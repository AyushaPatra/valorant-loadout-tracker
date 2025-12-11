"""
URL configuration for valorant_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from tracker.auth_api import login_view, logout_view, csrf, register_view, current_user


urlpatterns = [
    path('admin/', admin.site.urls),

    # Django HTML routes (server-side)
    path('', RedirectView.as_view(pattern_name='loadout_list', permanent=False)),
    path('', include('tracker.urls')),

    # Authentication API for React (session-based)
    path('api/csrf/', csrf, name='api-csrf'),
    path('api/login/', login_view, name='api-login'),
    path('api/logout/', logout_view, name='api-logout'),

    # REST API for React
    path('api/', include('tracker.api_urls')),

    # Django admin login system (HTML only)
    path('accounts/', include('django.contrib.auth.urls')),
    
    path('api/register/', register_view, name='api-register'),
    

]


