from django.urls import path
from . import views

urlpatterns = [
    path('registerUser', views.register_user, name='register_user'),
    path('loginUser', views.login_user, name='login_user'),
    path('logoutUser', views.logout_user, name='logout_user'),
    path('isUserAuthenticated', views.is_user_authenticated, name='is_user_authenticated'),
    path('changePasswordFromProfile', views.change_password_from_profile, name='change_password_from_profile'),
    path('addForumPost', views.add_forum_post, name='add_forum_post'),
    path('addReply', views.add_reply, name='add_reply'),
    path('getEmail', views.get_email, name='get_email'),
    path('getReplyCountByPostId', views.get_reply_count_by_post_id, name='get_reply_count_by_post_id'),
    path('getNRecentForumPosts', views.get_n_recent_forum_posts, name='get_n_recent_forum_posts'),
    path('getForumPostsByUsername', views.get_forum_posts_by_username, name='get_forum_posts_by_username'),
    path('getPostAndRepliesByPostId', views.get_post_and_replies_by_post_id, name='get_post_and_replies_by_post_id'),
    path('incrementConnectByPostId', views.increment_connect_by_post_id, name='increment_connect_by_post_id'),
    path('incrementConnectByReplyId', views.increment_connect_by_reply_id, name='increment_connect_by_reply_id'),
    path('getNRecentForumPostsByConnectCount', views.get_n_recent_forum_posts_by_connect_count, name='get_n_recent_forum_posts_by_connect_count'),
]