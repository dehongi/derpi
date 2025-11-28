from django.db import migrations
from django.utils.text import slugify

def add_initial_categories(apps, schema_editor):
    Company = apps.get_model('companies', 'Company')
    Category = apps.get_model('ecommerce', 'Category')

    categories = [
        {'name': 'الکترونیک', 'slug': 'electronics'},
        {'name': 'پوشاک', 'slug': 'clothing'},
        {'name': 'خانه و آشپزخانه', 'slug': 'home-kitchen'},
        {'name': 'کتاب', 'slug': 'books'},
        {'name': 'اسباب‌بازی', 'slug': 'toys'},
    ]

    for company in Company.objects.all():
        for cat_data in categories:
            if not Category.objects.filter(company=company, slug=cat_data['slug']).exists():
                Category.objects.create(
                    company=company,
                    name=cat_data['name'],
                    slug=cat_data['slug'],
                    is_active=True
                )

class Migration(migrations.Migration):

    dependencies = [
        ('ecommerce', '0001_initial'),
        ('companies', '0001_initial'), # Ensure companies app is loaded
    ]

    operations = [
        migrations.RunPython(add_initial_categories),
    ]
