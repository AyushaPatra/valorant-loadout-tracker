from django import forms
from .models import Loadout, Map, Weapon

class LoadoutForm(forms.ModelForm):
    class Meta:
        model = Loadout
        fields = ['agent','primary_weapon','secondary_weapon','skin','map']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['primary_weapon'].queryset  = Weapon.objects.filter(type='Primary')
        self.fields['secondary_weapon'].queryset = Weapon.objects.filter(type='Secondary')
        self.fields['map'].queryset = Map.objects.all()
        self.fields['map'].empty_label = "Select a Map"