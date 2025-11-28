from django.db import models
from django.conf import settings
from companies.models import Company


class Page(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='pages', verbose_name='شرکت')
    title = models.CharField(max_length=255, verbose_name='عنوان')
    slug = models.SlugField(max_length=255, verbose_name='نامک')
    content = models.TextField(verbose_name='محتوا')
    meta_title = models.CharField(max_length=255, blank=True, null=True, verbose_name='عنوان متا')
    meta_description = models.TextField(blank=True, null=True, verbose_name='توضیحات متا')
    meta_keywords = models.CharField(max_length=255, blank=True, null=True, verbose_name='کلمات کلیدی متا')
    is_published = models.BooleanField(default=False, verbose_name='منتشر شده')
    published_date = models.DateTimeField(blank=True, null=True, verbose_name='تاریخ انتشار')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, verbose_name='نویسنده')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'صفحه'
        verbose_name_plural = 'صفحات'
        ordering = ['-created_at']
        unique_together = [('company', 'slug')]

    def __str__(self):
        return self.title


class BlogPost(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='blog_posts', verbose_name='شرکت')
    title = models.CharField(max_length=255, verbose_name='عنوان')
    slug = models.SlugField(max_length=255, verbose_name='نامک')
    excerpt = models.TextField(blank=True, null=True, verbose_name='خلاصه')
    content = models.TextField(verbose_name='محتوا')
    featured_image = models.ImageField(upload_to='blog/', blank=True, null=True, verbose_name='تصویر شاخص')
    category = models.CharField(max_length=100, blank=True, null=True, verbose_name='دسته‌بندی')
    tags = models.CharField(max_length=255, blank=True, null=True, verbose_name='برچسب‌ها')
    meta_title = models.CharField(max_length=255, blank=True, null=True, verbose_name='عنوان متا')
    meta_description = models.TextField(blank=True, null=True, verbose_name='توضیحات متا')
    meta_keywords = models.CharField(max_length=255, blank=True, null=True, verbose_name='کلمات کلیدی متا')
    is_published = models.BooleanField(default=False, verbose_name='منتشر شده')
    published_date = models.DateTimeField(blank=True, null=True, verbose_name='تاریخ انتشار')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, verbose_name='نویسنده')
    views = models.IntegerField(default=0, verbose_name='بازدید')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'پست وبلاگ'
        verbose_name_plural = 'پست‌های وبلاگ'
        ordering = ['-published_date']
        unique_together = [('company', 'slug')]

    def __str__(self):
        return self.title


class Message(models.Model):
    name = models.CharField(max_length=255, verbose_name='نام')
    email = models.EmailField(verbose_name='ایمیل')
    subject = models.CharField(max_length=255, verbose_name='موضوع')
    message = models.TextField(verbose_name='پیام')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')

    class Meta:
        verbose_name = 'پیام'
        verbose_name_plural = 'پیام‌ها'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.subject}"
