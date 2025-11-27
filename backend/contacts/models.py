from django.db import models
from companies.models import Company

class Contact(models.Model):
    CONTACT_TYPES = [
        ('customer', 'مشتری'),
        ('supplier', 'تامین‌کننده'),
        ('partner', 'شریک تجاری'),
        ('other', 'سایر'),
    ]
    
    # Relationship
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='contacts')
    
    # Basic Information
    name = models.CharField(max_length=255, verbose_name='نام')
    email = models.EmailField(blank=True, null=True, verbose_name='ایمیل')
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name='تلفن')
    mobile = models.CharField(max_length=20, blank=True, null=True, verbose_name='موبایل')
    
    # Address Information
    address = models.TextField(blank=True, null=True, verbose_name='آدرس')
    city = models.CharField(max_length=100, blank=True, null=True, verbose_name='شهر')
    postal_code = models.CharField(max_length=20, blank=True, null=True, verbose_name='کد پستی')
    country = models.CharField(max_length=100, blank=True, null=True, default='ایران', verbose_name='کشور')
    
    # Business Information
    company_name = models.CharField(max_length=255, blank=True, null=True, verbose_name='نام شرکت')
    position = models.CharField(max_length=100, blank=True, null=True, verbose_name='سمت')
    website = models.URLField(blank=True, null=True, verbose_name='وب‌سایت')
    
    # Contact Type
    contact_type = models.CharField(max_length=20, choices=CONTACT_TYPES, default='customer', verbose_name='نوع مخاطب')
    
    # Additional
    notes = models.TextField(blank=True, null=True, verbose_name='یادداشت‌ها')
    is_active = models.BooleanField(default=True, verbose_name='فعال')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')
    
    class Meta:
        verbose_name = 'مخاطب'
        verbose_name_plural = 'مخاطبین'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
