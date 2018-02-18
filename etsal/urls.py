"""
Etsal URL Configuration
"""

from django.contrib import admin
from django.urls import path
from django.conf.urls import include
from django.conf.urls import url

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('Forum.urls'))
]
