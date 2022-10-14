from flask_restx import Resource
from flask import jsonify
from app import session
from sqlalchemy.exc import NoResultFound
from utils.globals import unpack, catch_errors, JWT_SECRET, \
    generate_verification_code, email_sender, verification_code, \
    delete_verification_code, verification_code_email, construct_email
from utils.api_models import *
from utils.request_handling import *
from models import User as UserModel, Admin as AdminModel
import jwt
import threading

auth = api.namespace('auth', description='Authentication Services')


@auth.route('/login', strict_slashes=False)
class Login(Resource):
    @auth.response(200, 'Success', token_details)
    @auth.response(400, 'Missing Username/Password')
    @auth.response(403, 'Invalid Username/Password')
    @auth.expect(login_details)
    @auth.doc(description="""
        Authenticates a verified account created through register.
        Returns a auth token which should be passed in subsequent calls to the api
        to verify the user.
    """)
    @catch_errors
    def post(self):
        j = get_request_json()
        (email, password) = unpack(j, 'email', 'password')
        # check user and password
        u = UserModel.query.filter_by(email=email).first()
        if not u or u.password != password:
            abort(403, "Invalid Username/Password")
        encoded_jwt = jwt.encode(
            {"email": email}, JWT_SECRET, algorithm="HS256")
        return {"token": encoded_jwt}


@auth.route('/register', strict_slashes=False)
class Register(Resource):
    @auth.response(200, 'Success', token_details)
    @auth.response(400, 'Missing Username/Password')
    @auth.response(409, 'Username Taken')
    @auth.expect(register_details)
    @auth.doc(description='''
        Creates a new account, name, email must be unique and non-empty,
        returns a auth token, same as /login would
    ''')
    @catch_errors
    def post(self):
        j = get_request_json()
        (n, ps, em) = unpack(j, 'name', 'password', 'email')
        q = UserModel.query.filter_by(email=em)
        if session.query(q.exists()).scalar():
            abort(409, 'Email Taken')
        if n == '' or ps == '' or em == '':
            abort(400, 'Email, password and name cannot be empty')

        encoded_jwt = jwt.encode({"email": em}, JWT_SECRET, algorithm="HS256")
        new_user = UserModel(name=n, email=em, password=ps)
        session.add(new_user)
        session.commit()
        return {'token': encoded_jwt}


@auth.route('/admin/login', strict_slashes=False)
class Login(Resource):
    @auth.expect(login_details)
    @auth.response(200, 'Success', token_details)
    @auth.response(400, 'Missing Username/Password')
    @auth.response(403, 'Invalid Username/Password')
    @auth.doc(description='''
        Authenticates a verified account created through register.
        Returns a auth token which should be passed in subsequent calls to the api
        to verify the admin.
    ''')
    @catch_errors
    def post(self):
        j = get_request_json()
        (email, password) = unpack(j, 'email', 'password')
        # check user and password
        a = AdminModel.query.filter_by(email=email).first()
        if not a or a.password != password:
            abort(403, "Invalid Username/Password")
        encoded_jwt = jwt.encode(
            {"email": email}, JWT_SECRET, algorithm="HS256")
        return {"token": encoded_jwt}


@auth.route('/forgot-password')
class ForgotPassword(Resource):
    @auth.param('email', required=True, description='user email')
    @auth.doc(description='Generate verification code')
    @auth.response(200, 'Success')
    @auth.response(400, 'User Not Found')
    @catch_errors
    def get(self):
        email = get_request_arg('email', str, required=True)
        try:
            user = UserModel.query.filter_by(email=email).one()

            code = generate_verification_code()
            title = 'Where2Park password reset verification code'
            content = construct_email(verification_code_email, user.name, code)
            print("Send verification code {} to {}({})".format(code, user.name, user.email))

            t1 = threading.Thread(target=email_sender, args=(
                title, user.name, content, user.email,))
            t1.start()
            verification_code[email] = code
            t2 = threading.Thread(
                target=delete_verification_code, args=(user.email,))
            t2.start()

            return jsonify({'message': 'Success'})
        except NoResultFound:
            abort(400, 'User Not Found')


@auth.route('/reset-password')
class ResetPassword(Resource):
    @auth.expect(auth_forget_password_post_detail)
    @auth.doc(description='Verification code check and reset password')
    @auth.response(400, 'User Not Found')
    @auth.response(403, 'Invalid Verification Code')
    @catch_errors
    def put(self):
        j = get_request_json()
        [email, code, password] = unpack(
            j, 'email', 'code', 'password', required=True)

        try:
            UserModel.query.filter_by(email=email).one()

            if email not in verification_code.keys() or verification_code[email] != code:
                abort(403, 'Invalid Verification Code')

            count = UserModel.query.filter_by(email=email).update(
                {'password': password}, synchronize_session=False)
            session.commit()
            return jsonify({'updated': count})
        except NoResultFound:
            abort(400, 'User Not Found')
