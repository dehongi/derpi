from rest_framework import serializers
from .models import Driver, Delivery, DeliveryItem, DeliveryRoute, RouteDelivery


class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class DeliveryItemSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.name', read_only=True)
    
    class Meta:
        model = DeliveryItem
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class DeliverySerializer(serializers.ModelSerializer):
    items = DeliveryItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    driver_name = serializers.CharField(source='driver.name', read_only=True)
    sales_order_number = serializers.CharField(source='sales_order.order_number', read_only=True)
    
    class Meta:
        model = Delivery
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class RouteDeliverySerializer(serializers.ModelSerializer):
    delivery_number = serializers.CharField(source='delivery.delivery_number', read_only=True)
    customer_name = serializers.CharField(source='delivery.customer.name', read_only=True)
    
    class Meta:
        model = RouteDelivery
        fields = '__all__'


class DeliveryRouteSerializer(serializers.ModelSerializer):
    deliveries = RouteDeliverySerializer(many=True, read_only=True)
    driver_name = serializers.CharField(source='driver.name', read_only=True)
    total_deliveries = serializers.ReadOnlyField()
    
    class Meta:
        model = DeliveryRoute
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
