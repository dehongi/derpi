from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import POSSaleViewSet, POSSaleItemViewSet, POSPaymentViewSet

router = DefaultRouter()
router.register(r'sales', POSSaleViewSet, basename='pos-sale')
router.register(r'sale-items', POSSaleItemViewSet, basename='pos-sale-item')
router.register(r'payments', POSPaymentViewSet, basename='pos-payment')

urlpatterns = [
    path('', include(router.urls)),
]
