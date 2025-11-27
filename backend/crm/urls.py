from django.urls import path
from .views import (
    LeadListCreateView, LeadDetailView,
    OpportunityListCreateView, OpportunityDetailView,
    ActivityListCreateView, ActivityDetailView,
)

urlpatterns = [
    path('leads/', LeadListCreateView.as_view(), name='lead-list-create'),
    path('leads/<int:pk>/', LeadDetailView.as_view(), name='lead-detail'),
    path('opportunitys/', OpportunityListCreateView.as_view(), name='opportunity-list-create'),
    path('opportunitys/<int:pk>/', OpportunityDetailView.as_view(), name='opportunity-detail'),
    path('activitys/', ActivityListCreateView.as_view(), name='activity-list-create'),
    path('activitys/<int:pk>/', ActivityDetailView.as_view(), name='activity-detail'),
]
