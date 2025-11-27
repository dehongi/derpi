from django.contrib import admin
from .models import POSSale, POSSaleItem, POSPayment

@admin.register(POSSale)
class POSSaleAdmin(admin.ModelAdmin):
    list_display = ('id', '__str__', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('id',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(POSSaleItem)
class POSSaleItemAdmin(admin.ModelAdmin):
    list_display = ('id', '__str__')



@admin.register(POSPayment)
class POSPaymentAdmin(admin.ModelAdmin):
    list_display = ('id', '__str__', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('id',)
    readonly_fields = ('created_at', 'updated_at')


