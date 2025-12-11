from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Loadout, Agent, Weapon, Skin, Map
from .serializers import *
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction

class AgentViewSet(viewsets.ModelViewSet):
    queryset = Agent.objects.all()
    serializer_class = AgentSerializer

class WeaponViewSet(viewsets.ModelViewSet):
    queryset = Weapon.objects.all()
    serializer_class = WeaponSerializer

class SkinViewSet(viewsets.ModelViewSet):
    queryset = Skin.objects.all()
    serializer_class = SkinSerializer

class MapViewSet(viewsets.ModelViewSet):
    queryset = Map.objects.all()
    serializer_class = MapSerializer

class LoadoutViewSet(viewsets.ModelViewSet):
    queryset = Loadout.objects.all()
    serializer_class = LoadoutSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Loadout.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        print("PERFORM_CREATE HIT in LoadoutViewSet")
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"], url_path="transaction-update")
    def transaction_update(self, request, pk=None):
        loadout = self.get_object()
        data = request.data

        try:
            with transaction.atomic():
                loadout.agent_id = data.get("agent")
                loadout.primary_weapon_id = data.get("primary_weapon")
                loadout.secondary_weapon_id = data.get("secondary_weapon")
                loadout.skin_id = data.get("skin")
                loadout.map_id = data.get("map")

                if data.get("force_error"):
                    raise Exception("Forced rollback for demo")

                loadout.save()

            return Response({"success": True}, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=400)
