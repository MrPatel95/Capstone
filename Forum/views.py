from django.core import serializers
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render

from django.contrib.auth import authenticate
from django.contrib.auth import login
from django.contrib.auth import logout

from django.views.decorators.csrf import csrf_exempt

from django.core.exceptions import ObjectDoesNotExist

from django.contrib.auth.models import User
from Forum.models import ForumPost
from Forum.models import ReplyPost
from Forum.models import ForumConnector
from Forum.models import ReplyConnector

from django.db.models import Count, When, Case, CharField

from django.forms.models import model_to_dict

import json
import logging
import time
import traceback
import yaml

logger = logging.getLogger(__name__)

def _date_handler(obj):
	'''
	Return datetime as string when dumping to JSON
	'''

	if hasattr(obj, 'isoformat'):
		return obj.isoformat()
	return obj

def _get_does_username_exist(username):
	'''
	Returns True or False depending on whether if the username exists
	'''

	try:
		user = User.objects.get(username=username)
		return True
	except ObjectDoesNotExist:
		return False

def _get_does_email_exist(email):
	'''
	Returns True or False depending on whether if the email exists
	'''

	try:
		user = User.objects.get(email=email)
		return True
	except ObjectDoesNotExist:
		return False

'''
API Endpoints will be csrf_exempt
Authenticity will be ensured by user session
'''

def _get_reply_count_by_reply_id(reply_id):
	'''
	Returns count of replies given reply_id
	'''

	return ReplyPost.objects.filter(parent_id=reply_id).count()

@csrf_exempt
def login_user(request):
	'''
	Attach user to current session
	'''

	body = json.loads(request.body.decode('utf-8'))

	try:
		username = body['username']
		password = body['password']

		if _get_does_username_exist(username):
			user = authenticate(request, username=username, password=password)
			if user is not None:
				login(request, user)
				return HttpResponse('{"response":"pass"}')
			else:
				return HttpResponse('{"response":"invalid password"}')
		else:
			return HttpResponse('{"response":"username not found"}')
	except Exception as e:
		return HttpResponse('{"response":"exception","error":"%s"}' % traceback.format_exc())

@csrf_exempt
def logout_user(request):
	'''
	Log user out of session
	'''

	logout(request)
	return HttpResponse('{"response":"pass"}')

@csrf_exempt
def is_user_authenticated(request):
	'''
	Check to see if the session of the request is valid
	'''

	if request.user.is_authenticated:
		return HttpResponse('{"response":"pass"}')
	else:
		return HttpResponse('{"response":"unauthenticated"}')

@csrf_exempt
def register_user(request):
	'''
	Create new user
	'''

	body = json.loads(request.body.decode('utf-8'))

	try:
		username = body['username']
		password = body['password']
		email = body['email']

		if not _get_does_username_exist(username):
			if not _get_does_email_exist(email):
				user = User.objects.create_user(username=username, password=password, email=email)
				user.save()
				return HttpResponse('{"response":"pass"}')
			else:
				return HttpResponse('{"response":"email in use"}')
		else:
			return HttpResponse('{"response":"username in use"}')

	except Exception as e:
		return HttpResponse('{"response":"exception","error":"%s"}' % traceback.format_exc())

@csrf_exempt
def change_password_from_profile(request):
	'''
	Change users password
	This endpoint is accessed from the profile page for users already logged in
	'''

	if request.user.is_authenticated:
		body = json.loads(request.body.decode('utf-8'))
		try:
			old_password = body['old_password']
			new_password = body['new_password']
			request_user = request.user
			db_user = authenticate(username=request_user.username, password=old_password)
			if db_user is not None and request_user == db_user:
				db_user.set_password(new_password)
				db_user.save()
			return HttpResponse('{"response":"pass"}')
		except Exception as e:
			return HttpResponse('{"response":"exception","error":"%s"}' % traceback.format_exc())
	else:
		return HttpResponse('{"response":"unauthenticated"}')

@csrf_exempt
def add_forum_post(request):
	'''
	Add forum post
	'''

	if request.user.is_authenticated:
		body = json.loads(request.body.decode('utf-8'))
		try:
			user = request.user
			post_title = body['post_title']
			post_body = body['post_body']
			post_image = body['post_image']
			post = ForumPost(user=user, post_title=post_title, post_body=post_body, post_image=post_image)
			post.save()
			return HttpResponse(json.dumps(model_to_dict(post)))
		except Exception as e:
			return HttpResponse('{"response":"exception","error":"%s"}' % traceback.format_exc())
	else:
		return HttpResponse('{"response":"unauthenticated"}')

@csrf_exempt
def add_reply(request):
	'''
	Add a reply to a post or comment
	'''

	if request.user.is_authenticated:
		body = json.loads(request.body.decode('utf-8'))
		try:
			user = request.user
			post_id = ForumPost.objects.get(post_id=body['post_id'])

			if 'parent_id' not in body:
				parent_id = None
			else:
				parent_id = ReplyPost.objects.get(reply_id=body['parent_id'])

			reply_body = body['reply_body']
			reply = ReplyPost(user=user, post_id=post_id, parent_id=parent_id, reply_body=reply_body)
			reply.save()
			return HttpResponse('{"response":"pass"}')
		except Exception as e:
			return HttpResponse('{"response":"exception","error":"%s"}' % traceback.format_exc())
	else:
		return HttpResponse('{"response":"unauthenticated"}')

@csrf_exempt
def get_email(request):
	'''
	Returns email of user in current session
	'''

	if request.user.is_authenticated:
		try:
			return HttpResponse('{"email":"%s"}' % request.user.email)
		except Exception as e:
			return HttpResponse('{"response":"exception","error":"%s"}' % traceback.format_exc())
	else:
		return HttpResponse('{"response":"unauthenticated"}')

@csrf_exempt
def get_reply_count_by_post_id(request):
	'''
	Returns reply count post
	'''

	if request.user.is_authenticated:
		body = json.loads(request.body.decode('utf-8'))
		try:
			post_id = body['post_id']
			reply_count = ReplyPost.objects.filter(post_id=post_id).count()
			return HttpResponse('{"reply_count":"%s"}' % reply_count)
		except Exception as e:
			return HttpResponse('{"response":"exception","error":"%s"}' % traceback.format_exc())
	else:
		return HttpResponse('{"response":"unauthenticated"}')

@csrf_exempt
def get_n_recent_forum_posts(request):
	'''
	Returns top n forum posts
	'''

	if request.user.is_authenticated:
		body = json.loads(request.body.decode('utf-8'))
		try:
			n = body['n']
			posts = ForumPost.objects.filter().values(
				'post_id', 'user__username', 'post_title', 'post_image', 
				'post_datetime', 'connect_count', 'post_body',
				).order_by('-post_datetime').annotate(reply_count=Count('replypost__post_id'))[:n]
			for i in posts:
				connected = ForumConnector.objects.filter(post_id=i['post_id'], user=request.user)
				if len(connected) == 0:
					i['connected'] = False
				else:
					i['connected'] = True
			return HttpResponse(json.dumps(list(posts), default=_date_handler))
		except Exception as e:
			return HttpResponse('{"response":"exception","error":"%s"}' % traceback.format_exc())
	else:
		return HttpResponse('{"response":"unauthenticated"}')

@csrf_exempt
def get_n_recent_forum_posts_by_connect_count(request):
	'''
	Returns json of top n forum posts ordered by connect count
	'''

	if request.user.is_authenticated:
		body = json.loads(request.body.decode('utf-8'))
		try:
			n = body['n']
			posts = ForumPost.objects.filter().values(
				'post_id', 'user__username', 'post_title', 'post_image',
				'post_datetime', 'connect_count', 'post_body',
				).order_by('-connect_count').annotate(reply_count=Count('replypost__post_id'))[:n]
			for i in posts:
				connected = ForumConnector.objects.filter(post_id=i['post_id'], user=request.user)
				if len(connected) == 0:
					i['connected'] = False
				else:
					i['connected'] = True
			return HttpResponse(json.dumps(list(posts), default=_date_handler))
		except Exception as e:
			return HttpResponse('{"response":"exception","error":"%s"}' % traceback.format_exc())
	else:
		return HttpResponse('{"response":"unauthenticated"}')

@csrf_exempt
def get_forum_posts_by_username(request):
	'''
	Returns all forum posts created by user
	'''

	if request.user.is_authenticated:
		body = json.loads(request.body.decode('utf-8'))
		try:
			username = body['username']
			posts = ForumPost.objects.filter(user=request.user).values(
				'post_id', 'user__username', 'post_title', 'post_image',
				'post_datetime', 'connect_count', 'post_body', 'forumconnector__post_id'
				).annotate(reply_count=Count('replypost__post_id'))
			for i in posts:
				connected = ForumConnector.objects.filter(post_id=i['post_id'], user=request.user)
				if len(connected) == 0:
					i['connected'] = False
				else:
					i['connected'] = True
			return HttpResponse(json.dumps(list(posts), default=_date_handler))
		except Exception as e:
			return HttpResponse('{"response":"exception","error":"%s"}' % traceback.format_exc())
	else:
		return HttpResponse('{"response":"unauthenticated"}')

@csrf_exempt
def search_posts_by_title(request):
	'''
	Returns posts that match keywords 
	'''

	if request.user.is_authenticated:
		body = json.loads(request.body.decode('utf-8'))
		try:
			keywords = body['keywords']
			posts = ForumPost.objects.filter(post_title__icontains=keywords)
			return HttpResponse(serializers.serialize('json', posts), content_type='application/json')
		except Exception as e:
			return HttpResponse('{"response":"exception","error":"%s"}' % traceback.format_exc())
	else:
		return HttpResponse('{"response":"unauthenticated"}')

@csrf_exempt
def increment_connect_by_post_id(request):
	'''
	Increments connect count of post by 1
	'''

	if request.user.is_authenticated:
		body = json.loads(request.body.decode('utf-8'))
		try:
			post_id = body['post_id']
			connect = ForumConnector.objects.filter(post_id=post_id, user=request.user)
			post = ForumPost.objects.get(post_id=post_id)
			if len(connect) == 0:
				post.connect_count += 1
				connector = ForumConnector(user=request.user, post_id=post)
				connector.save()
				post.save()
			return HttpResponse('{"response":"pass","connect_count":"%s"}' % str(post.connect_count))
		except Exception as e:
			return HttpResponse('{"response":"exception","error":"%s"}' % traceback.format_exc())
	else:
		return HttpResponse('{"response":"unauthenticated"}')

@csrf_exempt
def increment_connect_by_reply_id(request):
	'''
	Increments connect count of reply by 1
	'''

	if request.user.is_authenticated:
		body = json.loads(request.body.decode('utf-8'))
		try:
			reply_id = body['reply_id']
			connect = ReplyConnector.objects.filter(post_id=post_id, user=request.user)
			reply = ReplyPost.objects.get(reply_id=reply_id)
			if len(connect) == 0:
				reply.connect_count += 1
				connector = ReplyConnector(user=request.user, reply_id=reply)
				connector.save()
				reply.save()
			return HttpResponse('{"response":"pass","connect_count":"%s"}' % str(reply.connect_count))
		except Exception as e:
			return HttpResponse('{"response":"exception","error":"%s"}' % traceback.format_exc())
	else:
		return HttpResponse('{"response":"unauthenticated"}')

@csrf_exempt
def get_post_and_replies_by_post_id(request):
	'''
	Return's the post and replies pertaining to the post
	'''

	if request.user.is_authenticated:
		body = json.loads(request.body.decode('utf-8'))
		try:
			post_id = body['post_id']
			post = ForumPost.objects.get(post_id=post_id)

			s = (
				'{"post":{'
				+ '"post_id":"' + str(post.post_id)
				+ '","user":"' + post.user.username
				+ '","post_title":"' + post.post_title
				+ '","post_body":"' + post.post_body
				+ '","post_image":"' + post.post_image
				+ '","post_datetime":"' + str(post.post_datetime)
				+ '","connect_count":"' + str(post.connect_count)
				+ '"},"replies":['
			)

			replies = list(ReplyPost.objects.filter(post_id=post_id).values(
				'reply_id', 'user__username', 'parent_id', 'reply_body', 'reply_datetime', 
				'connect_count', 'replyconnector__user',
				).order_by('-reply_datetime'))

			for reply in replies:
				s += (
					'{"reply__reply_id":"' + str(reply['reply_id']) + '",'
					+ '"user":"' + str(reply['user__username']) + '",'
					+ '"parent_id":"' + str(reply['parent_id']) + '",'
				)
				if request.user.id == reply['replyconnector__user']:
					s += ('"replyconnector__user":"' + str(reply['replyconnector__user']) + '",')
				else:
					s += ('"replyconnector__user":"None",')

				if reply['parent_id'] != None:
					s += ('"parent_user":"' + str(User.objects.filter(id=ReplyPost.objects.filter(reply_id=reply['reply_id']).values('user')[0]['user'])[0]) + '",')
				else:
					s += ('"parent_user":"' + str(post.user.username) + '",')
				
				s += (
					'"reply_body":"' + reply['reply_body'] + '",'
					+ '"reply_datetime":"' + str(reply['reply_datetime']) + '",'
					+ '"reply_count":"' + str(_get_reply_count_by_reply_id(reply['reply_id'])) + '",'
					+ '"connect_count":"' + str(reply['connect_count']) + '"'
					+ '},'
				)
			if len(replies) > 0:
				s = s[:-1]
			s += ']}'
			return HttpResponse(s)
		except Exception as e:
			return HttpResponse('{"response":"exception","error":"%s"}' % traceback.format_exc())
	else:
		return HttpResponse('{"response":"unauthenticated"}')