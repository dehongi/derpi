from django.contrib import admin
from .models import Company, CompanyMembership

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'tax_id', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'tax_id', 'registration_number', 'owner__username')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(CompanyMembership)
class CompanyMembershipAdmin(admin.ModelAdmin):
    list_display = ('user', 'company', 'role', 'is_active', 'joined_at')
    list_filter = ('role', 'is_active', 'joined_at')
    search_fields = ('user__username', 'company__name')
    readonly_fields = ('joined_at',)

