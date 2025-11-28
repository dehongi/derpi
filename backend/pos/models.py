from django.db import models
from django.conf import settings
from django.utils import timezone
from companies.models import Company
from contacts.models import Contact
from inventory.models import Item, Stock


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
    sale_number = models.CharField(max_length=100, blank=True, verbose_name='شماره فروش')
    date = models.DateTimeField(verbose_name='تاریخ')
    customer = models.ForeignKey(Contact, on_delete=models.SET_NULL, null=True, blank=True, related_name='pos_sales', verbose_name='مشتری')
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='جمع جزء')
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='تخفیف')
    tax = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='مالیات')
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='جمع کل')
    paid_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='مبلغ پرداختی')
    change_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='مبلغ برگشتی')
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

    def save(self, *args, **kwargs):
        # Auto-generate sale number if not provided
        if not self.sale_number:
            # Get the last sale for this company
            last_sale = POSSale.objects.filter(company=self.company).order_by('-id').first()
            if last_sale and last_sale.sale_number:
                try:
                    # Extract number from format POS-YYYYMMDD-XXXX
                    last_num = int(last_sale.sale_number.split('-')[-1])
                    new_num = last_num + 1
                except (ValueError, IndexError):
                    new_num = 1
            else:
                new_num = 1
            
            # Format: POS-YYYYMMDD-0001
            date_str = timezone.now().strftime('%Y%m%d')
            self.sale_number = f"POS-{date_str}-{new_num:04d}"
        
        super().save(*args, **kwargs)
    
    def calculate_totals(self):
        """Calculate subtotal, tax, and total from items"""
        self.subtotal = sum(item.total for item in self.items.all())
        # Apply discount
        discounted_amount = self.subtotal - self.discount
        # Calculate tax (assuming tax is a percentage, e.g., 9% = 0.09)
        # For now, tax is set manually or can be calculated
        self.total = discounted_amount + self.tax
        # Calculate change if paid amount is provided
        if self.paid_amount > 0:
            self.change_amount = self.paid_amount - self.total
        self.save()

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
