from .base import *

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'lifelog_db',
        'USER': 'user',
        'PASSWORD': 'password',
        'HOST': 'life-log-db',
        'PORT': '5432',
        'ATOMIC_REQUESTS': True,
    }
}