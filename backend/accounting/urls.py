from django.urls import path
from .views import (
    ChartOfAccountsListCreateView, ChartOfAccountsDetailView,
    JournalEntryListCreateView, JournalEntryDetailView,
    TransactionListCreateView, TransactionDetailView,
)

urlpatterns = [
    path('chart-of-accountss/', ChartOfAccountsListCreateView.as_view(), name='chart-of-accounts-list-create'),
    path('chart-of-accountss/<int:pk>/', ChartOfAccountsDetailView.as_view(), name='chart-of-accounts-detail'),
    path('journal-entrys/', JournalEntryListCreateView.as_view(), name='journal-entry-list-create'),
    path('journal-entrys/<int:pk>/', JournalEntryDetailView.as_view(), name='journal-entry-detail'),
    path('transactions/', TransactionListCreateView.as_view(), name='transaction-list-create'),
    path('transactions/<int:pk>/', TransactionDetailView.as_view(), name='transaction-detail'),
]
