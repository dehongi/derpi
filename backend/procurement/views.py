from rest_framework import generics, permissions
from .models import Supplier, PurchaseOrder, PurchaseOrderItem, PurchaseReceipt, PurchaseReceiptItem
from .serializers import SupplierSerializer, PurchaseOrderSerializer, PurchaseOrderItemSerializer, PurchaseReceiptSerializer, PurchaseReceiptItemSerializer


class SupplierListCreateView(generics.ListCreateAPIView):
    serializer_class = SupplierSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return Supplier.objects.filter(company=user_company)
        return Supplier.objects.none()

    def perform_create(self, serializer):
        user_company = self.request.user.active_company
        if user_company:
            serializer.save(company=user_company)


class SupplierDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SupplierSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return Supplier.objects.filter(company=user_company)
        return Supplier.objects.none()


class PurchaseOrderListCreateView(generics.ListCreateAPIView):
    serializer_class = PurchaseOrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return PurchaseOrder.objects.filter(company=user_company)
        return PurchaseOrder.objects.none()

    def perform_create(self, serializer):
        user_company = self.request.user.active_company
        if user_company:
            serializer.save(company=user_company)


class PurchaseOrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PurchaseOrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return PurchaseOrder.objects.filter(company=user_company)
        return PurchaseOrder.objects.none()


class PurchaseOrderItemListCreateView(generics.ListCreateAPIView):
    serializer_class = PurchaseOrderItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PurchaseOrderItem.objects.all()


class PurchaseOrderItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PurchaseOrderItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PurchaseOrderItem.objects.all()


class PurchaseReceiptListCreateView(generics.ListCreateAPIView):
    serializer_class = PurchaseReceiptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return PurchaseReceipt.objects.filter(company=user_company)
        return PurchaseReceipt.objects.none()

    def perform_create(self, serializer):
        user_company = self.request.user.active_company
        if user_company:
            serializer.save(company=user_company)


class PurchaseReceiptDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PurchaseReceiptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return PurchaseReceipt.objects.filter(company=user_company)
        return PurchaseReceipt.objects.none()


class PurchaseReceiptItemListCreateView(generics.ListCreateAPIView):
    serializer_class = PurchaseReceiptItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PurchaseReceiptItem.objects.all()


class PurchaseReceiptItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PurchaseReceiptItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PurchaseReceiptItem.objects.all()


