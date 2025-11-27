from django.db import models
from django.conf import settings
from companies.models import Company


class ChartOfAccounts(models.Model):
    ACCOUNT_TYPE_CHOICES = [
        ('asset', 'دارایی'),
        ('liability', 'بدهی'),
        ('equity', 'حقوق صاحبان سهام'),
        ('revenue', 'درآمد'),
        ('expense', 'هزینه'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='accounts', verbose_name='شرکت')
    code = models.CharField(max_length=50, verbose_name='کد حساب')
    name = models.CharField(max_length=255, verbose_name='نام حساب')
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPE_CHOICES, verbose_name='نوع حساب')
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='children', verbose_name='حساب والد')
    is_active = models.BooleanField(default=True, verbose_name='فعال')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'حساب'
        verbose_name_plural = 'دفتر حساب‌ها'
        ordering = ['code']
        unique_together = [('company', 'code')]

    def __str__(self):
        return f"{self.code} - {self.name}"


class JournalEntry(models.Model):
    STATUS_CHOICES = [
        ('draft', 'پیش‌نویس'),
        ('posted', 'ثبت شده'),
        ('cancelled', 'لغو شده'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='journal_entries', verbose_name='شرکت')
    entry_number = models.CharField(max_length=100, verbose_name='شماره سند')
    date = models.DateField(verbose_name='تاریخ')
    description = models.TextField(verbose_name='شرح')
    reference = models.CharField(max_length=255, blank=True, null=True, verbose_name='مرجع')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', verbose_name='وضعیت')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, verbose_name='ایجاد شده توسط')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'سند حسابداری'
        verbose_name_plural = 'اسناد حسابداری'
        ordering = ['-date']
        unique_together = [('company', 'entry_number')]

    def __str__(self):
        return f"{self.entry_number} - {self.date}"


class Transaction(models.Model):
    journal_entry = models.ForeignKey(JournalEntry, on_delete=models.CASCADE, related_name='transactions', verbose_name='سند')
    account = models.ForeignKey(ChartOfAccounts, on_delete=models.PROTECT, verbose_name='حساب')
    debit = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='بدهکار')
    credit = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='بستانکار')
    description = models.TextField(blank=True, null=True, verbose_name='شرح')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'تراکنش'
        verbose_name_plural = 'تراکنش‌ها'

    def __str__(self):
        return f"{self.account.name} - بدهکار: {self.debit} - بستانکار: {self.credit}"
