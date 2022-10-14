from flask_restx import Resource
from flask import jsonify, request
from app import session
from utils.globals import unpack, authorize, catch_errors
from utils.api_models import *
from utils.request_handling import *
from models import User as UserModel, Admin as AdminModel, UserSchema, \
    UserSchemaWithRelationships

user = api.namespace('users', description='User Management')


@user.route('/current')
class CurrentUser(Resource):
    @user.expect(auth_details)
    @user.doc(description='Get current user')
    @catch_errors
    def get(self):
        one_user = authorize(request)
        return jsonify(UserSchemaWithRelationships(exclude=[
            'password', 'comments', 'car_spaces', 'bookings']).dump(one_user))


@user.route('/<user_id>')
class User(Resource):
    @user.expect(auth_details)
    @user.doc(description='Get a particular user by id')
    @user.response(200, 'Success', user_model_return)
    @user.response(400, 'User Not Found')
    @catch_errors
    def get(self, user_id):
        authorize(request)
        one_user = UserModel.query.get(user_id)
        if not one_user:
            abort(400, 'User not found')
        return jsonify({'user': UserSchema().dump(one_user)})

    @user.expect(auth_details, user_profile_put)
    @user.doc(description='Update a particular user by id')
    @user.response(400, 'User Not Found')
    @user.response(403, 'Invalid User Request')
    @catch_errors
    def put(self, user_id):
        user = authorize(request)
        j = get_request_json()
        attributes = ['name', 'bank_account_bsb', 'bank_account_name',
                      'bank_account_number', 'nearby_parking', 'rental_history',
                      'competitive', 'discount_rate']
        variables = unpack(j, *attributes, required=False)
        one_user = UserModel.query.get(user_id)
        if not one_user:
            abort(400, 'User not found')
        if user.id != one_user.id and not isinstance(user, AdminModel):
            abort(403, 'Invalid User Request')

        data = {}
        for a, v in zip(attributes, variables):
            if v is not None:
                if a == 'discount_rate' and v == 0:
                    data[a] = None
                    continue
                data[a] = v
        count = UserModel.query.filter_by(id=user_id).update(
            data, synchronize_session=False)
        session.commit()
        return jsonify({'updated': count})
