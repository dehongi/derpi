from django.db import models
from django.conf import settings
from companies.models import Company
from contacts.models import Contact
from sales.models import SalesOrder
from inventory.models import Item


class Driver(models.Model):
    STATUS_CHOICES = [
        ('available', 'آماده'),
        ('busy', 'مشغول'),
        ('off_duty', 'خارج از خدمت'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='drivers', verbose_name='شرکت')
    name = models.CharField(max_length=255, verbose_name='نام راننده')
    phone = models.CharField(max_length=20, verbose_name='تلفن')
    email = models.EmailField(blank=True, null=True, verbose_name='ایمیل')
    vehicle_type = models.CharField(max_length=100, blank=True, null=True, verbose_name='نوع وسیله نقلیه')
    vehicle_plate = models.CharField(max_length=50, blank=True, null=True, verbose_name='پلاک خودرو')
    license_number = models.CharField(max_length=100, blank=True, null=True, verbose_name='شماره گواهینامه')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available', verbose_name='وضعیت')
    is_active = models.BooleanField(default=True, verbose_name='فعال')
    notes = models.TextField(blank=True, null=True, verbose_name='یادداشت‌ها')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'راننده'
        verbose_name_plural = 'رانندگان'
        ordering = ['name']
        unique_together = [('company', 'phone')]

    def __str__(self):
        return f"{self.name} - {self.phone}"


class Delivery(models.Model):
    STATUS_CHOICES = [
        ('pending', 'در انتظار'),
        ('assigned', 'تخصیص داده شده'),
        ('picked_up', 'برداشته شده'),
        ('in_transit', 'در حال حمل'),
        ('delivered', 'تحویل داده شده'),
        ('cancelled', 'لغو شده'),
        ('failed', 'ناموفق'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='deliveries', verbose_name='شرکت')
    delivery_number = models.CharField(max_length=100, verbose_name='شماره حواله')
    sales_order = models.ForeignKey(SalesOrder, on_delete=models.SET_NULL, null=True, blank=True, related_name='deliveries', verbose_name='سفارش فروش')
    customer = models.ForeignKey(Contact, on_delete=models.PROTECT, related_name='deliveries', verbose_name='مشتری')
    driver = models.ForeignKey(Driver, on_delete=models.SET_NULL, null=True, blank=True, related_name='deliveries', verbose_name='راننده')
    
    pickup_address = models.TextField(verbose_name='آدرس مبدا')
    delivery_address = models.TextField(verbose_name='آدرس مقصد')
    customer_phone = models.CharField(max_length=20, blank=True, null=True, verbose_name='تلفن مشتری')
    
    scheduled_date = models.DateField(verbose_name='تاریخ برنامه‌ریزی شده')
    scheduled_time = models.TimeField(blank=True, null=True, verbose_name='زمان برنامه‌ریزی شده')
    pickup_date = models.DateTimeField(blank=True, null=True, verbose_name='تاریخ و زمان برداشت')
    delivery_date = models.DateTimeField(blank=True, null=True, verbose_name='تاریخ و زمان تحویل')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='وضعیت')
    priority = models.IntegerField(default=1, verbose_name='اولویت')
    
    distance = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, verbose_name='مسافت (کیلومتر)')
    delivery_fee = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='هزینه ارسال')
    
    tracking_code = models.CharField(max_length=100, blank=True, null=True, verbose_name='کد رهگیری')
    signature = models.TextField(blank=True, null=True, verbose_name='امضا تحویل‌گیرنده')
    
    notes = models.TextField(blank=True, null=True, verbose_name='یادداشت‌ها')
    internal_notes = models.TextField(blank=True, null=True, verbose_name='یادداشت‌های داخلی')
    
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, verbose_name='ایجاد شده توسط')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'حواله'
        verbose_name_plural = 'حواله‌ها'
        ordering = ['-scheduled_date', '-priority']
        unique_together = [('company', 'delivery_number')]

    def __str__(self):
        return f"{self.delivery_number} - {self.customer.name}"


class DeliveryItem(models.Model):
    delivery = models.ForeignKey(Delivery, on_delete=models.CASCADE, related_name='items', verbose_name='حواله')
    item = models.ForeignKey(Item, on_delete=models.PROTECT, verbose_name='کالا')
    quantity = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='تعداد')
    description = models.TextField(blank=True, null=True, verbose_name='توضیحات')
    condition_on_delivery = models.CharField(max_length=20, blank=True, null=True, verbose_name='وضعیت هنگام تحویل')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'کالای حواله'
        verbose_name_plural = 'کالاهای حواله'

    def __str__(self):
        return f"{self.item.name} x {self.quantity}"


class DeliveryRoute(models.Model):
    STATUS_CHOICES = [
        ('planned', 'برنامه‌ریزی شده'),
        ('in_progress', 'در حال انجام'),
        ('completed', 'تکمیل شده'),
        ('cancelled', 'لغو شده'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='delivery_routes', verbose_name='شرکت')
    route_name = models.CharField(max_length=255, verbose_name='نام مسیر')
    driver = models.ForeignKey(Driver, on_delete=models.SET_NULL, null=True, blank=True, related_name='routes', verbose_name='راننده')
    date = models.DateField(verbose_name='تاریخ')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned', verbose_name='وضعیت')
    
    start_location = models.TextField(blank=True, null=True, verbose_name='نقطه شروع')
    end_location = models.TextField(blank=True, null=True, verbose_name='نقطه پایان')
    
    total_distance = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name='مسافت کل (کیلومتر)')
    estimated_duration = models.IntegerField(default=0, verbose_name='زمان تخمینی (دقیقه)')
    
    start_time = models.DateTimeField(blank=True, null=True, verbose_name='زمان شروع')
    end_time = models.DateTimeField(blank=True, null=True, verbose_name='زمان پایان')
    
    notes = models.TextField(blank=True, null=True, verbose_name='یادداشت‌ها')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'مسیر حمل'
        verbose_name_plural = 'مسیرهای حمل'
        ordering = ['-date']

    def __str__(self):
        return f"{self.route_name} - {self.date}"

    @property
    def total_deliveries(self):
        """تعداد کل حواله‌ها در این مسیر"""
        return self.deliveries.count()


class RouteDelivery(models.Model):
    """رابطه بین مسیر و حواله‌ها با ترتیب مشخص"""
    route = models.ForeignKey(DeliveryRoute, on_delete=models.CASCADE, related_name='deliveries', verbose_name='مسیر')
    delivery = models.ForeignKey(Delivery, on_delete=models.CASCADE, related_name='routes', verbose_name='حواله')
    sequence = models.IntegerField(verbose_name='ترتیب در مسیر')
    estimated_arrival = models.DateTimeField(blank=True, null=True, verbose_name='زمان تخمینی رسیدن')

    class Meta:
        verbose_name = 'حواله در مسیر'
        verbose_name_plural = 'حواله‌ها در مسیر'
        ordering = ['sequence']
        unique_together = [('route', 'delivery')]

    def __str__(self):
        return f"{self.route.route_name} - {self.delivery.delivery_number} ({self.sequence})"
