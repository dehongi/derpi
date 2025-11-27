#!/usr/bin/env python
"""
Fix admin files - remove created_at/updated_at from Item models that don't have them
"""

import os
import re

# Models that don't have created_at/updated_at
ITEM_MODELS = [
    'QuotationItem', 'SalesOrderItem', 'InvoiceItem',
    'PurchaseOrderItem', 'PurchaseReceiptItem',
    'POSSaleItem', 'OrderItem'
]

def fix_admin_file(app_name):
    """Fix admin.py for an app"""
    admin_path = os.path.join(app_name, 'admin.py')
    if not os.path.exists(admin_path):
        return
    
    with open(admin_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # For each Item model, simplify the admin
    for model in ITEM_MODELS:
        if model in content:
            # Replace the complex admin with a simple one
            pattern = rf'@admin\.register\({model}\)\nclass {model}Admin\(admin\.ModelAdmin\):.*?(?=\n@admin\.register|\nfrom|\Z)'
            replacement = f'''@admin.register({model})
class {model}Admin(admin.ModelAdmin):
    list_display = ('id', '__str__')


'''
            content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    with open(admin_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Fixed {app_name}/admin.py")


def main():
    apps = ['sales', 'procurement', 'pos', 'ecommerce']
    for app in apps:
        fix_admin_file(app)
    print("\n✅ All admin files fixed!")


if __name__ == '__main__':
    main()
