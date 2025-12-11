from django.urls import path
from .views import transactional_update_loadout

from .views import (
    LoadoutListView,
    LoadoutCreateView,
    LoadoutDeleteView,
    analytics_view,
    transactional_update_loadout
)

urlpatterns = [
    path('loadouts/', LoadoutListView.as_view(), name='loadout_list'),
    path('loadouts/new/', LoadoutCreateView.as_view(), name='loadout_create'),
    path('loadouts/<int:pk>/delete/', LoadoutDeleteView.as_view(), name='loadout_delete'),
    path('analytics/', analytics_view, name='analytics'),  
    path('loadouts/<int:pk>/transaction-update/', transactional_update_loadout, name='loadout_tx_update'),  
]
