from django.core import serializers
from django.http import HttpResponse
from django.shortcuts import render

from django.contrib.auth import authenticate
from django.contrib.auth import login
from django.contrib.auth import logout

from django.views.decorators.csrf import csrf_exempt

from django.core.exceptions import ObjectDoesNotExist

from django.contrib.auth.models import User
from Forum.models import ForumPost
from Forum.models import ReplyPost

from django.db.models import Count

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

def _traverse(root_reply):
	'''
	Travserse root replies and build nested comment tree
	'''

	reply_stack = list(ReplyPost.objects.filter(parent_id=root_reply.reply_id).order_by('reply_datetime'))
	counter = 0
	s = '['

	while reply_stack:
		reply = reply_stack.pop(0)
		reply_list = list(ReplyPost.objects.filter(parent_id=reply.reply_id).order_by('reply_datetime'))

		s += (
			'{"reply_id":"' + str(reply.reply_id) + '",'
			+ '"user":"' + reply.user.username + '",'
			+ '"post_id":"' + str(reply.post_id) + '",'
			+ '"parent_id":"' + str(reply.parent_id) + '",'
			+ '"reply_body":"' + reply.reply_body + '",'
			+ '"reply_datetime":"' + str(reply.reply_datetime) + '",'
			+ '"connect_count":"' + str(reply.connect_count)
		)

		#This comment has a reply
		if len(reply_list) > 0:
			counter += 1
			reply_stack = list(ReplyPost.objects.filter(parent_id=reply.reply_id).order_by('reply_datetime')) + reply_stack
			s += '","replies":['

		#This comment does not have a reply, we can end this chain
		else:
			if len(reply_stack) > 0:
				counter -= 1
				s += '"}]},'
			else:
				if counter == 0:
					s += '"}'
				else:
					s += '"}]'
					for i in range(counter):
						s += '}'

	return s

'''
API Endpoints will be csrf_exempt
Authenticity will be ensured by user session
'''

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
				response = HttpResponse('{"response":"pass"}')
				response['Access-Control-Allow-Origin'] = '*'
				return response
				#return HttpResponse('{"response":"pass"}')
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
			return HttpResponse('{"response":"pass"}')
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
	Returns email of user in current session
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
	Returns json of top n forum posts
	'''

	if request.user.is_authenticated:
		body = json.loads(request.body.decode('utf-8'))
		try:
			n = body['n']
			posts = ForumPost.objects.filter().values(
				'post_id', 'user__username', 'post_title', 'post_image', 'post_datetime', 'connect_count', 'post_body'
				).order_by('post_datetime').annotate(reply_count=Count('replypost__post_id_id'))[:n]
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
				'post_id', 'user__username', 'post_title', 'post_image', 'post_datetime', 'connect_count', 'post_body'
				).annotate(reply_count=Count('replypost__post_id_id'))
			return HttpResponse(json.dumps(list(posts), default=_date_handler))
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
			post = ForumPost.objects.get(post_id=post_id)
			post.connect_count += 1
			post.save()
			return HttpResponse('{"response":"pass","connect_count":"%s"}' % str(post.connect_count))
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

			root_replies = list(ReplyPost.objects.filter(post_id=post_id, parent_id=None).order_by('reply_datetime'))

			if len(root_replies) > 0:
				counter = 0
				for reply in root_replies:
					s += (
						'{"reply_id":"' + str(reply.reply_id) + '",'
						+ '"user":"' + reply.user.username + '",'
						+ '"post_id":"' + str(reply.post_id) + '",'
						+ '"parent_id":"' + str(reply.parent_id) + '",'
						+ '"reply_body":"' + reply.reply_body + '",'
						+ '"reply_datetime":"' + str(reply.reply_datetime) + '",'
						+ '"connect_count":"' + str(reply.connect_count) + '",'
						+ '"replies":'
					)

					s += _traverse(reply) + ']},'
					counter += 1

				s = s[:-1]
				s += ']}'

			else:
				s += ']}'

			return HttpResponse(s)
		except Exception as e:
			return HttpResponse('{"response":"exception","error":"%s"}' % traceback.format_exc())
	else:
		return HttpResponse('{"response":"unauthenticated"}')