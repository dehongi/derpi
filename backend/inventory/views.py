from rest_framework import generics, permissions
from .models import Warehouse, Item, Stock, StockMovement
from .serializers import WarehouseSerializer, ItemSerializer, StockSerializer, StockMovementSerializer


class WarehouseListCreateView(generics.ListCreateAPIView):
    serializer_class = WarehouseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return Warehouse.objects.filter(company=user_company)
        return Warehouse.objects.none()

    def perform_create(self, serializer):
        user_company = self.request.user.active_company
        if user_company:
            serializer.save(company=user_company)


class WarehouseDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = WarehouseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return Warehouse.objects.filter(company=user_company)
        return Warehouse.objects.none()


class ItemListCreateView(generics.ListCreateAPIView):
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return Item.objects.filter(company=user_company)
        return Item.objects.none()

    def perform_create(self, serializer):
        user_company = self.request.user.active_company
        if user_company:
            serializer.save(company=user_company)


class ItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return Item.objects.filter(company=user_company)
        return Item.objects.none()


class StockListCreateView(generics.ListCreateAPIView):
    serializer_class = StockSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return Stock.objects.filter(warehouse__company=user_company)
        return Stock.objects.none()


class StockDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StockSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return Stock.objects.filter(warehouse__company=user_company)
        return Stock.objects.none()


class StockMovementListCreateView(generics.ListCreateAPIView):
    serializer_class = StockMovementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return StockMovement.objects.filter(company=user_company)
        return StockMovement.objects.none()

    def perform_create(self, serializer):
        user_company = self.request.user.active_company
        if user_company:
            serializer.save(company=user_company, created_by=self.request.user)


class StockMovementDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StockMovementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return StockMovement.objects.filter(company=user_company)
        return StockMovement.objects.none()
