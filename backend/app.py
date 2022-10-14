from flask import Flask
from flask_restx import Api
from werkzeug.middleware.proxy_fix import ProxyFix
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

MYSQL_USERNAME = os.getenv('MYSQL_USERNAME')
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD')
MYSQL_PORT = os.getenv('MYSQL_PORT')


app = Flask(__name__)
CORS(app)
app.wsgi_app = ProxyFix(app.wsgi_app)
api = Api(app, version='1.0', title='Where2Park API',
          description='API servicing Where2Park Web App',
          )

app.config['DEBUG'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{MYSQL_USERNAME}:{MYSQL_PASSWORD}@127.0.0.1:{MYSQL_PORT}/where2park'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['ENV'] = 'development'

db = SQLAlchemy(app)
session = db.session
ma = Marshmallow(app)
