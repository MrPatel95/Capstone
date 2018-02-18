from django.contrib import admin
from .models import ForumPost
from .models import ReplyPost

admin.site.register(ForumPost)
admin.site.register(ReplyPost)