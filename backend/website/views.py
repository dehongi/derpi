from rest_framework import generics, permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import F
from .models import GlobalPage, Page, BlogPost, Message
from .serializers import (
    GlobalPageSerializer, PublicGlobalPageSerializer,
    PageSerializer, BlogPostSerializer, PublicBlogPostSerializer,
    MessageSerializer
)


class IsSuperUser(permissions.BasePermission):
    """Custom permission to only allow superusers"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_superuser


class GlobalPageViewSet(viewsets.ModelViewSet):
    """ViewSet for managing global pages - superuser only"""
    queryset = GlobalPage.objects.all()
    serializer_class = GlobalPageSerializer
    permission_classes = [IsSuperUser]
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save()


class PublicGlobalPageViewSet(viewsets.ReadOnlyModelViewSet):
    """Public viewset for viewing published global pages"""
    queryset = GlobalPage.objects.filter(is_published=True)
    serializer_class = PublicGlobalPageSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class PageListCreateView(generics.ListCreateAPIView):
    serializer_class = PageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return Page.objects.filter(company=user_company)
        return Page.objects.none()

    def perform_create(self, serializer):
        user_company = self.request.user.active_company
        if user_company:
            serializer.save(company=user_company, author=self.request.user)


class PageDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return Page.objects.filter(company=user_company)
        return Page.objects.none()


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.AllowAny] # Allow public to post messages
    http_method_names = ['post'] # Only allow creating messages


class BlogPostListCreateView(generics.ListCreateAPIView):
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return BlogPost.objects.filter(company=user_company)
        return BlogPost.objects.none()

    def perform_create(self, serializer):
        user_company = self.request.user.active_company
        if user_company:
            serializer.save(company=user_company, author=self.request.user)


class BlogPostDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_company = self.request.user.active_company
        if user_company:
            return BlogPost.objects.filter(company=user_company)
        return BlogPost.objects.none()


class PublicBlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    """Public viewset for viewing published blog posts"""
    queryset = BlogPost.objects.filter(is_published=True).select_related('author', 'company')
    serializer_class = PublicBlogPostSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    
    def retrieve(self, request, *args, **kwargs):
        """Override retrieve to increment view counter"""
        instance = self.get_object()
        # Increment views using F() to avoid race conditions
        BlogPost.objects.filter(pk=instance.pk).update(views=F('views') + 1)
        # Refresh instance to get updated view count
        instance.refresh_from_db()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


