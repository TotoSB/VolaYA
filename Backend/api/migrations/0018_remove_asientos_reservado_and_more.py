# Generated by Django 5.2.3 on 2025-06-23 00:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_remove_paquetes_id_avion'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='asientos',
            name='reservado',
        ),
        migrations.RemoveField(
            model_name='paquetes',
            name='fecha_regreso',
        ),
        migrations.RemoveField(
            model_name='paquetes',
            name='fecha_salida',
        ),
        migrations.AddField(
            model_name='asientos',
            name='estado',
            field=models.CharField(default='DISPONIBLE', max_length=20),
        ),
    ]
