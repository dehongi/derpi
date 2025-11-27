from django.urls import path
from .views import (
    QuotationListCreateView, QuotationDetailView,
    QuotationItemListCreateView, QuotationItemDetailView,
    SalesOrderListCreateView, SalesOrderDetailView,
    SalesOrderItemListCreateView, SalesOrderItemDetailView,
    InvoiceListCreateView, InvoiceDetailView,
    InvoiceItemListCreateView, InvoiceItemDetailView,
    PaymentListCreateView, PaymentDetailView,
)

urlpatterns = [
    path('quotations/', QuotationListCreateView.as_view(), name='quotation-list-create'),
    path('quotations/<int:pk>/', QuotationDetailView.as_view(), name='quotation-detail'),
    path('quotation-items/', QuotationItemListCreateView.as_view(), name='quotation-item-list-create'),
    path('quotation-items/<int:pk>/', QuotationItemDetailView.as_view(), name='quotation-item-detail'),
    path('sales-orders/', SalesOrderListCreateView.as_view(), name='sales-order-list-create'),
    path('sales-orders/<int:pk>/', SalesOrderDetailView.as_view(), name='sales-order-detail'),
    path('sales-order-items/', SalesOrderItemListCreateView.as_view(), name='sales-order-item-list-create'),
    path('sales-order-items/<int:pk>/', SalesOrderItemDetailView.as_view(), name='sales-order-item-detail'),
    path('invoices/', InvoiceListCreateView.as_view(), name='invoice-list-create'),
    path('invoices/<int:pk>/', InvoiceDetailView.as_view(), name='invoice-detail'),
    path('invoice-items/', InvoiceItemListCreateView.as_view(), name='invoice-item-list-create'),
    path('invoice-items/<int:pk>/', InvoiceItemDetailView.as_view(), name='invoice-item-detail'),
    path('payments/', PaymentListCreateView.as_view(), name='payment-list-create'),
    path('payments/<int:pk>/', PaymentDetailView.as_view(), name='payment-detail'),
]
