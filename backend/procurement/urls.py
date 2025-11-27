from django.urls import path
from .views import (
    SupplierListCreateView, SupplierDetailView,
    PurchaseOrderListCreateView, PurchaseOrderDetailView,
    PurchaseOrderItemListCreateView, PurchaseOrderItemDetailView,
    PurchaseReceiptListCreateView, PurchaseReceiptDetailView,
    PurchaseReceiptItemListCreateView, PurchaseReceiptItemDetailView,
)

urlpatterns = [
    path('suppliers/', SupplierListCreateView.as_view(), name='supplier-list-create'),
    path('suppliers/<int:pk>/', SupplierDetailView.as_view(), name='supplier-detail'),
    path('purchase-orders/', PurchaseOrderListCreateView.as_view(), name='purchase-order-list-create'),
    path('purchase-orders/<int:pk>/', PurchaseOrderDetailView.as_view(), name='purchase-order-detail'),
    path('purchase-order-items/', PurchaseOrderItemListCreateView.as_view(), name='purchase-order-item-list-create'),
    path('purchase-order-items/<int:pk>/', PurchaseOrderItemDetailView.as_view(), name='purchase-order-item-detail'),
    path('purchase-receipts/', PurchaseReceiptListCreateView.as_view(), name='purchase-receipt-list-create'),
    path('purchase-receipts/<int:pk>/', PurchaseReceiptDetailView.as_view(), name='purchase-receipt-detail'),
    path('purchase-receipt-items/', PurchaseReceiptItemListCreateView.as_view(), name='purchase-receipt-item-list-create'),
    path('purchase-receipt-items/<int:pk>/', PurchaseReceiptItemDetailView.as_view(), name='purchase-receipt-item-detail'),
]
