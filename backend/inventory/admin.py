from django.contrib import admin
from .models import Warehouse, Item, Stock, StockMovement


@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'company', 'manager', 'is_active', 'created_at')
    list_filter = ('is_active', 'company', 'created_at')
    search_fields = ('name', 'code', 'location')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'sku', 'category', 'unit', 'cost', 'company', 'is_active')
    list_filter = ('is_active', 'category', 'unit', 'company')
    search_fields = ('name', 'sku', 'barcode')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ('item', 'warehouse', 'quantity', 'reserved', 'available', 'updated_at')
    list_filter = ('warehouse', 'updated_at')
    search_fields = ('item__name', 'item__sku', 'warehouse__name')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ('item', 'warehouse', 'movement_type', 'quantity', 'date', 'created_by')
    list_filter = ('movement_type', 'warehouse', 'date')
    search_fields = ('item__name', 'reference_number', 'notes')
    readonly_fields = ('created_at', 'updated_at')
