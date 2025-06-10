from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import *
from .models import Usuarios
import random
from django.core.mail import send_mail

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user.activo = False  # El usuario se desactiva, para validar luego y pedir el codigo de verificacion
        user.save()
        send_verification_code(user)
        return Response(
            {"message": "Registro exitoso. Verifica tu correo electrónico para activar tu cuenta."},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    correo = request.data.get('correo')
    password = request.data.get('password')

    if correo is None or password is None:
        return Response({'error': 'Correo y contraseña son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, correo=correo, password=password)
    if user is None:
        return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)

    if not user.activo:
        return Response({'error': 'Usuario no activo'}, status=status.HTTP_403_FORBIDDEN)

    refresh = RefreshToken.for_user(user)

    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'correo': user.correo,
        'nombre_usuario': user.nombre_usuario,
    })


def send_verification_code(user):
    code = random.randint(100000, 999999)
    user.codigo_activacion = code
    user.save()

    send_mail(
        'Volaya - Tu código de verificación',
        f'Tu código de verificación es: {code}',
        "noreplyprobuildsalbiononline@gmail.com",
        [user.correo],
        fail_silently=False,
    )

    return "Se ha enviado un código de verificación a tu correo electrónico."



@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    correo = request.data.get('correo')
    password = request.data.get('password')

    if not correo or not password:
        return Response({"error": "Correo y contraseña son requeridos"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = Usuarios.objects.get(correo=correo)
    except Usuarios.DoesNotExist:
        return Response({"error": "Credenciales inválidas"}, status=status.HTTP_401_UNAUTHORIZED)

    if not user.check_password(password):
        return Response({"error": "Credenciales inválidas"}, status=status.HTTP_401_UNAUTHORIZED)

    if not user.activo:
        return Response({
            "message": "Ingresa el código de verificación para terminar de iniciar sesión",
            "usuario_id": user.id  # Opcional, si querés usar esto para la validación posterior
        }, status=status.HTTP_403_FORBIDDEN)

    refresh = RefreshToken.for_user(user)

    return Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "correo": user.correo,
        "nombre_usuario": user.nombre_usuario,
    })


@api_view(['POST']) 
@permission_classes([AllowAny])
def log_code(request):
    usuario_id = request.data.get('id_usuario')
    codigo = request.data.get('codigo_activacion')

    try:
        user = Usuarios.objects.get(id=usuario_id)
    except Usuarios.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    if user.activo:
        return Response({"error": "El usuario ya está activado"}, status=status.HTTP_400_BAD_REQUEST)

    if str(user.codigo_activacion) != str(codigo):
        return Response({"error": "Código de verificación incorrecto"}, status=status.HTTP_400_BAD_REQUEST)

    user.activo = True
    user.codigo_activacion = None
    user.save()

    refresh = RefreshToken.for_user(user)

    return Response({
        "message": "Usuario activado correctamente",
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "correo": user.correo,
        "nombre_usuario": user.nombre_usuario,
    }, status=status.HTTP_200_OK)


#Parte de creacion de paises, autos, ciudades y hoteles

@api_view(['POST'])
def crear_pais(request):
    serializer = PaisSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "País creado correctamente."}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def crear_ciudad(request):
    serializer = CiudadSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Ciudad creada correctamente."}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def crear_auto(request):
    serializer = AutoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Auto creado correctamente."}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def crear_hotel(request):
    serializer = HotelSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Hotel creado correctamente."}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#Añadir Paquete y Persona



@api_view(['POST'])
def crear_paquete(request):
    serializer = PaqueteSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Paquete creado exitosamente"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def crear_persona(request):
    serializer = PersonaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Persona creada exitosamente"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)