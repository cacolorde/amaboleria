# Generated by Django 3.0.8 on 2020-08-06 00:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_auto_20200804_1650'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='order_description',
            field=models.TextField(blank=True, max_length=10000, null=True, verbose_name='Observação'),
        ),
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(choices=[('Aguardo confirmação de Pagamento', 'Aguardo confirmação de Pagamento'), ('Efetuado - Confirmado', 'Efetuado - Confirmado'), ('Entregue - Finalizado', 'Entregue - Finalizado')], max_length=50),
        ),
    ]
