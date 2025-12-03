from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DriverViewSet,
    DeliveryViewSet,
    DeliveryItemViewSet,
    DeliveryRouteViewSet,
    RouteDeliveryViewSet
)

router = DefaultRouter()
router.register(r'drivers', DriverViewSet, basename='driver')
router.register(r'deliveries', DeliveryViewSet, basename='delivery')
router.register(r'delivery-items', DeliveryItemViewSet, basename='delivery-item')
router.register(r'routes', DeliveryRouteViewSet, basename='delivery-route')
router.register(r'route-deliveries', RouteDeliveryViewSet, basename='route-delivery')

urlpatterns = [
    path('', include(router.urls)),
]
