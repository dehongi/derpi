from django.db import models
from django.conf import settings
from companies.models import Company


class Department(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='departments', verbose_name='شرکت')
    name = models.CharField(max_length=255, verbose_name='نام بخش')
    description = models.TextField(blank=True, null=True, verbose_name='توضیحات')
    is_active = models.BooleanField(default=True, verbose_name='فعال')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'بخش'
        verbose_name_plural = 'بخش‌ها'
        ordering = ['name']

    def __str__(self):
        return self.name


class Employee(models.Model):
    EMPLOYMENT_TYPE_CHOICES = [
        ('full_time', 'تمام وقت'),
        ('part_time', 'پاره وقت'),
        ('contract', 'قراردادی'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'فعال'),
        ('on_leave', 'مرخصی'),
        ('terminated', 'خاتمه یافته'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='employees', verbose_name='شرکت')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, verbose_name='کاربر')
    employee_number = models.CharField(max_length=50, verbose_name='شماره پرسنلی')
    first_name = models.CharField(max_length=100, verbose_name='نام')
    last_name = models.CharField(max_length=100, verbose_name='نام خانوادگی')
    email = models.EmailField(blank=True, null=True, verbose_name='ایمیل')
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name='تلفن')
    mobile = models.CharField(max_length=20, blank=True, null=True, verbose_name='موبایل')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, verbose_name='بخش')
    position = models.CharField(max_length=100, verbose_name='سمت')
    hire_date = models.DateField(verbose_name='تاریخ استخدام')
    salary = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='حقوق')
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPE_CHOICES, default='full_time', verbose_name='نوع استخدام')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active', verbose_name='وضعیت')
    address = models.TextField(blank=True, null=True, verbose_name='آدرس')
    national_id = models.CharField(max_length=20, blank=True, null=True, verbose_name='کد ملی')
    birth_date = models.DateField(blank=True, null=True, verbose_name='تاریخ تولد')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'کارمند'
        verbose_name_plural = 'کارمندان'
        ordering = ['last_name', 'first_name']
        unique_together = [('company', 'employee_number')]

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.employee_number})"


class Attendance(models.Model):
    STATUS_CHOICES = [
        ('present', 'حاضر'),
        ('absent', 'غایب'),
        ('late', 'تاخیر'),
        ('half_day', 'نیم روز'),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='attendances', verbose_name='کارمند')
    date = models.DateField(verbose_name='تاریخ')
    check_in = models.TimeField(blank=True, null=True, verbose_name='ورود')
    check_out = models.TimeField(blank=True, null=True, verbose_name='خروج')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='present', verbose_name='وضعیت')
    notes = models.TextField(blank=True, null=True, verbose_name='یادداشت‌ها')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'حضور و غیاب'
        verbose_name_plural = 'حضور و غیاب'
        ordering = ['-date']
        unique_together = [('employee', 'date')]

    def __str__(self):
        return f"{self.employee} - {self.date}"


class Leave(models.Model):
    LEAVE_TYPE_CHOICES = [
        ('annual', 'استحقاقی'),
        ('sick', 'استعلاجی'),
        ('unpaid', 'بدون حقوق'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'در انتظار'),
        ('approved', 'تایید شده'),
        ('rejected', 'رد شده'),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='leaves', verbose_name='کارمند')
    leave_type = models.CharField(max_length=20, choices=LEAVE_TYPE_CHOICES, verbose_name='نوع مرخصی')
    start_date = models.DateField(verbose_name='تاریخ شروع')
    end_date = models.DateField(verbose_name='تاریخ پایان')
    days = models.IntegerField(verbose_name='تعداد روز')
    reason = models.TextField(verbose_name='دلیل')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='وضعیت')
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, verbose_name='تایید شده توسط')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ بروزرسانی')

    class Meta:
        verbose_name = 'مرخصی'
        verbose_name_plural = 'مرخصی‌ها'
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.employee} - {self.get_leave_type_display()} ({self.days} روز)"
