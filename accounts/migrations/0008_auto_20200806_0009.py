# Generated by Django 3.0.8 on 2020-08-06 03:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0007_auto_20200806_0008'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='nsu',
        ),
        migrations.RemoveField(
            model_name='order',
            name='payment_id',
        ),
    ]
