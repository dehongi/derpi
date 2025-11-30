from rest_framework import serializers
from .models import GlobalPage, Page, BlogPost, Message


class GlobalPageSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    
    class Meta:
        model = GlobalPage
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'author')


class PublicGlobalPageSerializer(serializers.ModelSerializer):
    """Public serializer - only shows published global pages"""
    class Meta:
        model = GlobalPage
        fields = ('id', 'title', 'slug', 'content', 'meta_title', 'meta_description', 
                  'meta_keywords', 'published_date', 'order')


class PageSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = Page
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'author', 'company')


class BlogPostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)
    featured_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogPost
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'author', 'company', 'views')
    
    def get_featured_image_url(self, obj):
        if obj.featured_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.featured_image.url)
            return obj.featured_image.url
        return None


class PublicBlogPostSerializer(serializers.ModelSerializer):
    """Public serializer - only shows published blog posts"""
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)
    featured_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogPost
        fields = ('id', 'title', 'slug', 'excerpt', 'content', 'featured_image_url',
                  'category', 'tags', 'meta_title', 'meta_description', 'meta_keywords',
                  'published_date', 'author_name', 'company_name', 'views', 'created_at')
    
    def get_featured_image_url(self, obj):
        if obj.featured_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.featured_image.url)
            return obj.featured_image.url
        return None


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'
        read_only_fields = ('created_at',)
