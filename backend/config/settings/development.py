from .base import *
DATABASES = {
   'default': {
      'ENGINE': 'django.db.backends.mysql',
      'NAME': 'lifelog_db',
      'USER': 'user',
      'PASSWORD': 'password',
      'HOST': 'life-log-db',
      'PORT': '3306',
      'ATOMIC_REQUESTS': True
   }
}