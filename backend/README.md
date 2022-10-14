This is backend application of Where2Park Web Application using Python flask/flask-restx framework.

## Database Installation

First, install `MySQL`.

Then, set up a user other than `root` user and create a password for it.

Finally, create a database named `where2park`.

## Database Connection

After getting MySQL server up and running, create a `.env` file in the root (`/backend`) directory, and add following environment variables:

```env
MYSQL_USERNAME=<yourusername>
MYSQL_PASSWORD=<yourpassword>
MYSQL_PORT=<yourport>
```

## Getting Started

First, install the packages stated in the requirements text file.

```bash
pip install -r requirements.txt
```

Run the development server in the terminal:

```bash
python3 run.py
```

Open [http://localhost:4000](http://localhost:4000) with the browser to see the Swagger documentation generated.

## Application file structure

```.
├── README.md                       readme file
├── initdb.py                       database init
├── app.py                          app init
├── models.py                       database models and schemas
├── namespaces                      routes
│   ├── admin.py
│   ├── auth.py
│   ├── booking.py
│   ├── carspace.py
│   ├── public.py
│   ├── user.py
│   ├── vehicle.py
│   └── wishlist.py
├── requirements.txt                package requirement
├── run.py                          application entry point
├── utils
    ├── api_models.py               api documentation models
    ├── email_template.py           email template strings
    ├── globals.py                  utility functions
    └── request_handling.py         request body and args handler
```

## Main packages

### [Flask-RESTX](https://flask-restx.readthedocs.io/en/latest/)

For writing API.

### [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/en/2.x/)

For interacting with database.

- Use `Class` to define database model
- Use provided API to execute operations instead of plain SQL

#### [Query API](https://docs.sqlalchemy.org/en/14/orm/query.html)

Frequently used:

```
- all()
- one()
- first()
- get()
- filter()
- fitler_by()
- update()
- delete()
```

Search function name in Query API to see usage.

#### [Session](https://docs.sqlalchemy.org/en/14/orm/session.html)

Simple example

```python
db = SQLAlchemy(app)
user = User(email='email',password='password')
db.session.add(user)
db.session.commit()
```

See documentation and following examples for more details.

### [Flask-Marshmallow](https://flask-marshmallow.readthedocs.io/en/latest/)

For serialization/deserialization object

- [dump](https://marshmallow.readthedocs.io/en/latest/api_reference.html#marshmallow.Schema.dump) To serialize object
- [load](https://marshmallow.readthedocs.io/en/latest/api_reference.html#marshmallow.Schema.load) To deserialize object

See also [Marshmallow](https://marshmallow.readthedocs.io/en/latest/)

### [Marshmallow-SQLAlchemy](https://marshmallow-sqlalchemy.readthedocs.io/en/latest/)

"SQLAlchemy integration with the marshmallow (de)serialization library."

## Examples

> The following examples were from early development, please refer to the source code if you need to see the code

Namespace file, for writing API endpoint, main file for logic and database interaction.

```python
# /namespaces/auth.py
# Resource class used as base class for each route class
from flask_restx import Resource

# utility functions
from utils.globals import *
# models for api documentation, see below
from utils.api_models import *
# request_handling file provides two functions
# get_request_json() takes no argument, returns a dictionary of request body
from utils.request_handling import *
# models folder include all database models
from models import User as UserModel

# create a namespace
auth = api.namespace('auth', description='Authentication Services')

# db is from a SQLAlchemy class instance, see `app.py`
session = db.session

# secret key for encrypt the json web token
jwt_secret = 'iJIUzI1NiJ9W5AZ21haWwuY29tIn'


# route decorator
@auth.route('/login', strict_slashes=False)
# route class should be the same name as the route name
class Login(Resource):
    # for swagger documentation, each routh must have detailed documentation
    @auth.response(200, 'Success', token_details)
    @auth.response(400, 'Missing Username/Password')
    @auth.response(403, 'Invalid Username/Password')
    # request body format
    @auth.expect(login_details)
    @auth.doc(description='''
        This is used to authenticate a verified account created through register.
        Returns a auth token which should be passed in subsequent calls to the api
        to verify the user.
    ''')
    # utility function for catch all errors other than the specified ones
    # this decorator must be included in each Method function of each route,
    # and it must be put after all the swagger documentation decorators
    @catch_errors
    def post(self):
        # get request body
        j = get_request_json()
        # unpack from the dictionary
        # see unpack function for details
        (email, password) = unpack(j, 'email', 'password')
        # check user and password
        # SQLAlchemy Model query API
        u = UserModel.query.filter_by(email=email).first()

        if not u or u.password != password:
            abort(403, "Invalid Username/Password")
        # return token using jwt encode method
        encoded_jwt = jwt.encode({"email": email}, jwt_secret, algorithm="HS256")
        return {"token": encoded_jwt}
```

```python
# namespaces/user.py
user = api.namespace('users', description='User Management')

# create route /user
@user.route('')
class Users(Resource):
    @user.doc(description='Get a list of users, could be filtered')
    @catch_errors
    def get(self):
        # check token
        # utility function for checking whether the token is valid
        # include this function call in every route other than auth
        authorize(request)

        # get all users
        # variable `users` is a list of <User> objects
        users = UserModel.query.all()

        # create users schema, with `many=True` indicating the schema
        # is used for a list of objects
        users_schema = UserSchema(Many=True)

        # serialize and return
        # make sure to wrap the result in jsonify function call
        return jsonify({"users": users_schema.dump(users)})
```

SQLAlchemy models and Marshmallow schemas

```python
# /models/user.py
from sqlalchemy import Column, Integer, String, DateTime
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app import db
from datetime import datetime

# User Table
class User(db.Model):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    email = Column(String(255))
    password = Column(String(255))
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

# User schema
# marshmallow_sqlalchemy provides integration for
# Marshmallow and SQLAlchemy, schema is easy to write
class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        # config dump, see documentation for details
        include_fk = True
        load_instance = True
```
