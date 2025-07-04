# Generated by Django 5.2.3 on 2025-06-23 00:50

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0019_remove_asientos_estado_asientos_reservado'),
    ]

    operations = [
        migrations.AddField(
            model_name='paquetes',
            name='asiento_ida',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='paquetes_asiento_ida', to='api.asientos'),
        ),
        migrations.AddField(
            model_name='paquetes',
            name='asiento_vuelta',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='paquetes_asiento_vuelta', to='api.asientos'),
        ),
    ]
