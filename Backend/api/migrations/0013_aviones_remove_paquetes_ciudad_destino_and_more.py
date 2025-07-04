# Generated by Django 5.2.3 on 2025-06-18 15:43

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_hoteles_personas'),
    ]

    operations = [
        migrations.CreateModel(
            name='Aviones',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(blank=True, max_length=100)),
                ('costo_km_general', models.IntegerField()),
                ('costo_km_vip', models.IntegerField()),
                ('capacidad_avion', models.IntegerField(default=1)),
                ('capacidad_vip', models.IntegerField()),
                ('capacidad_general', models.IntegerField()),
            ],
        ),
        migrations.RemoveField(
            model_name='paquetes',
            name='ciudad_destino',
        ),
        migrations.RemoveField(
            model_name='paquetes',
            name='ciudad_salida',
        ),
        migrations.RemoveField(
            model_name='paquetes',
            name='hora_salida',
        ),
        migrations.AlterField(
            model_name='paquetes',
            name='fecha_regreso',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='paquetes',
            name='fecha_salida',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='personas',
            name='telefono',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='paquetes',
            name='id_avion',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.DO_NOTHING, related_name='paquetes', to='api.aviones'),
        ),
        migrations.CreateModel(
            name='Vuelos',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('fecha', models.DateTimeField(blank=True, null=True)),
                ('avion', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='vuelos', to='api.aviones')),
                ('destino', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='vuelos_destino', to='api.ciudades')),
                ('origen', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='vuelos_orig', to='api.ciudades')),
            ],
        ),
        migrations.CreateModel(
            name='Asientos',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('vip', models.BooleanField(default=False)),
                ('reservado', models.BooleanField(default=False)),
                ('vuelo', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='asientos', to='api.vuelos')),
            ],
        ),
        migrations.AddField(
            model_name='paquetes',
            name='vuelo_ida',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.DO_NOTHING, related_name='paquetes_ida', to='api.vuelos'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='paquetes',
            name='vuelo_vuelta',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.DO_NOTHING, related_name='paquetes_vuelta', to='api.vuelos'),
            preserve_default=False,
        ),
    ]
