from django.db import models
from companies.models import Company
from contacts.models import Contact


class Category(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='ecommerce_categories', verbose_name='شرکت')
    name = models.CharField(max_length=255, verbose_name='نام')
    slug = models.SlugField(max_length=255, verbose_name='نامک')
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='children', verbose_name='دسته والد')
    description = models.TextField(blank=True, null=True, verbose_name='توضیحات')
    image = models.ImageField(upload_to='categories/', blank=True, null=True, verbose_name='تصویر')
    is_active = models.BooleanField(default=True, verbose_name='فعال')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'دسته‌بندی'
        verbose_name_plural = 'دسته‌بندی‌ها'
        ordering = ['name']

    def __str__(self):
        return self.name


class Product(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='ecommerce_products', verbose_name='شرکت')
    name = models.CharField(max_length=255, verbose_name='نام محصول')
    slug = models.SlugField(max_length=255, verbose_name='نامک')
    sku = models.CharField(max_length=100, verbose_name='کد محصول')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, verbose_name='دسته‌بندی')
    description = models.TextField(blank=True, null=True, verbose_name='توضیحات')
    price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='قیمت')
    sale_price = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True, verbose_name='قیمت فروش ویژه')
    cost = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='قیمت تمام شده')
    stock_quantity = models.IntegerField(default=0, verbose_name='موجودی')
    images = models.JSONField(blank=True, null=True, verbose_name='تصاویر')
    is_active = models.BooleanField(default=True, verbose_name='فعال')
    is_featured = models.BooleanField(default=False, verbose_name='ویژه')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'محصول'
        verbose_name_plural = 'محصولات'
        ordering = ['-created_at']
        unique_together = [('company', 'sku')]

    def __str__(self):
        return self.name


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'در انتظار'),
        ('processing', 'در حال پردازش'),
        ('shipped', 'ارسال شده'),
        ('delivered', 'تحویل داده شده'),
        ('cancelled', 'لغو شده'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='ecommerce_orders', verbose_name='شرکت')
    order_number = models.CharField(max_length=100, verbose_name='شماره سفارش')
    customer = models.ForeignKey(Contact, on_delete=models.PROTECT, related_name='ecommerce_orders', verbose_name='مشتری')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='وضعیت')
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='جمع جزء')
    tax = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='مالیات')
    shipping = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='هزینه ارسال')
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='جمع کل')
    shipping_address = models.JSONField(blank=True, null=True, verbose_name='آدرس ارسال')
    billing_address = models.JSONField(blank=True, null=True, verbose_name='آدرس صورتحساب')
    notes = models.TextField(blank=True, null=True, verbose_name='یادداشت‌ها')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'سفارش'
        verbose_name_plural = 'سفارش‌ها'
        ordering = ['-created_at']
        unique_together = [('company', 'order_number')]

    def __str__(self):
        return f"{self.order_number} - {self.customer.name}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items', verbose_name='سفارش')
    product = models.ForeignKey(Product, on_delete=models.PROTECT, verbose_name='محصول')
    quantity = models.IntegerField(verbose_name='تعداد')
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='قیمت واحد')
    total = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='جمع')

    class Meta:
        verbose_name = 'آیتم سفارش'
        verbose_name_plural = 'آیتم‌های سفارش'

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"
