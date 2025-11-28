from rest_framework import serializers
from django.utils import timezone
from django.db import transaction, models
from .models import POSSale, POSSaleItem, POSPayment
from inventory.models import Item, Stock
from contacts.models import Contact


class ItemBasicSerializer(serializers.ModelSerializer):
    """Basic item info for nested display"""
    class Meta:
        model = Item
        fields = ['id', 'name', 'sku', 'barcode', 'sale_price', 'unit']
        read_only_fields = fields


class CustomerBasicSerializer(serializers.ModelSerializer):
    """Basic customer info for nested display"""
    class Meta:
        model = Contact
        fields = ['id', 'name', 'phone', 'mobile']
        read_only_fields = fields


class POSSaleItemSerializer(serializers.ModelSerializer):
    """Serializer for POS sale items"""
    item_details = ItemBasicSerializer(source='item', read_only=True)
    item_name = serializers.CharField(source='item.name', read_only=True)
    
    class Meta:
        model = POSSaleItem
        fields = ['id', 'sale', 'item', 'item_details', 'item_name', 
                  'quantity', 'unit_price', 'discount', 'total']
        read_only_fields = ['id']


class POSSaleItemCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating POS sale items"""
    class Meta:
        model = POSSaleItem
        fields = ['item', 'quantity', 'unit_price', 'discount']
    
    def validate(self, data):
        """Calculate total for the item"""
        quantity = data.get('quantity', 0)
        unit_price = data.get('unit_price', 0)
        discount = data.get('discount', 0)
        data['total'] = (quantity * unit_price) - discount
        return data


class POSPaymentSerializer(serializers.ModelSerializer):
    """Serializer for POS payments"""
    payment_method_display = serializers.CharField(
        source='get_payment_method_display', 
        read_only=True
    )
    
    class Meta:
        model = POSPayment
        fields = ['id', 'sale', 'amount', 'payment_method', 
                  'payment_method_display', 'reference', 'date', 
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class POSSaleSerializer(serializers.ModelSerializer):
    """Basic serializer for POS sales list"""
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    cashier_name = serializers.CharField(source='cashier.get_full_name', read_only=True)
    payment_method_display = serializers.CharField(
        source='get_payment_method_display', 
        read_only=True
    )
    status_display = serializers.CharField(
        source='get_status_display', 
        read_only=True
    )
    
    class Meta:
        model = POSSale
        fields = ['id', 'sale_number', 'date', 'customer', 'customer_name',
                  'subtotal', 'discount', 'tax', 'total', 'paid_amount', 
                  'change_amount', 'payment_method', 'payment_method_display',
                  'status', 'status_display', 'cashier', 'cashier_name', 
                  'notes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'sale_number', 'created_at', 'updated_at']


class POSSaleDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for POS sale with nested items and customer"""
    items = POSSaleItemSerializer(many=True, read_only=True)
    customer_details = CustomerBasicSerializer(source='customer', read_only=True)
    cashier_name = serializers.CharField(source='cashier.get_full_name', read_only=True)
    payment_method_display = serializers.CharField(
        source='get_payment_method_display', 
        read_only=True
    )
    status_display = serializers.CharField(
        source='get_status_display', 
        read_only=True
    )
    
    class Meta:
        model = POSSale
        fields = ['id', 'sale_number', 'date', 'customer', 'customer_details',
                  'subtotal', 'discount', 'tax', 'total', 'paid_amount', 
                  'change_amount', 'payment_method', 'payment_method_display',
                  'status', 'status_display', 'cashier', 'cashier_name', 
                  'notes', 'items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'sale_number', 'created_at', 'updated_at']


class POSSaleCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a complete POS sale with items"""
    items = POSSaleItemCreateSerializer(many=True)
    
    class Meta:
        model = POSSale
        fields = ['date', 'customer', 'discount', 'tax', 'paid_amount',
                  'payment_method', 'notes', 'items']
    
    def validate_items(self, items):
        """Validate that items list is not empty"""
        if not items:
            raise serializers.ValidationError("Sale must have at least one item")
        return items
    
    def validate(self, data):
        """Validate stock availability for all items"""
        items = data.get('items', [])
        company = self.context['request'].user.active_company
        
        for item_data in items:
            item = item_data['item']
            quantity = item_data['quantity']
            
            # Check if item belongs to the company
            if item.company != company:
                raise serializers.ValidationError(
                    f"Item {item.name} does not belong to your company"
                )
            
            # Check stock availability across all warehouses
            total_stock = Stock.objects.filter(
                item=item,
                warehouse__company=company
            ).aggregate(
                total=models.Sum('quantity')
            )['total'] or 0
            
            if total_stock < quantity:
                raise serializers.ValidationError(
                    f"Insufficient stock for {item.name}. Available: {total_stock}, Required: {quantity}"
                )
        
        return data
    
    @transaction.atomic
    def create(self, validated_data):
        """Create sale with items in a single transaction"""
        items_data = validated_data.pop('items')
        request = self.context['request']
        
        # Set company and cashier
        validated_data['company'] = request.user.active_company
        validated_data['cashier'] = request.user
        
        # Create the sale
        sale = POSSale.objects.create(**validated_data)
        
        # Create sale items
        for item_data in items_data:
            POSSaleItem.objects.create(sale=sale, **item_data)
        
        # Calculate totals
        sale.calculate_totals()
        
        # Update inventory stock
        self._update_inventory(sale)
        
        return sale
    
    def _update_inventory(self, sale):
        """Update inventory stock for completed sale"""
        from inventory.models import StockMovement
        
        for sale_item in sale.items.all():
            # Find warehouses with stock for this item
            stocks = Stock.objects.filter(
                item=sale_item.item,
                warehouse__company=sale.company,
                quantity__gt=0
            ).order_by('-quantity')
            
            remaining_qty = sale_item.quantity
            
            for stock in stocks:
                if remaining_qty <= 0:
                    break
                
                # Deduct from this warehouse
                deduct_qty = min(stock.quantity, remaining_qty)
                stock.quantity -= deduct_qty
                stock.save()
                
                # Create stock movement record
                StockMovement.objects.create(
                    company=sale.company,
                    warehouse=stock.warehouse,
                    item=sale_item.item,
                    movement_type='out',
                    quantity=deduct_qty,
                    reference_type='pos_sale',
                    reference_number=sale.sale_number,
                    date=sale.date,
                    created_by=sale.cashier,
                    notes=f'POS Sale: {sale.sale_number}'
                )
                
                remaining_qty -= deduct_qty

