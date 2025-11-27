from django.urls import path
from .views import (
    WarehouseListCreateView, WarehouseDetailView,
    ItemListCreateView, ItemDetailView,
    StockListCreateView, StockDetailView,
    StockMovementListCreateView, StockMovementDetailView
)

urlpatterns = [
    path('warehouses/', WarehouseListCreateView.as_view(), name='warehouse-list-create'),
    path('warehouses/<int:pk>/', WarehouseDetailView.as_view(), name='warehouse-detail'),
    path('items/', ItemListCreateView.as_view(), name='item-list-create'),
    path('items/<int:pk>/', ItemDetailView.as_view(), name='item-detail'),
    path('stocks/', StockListCreateView.as_view(), name='stock-list-create'),
    path('stocks/<int:pk>/', StockDetailView.as_view(), name='stock-detail'),
    path('movements/', StockMovementListCreateView.as_view(), name='movement-list-create'),
    path('movements/<int:pk>/', StockMovementDetailView.as_view(), name='movement-detail'),
]
