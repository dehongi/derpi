from django.contrib import admin
from .models import Supplier, PurchaseOrder, PurchaseOrderItem, PurchaseReceipt, PurchaseReceiptItem

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ('id', '__str__', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('id',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    list_display = ('id', '__str__', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('id',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(PurchaseOrderItem)
class PurchaseOrderItemAdmin(admin.ModelAdmin):
    list_display = ('id', '__str__')



@admin.register(PurchaseReceipt)
class PurchaseReceiptAdmin(admin.ModelAdmin):
    list_display = ('id', '__str__', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('id',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(PurchaseReceiptItem)
class PurchaseReceiptItemAdmin(admin.ModelAdmin):
    list_display = ('id', '__str__')


