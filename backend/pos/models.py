from django.db import models
from django.conf import settings
from companies.models import Company
from contacts.models import Contact
from inventory.models import Item


class POSSale(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'نقدی'),
        ('card', 'کارت'),
        ('transfer', 'انتقال بانکی'),
    ]
    
    STATUS_CHOICES = [
        ('completed', 'تکمیل شده'),
        ('cancelled', 'لغو شده'),
        ('refunded', 'بازگشت داده شده'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='pos_sales', verbose_name='شرکت')
    sale_number = models.CharField(max_length=100, verbose_name='شماره فروش')
    date = models.DateTimeField(verbose_name='تاریخ')
    customer = models.ForeignKey(Contact, on_delete=models.SET_NULL, null=True, blank=True, related_name='pos_sales', verbose_name='مشتری')
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='جمع جزء')
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='تخفیف')
    tax = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='مالیات')
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='جمع کل')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, verbose_name='روش پرداخت')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='completed', verbose_name='وضعیت')
    cashier = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, verbose_name='صندوقدار')
    notes = models.TextField(blank=True, null=True, verbose_name='یادداشت‌ها')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'فروش POS'
        verbose_name_plural = 'فروش‌های POS'
        ordering = ['-date']
        unique_together = [('company', 'sale_number')]

    def __str__(self):
        return f"{self.sale_number} - {self.total}"


class POSSaleItem(models.Model):
    sale = models.ForeignKey(POSSale, on_delete=models.CASCADE, related_name='items', verbose_name='فروش')
    item = models.ForeignKey(Item, on_delete=models.PROTECT, verbose_name='کالا')
    quantity = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='تعداد')
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='قیمت واحد')
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='تخفیف')
    total = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='جمع')

    class Meta:
        verbose_name = 'آیتم فروش POS'
        verbose_name_plural = 'آیتم‌های فروش POS'

    def __str__(self):
        return f"{self.item.name} x {self.quantity}"


class POSPayment(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'نقدی'),
        ('card', 'کارت'),
        ('transfer', 'انتقال بانکی'),
    ]

    sale = models.ForeignKey(POSSale, on_delete=models.CASCADE, related_name='payments', verbose_name='فروش')
    amount = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='مبلغ')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, verbose_name='روش پرداخت')
    reference = models.CharField(max_length=255, blank=True, null=True, verbose_name='مرجع')
    date = models.DateTimeField(verbose_name='تاریخ')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'پرداخت POS'
        verbose_name_plural = 'پرداخت‌های POS'
        ordering = ['-date']

    def __str__(self):
        return f"{self.amount} - {self.get_payment_method_display()}"
