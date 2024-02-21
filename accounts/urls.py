from django.urls import path
from .views import SignupPageView

urlpatterns = [
    # Login and Logout
    path("signup/", SignupPageView.as_view(), name="signup"),
]
