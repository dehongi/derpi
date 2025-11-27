from rest_framework import serializers
from .models import POSSale, POSSaleItem, POSPayment

class POSSaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = POSSale
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class POSSaleItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = POSSaleItem
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class POSPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = POSPayment
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


