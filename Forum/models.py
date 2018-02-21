from django.db import models
from django.contrib.auth.models import User

class ForumPost(models.Model):
	post_id = models.AutoField(primary_key=True)
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	post_title = models.CharField(max_length=512)
	post_body = models.CharField(max_length=2048, blank=True)
	post_image = models.URLField(blank=True)
	post_datetime = models.DateTimeField(auto_now_add=True)
	connect_count = models.PositiveSmallIntegerField(default=0)

class ReplyPost(models.Model):
	reply_id = models.AutoField(primary_key=True)
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	post_id = models.ForeignKey(ForumPost, on_delete=models.CASCADE)
	parent_id = models.ForeignKey('self', default=None, blank=True, on_delete=models.CASCADE)
	reply_body = models.CharField(max_length=2048)
	reply_datetime = models.DateTimeField(auto_now_add=True)
	connect_count = models.PositiveSmallIntegerField(default=0)