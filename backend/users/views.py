from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserMeSerializer

@api_view(['GET'])
def get_user_data(request):
    user = request.user
    serializer = UserMeSerializer(user)
    return Response(serializer.data)