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

    def __str__(self):
        return self.nombre

class Ciudades(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=80, null=False, blank=False)
    pais = models.ForeignKey(Paises, on_delete=models.DO_NOTHING)
    latitud = models.DecimalField(max_digits=9, decimal_places=6, null=False, blank=False)
    longitud = models.DecimalField(max_digits=9, decimal_places=6, null=False, blank=False)

    def __str__(self):
        return f"{self.nombre}, {self.pais.nombre}"

class Autos(models.Model):
    id = models.AutoField(primary_key=True)
    marca = models.CharField(max_length=50, null=False, blank=False)
    modelo = models.CharField(max_length=50, null=False, blank=False)
    color = models.CharField(max_length=30, null=False, blank=False)
    precio_dia = models.IntegerField(null=False, blank=False)

    def __str__(self):
        return f"{self.marca} {self.modelo} ({self.color}) - ${self.precio_dia}/día"

class Hoteles(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100, null=False, blank=False)
    ciudad = models.ForeignKey(Ciudades, on_delete=models.DO_NOTHING, related_name='hoteles')
    descripcion = models.TextField(null=True, blank=True)
    personas = models.IntegerField(null=False, blank=False, default=1)
    precio_noche = models.IntegerField(null=False, blank=False)
    direccion = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.nombre} - {self.ciudad.nombre} (${self.precio_noche}/noche)"


class Personas(models.Model):
    id = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(Usuarios, on_delete=models.DO_NOTHING, related_name='personas')
    nombre = models.CharField(max_length=100, null=False, blank=False)
    apellido = models.CharField(max_length=100, null=False, blank=False)
    tipo_documento = models.CharField(max_length=20, null=False, blank=False)
    documento = models.CharField(max_length=20, unique=True, null=False, blank=False)
    telefono = models.CharField(max_length=20, null=True, blank=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    genero = models.CharField(max_length=10, null=True, blank=True)
    dueno = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.nombre} {self.apellido} ({self.tipo_documento}: {self.documento})"

class Aviones(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100, null=False, blank=True)
    costo_km_general = models.IntegerField(null=False)
    costo_km_vip = models.IntegerField(null=False)
    capacidad_avion = models.IntegerField(min=1)
    capacidad_vip = models.IntegerField()
    capacidad_general = models.IntegerField() 

class Vuelos(models.Model):
    id = models.IntegerField(primary_key=True)
    avion = models.ForeignKey(Aviones, on_delete=models.DO_NOTHING, related_name='vuelos')
    origen = models.ForeignKey(Ciudades, on_delete=models.DO_NOTHING, related_name='vuelos_orig')
    destino = models.ForeignKey(Ciudades, on_delete=models.DO_NOTHING, related_name='vuelos_destino')
    fecha = models.DateTimeField(null=True, blank=True)
  

class Asientos(models.Model):
    id = models.AutoField(primary_key=True)
    vip = models.BooleanField(default=False)
    reservado = models.BooleanField(default=False)
    vuelo = models.ForeignKey(Vuelos, on_delete=models.DO_NOTHING, related_name='asientos')


class Paquetes(models.Model):
    id = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(Usuarios, on_delete=models.DO_NOTHING, related_name='paquetes')
    id_avion = models.ForeignKey(Aviones, on_delete=models.DO_NOTHING, related_name='paquetes')
    descripcion = models.TextField(null=True, blank=True)
    personas = models.IntegerField(null=False, blank=False)

    vuelo_ida = models.ForeignKey(Vuelos, on_delete=models.DO_NOTHING, related_name='paquetes_ida')
    vuelo_vuelta = models.ForeignKey(Vuelos, on_delete=models.DO_NOTHING, related_name='paquetes_vuelta')

   

    auto = models.ForeignKey(Autos, on_delete=models.DO_NOTHING, null=True, blank=True)
    hotel = models.ForeignKey(Hoteles, on_delete=models.DO_NOTHING, null=True, blank=True)
    pagado = models.BooleanField(default=False)
    total = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=True)

    def __str__(self):
        return f"Paquete {self.id} - Destino: {self.vuelo_ida.nombre} - {self.vuelo_vuelta} ({self.fecha_salida} a {self.fecha_regreso})"

class Carritos(models.Model):
    id = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(Usuarios, on_delete=models.DO_NOTHING, related_name='carritos')
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"Carrito de {self.id_usuario.nombre_usuario} - Total: ${self.total}"

class Reservas_usuario(models.Model):
    id = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(Usuarios, on_delete=models.DO_NOTHING, related_name='reservas_usuario')
    paquete = models.ForeignKey(Paquetes, on_delete=models.DO_NOTHING, related_name='paquete')

    def __str__(self):
        return f"Reserva {self.id} - Usuario: {self.usuario.nombre_usuario} - Paquete: {self.paquete.id}"

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

    def __str__(self):
        return f"Pago {self.id} - Paquete: {self.paquete.id} - Monto: ${self.monto} - Estado: {self.estado}"

class Historica(models.Model):
    paquete = models.ForeignKey(Paquetes, on_delete=models.DO_NOTHING, related_name='historica')
    fecha = models.DateTimeField(auto_now_add=True)
    pago = models.ForeignKey(Pagos, on_delete=models.DO_NOTHING, related_name='historica')
    factura = models.ForeignKey('Facturas', on_delete=models.DO_NOTHING, related_name='historica')

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

    def __str__(self):
        return f"Factura {self.id} - Pago: {self.pago.id} - Fecha: {self.fecha_factura.strftime('%Y-%m-%d %H:%M:%S')}"