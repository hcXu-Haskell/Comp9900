import threading
from flask_restx import Resource
from flask import jsonify, request
from app import session
from utils.globals import authorize, catch_errors, statement_email, \
    email_sender, SERVICE_FEE_RATE, construct_email
from utils.api_models import *
from utils.request_handling import *
from models import User as UserModel, UserSchema, CarSpace as CarSpaceModel, \
    CarSpaceSchemaForList, Booking as BookingModel, \
    BookingSchemaWithRelationships

admin = api.namespace('admin', description='Admin-only Operations')


@admin.route('/users')
class Users(Resource):
    @admin.expect(auth_details)
    @admin.response(200, 'Success', [user_model_return])
    @admin.response(403, 'Invalid Authorization Token')
    @admin.doc(description='Get all users')
    @catch_errors
    def get(self):
        authorize(request, True)
        users = UserModel.query.all()
        return jsonify(UserSchema(exclude=['password'], many=True).dump(users))


@admin.route('/users/<user_id>')
class User(Resource):
    @admin.expect(auth_details)
    @admin.response(200, 'Success')
    @admin.response(400, "User Not Found")
    @admin.response(403, 'Invalid Authorization Token')
    @admin.doc(description='Delete a particular user by id')
    @catch_errors
    def delete(self, user_id):
        authorize(request, True)
        one_user = UserModel.query.get(user_id)
        if not one_user:
            abort(400, "User not found")
        # session.delete returns null when success
        session.delete(one_user)
        session.commit()
        # return empty body to indicate success
        return {}


@admin.route('/car-spaces')
class CarSpaces(Resource):
    @admin.expect(auth_details)
    @admin.response(200, 'Success', [car_space_schema_for_list_return])
    @admin.response(403, 'Invalid Authorization Token')
    @admin.doc(description='Get all car spaces')
    @catch_errors
    def get(self):
        authorize(request, True)
        car_spaces = CarSpaceModel.query.all()
        return jsonify(CarSpaceSchemaForList(many=True).dump(car_spaces))


@admin.route('/car-spaces/<cs_id>')
class CarSpace(Resource):
    @admin.expect(auth_details)
    @admin.doc(description='Delete a particular car space by id')
    @admin.response(200, 'Success')
    @admin.response(400, "Car Space Not Found")
    @admin.response(403, 'Invalid Authorization Token')
    @catch_errors
    def delete(self, cs_id):
        authorize(request, True)
        one_cs = CarSpaceModel.query.get(cs_id)
        if not one_cs:
            abort(400, 'Booking not found')
        session.delete(one_cs)
        session.commit()
        return {}


@admin.route('/bookings')
class Bookings(Resource):
    @admin.expect(auth_details)
    @admin.response(200, 'Success', [booking_schema_with_relationships_return])
    @admin.response(403, 'Invalid Authorization Token')
    @admin.doc(description='Get all bookings')
    @catch_errors
    def get(self):
        authorize(request, True)
        bookings = BookingModel.query.all()
        return jsonify(BookingSchemaWithRelationships(
            exclude=['bookings_to_same_car_space'], many=True).dump(bookings))


@admin.route('/bookings/<bk_id>')
class Booking(Resource):
    @admin.expect(auth_details)
    @admin.doc(description='Delete a particular booking by id')
    @admin.response(200, 'Success')
    @admin.response(400, 'Booking Not Found')
    @admin.response(403, 'Invalid Authorization Token')
    @catch_errors
    def delete(self, bk_id):
        authorize(request, True)
        one_bk = BookingModel.query.get(bk_id)
        if not one_bk:
            abort(400, 'Booking not found')
        session.delete(one_bk)
        session.commit()
        return {}


@admin.route('/statements/<user_id>')
class Statements(Resource):
    @admin.expect(auth_details)
    @admin.response(200, 'Success')
    @admin.doc(description="Send a statement of historical bookings taken to the user")
    def post(self, user_id):
        authorize(request, True)
        bookings = BookingModel.query.filter_by(
            provider_id=user_id, status='paid').all()
        bookings_dict = {}
        total_income = 0

        if bookings:
            for bk in bookings:
                cs = CarSpaceModel.query.get(bk.car_space_id)
                customer = UserModel.query.get(bk.customer_id)
                bookings_dict[bk.id] = {'title': cs.title,
                                        'address': cs.address,
                                        'start_date': bk.start_date.strftime('%d-%m-%Y'),
                                        'end_date': bk.end_date.strftime('%d-%m-%Y'),
                                        'total_days': len(bk.picked_dates.split(',')),
                                        'price': f"${format(bk.price * (1 - SERVICE_FEE_RATE), '.2f')}",
                                        'customer': customer.name
                                        }
                total_income += bk.price

            platform_service_fee = total_income * SERVICE_FEE_RATE
            total_income -= platform_service_fee

            total_income = format(total_income, '.2f')

            bookings_table = """
<p>Here is a statement of historical bookings made to you:</p>
<table>
<tr>
    <th>Booking Id</th>
    <th>Car Space Title</th>
    <th>Car Space Address</th>
    <th>Start Date</th>
    <th>End Date</th>
    <th>Total Days</th>
    <th>Price</th>
    <th>Customer</th>
</tr>
"""
            for bk_id, item in bookings_dict.items():
                row = "<tr>"
                row += f"<td>{bk_id}</td>"
                row += "".join([f"<td>{v}</td>" for v in item.values()])
                row += "</tr>"
                bookings_table += row
            bookings_table += "</table>"

            bookings_table += f"<p>Your total income is ${total_income}.</p>"
        else:
            bookings_table = "There is no bookings made to you."
        user = UserModel.query.get(user_id)
        title = 'Statement of historical bookings made to you'

        # username, bookings table
        content = construct_email(statement_email, user.name,
                                  bookings_table,
                                  )

        # title, name, content, email
        t = threading.Thread(target=email_sender, args=(
            title, user.name, content, user.email))
        t.start()
        return jsonify({'send_to_user': user.name})
