from rest_framework import generics, permissions
from .models import Category, Product, Order, OrderItem
from .serializers import CategorySerializer, ProductSerializer, OrderSerializer, OrderItemSerializer


class CategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return Category.objects.filter(company=user_company)
        return Category.objects.none()

    def perform_create(self, serializer):
        user_company = self.request.user.active_company
        if user_company:
            serializer.save(company=user_company)


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return Category.objects.filter(company=user_company)
        return Category.objects.none()


class ProductListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return Product.objects.filter(company=user_company)
        return Product.objects.none()

    def perform_create(self, serializer):
        user_company = self.request.user.active_company
        if user_company:
            serializer.save(company=user_company)


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return Product.objects.filter(company=user_company)
        return Product.objects.none()


class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return Order.objects.filter(company=user_company)
        return Order.objects.none()

    def perform_create(self, serializer):
        user_company = self.request.user.active_company
        if user_company:
            serializer.save(company=user_company)


class OrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return Order.objects.filter(company=user_company)
        return Order.objects.none()


class OrderItemListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return OrderItem.objects.all()


class OrderItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = OrderItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return OrderItem.objects.all()


