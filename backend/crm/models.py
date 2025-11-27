from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from companies.models import Company
from contacts.models import Contact


class Lead(models.Model):
    SOURCE_CHOICES = [
        ('website', 'وب‌سایت'),
        ('referral', 'معرفی'),
        ('cold_call', 'تماس سرد'),
        ('social_media', 'شبکه‌های اجتماعی'),
        ('other', 'سایر'),
    ]
    
    STATUS_CHOICES = [
        ('new', 'جدید'),
        ('contacted', 'تماس گرفته شده'),
        ('qualified', 'واجد شرایط'),
        ('lost', 'از دست رفته'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='leads', verbose_name='شرکت')
    name = models.CharField(max_length=255, verbose_name='نام')
    email = models.EmailField(blank=True, null=True, verbose_name='ایمیل')
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name='تلفن')
    mobile = models.CharField(max_length=20, blank=True, null=True, verbose_name='موبایل')
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, verbose_name='منبع')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new', verbose_name='وضعیت')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, verbose_name='اختصاص داده شده به')
    notes = models.TextField(blank=True, null=True, verbose_name='یادداشت‌ها')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'سرنخ'
        verbose_name_plural = 'سرنخ‌ها'
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class Opportunity(models.Model):
    STAGE_CHOICES = [
        ('prospecting', 'جستجو'),
        ('qualification', 'ارزیابی'),
        ('proposal', 'پیشنهاد'),
        ('negotiation', 'مذاکره'),
        ('closed_won', 'بسته شده - برنده'),
        ('closed_lost', 'بسته شده - بازنده'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='opportunities', verbose_name='شرکت')
    lead = models.ForeignKey(Lead, on_delete=models.SET_NULL, null=True, blank=True, verbose_name='سرنخ')
    contact = models.ForeignKey(Contact, on_delete=models.PROTECT, verbose_name='مخاطب')
    title = models.CharField(max_length=255, verbose_name='عنوان')
    value = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='ارزش')
    probability = models.IntegerField(default=50, verbose_name='احتمال (%)')
    stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default='prospecting', verbose_name='مرحله')
    expected_close_date = models.DateField(blank=True, null=True, verbose_name='تاریخ بسته شدن مورد انتظار')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, verbose_name='اختصاص داده شده به')
    notes = models.TextField(blank=True, null=True, verbose_name='یادداشت‌ها')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'فرصت'
        verbose_name_plural = 'فرصت‌ها'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Activity(models.Model):
    ACTIVITY_TYPE_CHOICES = [
        ('call', 'تماس'),
        ('meeting', 'جلسه'),
        ('email', 'ایمیل'),
        ('task', 'وظیفه'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='activities', verbose_name='شرکت')
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPE_CHOICES, verbose_name='نوع فعالیت')
    subject = models.CharField(max_length=255, verbose_name='موضوع')
    description = models.TextField(blank=True, null=True, verbose_name='توضیحات')
    due_date = models.DateTimeField(blank=True, null=True, verbose_name='سررسید')
    completed = models.BooleanField(default=False, verbose_name='انجام شده')
    
    # Generic relation to Lead, Opportunity, or Contact
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    related_to = GenericForeignKey('content_type', 'object_id')
    
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, verbose_name='اختصاص داده شده به')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'فعالیت'
        verbose_name_plural = 'فعالیت‌ها'
        ordering = ['-due_date']

    def __str__(self):
        return self.subject
