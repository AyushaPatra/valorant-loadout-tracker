from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.decorators import login_required
from .models import Agent, Loadout, Map, Skin, Weapon
from .forms import LoadoutForm
from django.db.models import Count
from django.shortcuts import render
from .models import Loadout
from django.db import transaction
from django.http import JsonResponse

@login_required
def transactional_update_loadout(request, pk):
    loadout = Loadout.objects.get(pk=pk, user=request.user)

    agents = Agent.objects.all()
    primary_weapons = Weapon.objects.filter(type="Primary")
    secondary_weapons = Weapon.objects.filter(type="Secondary")
    skins = Skin.objects.all()
    maps = Map.objects.all()

    if request.method == "GET":
        return render(request, "tracker/transaction_update.html", {
            "loadout": loadout,
            "agents": agents,
            "primary_weapons": primary_weapons,
            "secondary_weapons": secondary_weapons,
            "skins": skins,
            "maps": maps
        })

    force_error = request.POST.get("force_error")

    try:
        with transaction.atomic():
            loadout.agent_id = request.POST.get("agent")
            loadout.primary_weapon_id = request.POST.get("primary_weapon")
            loadout.secondary_weapon_id = request.POST.get("secondary_weapon")
            loadout.skin_id = request.POST.get("skin")
            loadout.map_id = request.POST.get("map")

            if force_error == "on":
                raise Exception("Rollback test triggered.")

            loadout.save()

        return render(request, "tracker/transaction_success.html", {"loadout": loadout})

    except Exception as e:
        return render(request, "tracker/transaction_fail.html", {"error": str(e)})


@login_required
def analytics_view(request):
    user = request.user  # current logged-in user
    loadouts = Loadout.objects.filter(user=user)  # restrict to this user's data

    map_counts = (
        loadouts.values('map__name')
        .annotate(total=Count('id'))
        .order_by('map__name')
    )

    top_agents = (
        loadouts.values('agent__name')
        .annotate(total=Count('id'))
        .order_by('-total')[:5]
    )

    top_weapons = (
        loadouts.values('primary_weapon__name')
        .annotate(total=Count('id'))
        .order_by('-total')[:5]
    )

    context = {
        'map_counts': map_counts,
        'top_agents': top_agents,
        'top_weapons': top_weapons,
    }
    return render(request, 'tracker/analytics.html', context)

class LoadoutListView(LoginRequiredMixin, ListView):
    model = Loadout
    template_name = 'tracker/loadout_list.html'

    def get_queryset(self):
        return Loadout.objects.filter(user=self.request.user)


class LoadoutCreateView(LoginRequiredMixin, CreateView):
    model = Loadout
    form_class = LoadoutForm
    template_name = 'tracker/loadout_form.html'
    success_url = reverse_lazy('loadout_list')

    def form_valid(self, form):
        form.instance.user = self.request.user
        return super().form_valid(form)

'''
class LoadoutUpdateView(LoginRequiredMixin, UpdateView):
    model = Loadout
    form_class = LoadoutForm
    template_name = 'tracker/loadout_form.html'
    success_url = reverse_lazy('loadout_list')

    def get_queryset(self):
        return Loadout.objects.filter(user=self.request.user)
'''

class LoadoutDeleteView(LoginRequiredMixin, DeleteView):
    model = Loadout
    template_name = 'tracker/confirm_delete.html'
    success_url = reverse_lazy('loadout_list')

    def get_queryset(self):
        return Loadout.objects.filter(user=self.request.user)




# SQL Injection dangerous example (do NOT use!!)
# query = f"SELECT * FROM tracker_loadout WHERE user_id = {request.user.id}"
# loadouts = Loadout.objects.raw(query)

# Correct, safe version using ORM
# loadouts = Loadout.objects.filter(user=request.user)
