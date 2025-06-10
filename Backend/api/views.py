from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
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

    Usuarios = get_user_model()

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
            return Response({"error": "Usuario no activo"}, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "correo": user.correo,
            "nombre_usuario": user.nombre_usuario,
        })