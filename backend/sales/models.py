from django.db import models
from django.conf import settings
from companies.models import Company
from contacts.models import Contact
from inventory.models import Item


class Quotation(models.Model):
    STATUS_CHOICES = [
        ('draft', 'پیش‌نویس'),
        ('sent', 'ارسال شده'),
        ('accepted', 'پذیرفته شده'),
        ('rejected', 'رد شده'),
        ('expired', 'منقضی شده'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='quotations', verbose_name='شرکت')
    quote_number = models.CharField(max_length=100, verbose_name='شماره پیش‌فاکتور')
    customer = models.ForeignKey(Contact, on_delete=models.PROTECT, related_name='quotations', verbose_name='مشتری')
    date = models.DateField(verbose_name='تاریخ')
    valid_until = models.DateField(verbose_name='اعتبار تا')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', verbose_name='وضعیت')
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='جمع جزء')
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='تخفیف')
    tax = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='مالیات')
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='جمع کل')
    terms = models.TextField(blank=True, null=True, verbose_name='شرایط')
    notes = models.TextField(blank=True, null=True, verbose_name='یادداشت‌ها')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, verbose_name='ایجاد شده توسط')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'پیش‌فاکتور'
        verbose_name_plural = 'پیش‌فاکتورها'
        ordering = ['-date']
        unique_together = [('company', 'quote_number')]

    def __str__(self):
        return f"{self.quote_number} - {self.customer.name}"


class QuotationItem(models.Model):
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE, related_name='items', verbose_name='پیش‌فاکتور')
    item = models.ForeignKey(Item, on_delete=models.PROTECT, verbose_name='کالا')
    description = models.TextField(blank=True, null=True, verbose_name='توضیحات')
    quantity = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='تعداد')
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='قیمت واحد')
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='تخفیف')
    total = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='جمع')

    class Meta:
        verbose_name = 'آیتم پیش‌فاکتور'
        verbose_name_plural = 'آیتم‌های پیش‌فاکتور'

    def __str__(self):
        return f"{self.item.name} x {self.quantity}"


class SalesOrder(models.Model):
    STATUS_CHOICES = [
        ('draft', 'پیش‌نویس'),
        ('confirmed', 'تایید شده'),
        ('in_progress', 'در حال انجام'),
        ('delivered', 'تحویل داده شده'),
        ('cancelled', 'لغو شده'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='sales_orders', verbose_name='شرکت')
    order_number = models.CharField(max_length=100, verbose_name='شماره سفارش')
    quotation = models.ForeignKey(Quotation, on_delete=models.SET_NULL, null=True, blank=True, verbose_name='پیش‌فاکتور')
    customer = models.ForeignKey(Contact, on_delete=models.PROTECT, related_name='sales_orders', verbose_name='مشتری')
    date = models.DateField(verbose_name='تاریخ')
    delivery_date = models.DateField(blank=True, null=True, verbose_name='تاریخ تحویل')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', verbose_name='وضعیت')
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='جمع جزء')
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='تخفیف')
    tax = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='مالیات')
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='جمع کل')
    notes = models.TextField(blank=True, null=True, verbose_name='یادداشت‌ها')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, verbose_name='ایجاد شده توسط')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'سفارش فروش'
        verbose_name_plural = 'سفارش‌های فروش'
        ordering = ['-date']
        unique_together = [('company', 'order_number')]

    def __str__(self):
        return f"{self.order_number} - {self.customer.name}"


class SalesOrderItem(models.Model):
    sales_order = models.ForeignKey(SalesOrder, on_delete=models.CASCADE, related_name='items', verbose_name='سفارش فروش')
    item = models.ForeignKey(Item, on_delete=models.PROTECT, verbose_name='کالا')
    description = models.TextField(blank=True, null=True, verbose_name='توضیحات')
    quantity = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='تعداد')
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='قیمت واحد')
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='تخفیف')
    total = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='جمع')

    class Meta:
        verbose_name = 'آیتم سفارش فروش'
        verbose_name_plural = 'آیتم‌های سفارش فروش'

    def __str__(self):
        return f"{self.item.name} x {self.quantity}"


class Invoice(models.Model):
    STATUS_CHOICES = [
        ('draft', 'پیش‌نویس'),
        ('sent', 'ارسال شده'),
        ('paid', 'پرداخت شده'),
        ('overdue', 'سررسید گذشته'),
        ('cancelled', 'لغو شده'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='invoices', verbose_name='شرکت')
    invoice_number = models.CharField(max_length=100, verbose_name='شماره فاکتور')
    sales_order = models.ForeignKey(SalesOrder, on_delete=models.SET_NULL, null=True, blank=True, verbose_name='سفارش فروش')
    customer = models.ForeignKey(Contact, on_delete=models.PROTECT, related_name='invoices', verbose_name='مشتری')
    date = models.DateField(verbose_name='تاریخ')
    due_date = models.DateField(verbose_name='سررسید')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', verbose_name='وضعیت')
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='جمع جزء')
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='تخفیف')
    tax = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='مالیات')
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='جمع کل')
    paid_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='مبلغ پرداخت شده')
    notes = models.TextField(blank=True, null=True, verbose_name='یادداشت‌ها')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, verbose_name='ایجاد شده توسط')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'فاکتور'
        verbose_name_plural = 'فاکتورها'
        ordering = ['-date']
        unique_together = [('company', 'invoice_number')]

    def __str__(self):
        return f"{self.invoice_number} - {self.customer.name}"

    @property
    def balance(self):
        """مانده = جمع کل - مبلغ پرداخت شده"""
        return self.total - self.paid_amount


class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items', verbose_name='فاکتور')
    item = models.ForeignKey(Item, on_delete=models.PROTECT, verbose_name='کالا')
    description = models.TextField(blank=True, null=True, verbose_name='توضیحات')
    quantity = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='تعداد')
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='قیمت واحد')
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='تخفیف')
    total = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='جمع')

    class Meta:
        verbose_name = 'آیتم فاکتور'
        verbose_name_plural = 'آیتم‌های فاکتور'

    def __str__(self):
        return f"{self.item.name} x {self.quantity}"


class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'نقدی'),
        ('card', 'کارت'),
        ('transfer', 'انتقال بانکی'),
        ('cheque', 'چک'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='payments', verbose_name='شرکت')
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='payments', verbose_name='فاکتور')
    payment_number = models.CharField(max_length=100, verbose_name='شماره پرداخت')
    date = models.DateField(verbose_name='تاریخ')
    amount = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='مبلغ')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, verbose_name='روش پرداخت')
    reference = models.CharField(max_length=255, blank=True, null=True, verbose_name='مرجع')
    notes = models.TextField(blank=True, null=True, verbose_name='یادداشت‌ها')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'پرداخت'
        verbose_name_plural = 'پرداخت‌ها'
        ordering = ['-date']
        unique_together = [('company', 'payment_number')]

    def __str__(self):
        return f"{self.payment_number} - {self.amount}"
