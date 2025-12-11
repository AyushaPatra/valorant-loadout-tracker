from django.db import models
from django.contrib.auth.models import User

class Agent(models.Model):
    name = models.CharField(max_length=50)
    
    ROLE_CHOICES = [
    ('Duelist', 'Duelist'),
    ('Initiator', 'Initiator'),
    ('Controller', 'Controller'),
    ('Sentinel', 'Sentinel'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    def __str__(self): return f"{self.name} ({self.role})"


class Weapon(models.Model):
    name = models.CharField(max_length=50)
    type = models.CharField(max_length=20, choices=[
        ('Primary', 'Primary'),
        ('Secondary', 'Secondary')
    ], db_index=True)

    def __str__(self):
        return f"{self.name} ({self.type})"


class Skin(models.Model):
    RARITY_CHOICES = [
        ('Select', 'Select'),
        ('Deluxe', 'Deluxe'),
        ('Premium', 'Premium'),
        ('Ultra', 'Ultra'),
        ('Exclusive', 'Exclusive'),
    ]
    name = models.CharField(max_length=50)
    weapon = models.ForeignKey(Weapon, on_delete=models.CASCADE)
    rarity = models.CharField(max_length=20, choices=RARITY_CHOICES, default='Select')

    def __str__(self):
        return f"{self.name} - {self.weapon.name}"

class Map(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

    
class Loadout(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE)
    primary_weapon = models.ForeignKey(
        Weapon, on_delete=models.CASCADE, related_name='primary_loadouts')
    secondary_weapon = models.ForeignKey(
        Weapon, on_delete=models.CASCADE, related_name='secondary_loadouts')
    skin = models.ForeignKey(Skin, on_delete=models.SET_NULL, null=True, blank=True)
    map = models.ForeignKey(Map, on_delete=models.CASCADE)

    class Meta:
        indexes = [
            models.Index(fields=["user"]),  # speeds up list & analytics views
            models.Index(fields=["map"]),   # speeds up map analytics
            models.Index(fields=["agent", "user"]),  # helps top-agents analytics
        ]
    
    def __str__(self):
        return f"{self.agent.name} – {self.primary_weapon.name}"
