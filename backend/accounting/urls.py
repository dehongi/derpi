from django.urls import path
from .views import (
    ChartOfAccountsListCreateView, ChartOfAccountsDetailView,
    JournalEntryListCreateView, JournalEntryDetailView,
    TransactionListCreateView, TransactionDetailView,
    BalanceSheetView, IncomeStatementView, CreateDefaultChartView
)

urlpatterns = [
    path('accounts/', ChartOfAccountsListCreateView.as_view(), name='account-list-create'),
    path('accounts/<int:pk>/', ChartOfAccountsDetailView.as_view(), name='account-detail'),
    path('accounts/create-default/', CreateDefaultChartView.as_view(), name='create-default-chart'),
    path('journal-entries/', JournalEntryListCreateView.as_view(), name='journal-entry-list-create'),
    path('journal-entries/<int:pk>/', JournalEntryDetailView.as_view(), name='journal-entry-detail'),
    path('transactions/', TransactionListCreateView.as_view(), name='transaction-list-create'),
    path('transactions/<int:pk>/', TransactionDetailView.as_view(), name='transaction-detail'),
    path('reports/balance-sheet/', BalanceSheetView.as_view(), name='balance-sheet'),
    path('reports/income-statement/', IncomeStatementView.as_view(), name='income-statement'),
]
