from django.contrib import admin
from .models import ForumPost
from .models import ReplyPost
from .models import ForumConnector
from .models import ReplyConnector

admin.site.register(ForumPost)
admin.site.register(ReplyPost)
admin.site.register(ForumConnector)
admin.site.register(ReplyConnector)