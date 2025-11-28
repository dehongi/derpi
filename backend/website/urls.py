from django.urls import path
from .views import (
    PageListCreateView, PageDetailView,
    BlogPostListCreateView, BlogPostDetailView,
    MessageViewSet,
)

urlpatterns = [
    path('pages/', PageListCreateView.as_view(), name='page-list-create'),
    path('pages/<int:pk>/', PageDetailView.as_view(), name='page-detail'),
    path('blog-posts/', BlogPostListCreateView.as_view(), name='blog-post-list-create'),
    path('blog-posts/<int:pk>/', BlogPostDetailView.as_view(), name='blog-post-detail'),
    path('messages/', MessageViewSet.as_view({'post': 'create'}), name='message-create'),
]
