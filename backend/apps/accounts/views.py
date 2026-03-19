from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, get_user_model

from .serializers import RegisterSerializer, UserSerializer, LoginSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {"user": UserSerializer(user).data, "token": token.key},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(
            username=serializer.validated_data["username"],
            password=serializer.validated_data["password"],
        )
        if not user:
            return Response(
                {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
            )
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"user": UserSerializer(user).data, "token": token.key})


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class ToggleFavoriteRouteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, route_id):
        from apps.transit.models import Route

        try:
            route = Route.objects.get(pk=route_id)
        except Route.DoesNotExist:
            return Response({"error": "Route not found"}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        if route in user.favorite_routes.all():
            user.favorite_routes.remove(route)
            return Response({"status": "removed", "route_id": route_id})
        else:
            user.favorite_routes.add(route)
            return Response({"status": "added", "route_id": route_id})
