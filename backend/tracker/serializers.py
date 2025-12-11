from rest_framework import serializers
from .models import Loadout, Agent, Weapon, Skin, Map

class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = '__all__'

class WeaponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Weapon
        fields = '__all__'

class SkinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skin
        fields = '__all__'

class MapSerializer(serializers.ModelSerializer):
    class Meta:
        model = Map
        fields = '__all__'

class LoadoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loadout
        fields = '__all__'
        read_only_fields = ("user",)
