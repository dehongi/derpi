from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db import transaction
from django.db.models import Q, Sum
from .models import POSSale, POSSaleItem, POSPayment
from .serializers import (
    POSSaleSerializer, POSSaleDetailSerializer, POSSaleCreateSerializer,
    POSSaleItemSerializer, POSPaymentSerializer
)
from inventory.models import Stock, StockMovement


class POSSaleViewSet(viewsets.ModelViewSet):
    """ViewSet for POS sales with custom actions"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'create':
            return POSSaleCreateSerializer
        elif self.action == 'retrieve':
            return POSSaleDetailSerializer
        return POSSaleSerializer
    
    def get_queryset(self):
        """Filter sales by user's active company"""
        user_company = self.request.user.active_company
        if not user_company:
            return POSSale.objects.none()
        
        queryset = POSSale.objects.filter(company=user_company).prefetch_related(
            'items', 'items__item', 'customer', 'cashier'
        )
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        
        # Filter by status
        sale_status = self.request.query_params.get('status')
        if sale_status:
            queryset = queryset.filter(status=sale_status)
        
        # Filter by customer
        customer_id = self.request.query_params.get('customer')
        if customer_id:
            queryset = queryset.filter(customer_id=customer_id)
        
        # Search by sale number or customer name
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(sale_number__icontains=search) |
                Q(customer__name__icontains=search)
            )
        
        return queryset.order_by('-date')
    
    @action(detail=True, methods=['post'])
    def complete_sale(self, request, pk=None):
        """
        Complete a sale and update inventory.
        This is called when a sale is finalized.
        """
        sale = self.get_object()
        
        if sale.status != 'completed':
            return Response(
                {'error': 'Sale is not in completed status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Recalculate totals
        sale.calculate_totals()
        
        serializer = POSSaleDetailSerializer(sale)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    @transaction.atomic
    def void_sale(self, request, pk=None):
        """
        Void a sale and restore inventory.
        This reverses the stock movements.
        """
        sale = self.get_object()
        
        if sale.status == 'cancelled':
            return Response(
                {'error': 'Sale is already cancelled'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Restore inventory for each item
        for sale_item in sale.items.all():
            # Find the stock movements for this sale
            movements = StockMovement.objects.filter(
                company=sale.company,
                item=sale_item.item,
                reference_type='pos_sale',
                reference_number=sale.sale_number,
                movement_type='out'
            )
            
            for movement in movements:
                # Restore stock
                stock, created = Stock.objects.get_or_create(
                    warehouse=movement.warehouse,
                    item=movement.item,
                    defaults={'quantity': 0}
                )
                stock.quantity += movement.quantity
                stock.save()
                
                # Create reverse movement
                StockMovement.objects.create(
                    company=sale.company,
                    warehouse=movement.warehouse,
                    item=movement.item,
                    movement_type='in',
                    quantity=movement.quantity,
                    reference_type='pos_sale_void',
                    reference_number=sale.sale_number,
                    date=timezone.now(),
                    created_by=request.user,
                    notes=f'Void POS Sale: {sale.sale_number}'
                )
        
        # Update sale status
        sale.status = 'cancelled'
        sale.save()
        
        serializer = POSSaleDetailSerializer(sale)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def print_receipt(self, request, pk=None):
        """
        Get receipt data for printing.
        Returns formatted sale data suitable for receipt printing.
        """
        sale = self.get_object()
        
        receipt_data = {
            'sale_number': sale.sale_number,
            'date': sale.date,
            'cashier': sale.cashier.get_full_name() if sale.cashier else 'N/A',
            'customer': sale.customer.name if sale.customer else 'Walk-in Customer',
            'items': [
                {
                    'name': item.item.name,
                    'quantity': float(item.quantity),
                    'unit_price': float(item.unit_price),
                    'discount': float(item.discount),
                    'total': float(item.total)
                }
                for item in sale.items.all()
            ],
            'subtotal': float(sale.subtotal),
            'discount': float(sale.discount),
            'tax': float(sale.tax),
            'total': float(sale.total),
            'paid_amount': float(sale.paid_amount),
            'change_amount': float(sale.change_amount),
            'payment_method': sale.get_payment_method_display(),
            'notes': sale.notes or ''
        }
        
        return Response(receipt_data)
    
    @action(detail=False, methods=['get'])
    def today_sales(self, request):
        """Get today's sales summary"""
        user_company = request.user.active_company
        if not user_company:
            return Response({'error': 'No active company'}, status=status.HTTP_400_BAD_REQUEST)
        
        today = timezone.now().date()
        sales = POSSale.objects.filter(
            company=user_company,
            date__date=today,
            status='completed'
        )
        
        summary = {
            'total_sales': sales.count(),
            'total_revenue': sales.aggregate(Sum('total'))['total__sum'] or 0,
            'cash_sales': sales.filter(payment_method='cash').aggregate(Sum('total'))['total__sum'] or 0,
            'card_sales': sales.filter(payment_method='card').aggregate(Sum('total'))['total__sum'] or 0,
            'transfer_sales': sales.filter(payment_method='transfer').aggregate(Sum('total'))['total__sum'] or 0,
        }
        
        return Response(summary)


class POSSaleItemViewSet(viewsets.ModelViewSet):
    """ViewSet for POS sale items"""
    serializer_class = POSSaleItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filter by user's company sales"""
        user_company = self.request.user.active_company
        if not user_company:
            return POSSaleItem.objects.none()
        
        return POSSaleItem.objects.filter(
            sale__company=user_company
        ).select_related('sale', 'item')


class POSPaymentViewSet(viewsets.ModelViewSet):
    """ViewSet for POS payments"""
    serializer_class = POSPaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filter by user's company sales"""
        user_company = self.request.user.active_company
        if not user_company:
            return POSPayment.objects.none()
        
        return POSPayment.objects.filter(
            sale__company=user_company
        ).select_related('sale')
    
    def perform_create(self, serializer):
        """Set date if not provided"""
        if not serializer.validated_data.get('date'):
            serializer.save(date=timezone.now())
        else:
            serializer.save()
