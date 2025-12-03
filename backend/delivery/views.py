from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Driver, Delivery, DeliveryItem, DeliveryRoute, RouteDelivery
from .serializers import (
    DriverSerializer, 
    DeliverySerializer, 
    DeliveryItemSerializer,
    DeliveryRouteSerializer,
    RouteDeliverySerializer
)


class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['company', 'status', 'is_active']
    search_fields = ['name', 'phone', 'vehicle_plate']
    ordering_fields = ['name', 'created_at']
    
    @action(detail=False, methods=['get'])
    def available(self, request):
        """Get list of available drivers"""
        available_drivers = self.queryset.filter(status='available', is_active=True)
        company_id = request.query_params.get('company')
        if company_id:
            available_drivers = available_drivers.filter(company_id=company_id)
        serializer = self.get_serializer(available_drivers, many=True)
        return Response(serializer.data)


class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['company', 'status', 'driver', 'customer', 'scheduled_date']
    search_fields = ['delivery_number', 'customer__name', 'tracking_code']
    ordering_fields = ['scheduled_date', 'priority', 'created_at']
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get list of pending deliveries"""
        pending = self.queryset.filter(status='pending')
        company_id = request.query_params.get('company')
        if company_id:
            pending = pending.filter(company_id=company_id)
        serializer = self.get_serializer(pending, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def in_transit(self, request):
        """Get list of in-transit deliveries"""
        in_transit = self.queryset.filter(status__in=['picked_up', 'in_transit'])
        company_id = request.query_params.get('company')
        if company_id:
            in_transit = in_transit.filter(company_id=company_id)
        serializer = self.get_serializer(in_transit, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def assign_driver(self, request, pk=None):
        """Assign a driver to delivery"""
        delivery = self.get_object()
        driver_id = request.data.get('driver_id')
        if driver_id:
            delivery.driver_id = driver_id
            delivery.status = 'assigned'
            delivery.save()
            return Response({'status': 'driver assigned'})
        return Response({'error': 'driver_id required'}, status=400)
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update delivery status"""
        delivery = self.get_object()
        new_status = request.data.get('status')
        if new_status in dict(Delivery.STATUS_CHOICES):
            delivery.status = new_status
            delivery.save()
            return Response({'status': 'updated'})
        return Response({'error': 'invalid status'}, status=400)


class DeliveryItemViewSet(viewsets.ModelViewSet):
    queryset = DeliveryItem.objects.all()
    serializer_class = DeliveryItemSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['delivery', 'item']


class DeliveryRouteViewSet(viewsets.ModelViewSet):
    queryset = DeliveryRoute.objects.all()
    serializer_class = DeliveryRouteSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['company', 'status', 'driver', 'date']
    search_fields = ['route_name']
    ordering_fields = ['date', 'created_at']
    
    @action(detail=True, methods=['post'])
    def add_delivery(self, request, pk=None):
        """Add a delivery to this route"""
        route = self.get_object()
        delivery_id = request.data.get('delivery_id')
        sequence = request.data.get('sequence', route.deliveries.count() + 1)
        
        if delivery_id:
            RouteDelivery.objects.create(
                route=route,
                delivery_id=delivery_id,
                sequence=sequence
            )
            return Response({'status': 'delivery added to route'})
        return Response({'error': 'delivery_id required'}, status=400)
    
    @action(detail=True, methods=['post'])
    def start_route(self, request, pk=None):
        """Start route execution"""
        from django.utils import timezone
        route = self.get_object()
        route.status = 'in_progress'
        route.start_time = timezone.now()
        route.save()
        return Response({'status': 'route started'})
    
    @action(detail=True, methods=['post'])
    def complete_route(self, request, pk=None):
        """Complete route execution"""
        from django.utils import timezone
        route = self.get_object()
        route.status = 'completed'
        route.end_time = timezone.now()
        route.save()
        return Response({'status': 'route completed'})


class RouteDeliveryViewSet(viewsets.ModelViewSet):
    queryset = RouteDelivery.objects.all()
    serializer_class = RouteDeliverySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['route', 'delivery']
