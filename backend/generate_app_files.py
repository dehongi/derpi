#!/usr/bin/env python
"""
Auto-generate serializers, views, URLs, and admin files for all ERP apps
Run this script from the backend directory: python generate_app_files.py
"""

import os
import re

# Define all apps and their models
APPS_CONFIG = {
    'sales': {
        'models': ['Quotation', 'QuotationItem', 'SalesOrder', 'SalesOrderItem', 'Invoice', 'InvoiceItem', 'Payment'],
        'company_field': True,
    },
    'procurement': {
        'models': ['Supplier', 'PurchaseOrder', 'PurchaseOrderItem', 'PurchaseReceipt', 'PurchaseReceiptItem'],
        'company_field': True,
    },
    'pos': {
        'models': ['POSSale', 'POSSaleItem', 'POSPayment'],
        'company_field': True,
    },
    'hr': {
        'models': ['Department', 'Employee', 'Attendance', 'Leave'],
        'company_field': True,
    },
    'crm': {
        'models': ['Lead', 'Opportunity', 'Activity'],
        'company_field': True,
    },
    'accounting': {
        'models': ['ChartOfAccounts', 'JournalEntry', 'Transaction'],
        'company_field': True,
    },
    'ecommerce': {
        'models': ['Category', 'Product', 'Order', 'OrderItem'],
        'company_field': True,
    },
    'website': {
        'models': ['Page', 'BlogPost'],
        'company_field': True,
    },
}


def generate_serializers(app_name, models):
    """Generate serializers.py for an app"""
    imports = "from rest_framework import serializers\nfrom .models import " + ", ".join(models) + "\n\n"
    
    serializers_code = ""
    for model in models:
        serializers_code += f"""class {model}Serializer(serializers.ModelSerializer):
    class Meta:
        model = {model}
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


"""
    
    return imports + serializers_code


def generate_views(app_name, models, has_company_field):
    """Generate views.py for an app"""
    imports = """from rest_framework import generics, permissions
from .models import """ + ", ".join(models) + """
from .serializers import """ + ", ".join([f"{m}Serializer" for m in models]) + """


"""
    
    views_code = ""
    for model in models:
        # Determine if this model has company field directly
        needs_company_filter = has_company_field and not model.endswith('Item')
        
        views_code += f"""class {model}ListCreateView(generics.ListCreateAPIView):
    serializer_class = {model}Serializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
"""
        
        if needs_company_filter:
            views_code += """        user_company = self.request.user.active_company
        if user_company:
            return """ + model + """.objects.filter(company=user_company)
        return """ + model + """.objects.none()

    def perform_create(self, serializer):
        user_company = self.request.user.active_company
        if user_company:
            serializer.save(company=user_company)


"""
        else:
            views_code += f"""        return {model}.objects.all()


"""
        
        views_code += f"""class {model}DetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = {model}Serializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
"""
        
        if needs_company_filter:
            views_code += """        user_company = self.request.user.active_company
        if user_company:
            return """ + model + """.objects.filter(company=user_company)
        return """ + model + """.objects.none()


"""
        else:
            views_code += f"""        return {model}.objects.all()


"""
    
    return imports + views_code


def generate_urls(app_name, models):
    """Generate urls.py for an app"""
    imports = "from django.urls import path\nfrom .views import (\n"
    for model in models:
        imports += f"    {model}ListCreateView, {model}DetailView,\n"
    imports += ")\n\nurlpatterns = [\n"
    
    for model in models:
        model_lower = re.sub(r'(?<!^)(?=[A-Z])', '-', model).lower()
        imports += f"    path('{model_lower}s/', {model}ListCreateView.as_view(), name='{model_lower}-list-create'),\n"
        imports += f"    path('{model_lower}s/<int:pk>/', {model}DetailView.as_view(), name='{model_lower}-detail'),\n"
    
    imports += "]\n"
    return imports


def generate_admin(app_name, models):
    """Generate admin.py for an app"""
    imports = "from django.contrib import admin\nfrom .models import " + ", ".join(models) + "\n\n"
    
    admin_code = ""
    for model in models:
        admin_code += f"""@admin.register({model})
class {model}Admin(admin.ModelAdmin):
    list_display = ('id', '__str__', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('id',)
    readonly_fields = ('created_at', 'updated_at')


"""
    
    return imports + admin_code


def main():
    """Generate all files for all apps"""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    for app_name, config in APPS_CONFIG.items():
        app_dir = os.path.join(base_dir, app_name)
        if not os.path.exists(app_dir):
            print(f"Warning: {app_dir} does not exist, skipping...")
            continue
        
        models = config['models']
        has_company = config.get('company_field', False)
        
        # Generate serializers
        serializers_path = os.path.join(app_dir, 'serializers.py')
        with open(serializers_path, 'w', encoding='utf-8') as f:
            f.write(generate_serializers(app_name, models))
        print(f"✓ Generated {app_name}/serializers.py")
        
        # Generate views
        views_path = os.path.join(app_dir, 'views.py')
        with open(views_path, 'w', encoding='utf-8') as f:
            f.write(generate_views(app_name, models, has_company))
        print(f"✓ Generated {app_name}/views.py")
        
        # Generate URLs
        urls_path = os.path.join(app_dir, 'urls.py')
        with open(urls_path, 'w', encoding='utf-8') as f:
            f.write(generate_urls(app_name, models))
        print(f"✓ Generated {app_name}/urls.py")
        
        # Generate admin
        admin_path = os.path.join(app_dir, 'admin.py')
        with open(admin_path, 'w', encoding='utf-8') as f:
            f.write(generate_admin(app_name, models))
        print(f"✓ Generated {app_name}/admin.py")
    
    print("\n✅ All files generated successfully!")
    print("\nNext steps:")
    print("1. Add all apps to INSTALLED_APPS in settings.py")
    print("2. Add all URLs to django_project/urls.py")
    print("3. Run: python manage.py makemigrations")
    print("4. Run: python manage.py migrate")


if __name__ == '__main__':
    main()
