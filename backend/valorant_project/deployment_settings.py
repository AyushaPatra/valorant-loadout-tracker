import os
import dj_database_url
from .settings import *
from .settings import BASE_DIR

ALLOWED_HOSTS = [os.environ.get['RENDER_EXTERNAL_HOSTNAME']]

CS