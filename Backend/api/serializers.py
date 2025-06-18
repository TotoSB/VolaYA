from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import *

Usuarios = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, min_length=6, style={'input_type': 'password'}, label='Confirmar contraseña')

    class Meta:
        model = Usuarios
        fields = ('correo', 'nombre_usuario', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = Usuarios.objects.create_user(
            correo=validated_data['correo'],
            nombre_usuario=validated_data['nombre_usuario'],
            password=validated_data['password']
        )
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = Usuarios.USERNAME_FIELD  

    def validate(self, attrs):

        data = super().validate(attrs)
        data.update({
            'correo': self.user.correo,
            'nombre_usuario': self.user.nombre_usuario,
        })
        return data

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = ['id', 'correo', 'nombre_usuario', 'is_staff']

Usuarios = get_user_model()

class LoginSerializer(serializers.Serializer):
    correo = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        correo = data.get('correo')
        password = data.get('password')

        if correo and password:
            user = authenticate(correo=correo, password=password)
            if user is None:
                raise serializers.ValidationError("Credenciales inválidas.")
            if not user.activo:
                raise serializers.ValidationError("Usuario no activo.")
        else:
            raise serializers.ValidationError("Debe proveer correo y contraseña.")

        data['user'] = user
        return data

class PaisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paises
        fields = ['id', 'nombre']

class CiudadSerializer(serializers.ModelSerializer):
    pais_nombre = serializers.CharField(source='pais.nombre', read_only=True)

    class Meta:
        model = Ciudades
        fields = ['id', 'nombre', 'pais', 'pais_nombre', 'latitud', 'longitud']

class AutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Autos
        fields = ['id', 'marca', 'modelo', 'color', 'precio_dia']

class HotelSerializer(serializers.ModelSerializer):
    ciudad_nombre = serializers.CharField(source='ciudad.nombre', read_only=True)
    pais_nombre = serializers.CharField(source='ciudad.pais.nombre', read_only=True)

    class Meta:
        model = Hoteles
        fields = [
            'id',
            'nombre',
            'descripcion',
            'precio_noche',
            'direccion',
            'personas',
            'ciudad',         # Necesario para que acepte el ID
            'ciudad_nombre',
            'pais_nombre',
        ]

class AvionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aviones
        fields = '__all__'

class VueloSerializer(serializers.ModelSerializer):
    origen_nombre = serializers.CharField(source='origen.nombre', read_only=True)
    destino_nombre = serializers.CharField(source='destino.nombre', read_only=True)
    
    class Meta:
        model = Vuelos
        fields = ['id', 'avion', 'origen', 'origen_nombre', 'destino', 'destino_nombre']

class AsientoSerializer(serializers.ModelSerializer):
    vuelo_info = serializers.StringRelatedField(source='vuelo', read_only=True)

    class Meta:
        model = Asientos
        fields = ['id', 'vip', 'reservado', 'vuelo', 'vuelo_info']



class PaqueteSerializer(serializers.ModelSerializer):
    vuelo_ida_info = serializers.SerializerMethodField()
    vuelo_vuelta_info = serializers.SerializerMethodField()
    auto_nombre = serializers.CharField(source='auto.modelo', read_only=True)
    hotel_nombre = serializers.CharField(source='hotel.nombre', read_only=True)

    class Meta:
        model = Paquetes
        fields = [
            'id',
            'descripcion',
            'personas',
            'fecha_salida',
            'fecha_regreso',
            'vuelo_ida',
            'vuelo_ida_info',
            'vuelo_vuelta',
            'vuelo_vuelta_info',
            'auto',
            'auto_nombre',
            'hotel',
            'hotel_nombre',
            'pagado',
            'total',
            'id_usuario',
        ]
        read_only_fields = ['pagado', 'total']

    def get_vuelo_ida_info(self, obj):
        return str(obj.vuelo_ida)

    def get_vuelo_vuelta_info(self, obj):
        return str(obj.vuelo_vuelta)

class CotizarPaqueteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paquetes
        fields = [
            'personas',
            'fecha_salida',
            'fecha_regreso',
            'vuelo_ida',
            'vuelo_vuelta',
            'auto',
        ]
        read_only_fields = ['total']



class PersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Personas
        fields = [
            'id_usuario',
            'nombre',
            'apellido',
            'tipo_documento',
            'documento',
            'telefono',
            'fecha_nacimiento',
            'genero',
            'dueno'
        ]


class CarritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carritos
        fields = ['id_usuario', 'total']

class ReservaUsuarioSerializer(serializers.ModelSerializer):
    total_paquete = serializers.DecimalField(source='paquete.total', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Reservas_usuario
        fields = ['id', 'usuario', 'paquete', 'total_paquete']

class FacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Facturas
        fields = ['id', 'paquete', 'fecha_emision', 'total', 'detalles']

    def create(self, validated_data):
        factura = Facturas.objects.create(**validated_data)
        return factura
    
class PagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pagos
        fields = ['id', 'paquete', 'fecha_pago', 'monto', 'estado']

class HistoricaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Historica
        fields = ['id', 'paquete', 'fecha', 'pago', 'factura']