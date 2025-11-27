from rest_framework import generics, permissions
from .models import Quotation, QuotationItem, SalesOrder, SalesOrderItem, Invoice, InvoiceItem, Payment
from .serializers import QuotationSerializer, QuotationItemSerializer, SalesOrderSerializer, SalesOrderItemSerializer, InvoiceSerializer, InvoiceItemSerializer, PaymentSerializer


class QuotationListCreateView(generics.ListCreateAPIView):
    serializer_class = QuotationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return Quotation.objects.filter(company=user_company)
        return Quotation.objects.none()

    def perform_create(self, serializer):
        user_company = self.request.user.active_company
        if user_company:
            serializer.save(company=user_company)


class QuotationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = QuotationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return Quotation.objects.filter(company=user_company)
        return Quotation.objects.none()


class QuotationItemListCreateView(generics.ListCreateAPIView):
    serializer_class = QuotationItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return QuotationItem.objects.all()


class QuotationItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = QuotationItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return QuotationItem.objects.all()


class SalesOrderListCreateView(generics.ListCreateAPIView):
    serializer_class = SalesOrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return SalesOrder.objects.filter(company=user_company)
        return SalesOrder.objects.none()

    def perform_create(self, serializer):
        user_company = self.request.user.active_company
        if user_company:
            serializer.save(company=user_company)


class SalesOrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SalesOrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return SalesOrder.objects.filter(company=user_company)
        return SalesOrder.objects.none()


class SalesOrderItemListCreateView(generics.ListCreateAPIView):
    serializer_class = SalesOrderItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SalesOrderItem.objects.all()


class SalesOrderItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SalesOrderItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SalesOrderItem.objects.all()


class InvoiceListCreateView(generics.ListCreateAPIView):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return Invoice.objects.filter(company=user_company)
        return Invoice.objects.none()

    def perform_create(self, serializer):
        user_company = self.request.user.active_company
        if user_company:
            serializer.save(company=user_company)


class InvoiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return Invoice.objects.filter(company=user_company)
        return Invoice.objects.none()


class InvoiceItemListCreateView(generics.ListCreateAPIView):
    serializer_class = InvoiceItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return InvoiceItem.objects.all()


class InvoiceItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = InvoiceItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return InvoiceItem.objects.all()


class PaymentListCreateView(generics.ListCreateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return Payment.objects.filter(company=user_company)
        return Payment.objects.none()

    def perform_create(self, serializer):
        user_company = self.request.user.active_company
        if user_company:
            serializer.save(company=user_company)


class PaymentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return Payment.objects.filter(company=user_company)
        return Payment.objects.none()


