from rest_framework import generics, permissions
from .models import POSSale, POSSaleItem, POSPayment
from .serializers import POSSaleSerializer, POSSaleItemSerializer, POSPaymentSerializer


class POSSaleListCreateView(generics.ListCreateAPIView):
    serializer_class = POSSaleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return POSSale.objects.filter(company=user_company)
        return POSSale.objects.none()

    def perform_create(self, serializer):
        user_company = self.request.user.active_company
        if user_company:
            serializer.save(company=user_company)


class POSSaleDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = POSSaleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return POSSale.objects.filter(company=user_company)
        return POSSale.objects.none()


class POSSaleItemListCreateView(generics.ListCreateAPIView):
    serializer_class = POSSaleItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return POSSaleItem.objects.all()


class POSSaleItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = POSSaleItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return POSSaleItem.objects.all()


class POSPaymentListCreateView(generics.ListCreateAPIView):
    serializer_class = POSPaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return POSPayment.objects.filter(company=user_company)
        return POSPayment.objects.none()

    def perform_create(self, serializer):
        user_company = self.request.user.active_company
        if user_company:
            serializer.save(company=user_company)


class POSPaymentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = POSPaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return POSPayment.objects.filter(company=user_company)
        return POSPayment.objects.none()


