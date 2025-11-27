#!/usr/bin/env python3
"""
Auto-generate frontend pages for all ERP modules
Run this script from the frontend directory: python generate_frontend_pages.py
"""

import os
import re

# Define all modules and their main models
MODULES_CONFIG = {
    'inventory': {
        'models': [
            {'name': 'Item', 'plural': 'Items', 'persian': 'کالا', 'persian_plural': 'کالاها', 'endpoint': 'items'},
            {'name': 'Warehouse', 'plural': 'Warehouses', 'persian': 'انبار', 'persian_plural': 'انبارها', 'endpoint': 'warehouses'},
        ]
    },
    'sales': {
        'models': [
            {'name': 'Quotation', 'plural': 'Quotations', 'persian': 'پیش‌فاکتور', 'persian_plural': 'پیش‌فاکتورها', 'endpoint': 'quotations'},
            {'name': 'SalesOrder', 'plural': 'SalesOrders', 'persian': 'سفارش فروش', 'persian_plural': 'سفارش‌های فروش', 'endpoint': 'sales-orders'},
            {'name': 'Invoice', 'plural': 'Invoices', 'persian': 'فاکتور', 'persian_plural': 'فاکتورها', 'endpoint': 'invoices'},
            {'name': 'Payment', 'plural': 'Payments', 'persian': 'پرداخت', 'persian_plural': 'پرداخت‌ها', 'endpoint': 'payments'},
        ]
    },
    'procurement': {
        'models': [
            {'name': 'Supplier', 'plural': 'Suppliers', 'persian': 'تامین‌کننده', 'persian_plural': 'تامین‌کنندگان', 'endpoint': 'suppliers'},
            {'name': 'PurchaseOrder', 'plural': 'PurchaseOrders', 'persian': 'سفارش خرید', 'persian_plural': 'سفارش‌های خرید', 'endpoint': 'purchase-orders'},
        ]
    },
    'hr': {
        'models': [
            {'name': 'Department', 'plural': 'Departments', 'persian': 'بخش', 'persian_plural': 'بخش‌ها', 'endpoint': 'departments'},
            {'name': 'Employee', 'plural': 'Employees', 'persian': 'کارمند', 'persian_plural': 'کارمندان', 'endpoint': 'employees'},
            {'name': 'Leave', 'plural': 'Leaves', 'persian': 'مرخصی', 'persian_plural': 'مرخصی‌ها', 'endpoint': 'leaves'},
        ]
    },
    'crm': {
        'models': [
            {'name': 'Lead', 'plural': 'Leads', 'persian': 'سرنخ', 'persian_plural': 'سرنخ‌ها', 'endpoint': 'leads'},
            {'name': 'Opportunity', 'plural': 'Opportunities', 'persian': 'فرصت', 'persian_plural': 'فرصت‌ها', 'endpoint': 'opportunities'},
        ]
    },
    'accounting': {
        'models': [
            {'name': 'ChartOfAccounts', 'plural': 'ChartOfAccounts', 'persian': 'حساب', 'persian_plural': 'دفتر حساب‌ها', 'endpoint': 'chart-of-accountss'},
            {'name': 'JournalEntry', 'plural': 'JournalEntries', 'persian': 'سند', 'persian_plural': 'اسناد حسابداری', 'endpoint': 'journal-entrys'},
        ]
    },
    'ecommerce': {
        'models': [
            {'name': 'Product', 'plural': 'Products', 'persian': 'محصول', 'persian_plural': 'محصولات', 'endpoint': 'products'},
            {'name': 'Order', 'plural': 'Orders', 'persian': 'سفارش', 'persian_plural': 'سفارش‌ها', 'endpoint': 'orders'},
        ]
    },
    'website': {
        'models': [
            {'name': 'Page', 'plural': 'Pages', 'persian': 'صفحه', 'persian_plural': 'صفحات', 'endpoint': 'pages'},
            {'name': 'BlogPost', 'plural': 'BlogPosts', 'persian': 'پست', 'persian_plural': 'پست‌های وبلاگ', 'endpoint': 'blog-posts'},
        ]
    },
}


def generate_list_page(module, model):
    """Generate a list page for a model"""
    return f"""'use client';

import {{ useEffect, useState }} from 'react';
import {{ useRouter }} from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import api from '@/utils/api';

export default function {model['plural']}Page() {{
    const router = useRouter();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {{
        fetchItems();
    }}, []);

    const fetchItems = async () => {{
        try {{
            const response = await api.get('/{module}/{model['endpoint']}/');
            setItems(response.data);
        }} catch (error) {{
            console.error('Error fetching items:', error);
        }} finally {{
            setLoading(false);
        }}
    }};

    const handleEdit = (item: any) => {{
        router.push(`/dashboard/{module}/{model['endpoint']}/${{item.id}}`);
    }};

    const handleDelete = async (item: any) => {{
        if (confirm('آیا از حذف این مورد اطمینان دارید؟')) {{
            try {{
                await api.delete(`/{module}/{model['endpoint']}/${{item.id}}/`);
                fetchItems();
            }} catch (error) {{
                console.error('Error deleting item:', error);
                alert('خطا در حذف');
            }}
        }}
    }};

    const columns = [
        {{ key: 'id', label: 'شناسه' }},
        {{ key: '__str__', label: 'نام' }},
    ];

    return (
        <div>
            <PageHeader
                title="{model['persian_plural']}"
                subtitle="مدیریت {model['persian_plural']}"
                action={{
                    <button
                        onClick={{() => router.push('/dashboard/{module}/{model['endpoint']}/create')}}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        افزودن {model['persian']} جدید
                    </button>
                }}
            />

            <DataTable
                columns={{columns}}
                data={{items}}
                onEdit={{handleEdit}}
                onDelete={{handleDelete}}
                loading={{loading}}
            />
        </div>
    );
}}
"""


def generate_create_page(module, model):
    """Generate a create page for a model"""
    return f"""'use client';

import {{ useState }} from 'react';
import {{ useRouter }} from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import api from '@/utils/api';

export default function Create{model['name']}Page() {{
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const [formData, setFormData] = useState({{}});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {{
        const {{ name, value }} = e.target;
        setFormData(prev => ({{ ...prev, [name]: value }}));
    }};

    const handleSubmit = async (e: React.FormEvent) => {{
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {{
            await api.post('/{module}/{model['endpoint']}/', formData);
            setSuccess('{model['persian']} با موفقیت ایجاد شد');
            setTimeout(() => {{
                router.push('/dashboard/{module}/{model['endpoint']}');
            }}, 1500);
        }} catch (err: any) {{
            setError(err.response?.data?.detail || 'خطا در ایجاد');
        }} finally {{
            setLoading(false);
        }}
    }};

    return (
        <div>
            <PageHeader
                title="افزودن {model['persian']} جدید"
                subtitle="ایجاد {model['persian']} جدید در سیستم"
            />

            {{error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {{error}}
                </div>
            )}}

            {{success && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                    {{success}}
                </div>
            )}}

            <form onSubmit={{handleSubmit}} className="bg-white rounded shadow p-6">
                <div className="text-gray-500 text-center py-8">
                    فرم ایجاد {model['persian']} - فیلدها باید بر اساس مدل تکمیل شوند
                </div>

                <div className="mt-6 flex gap-4">
                    <button
                        type="submit"
                        disabled={{loading}}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {{loading ? 'در حال ذخیره...' : 'ذخیره'}}
                    </button>
                    <button
                        type="button"
                        onClick={{() => router.push('/dashboard/{module}/{model['endpoint']}')}}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
                    >
                        انصراف
                    </button>
                </div>
            </form>
        </div>
    );
}}
"""


def generate_index_page(module, first_model):
    """Generate index page that redirects to first model"""
    return f"""'use client';

import {{ useEffect }} from 'react';
import {{ useRouter }} from 'next/navigation';

export default function {module.capitalize()}IndexPage() {{
    const router = useRouter();

    useEffect(() => {{
        router.push('/dashboard/{module}/{first_model['endpoint']}');
    }}, [router]);

    return null;
}}
"""


def main():
    """Generate all frontend pages"""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    app_dir = os.path.join(base_dir, 'app', '(dashboard)', 'dashboard')
    
    for module, config in MODULES_CONFIG.items():
        print(f"\n📁 Generating {module} module...")
        
        models = config['models']
        module_dir = os.path.join(app_dir, module)
        os.makedirs(module_dir, exist_ok=True)
        
        # Generate index page
        index_path = os.path.join(module_dir, 'page.tsx')
        with open(index_path, 'w', encoding='utf-8') as f:
            f.write(generate_index_page(module, models[0]))
        print(f"  ✓ Generated index page")
        
        # Generate pages for each model
        for model in models:
            model_dir = os.path.join(module_dir, model['endpoint'])
            os.makedirs(model_dir, exist_ok=True)
            
            # List page
            list_path = os.path.join(model_dir, 'page.tsx')
            with open(list_path, 'w', encoding='utf-8') as f:
                f.write(generate_list_page(module, model))
            print(f"  ✓ Generated {model['endpoint']}/page.tsx")
            
            # Create page
            create_dir = os.path.join(model_dir, 'create')
            os.makedirs(create_dir, exist_ok=True)
            create_path = os.path.join(create_dir, 'page.tsx')
            with open(create_path, 'w', encoding='utf-8') as f:
                f.write(generate_create_page(module, model))
            print(f"  ✓ Generated {model['endpoint']}/create/page.tsx")
    
    print("\n✅ All frontend pages generated successfully!")
    print("\nNote: The create forms have placeholder content.")
    print("You'll need to customize them with actual form fields based on your models.")


if __name__ == '__main__':
    main()
