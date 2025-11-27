from django.db import models
from django.conf import settings
from companies.models import Company


class Warehouse(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='warehouses', verbose_name='شرکت')
    name = models.CharField(max_length=255, verbose_name='نام انبار')
    code = models.CharField(max_length=50, verbose_name='کد انبار')
    location = models.TextField(blank=True, null=True, verbose_name='موقعیت')
    manager = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='managed_warehouses',
        verbose_name='مدیر انبار'
    )
    is_active = models.BooleanField(default=True, verbose_name='فعال')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'انبار'
        verbose_name_plural = 'انبارها'
        ordering = ['name']
        unique_together = [('company', 'code')]

    def __str__(self):
        return f"{self.name} ({self.code})"


class Item(models.Model):
    UNIT_CHOICES = [
        ('piece', 'عدد'),
        ('kg', 'کیلوگرم'),
        ('liter', 'لیتر'),
        ('meter', 'متر'),
        ('box', 'جعبه'),
        ('pack', 'بسته'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='items', verbose_name='شرکت')
    name = models.CharField(max_length=255, verbose_name='نام کالا')
    sku = models.CharField(max_length=100, verbose_name='کد کالا')
    barcode = models.CharField(max_length=100, blank=True, null=True, verbose_name='بارکد')
    category = models.CharField(max_length=100, blank=True, null=True, verbose_name='دسته‌بندی')
    unit = models.CharField(max_length=20, choices=UNIT_CHOICES, default='piece', verbose_name='واحد')
    min_stock = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name='حداقل موجودی')
    max_stock = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name='حداکثر موجودی')
    cost = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='قیمت تمام شده')
    description = models.TextField(blank=True, null=True, verbose_name='توضیحات')
    is_active = models.BooleanField(default=True, verbose_name='فعال')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'کالا'
        verbose_name_plural = 'کالاها'
        ordering = ['name']
        unique_together = [('company', 'sku')]

    def __str__(self):
        return f"{self.name} ({self.sku})"


class Stock(models.Model):
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='stocks', verbose_name='انبار')
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='stocks', verbose_name='کالا')
    quantity = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='موجودی')
    reserved = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='رزرو شده')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'موجودی'
        verbose_name_plural = 'موجودی‌ها'
        unique_together = [('warehouse', 'item')]

    def __str__(self):
        return f"{self.item.name} @ {self.warehouse.name}: {self.quantity}"

    @property
    def available(self):
        """موجود = موجودی - رزرو شده"""
        return self.quantity - self.reserved


class StockMovement(models.Model):
    MOVEMENT_TYPE_CHOICES = [
        ('in', 'ورود'),
        ('out', 'خروج'),
        ('transfer', 'انتقال'),
        ('adjustment', 'تعدیل'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='stock_movements', verbose_name='شرکت')
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='movements', verbose_name='انبار')
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='movements', verbose_name='کالا')
    movement_type = models.CharField(max_length=20, choices=MOVEMENT_TYPE_CHOICES, verbose_name='نوع حرکت')
    quantity = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='مقدار')
    reference_type = models.CharField(max_length=50, blank=True, null=True, verbose_name='نوع مرجع')
    reference_number = models.CharField(max_length=100, blank=True, null=True, verbose_name='شماره مرجع')
    date = models.DateTimeField(verbose_name='تاریخ')
    notes = models.TextField(blank=True, null=True, verbose_name='یادداشت‌ها')
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='stock_movements',
        verbose_name='ایجاد شده توسط'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'حرکت موجودی'
        verbose_name_plural = 'حرکات موجودی'
        ordering = ['-date']

    def __str__(self):
        return f"{self.get_movement_type_display()} - {self.item.name} ({self.quantity})"
