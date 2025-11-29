from django.urls import path
from .views import (
    CompanyListCreateView,
    CompanyDetailView,
    set_active_company,
    get_active_company,
    CompanyUsersView
)

urlpatterns = [
    path('', CompanyListCreateView.as_view(), name='company-list-create'),
    path('<int:pk>/', CompanyDetailView.as_view(), name='company-detail'),
    path('<int:pk>/set-active/', set_active_company, name='company-set-active'),
    path('active/', get_active_company, name='company-get-active'),
    path('active/users/', CompanyUsersView.as_view(), name='company-active-users'),
]

