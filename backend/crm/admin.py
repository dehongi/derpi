from django.contrib import admin
from .models import Lead, Opportunity, Activity

@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ('id', '__str__', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('id',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Opportunity)
class OpportunityAdmin(admin.ModelAdmin):
    list_display = ('id', '__str__', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('id',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('id', '__str__', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('id',)
    readonly_fields = ('created_at', 'updated_at')


