from django.urls import path
from . import views

urlpatterns = [
	path('testRequest', views.test_request, name='test_request'),
    path('registerUser', views.register_user, name='register_user'),
    path('loginUser', views.login_user, name='login_user'),
    path('logoutUser', views.logout_user, name='logout_user'),
    path('addForumPost', views.add_forum_post, name='add_forum_post'),
]