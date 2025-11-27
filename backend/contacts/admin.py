from django.contrib import admin
from .models import Contact

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'contact_type', 'company', 'is_active', 'created_at')
    list_filter = ('contact_type', 'is_active', 'created_at')
    search_fields = ('name', 'email', 'phone', 'mobile', 'company_name')
    readonly_fields = ('created_at', 'updated_at')

