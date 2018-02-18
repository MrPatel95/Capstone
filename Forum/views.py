from django.http import HttpResponse
from django.shortcuts import render
from django.contrib.auth import authenticate
from django.contrib.auth import login
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import ensure_csrf_cookie

from django.core.exceptions import ObjectDoesNotExist

from django.contrib.auth.models import User
from Forum.models import ForumPost

import traceback
import logging
import json
import yaml

logger = logging.getLogger(__name__)

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
		return HttpResponse('{"response":"exception","error":"' + traceback.format_exc() + '"}')

def register_user(request):
	'''
	Add user
	'''
	body = json.loads(request.body.decode('utf-8'))
	try:
		username = body['username']
		password = body['password']
		email = body['email']
		if not _get_does_username_exist(username):
			if not _get_does_email_exist(email):
				user = User(username=username, password=password, email=email)
				user.save()
				return HttpResponse('{"response":"pass"}')
			else:
				return HttpResponse('{"response":"email in use"}')
		else:
			return HttpResponse('{"response":"username in use"}')

	except Exception as e:
		return HttpResponse('{"response":"exception","error":"' + traceback.format_exc() + '"}')

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
		except Exception as e:
			return HttpResponse('{"response":"exception","error":"' + traceback.format_exc() + '"}')
	else:
		return HttpResponse('{"response":"unauthenticated"}')

def test_request(request):
	if request.user.is_authenticated:
		return HttpResponse(request.user.username)
	else:
		return HttpResponse('unauthenticated')