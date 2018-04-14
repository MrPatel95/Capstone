from django.db import models
from django.contrib.auth.models import User

#Querying User model with use_natural_foreign_keys=True returns username instead of key
class UserManager(models.Manager):
    def unatural_key(self):
        return self.username
    User.natural_key = unatural_key

class ForumPost(models.Model):
	post_id = models.AutoField(primary_key=True)
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	post_title = models.CharField(max_length=512)
	post_body = models.CharField(max_length=2048, blank=True)
	post_image = models.URLField(blank=True)
	post_datetime = models.DateTimeField(auto_now_add=True)
	connect_count = models.PositiveSmallIntegerField(default=0)

	def __str__(self):
		return str(self.post_id)

class ReplyPost(models.Model):
	reply_id = models.AutoField(primary_key=True)
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	post_id = models.ForeignKey(ForumPost, on_delete=models.CASCADE)
	parent_id = models.ForeignKey('self', default=None, blank=True, null=True, on_delete=models.CASCADE)
	reply_body = models.CharField(max_length=2048)
	reply_datetime = models.DateTimeField(auto_now_add=True)
	connect_count = models.PositiveSmallIntegerField(default=0)

	def __str__(self):
		return str(self.reply_id)

class ForumConnector(models.Model):
	post_id = models.ForeignKey(ForumPost, on_delete=models.CASCADE)
	user = models.ForeignKey(User, on_delete=models.CASCADE)

class ReplyConnector(models.Model):
	reply_id = models.ForeignKey(ReplyPost, on_delete=models.CASCADE)
	user = models.ForeignKey(User, on_delete=models.CASCADE)