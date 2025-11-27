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
            return Transaction.objects.filter(company=user_company)
        return Transaction.objects.none()

    def perform_create(self, serializer):
        user_company = self.request.user.active_company
        if user_company:
            serializer.save(company=user_company)


class TransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return Transaction.objects.filter(company=user_company)
        return Transaction.objects.none()


