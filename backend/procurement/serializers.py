from rest_framework import serializers
from .models import Supplier, PurchaseOrder, PurchaseOrderItem, PurchaseReceipt, PurchaseReceiptItem

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'company')


class PurchaseOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrder
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'company')


class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrderItem
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class PurchaseReceiptSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseReceipt
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'company')


class PurchaseReceiptItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseReceiptItem
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


