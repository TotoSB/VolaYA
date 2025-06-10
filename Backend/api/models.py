from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, correo, nombre_usuario, password=None, **extra_fields):
        if not correo:
            raise ValueError('El correo es obligatorio')
        correo = self.normalize_email(correo)
        user = self.model(correo=correo, nombre_usuario=nombre_usuario, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, correo, nombre_usuario, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('activo', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('El superusuario debe tener is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('El superusuario debe tener is_superuser=True.')

        return self.create_user(correo, nombre_usuario, password, **extra_fields)

class Usuarios(AbstractBaseUser, PermissionsMixin):
    correo = models.EmailField(unique=True)
    nombre_usuario = models.CharField(max_length=100, unique=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    activo = models.BooleanField(default=True)
    codigo_activacion = models.IntegerField(null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'correo'
    REQUIRED_FIELDS = ['nombre_usuario']

    def __str__(self):
        return self.correo

class Paises(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50, unique=True, null=False, blank=False)

class Ciudades(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=80, null=False, blank=False)
    pais = models.ForeignKey(Paises, on_delete=models.DO_NOTHING)
    latitud = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitud = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

class Autos(models.Model):
    id = models.AutoField(primary_key=True)
    marca = models.CharField(max_length=50, null=False, blank=False)
    modelo = models.CharField(max_length=50, null=False, blank=False)
    color = models.CharField(max_length=30, null=False, blank=False)
    precio_dia = models.IntegerField(null=False, blank=False)

class Hoteles(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100, null=False, blank=False)
    ciudad = models.ForeignKey(Ciudades, on_delete=models.DO_NOTHING, related_name='hoteles')
    descripcion = models.TextField(null=True, blank=True)
    precio_noche = models.IntegerField(null=False, blank=False)
    direccion = models.CharField(max_length=255, null=True, blank=True)

class Paquetes(models.Model):
    id = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(Usuarios, on_delete=models.DO_NOTHING, related_name='paquetes')
    descripcion = models.TextField(null=True, blank=True)
    personas = models.IntegerField(null=False, blank=False)
    fecha_salida = models.DateTimeField(null=False, blank=False)
    fecha_regreso = models.DateTimeField(null=False, blank=False)
    ciudad_destino = models.ForeignKey(Ciudades, on_delete=models.DO_NOTHING, related_name='paquetes_destino')
    ciudad_salida = models.ForeignKey(Ciudades, on_delete=models.DO_NOTHING, related_name='paquetes_salida')
    hora_salida = models.TimeField(null=False, blank=False)
    auto = models.ForeignKey(Autos, on_delete=models.DO_NOTHING, null=True, blank=True)
    hotel = models.ForeignKey(Hoteles, on_delete=models.DO_NOTHING, null=True, blank=True)
    pagado = models.BooleanField(default=False)
    total = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)

class Personas(models.Model):
    id = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(Usuarios, on_delete=models.DO_NOTHING, related_name='personas')
    nombre = models.CharField(max_length=100, null=False, blank=False)
    apellido = models.CharField(max_length=100, null=False, blank=False)
    tipo_documento = models.CharField(max_length=20, null=False, blank=False)
    documento = models.CharField(max_length=20, unique=True, null=False, blank=False)
    telefono = models.IntegerField(null=True, blank=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    genero = models.CharField(max_length=10, null=True, blank=True)

class Carritos(models.Model):
    id = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(Usuarios, on_delete=models.DO_NOTHING, related_name='carritos')
    total = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)

class Reservas_usuario(models.Model):
    id = models.AutoField(primary_key=True)
    carrito = models.ForeignKey(Carritos, on_delete=models.DO_NOTHING, related_name='carrito')
    paquete = models.ForeignKey(Paquetes, on_delete=models.DO_NOTHING, related_name='paquete')

class Pagos(models.Model):
    id = models.AutoField(primary_key=True)
    paquete = models.ForeignKey(Paquetes, on_delete=models.DO_NOTHING, related_name='pagos')
    fecha_pago = models.DateTimeField(auto_now_add=True)
    monto = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)
    estado = models.CharField(max_length=20, choices=[
        ('PENDIENTE', 'Pendiente'),
        ('COMPLETADO', 'Completado'),
        ('CANCELADO', 'Cancelado')
    ], default='PENDIENTE')

class Facturas(models.Model):
    id = models.AutoField(primary_key=True)
    pago = models.ForeignKey(Pagos, on_delete=models.DO_NOTHING, related_name='facturas')
    fecha_factura = models.DateTimeField(auto_now_add=True)
    razon_social = models.CharField(max_length=255, null=False, blank=False)
    cuil = models.CharField(max_length=20, null=False, blank=False)
    provincia = models.CharField(max_length=100, null=False, blank=False)
    ciudad = models.CharField(max_length=100, null=False, blank=False)
    calle = models.CharField(max_length=255, null=False, blank=False)
    numero_calle = models.CharField(max_length=20, null=False, blank=False)
    piso = models.CharField(max_length=10, null=True, blank=True)
    departamento = models.CharField(max_length=10, null=True, blank=True)