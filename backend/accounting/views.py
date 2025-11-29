from rest_framework import generics, permissions
from .models import ChartOfAccounts, JournalEntry, Transaction
from .serializers import ChartOfAccountsSerializer, JournalEntrySerializer, TransactionSerializer


class ChartOfAccountsListCreateView(generics.ListCreateAPIView):
    serializer_class = ChartOfAccountsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return ChartOfAccounts.objects.filter(company=user_company)
        return ChartOfAccounts.objects.none()

    def perform_create(self, serializer):
        user_company = self.request.user.active_company
        if user_company:
            serializer.save(company=user_company)


class ChartOfAccountsDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ChartOfAccountsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return ChartOfAccounts.objects.filter(company=user_company)
        return ChartOfAccounts.objects.none()


class JournalEntryListCreateView(generics.ListCreateAPIView):
    serializer_class = JournalEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return JournalEntry.objects.filter(company=user_company)
        return JournalEntry.objects.none()

    def perform_create(self, serializer):
        user_company = self.request.user.active_company
        if user_company:
            serializer.save(company=user_company)


class JournalEntryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = JournalEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return JournalEntry.objects.filter(company=user_company)
        return JournalEntry.objects.none()


class TransactionListCreateView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return Transaction.objects.filter(journal_entry__company=user_company)
        return Transaction.objects.none()

    def perform_create(self, serializer):
        # Transactions should ideally be created via JournalEntry, but if created directly,
        # we need to ensure the journal_entry belongs to the user's company.
        # For now, we'll assume the serializer validation handles the journal_entry validity.
        serializer.save()


class TransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return Transaction.objects.filter(journal_entry__company=user_company)
        return Transaction.objects.none()


from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum

class BalanceSheetView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_company = request.user.active_company
        if not user_company:
            return Response({"error": "No active company"}, status=400)

        accounts = ChartOfAccounts.objects.filter(company=user_company)
        assets = accounts.filter(account_type='asset')
        liabilities = accounts.filter(account_type='liability')
        equity = accounts.filter(account_type='equity')

        def get_balance(account_qs):
            data = []
            total = 0
            for account in account_qs:
                debit = Transaction.objects.filter(account=account).aggregate(Sum('debit'))['debit__sum'] or 0
                credit = Transaction.objects.filter(account=account).aggregate(Sum('credit'))['credit__sum'] or 0
                # For assets, normal balance is debit. For others, it depends, but let's simplify:
                # Asset: Debit - Credit
                # Liability/Equity: Credit - Debit
                if account.account_type == 'asset':
                    balance = debit - credit
                else:
                    balance = credit - debit
                
                if balance != 0:
                    data.append({
                        "name": account.name,
                        "code": account.code,
                        "balance": balance
                    })
                    total += balance
            return data, total

        assets_data, total_assets = get_balance(assets)
        liabilities_data, total_liabilities = get_balance(liabilities)
        equity_data, total_equity = get_balance(equity)

        return Response({
            "assets": assets_data,
            "total_assets": total_assets,
            "liabilities": liabilities_data,
            "total_liabilities": total_liabilities,
            "equity": equity_data,
            "total_equity": total_equity,
        })

class IncomeStatementView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_company = request.user.active_company
        if not user_company:
            return Response({"error": "No active company"}, status=400)

        accounts = ChartOfAccounts.objects.filter(company=user_company)
        revenue = accounts.filter(account_type='revenue')
        expenses = accounts.filter(account_type='expense')

        def get_balance(account_qs):
            data = []
            total = 0
            for account in account_qs:
                debit = Transaction.objects.filter(account=account).aggregate(Sum('debit'))['debit__sum'] or 0
                credit = Transaction.objects.filter(account=account).aggregate(Sum('credit'))['credit__sum'] or 0
                
                # Revenue: Credit - Debit
                # Expense: Debit - Credit
                if account.account_type == 'revenue':
                    balance = credit - debit
                else:
                    balance = debit - credit
                
                if balance != 0:
                    data.append({
                        "name": account.name,
                        "code": account.code,
                        "balance": balance
                    })
                    total += balance
            return data, total

        revenue_data, total_revenue = get_balance(revenue)
        expenses_data, total_expenses = get_balance(expenses)
        net_income = total_revenue - total_expenses

        return Response({
            "revenue": revenue_data,
            "total_revenue": total_revenue,
            "expenses": expenses_data,
            "total_expenses": total_expenses,
            "net_income": net_income
        })


class CreateDefaultChartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user_company = request.user.active_company
        if not user_company:
            return Response({"error": "No active company"}, status=400)

        # Check if company already has accounts
        if ChartOfAccounts.objects.filter(company=user_company).exists():
            return Response({"error": "Company already has chart of accounts"}, status=400)

        # Create default accounts
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
                company=user_company,
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

        return Response({
            "message": f"Successfully created {len(default_accounts)} default accounts",
            "count": len(default_accounts)
        }, status=201)


