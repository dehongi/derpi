"""
Management command to create default chart of accounts for a company
"""
from django.core.management.base import BaseCommand
from companies.models import Company
from accounting.models import ChartOfAccounts


class Command(BaseCommand):
    help = 'Create default chart of accounts for a company'

    def add_arguments(self, parser):
        parser.add_argument('--company-id', type=int, help='Company ID to create chart of accounts for')

    def handle(self, *args, **options):
        company_id = options.get('company_id')
        
        if company_id:
            try:
                company = Company.objects.get(id=company_id)
                self.create_default_accounts(company)
                self.stdout.write(self.style.SUCCESS(f'Successfully created default chart of accounts for {company.name}'))
            except Company.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'Company with ID {company_id} does not exist'))
        else:
            self.stdout.write(self.style.ERROR('Please provide --company-id'))

    def create_default_accounts(self, company):
        """Create a basic chart of accounts"""
        
        # Check if company already has accounts
        if ChartOfAccounts.objects.filter(company=company).exists():
            self.stdout.write(self.style.WARNING(f'Company {company.name} already has accounts. Skipping.'))
            return

        default_accounts = [
            # Assets (1000-1999)
            {'code': '1000', 'name': 'دارایی‌های جاری', 'account_type': 'asset', 'parent': None},
            {'code': '1010', 'name': 'صندوق', 'account_type': 'asset', 'parent': '1000'},
            {'code': '1020', 'name': 'بانک', 'account_type': 'asset', 'parent': '1000'},
            {'code': '1030', 'name': 'حساب‌های دریافتنی', 'account_type': 'asset', 'parent': '1000'},
            {'code': '1040', 'name': 'موجودی کالا', 'account_type': 'asset', 'parent': '1000'},
            
            {'code': '1500', 'name': 'دارایی‌های ثابت', 'account_type': 'asset', 'parent': None},
            {'code': '1510', 'name': 'زمین', 'account_type': 'asset', 'parent': '1500'},
            {'code': '1520', 'name': 'ساختمان', 'account_type': 'asset', 'parent': '1500'},
            {'code': '1530', 'name': 'تجهیزات', 'account_type': 'asset', 'parent': '1500'},
            
            # Liabilities (2000-2999)
            {'code': '2000', 'name': 'بدهی‌های جاری', 'account_type': 'liability', 'parent': None},
            {'code': '2010', 'name': 'حساب‌های پرداختنی', 'account_type': 'liability', 'parent': '2000'},
            {'code': '2020', 'name': 'وام کوتاه‌مدت', 'account_type': 'liability', 'parent': '2000'},
            
            {'code': '2500', 'name': 'بدهی‌های بلندمدت', 'account_type': 'liability', 'parent': None},
            {'code': '2510', 'name': 'وام بلندمدت', 'account_type': 'liability', 'parent': '2500'},
            
            # Equity (3000-3999)
            {'code': '3000', 'name': 'حقوق صاحبان سهام', 'account_type': 'equity', 'parent': None},
            {'code': '3010', 'name': 'سرمایه', 'account_type': 'equity', 'parent': '3000'},
            {'code': '3020', 'name': 'سود (زیان) انباشته', 'account_type': 'equity', 'parent': '3000'},
            
            # Revenue (4000-4999)
            {'code': '4000', 'name': 'درآمدها', 'account_type': 'revenue', 'parent': None},
            {'code': '4010', 'name': 'درآمد فروش', 'account_type': 'revenue', 'parent': '4000'},
            {'code': '4020', 'name': 'درآمد خدمات', 'account_type': 'revenue', 'parent': '4000'},
            
            # Expenses (5000-5999)
            {'code': '5000', 'name': 'هزینه‌های عملیاتی', 'account_type': 'expense', 'parent': None},
            {'code': '5010', 'name': 'بهای تمام شده کالای فروش رفته', 'account_type': 'expense', 'parent': '5000'},
            {'code': '5020', 'name': 'حقوق و دستمزد', 'account_type': 'expense', 'parent': '5000'},
            {'code': '5030', 'name': 'اجاره', 'account_type': 'expense', 'parent': '5000'},
            {'code': '5040', 'name': 'آب و برق و گاز', 'account_type': 'expense', 'parent': '5000'},
            {'code': '5050', 'name': 'استهلاک', 'account_type': 'expense', 'parent': '5000'},
        ]

        # Create accounts in two passes to handle parent relationships
        created_accounts = {}
        
        # First pass: create all accounts without parent
        for account_data in default_accounts:
            account = ChartOfAccounts.objects.create(
                company=company,
                code=account_data['code'],
                name=account_data['name'],
                account_type=account_data['account_type'],
                is_active=True
            )
            created_accounts[account_data['code']] = account
        
        # Second pass: set parent relationships
        for account_data in default_accounts:
            if account_data['parent']:
                account = created_accounts[account_data['code']]
                parent = created_accounts.get(account_data['parent'])
                if parent:
                    account.parent = parent
                    account.save()

        self.stdout.write(self.style.SUCCESS(f'Created {len(default_accounts)} default accounts'))
