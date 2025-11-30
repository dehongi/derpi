from django.contrib import admin
from .models import GlobalPage, Page, BlogPost, Message


@admin.register(GlobalPage)
class GlobalPageAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'slug', 'is_published', 'order', 'author', 'created_at')
    list_filter = ('is_published', 'created_at', 'updated_at')
    search_fields = ('title', 'slug', 'content')
    readonly_fields = ('created_at', 'updated_at')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'slug', 'company', 'is_published', 'author', 'created_at')
    list_filter = ('is_published', 'company', 'created_at', 'updated_at')
    search_fields = ('title', 'slug', 'content')
    readonly_fields = ('created_at', 'updated_at')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'slug', 'company', 'category', 'is_published', 'views', 'author', 'created_at')
    list_filter = ('is_published', 'category', 'company', 'created_at', 'updated_at')
    search_fields = ('title', 'slug', 'content', 'tags')
    readonly_fields = ('created_at', 'updated_at', 'views')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'subject', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('created_at',)


