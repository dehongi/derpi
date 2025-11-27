from django.db import models
from django.conf import settings
from companies.models import Company
from inventory.models import Item


class Supplier(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='suppliers', verbose_name='شرکت')
    name = models.CharField(max_length=255, verbose_name='نام تامین‌کننده')
    contact_person = models.CharField(max_length=255, blank=True, null=True, verbose_name='فرد تماس')
    email = models.EmailField(blank=True, null=True, verbose_name='ایمیل')
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name='تلفن')
    address = models.TextField(blank=True, null=True, verbose_name='آدرس')
    tax_id = models.CharField(max_length=50, blank=True, null=True, verbose_name='شناسه مالیاتی')
    payment_terms = models.TextField(blank=True, null=True, verbose_name='شرایط پرداخت')
    is_active = models.BooleanField(default=True, verbose_name='فعال')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'تامین‌کننده'
        verbose_name_plural = 'تامین‌کنندگان'
        ordering = ['name']

    def __str__(self):
        return self.name


class PurchaseOrder(models.Model):
    STATUS_CHOICES = [
        ('draft', 'پیش‌نویس'),
        ('sent', 'ارسال شده'),
        ('confirmed', 'تایید شده'),
        ('received', 'دریافت شده'),
        ('cancelled', 'لغو شده'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='purchase_orders', verbose_name='شرکت')
    po_number = models.CharField(max_length=100, verbose_name='شماره سفارش خرید')
    supplier = models.ForeignKey(Supplier, on_delete=models.PROTECT, related_name='purchase_orders', verbose_name='تامین‌کننده')
    date = models.DateField(verbose_name='تاریخ')
    expected_delivery_date = models.DateField(blank=True, null=True, verbose_name='تاریخ تحویل مورد انتظار')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', verbose_name='وضعیت')
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='جمع جزء')
    tax = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='مالیات')
    shipping = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='هزینه حمل')
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='جمع کل')
    notes = models.TextField(blank=True, null=True, verbose_name='یادداشت‌ها')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, verbose_name='ایجاد شده توسط')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'سفارش خرید'
        verbose_name_plural = 'سفارش‌های خرید'
        ordering = ['-date']
        unique_together = [('company', 'po_number')]

    def __str__(self):
        return f"{self.po_number} - {self.supplier.name}"


class PurchaseOrderItem(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='items', verbose_name='سفارش خرید')
    item = models.ForeignKey(Item, on_delete=models.PROTECT, verbose_name='کالا')
    quantity = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='تعداد')
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='قیمت واحد')
    total = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='جمع')

    class Meta:
        verbose_name = 'آیتم سفارش خرید'
        verbose_name_plural = 'آیتم‌های سفارش خرید'

    def __str__(self):
        return f"{self.item.name} x {self.quantity}"


class PurchaseReceipt(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='purchase_receipts', verbose_name='شرکت')
    receipt_number = models.CharField(max_length=100, verbose_name='شماره رسید')
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.PROTECT, related_name='receipts', verbose_name='سفارش خرید')
    date = models.DateField(verbose_name='تاریخ')
    received_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, verbose_name='دریافت شده توسط')
    notes = models.TextField(blank=True, null=True, verbose_name='یادداشت‌ها')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'رسید خرید'
        verbose_name_plural = 'رسیدهای خرید'
        ordering = ['-date']
        unique_together = [('company', 'receipt_number')]

    def __str__(self):
        return f"{self.receipt_number}"


class PurchaseReceiptItem(models.Model):
    receipt = models.ForeignKey(PurchaseReceipt, on_delete=models.CASCADE, related_name='items', verbose_name='رسید')
    po_item = models.ForeignKey(PurchaseOrderItem, on_delete=models.PROTECT, verbose_name='آیتم سفارش خرید')
    quantity_received = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='تعداد دریافت شده')
    notes = models.TextField(blank=True, null=True, verbose_name='یادداشت‌ها')

    class Meta:
        verbose_name = 'آیتم رسید خرید'
        verbose_name_plural = 'آیتم‌های رسید خرید'

    def __str__(self):
        return f"{self.po_item.item.name} x {self.quantity_received}"
