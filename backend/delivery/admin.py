from django.contrib import admin
from .models import Driver, Delivery, DeliveryItem, DeliveryRoute, RouteDelivery


class DeliveryItemInline(admin.TabularInline):
    model = DeliveryItem
    extra = 1


class RouteDeliveryInline(admin.TabularInline):
    model = RouteDelivery
    extra = 1


@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'company', 'vehicle_type', 'vehicle_plate', 'status', 'is_active')
    list_filter = ('company', 'status', 'is_active')
    search_fields = ('name', 'phone', 'vehicle_plate', 'license_number')
    ordering = ('name',)


@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = ('delivery_number', 'customer', 'driver', 'scheduled_date', 'status', 'company')
    list_filter = ('company', 'status', 'scheduled_date', 'driver')
    search_fields = ('delivery_number', 'customer__name', 'tracking_code')
    ordering = ('-scheduled_date', '-priority')
    inlines = [DeliveryItemInline]
    date_hierarchy = 'scheduled_date'


@admin.register(DeliveryItem)
class DeliveryItemAdmin(admin.ModelAdmin):
    list_display = ('delivery', 'item', 'quantity', 'condition_on_delivery')
    list_filter = ('delivery__company',)
    search_fields = ('delivery__delivery_number', 'item__name')


@admin.register(DeliveryRoute)
class DeliveryRouteAdmin(admin.ModelAdmin):
    list_display = ('route_name', 'driver', 'date', 'status', 'total_distance', 'company')
    list_filter = ('company', 'status', 'date', 'driver')
    search_fields = ('route_name',)
    ordering = ('-date',)
    inlines = [RouteDeliveryInline]
    date_hierarchy = 'date'


@admin.register(RouteDelivery)
class RouteDeliveryAdmin(admin.ModelAdmin):
    list_display = ('route', 'delivery', 'sequence', 'estimated_arrival')
    list_filter = ('route__company',)
    search_fields = ('route__route_name', 'delivery__delivery_number')
    ordering = ('route', 'sequence')
