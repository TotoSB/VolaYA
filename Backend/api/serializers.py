from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

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
