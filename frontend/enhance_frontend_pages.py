#!/usr/bin/env python3
"""
Enhanced frontend generator - adds proper columns and edit pages
Run this from frontend directory: python enhance_frontend_pages.py
"""

import os

# Define detailed column configurations for each model
MODELS_COLUMNS = {
    'inventory': {
        'Item': [
            "{ key: 'id', label: 'شناسه' }",
            "{ key: 'name', label: 'نام کالا' }",
            "{ key: 'sku', label: 'کد کالا' }",
            "{ key: 'category', label: 'دسته‌بندی' }",
            "{ key: 'unit', label: 'واحد' }",
            "{ key: 'cost', label: 'قیمت', render: (value: number) => value?.toLocaleString('fa-IR') + ' ریال' }",
            "{ key: 'is_active', label: 'وضعیت', render: (value: boolean) => <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{value ? 'فعال' : 'غیرفعال'}</span> }",
        ],
        'Warehouse': [
            "{ key: 'id', label: 'شناسه' }",
            "{ key: 'name', label: 'نام انبار' }",
            "{ key: 'code', label: 'کد انبار' }",
            "{ key: 'location', label: 'موقعیت' }",
            "{ key: 'is_active', label: 'وضعیت', render: (value: boolean) => <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{value ? 'فعال' : 'غیرفعال'}</span> }",
        ],
    },
    'sales': {
        'Quotation': [
            "{ key: 'id', label: 'شناسه' }",
            "{ key: 'quote_number', label: 'شماره پیش‌فاکتور' }",
            "{ key: 'date', label: 'تاریخ' }",
            "{ key: 'total', label: 'مبلغ کل', render: (value: number) => value?.toLocaleString('fa-IR') + ' ریال' }",
            "{ key: 'status', label: 'وضعیت' }",
        ],
        'SalesOrder': [
            "{ key: 'id', label: 'شناسه' }",
            "{ key: 'order_number', label: 'شماره سفارش' }",
            "{ key: 'date', label: 'تاریخ' }",
            "{ key: 'total', label: 'مبلغ کل', render: (value: number) => value?.toLocaleString('fa-IR') + ' ریال' }",
            "{ key: 'status', label: 'وضعیت' }",
        ],
        'Invoice': [
            "{ key: 'id', label: 'شناسه' }",
            "{ key: 'invoice_number', label: 'شماره فاکتور' }",
            "{ key: 'date', label: 'تاریخ' }",
            "{ key: 'due_date', label: 'سررسید' }",
            "{ key: 'total', label: 'مبلغ کل', render: (value: number) => value?.toLocaleString('fa-IR') + ' ریال' }",
            "{ key: 'status', label: 'وضعیت' }",
        ],
        'Payment': [
            "{ key: 'id', label: 'شناسه' }",
            "{ key: 'payment_number', label: 'شماره پرداخت' }",
            "{ key: 'date', label: 'تاریخ' }",
            "{ key: 'amount', label: 'مبلغ', render: (value: number) => value?.toLocaleString('fa-IR') + ' ریال' }",
            "{ key: 'payment_method', label: 'روش پرداخت' }",
        ],
    },
    'procurement': {
        'Supplier': [
            "{ key: 'id', label: 'شناسه' }",
            "{ key: 'name', label: 'نام تامین‌کننده' }",
            "{ key: 'contact_person', label: 'فرد تماس' }",
            "{ key: 'phone', label: 'تلفن' }",
            "{ key: 'email', label: 'ایمیل' }",
            "{ key: 'is_active', label: 'وضعیت', render: (value: boolean) => <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{value ? 'فعال' : 'غیرفعال'}</span> }",
        ],
        'PurchaseOrder': [
            "{ key: 'id', label: 'شناسه' }",
            "{ key: 'po_number', label: 'شماره سفارش' }",
            "{ key: 'date', label: 'تاریخ' }",
            "{ key: 'total', label: 'مبلغ کل', render: (value: number) => value?.toLocaleString('fa-IR') + ' ریال' }",
            "{ key: 'status', label: 'وضعیت' }",
        ],
    },
    'hr': {
        'Department': [
            "{ key: 'id', label: 'شناسه' }",
            "{ key: 'name', label: 'نام بخش' }",
            "{ key: 'description', label: 'توضیحات' }",
            "{ key: 'is_active', label: 'وضعیت', render: (value: boolean) => <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{value ? 'فعال' : 'غیرفعال'}</span> }",
        ],
        'Employee': [
            "{ key: 'id', label: 'شناسه' }",
            "{ key: 'employee_number', label: 'شماره پرسنلی' }",
            "{ key: 'first_name', label: 'نام' }",
            "{ key: 'last_name', label: 'نام خانوادگی' }",
            "{ key: 'position', label: 'سمت' }",
            "{ key: 'status', label: 'وضعیت' }",
        ],
        'Leave': [
            "{ key: 'id', label: 'شناسه' }",
            "{ key: 'leave_type', label: 'نوع مرخصی' }",
            "{ key: 'start_date', label: 'تاریخ شروع' }",
            "{ key: 'end_date', label: 'تاریخ پایان' }",
            "{ key: 'days', label: 'تعداد روز' }",
            "{ key: 'status', label: 'وضعیت' }",
        ],
    },
    'crm': {
        'Lead': [
            "{ key: 'id', label: 'شناسه' }",
            "{ key: 'name', label: 'نام' }",
            "{ key: 'email', label: 'ایمیل' }",
            "{ key: 'phone', label: 'تلفن' }",
            "{ key: 'source', label: 'منبع' }",
            "{ key: 'status', label: 'وضعیت' }",
        ],
        'Opportunity': [
            "{ key: 'id', label: 'شناسه' }",
            "{ key: 'title', label: 'عنوان' }",
            "{ key: 'value', label: 'ارزش', render: (value: number) => value?.toLocaleString('fa-IR') + ' ریال' }",
            "{ key: 'probability', label: 'احتمال', render: (value: number) => value + '%' }",
            "{ key: 'stage', label: 'مرحله' }",
        ],
    },
    'accounting': {
        'ChartOfAccounts': [
            "{ key: 'id', label: 'شناسه' }",
            "{ key: 'code', label: 'کد حساب' }",
            "{ key: 'name', label: 'نام حساب' }",
            "{ key: 'account_type', label: 'نوع حساب' }",
            "{ key: 'is_active', label: 'وضعیت', render: (value: boolean) => <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{value ? 'فعال' : 'غیرفعال'}</span> }",
        ],
        'JournalEntry': [
            "{ key: 'id', label: 'شناسه' }",
            "{ key: 'entry_number', label: 'شماره سند' }",
            "{ key: 'date', label: 'تاریخ' }",
            "{ key: 'description', label: 'شرح' }",
            "{ key: 'status', label: 'وضعیت' }",
        ],
    },
    'ecommerce': {
        'Product': [
            "{ key: 'id', label: 'شناسه' }",
            "{ key: 'name', label: 'نام محصول' }",
            "{ key: 'sku', label: 'کد محصول' }",
            "{ key: 'price', label: 'قیمت', render: (value: number) => value?.toLocaleString('fa-IR') + ' ریال' }",
            "{ key: 'stock_quantity', label: 'موجودی' }",
            "{ key: 'is_active', label: 'وضعیت', render: (value: boolean) => <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{value ? 'فعال' : 'غیرفعال'}</span> }",
        ],
        'Order': [
            "{ key: 'id', label: 'شناسه' }",
            "{ key: 'order_number', label: 'شماره سفارش' }",
            "{ key: 'total', label: 'مبلغ کل', render: (value: number) => value?.toLocaleString('fa-IR') + ' ریال' }",
            "{ key: 'status', label: 'وضعیت' }",
        ],
    },
    'website': {
        'Page': [
            "{ key: 'id', label: 'شناسه' }",
            "{ key: 'title', label: 'عنوان' }",
            "{ key: 'slug', label: 'نامک' }",
            "{ key: 'is_published', label: 'منتشر شده', render: (value: boolean) => <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{value ? 'بله' : 'خیر'}</span> }",
        ],
        'BlogPost': [
            "{ key: 'id', label: 'شناسه' }",
            "{ key: 'title', label: 'عنوان' }",
            "{ key: 'category', label: 'دسته‌بندی' }",
            "{ key: 'views', label: 'بازدید' }",
            "{ key: 'is_published', label: 'منتشر شده', render: (value: boolean) => <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{value ? 'بله' : 'خیر'}</span> }",
        ],
    },
}


def generate_edit_page(module, model_name, endpoint):
    """Generate edit page for a model"""
    return f"""'use client';

import {{ useEffect, useState }} from 'react';
import {{ useRouter, useParams }} from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import api from '@/utils/api';

export default function Edit{model_name}Page() {{
    const router = useRouter();
    const params = useParams();
    const id = params.id;
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState<any>({{}});

    useEffect(() => {{
        if (id) {{
            fetchItem();
        }}
    }}, [id]);

    const fetchItem = async () => {{
        try {{
            const response = await api.get(`/{module}/{endpoint}/${{id}}/`);
            setFormData(response.data);
        }} catch (error) {{
            console.error('Error fetching item:', error);
            setError('خطا در بارگذاری اطلاعات');
        }} finally {{
            setLoading(false);
        }}
    }};

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {{
        const {{ name, value, type }} = e.target;
        setFormData((prev: any) => ({{
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }}));
    }};

    const handleSubmit = async (e: React.FormEvent) => {{
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {{
            await api.put(`/{module}/{endpoint}/${{id}}/`, formData);
            setSuccess('تغییرات با موفقیت ذخیره شد');
            setTimeout(() => {{
                router.push('/dashboard/{module}/{endpoint}');
            }}, 1500);
        }} catch (err: any) {{
            setError(err.response?.data?.detail || 'خطا در ذخیره تغییرات');
        }} finally {{
            setSaving(false);
        }}
    }};

    const handleDelete = async () => {{
        if (confirm('آیا از حذف این مورد اطمینان دارید؟')) {{
            try {{
                await api.delete(`/{module}/{endpoint}/${{id}}/`);
                router.push('/dashboard/{module}/{endpoint}');
            }} catch (error) {{
                console.error('Error deleting item:', error);
                alert('خطا در حذف');
            }}
        }}
    }};

    if (loading) {{
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">در حال بارگذاری...</div>
            </div>
        );
    }}

    return (
        <div>
            <PageHeader
                title="ویرایش"
                subtitle="ویرایش اطلاعات"
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
                    فرم ویرایش - فیلدها باید بر اساس مدل تکمیل شوند
                </div>

                <div className="mt-6 flex gap-4">
                    <button
                        type="submit"
                        disabled={{saving}}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {{saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}}
                    </button>
                    <button
                        type="button"
                        onClick={{() => router.push('/dashboard/{module}/{endpoint}')}}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
                    >
                        انصراف
                    </button>
                    <button
                        type="button"
                        onClick={{handleDelete}}
                        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 mr-auto"
                    >
                        حذف
                    </button>
                </div>
            </form>
        </div>
    );
}}
"""


def update_list_page_with_columns(file_path, module, model_name, columns):
    """Update list page with proper columns"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the columns definition
    columns_str = ',\n        '.join(columns)
    new_columns = f"""    const columns = [
        {columns_str}
    ];"""
    
    # Find and replace columns
    import re
    content = re.sub(
        r'const columns = \[.*?\];',
        new_columns,
        content,
        flags=re.DOTALL
    )
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)


def main():
    """Enhance all frontend pages"""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    app_dir = os.path.join(base_dir, 'app', '(dashboard)', 'dashboard')
    
    for module, models_config in MODELS_COLUMNS.items():
        print(f"\n📁 Enhancing {module} module...")
        
        for model_name, columns in models_config.items():
            # Determine endpoint
            endpoint = model_name.lower() + 's'
            if model_name == 'ChartOfAccounts':
                endpoint = 'chart-of-accountss'
            elif model_name == 'JournalEntry':
                endpoint = 'journal-entrys'
            elif model_name == 'SalesOrder':
                endpoint = 'sales-orders'
            elif model_name == 'PurchaseOrder':
                endpoint = 'purchase-orders'
            elif model_name == 'BlogPost':
                endpoint = 'blog-posts'
            
            # Update list page with proper columns
            list_page_path = os.path.join(app_dir, module, endpoint, 'page.tsx')
            if os.path.exists(list_page_path):
                update_list_page_with_columns(list_page_path, module, model_name, columns)
                print(f"  ✓ Updated {endpoint}/page.tsx with columns")
            
            # Create edit page
            edit_dir = os.path.join(app_dir, module, endpoint, '[id]')
            os.makedirs(edit_dir, exist_ok=True)
            edit_page_path = os.path.join(edit_dir, 'page.tsx')
            with open(edit_page_path, 'w', encoding='utf-8') as f:
                f.write(generate_edit_page(module, model_name, endpoint))
            print(f"  ✓ Created {endpoint}/[id]/page.tsx")
    
    print("\n✅ All pages enhanced successfully!")
    print("\nWhat was added:")
    print("  ✓ Proper table columns for all list pages")
    print("  ✓ Edit pages with update and delete functionality")
    print("\nNote: Create and edit forms still need actual field inputs based on your models.")


if __name__ == '__main__':
    main()
