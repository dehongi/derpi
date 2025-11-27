from django.db import models
from django.conf import settings

class Company(models.Model):
    # Basic Information
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='owned_companies',
        verbose_name='مالک'
    )
    name = models.CharField(max_length=255, verbose_name='نام شرکت')
    address = models.TextField(blank=True, null=True, verbose_name='آدرس')
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name='تلفن')
    
    # Additional Company Information
    tax_id = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        verbose_name='شناسه مالیاتی'
    )
    registration_number = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        verbose_name='شماره ثبت'
    )
    
    # Status
    is_active = models.BooleanField(default=True, verbose_name='فعال')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')
    
    class Meta:
        verbose_name = 'شرکت'
        verbose_name_plural = 'شرکت‌ها'
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class CompanyMembership(models.Model):
    """
    Intermediate model for many-to-many relationship between User and Company
    with additional fields for role and permissions
    """
    ROLE_CHOICES = [
        ('owner', 'مالک'),
        ('admin', 'مدیر'),
        ('manager', 'مدیر بخش'),
        ('accountant', 'حسابدار'),
        ('employee', 'کارمند'),
        ('viewer', 'بیننده'),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='company_memberships',
        verbose_name='کاربر'
    )
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name='memberships',
        verbose_name='شرکت'
    )
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='employee',
        verbose_name='نقش'
    )
    is_active = models.BooleanField(default=True, verbose_name='فعال')
    joined_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ عضویت')
    
    # Optional: For future granular permissions
    permissions = models.JSONField(
        blank=True,
        null=True,
        verbose_name='مجوزها',
        help_text='مجوزهای سفارشی برای این عضویت'
    )
    
    class Meta:
        verbose_name = 'عضویت شرکت'
        verbose_name_plural = 'عضویت‌های شرکت'
        unique_together = [('user', 'company')]
        ordering = ['-joined_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.company.name} ({self.get_role_display()})"

