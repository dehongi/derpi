from django.contrib import admin
from .models import Page, BlogPost

@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ('id', '__str__', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('id',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('id', '__str__', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('id',)
    readonly_fields = ('created_at', 'updated_at')


