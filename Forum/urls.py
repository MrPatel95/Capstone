from django.urls import path
from . import views

urlpatterns = [
    path('registerUser', views.register_user, name='register_user'),
    path('loginUser', views.login_user, name='login_user'),
    path('logoutUser', views.logout_user, name='logout_user'),
    path('addForumPost', views.add_forum_post, name='add_forum_post'),
    path('addReply', views.add_reply, name='add_reply'),
    path('getNRecentForumPosts', views.get_n_recent_forum_posts, name='get_n_recent_forum_posts'),
]