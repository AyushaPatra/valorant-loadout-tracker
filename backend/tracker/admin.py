from django.contrib import admin
from .models import Agent, Weapon, Skin, Loadout, Map

admin.site.register(Agent)
admin.site.register(Weapon)
admin.site.register(Skin)
admin.site.register(Loadout)
admin.site.register(Map)