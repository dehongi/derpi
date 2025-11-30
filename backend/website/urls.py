from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    GlobalPageViewSet, PublicGlobalPageViewSet,
    PageListCreateView, PageDetailView,
    BlogPostListCreateView, BlogPostDetailView,
    PublicBlogPostViewSet,
    MessageViewSet,
)

router = DefaultRouter()
router.register(r'global-pages', GlobalPageViewSet, basename='global-page')
router.register(r'public/global-pages', PublicGlobalPageViewSet, basename='public-global-page')
router.register(r'public/blog-posts', PublicBlogPostViewSet, basename='public-blog-post')

urlpatterns = [
    # Dashboard endpoints (authenticated)
    path('pages/', PageListCreateView.as_view(), name='page-list-create'),
    path('pages/<int:pk>/', PageDetailView.as_view(), name='page-detail'),
    path('blog-posts/', BlogPostListCreateView.as_view(), name='blog-post-list-create'),
    path('blog-posts/<int:pk>/', BlogPostDetailView.as_view(), name='blog-post-detail'),
    
    # Public endpoints
    path('messages/', MessageViewSet.as_view({'post': 'create'}), name='message-create'),
    
    # Router URLs
    path('', include(router.urls)),
]
