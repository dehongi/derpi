from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    active_company = models.ForeignKey(
        'companies.Company',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='active_users',
        verbose_name='شرکت فعال'
    )
    
    class Meta:
        verbose_name = 'کاربر'
        verbose_name_plural = 'کاربران'

