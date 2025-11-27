from django.urls import path
from .views import (
    POSSaleListCreateView, POSSaleDetailView,
    POSSaleItemListCreateView, POSSaleItemDetailView,
    POSPaymentListCreateView, POSPaymentDetailView,
)

urlpatterns = [
    path('p-o-s-sales/', POSSaleListCreateView.as_view(), name='p-o-s-sale-list-create'),
    path('p-o-s-sales/<int:pk>/', POSSaleDetailView.as_view(), name='p-o-s-sale-detail'),
    path('p-o-s-sale-items/', POSSaleItemListCreateView.as_view(), name='p-o-s-sale-item-list-create'),
    path('p-o-s-sale-items/<int:pk>/', POSSaleItemDetailView.as_view(), name='p-o-s-sale-item-detail'),
    path('p-o-s-payments/', POSPaymentListCreateView.as_view(), name='p-o-s-payment-list-create'),
    path('p-o-s-payments/<int:pk>/', POSPaymentDetailView.as_view(), name='p-o-s-payment-detail'),
]
