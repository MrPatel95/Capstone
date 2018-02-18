from django.urls import path
from . import views

urlpatterns = [
	path('testRequest', views.test_request, name='test_request'),
    path('registerUser', views.register_user, name='register_user'),
    path('loginUser', views.login_user, name='login_user'),
]