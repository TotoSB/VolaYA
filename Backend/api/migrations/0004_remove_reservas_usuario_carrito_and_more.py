# Generated by Django 5.2.3 on 2025-06-12 01:24

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_carritos_total'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='reservas_usuario',
            name='carrito',
        ),
        migrations.AddField(
            model_name='reservas_usuario',
            name='usuario',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.DO_NOTHING, related_name='reservas_usuario', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='carritos',
            name='id_usuario',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='carritos', to=settings.AUTH_USER_MODEL),
        ),
    ]
