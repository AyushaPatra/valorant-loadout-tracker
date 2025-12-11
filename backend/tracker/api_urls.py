from rest_framework import routers
from .api import AgentViewSet, WeaponViewSet, SkinViewSet, MapViewSet, LoadoutViewSet
from django.urls import path
from .api_transaction import transactional_update_api
from .auth_api import current_user 

router = routers.DefaultRouter()
router.register('agents', AgentViewSet)
router.register('weapons', WeaponViewSet)
router.register('skins', SkinViewSet)
router.register('maps', MapViewSet)
router.register('loadouts', LoadoutViewSet)

urlpatterns = router.urls
urlpatterns += [
    path("loadouts/<int:pk>/transaction-update/", transactional_update_api),
    
    path('current-user/', current_user),
]
