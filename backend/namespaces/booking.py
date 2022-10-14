from flask_restx import Resource
from flask import jsonify, request
from app import session
from utils.globals import unpack, authorize, catch_errors, payment_check, \
    email_sender, invoice_email, problem_report_email, construct_email
from utils.api_models import *
from utils.request_handling import *
from models import Booking as BookingModel, CarSpace as CarSpaceModel, \
    BookingSchemaWithRelationships, User as UserModel, CarSpaceSnapShotSchema, \
    Admin as AdminModel
from dateutil import parser
import threading
from datetime import datetime
import json

booking = api.namespace('bookings', description='Booking Management')


@booking.route('')
class Bookings(Resource):
    @booking.expect(auth_details)
    @booking.doc(description='Get a list of bookings of current user')
    @booking.response(200, 'Success', [booking_return])
    @catch_errors
    def get(self):
        user = authorize(request)
        bookings = BookingModel.query.filter_by(customer_id=user.id).all()
        return jsonify(BookingSchemaWithRelationships(exclude=['customer'], many=True).dump(bookings))

    @booking.expect(auth_details, booking_details)
    @booking.doc(description='Create a new pending booking')
    @booking.response(200, "Success")
    @booking.response(400, 'Invalid Car Space')
    @booking.response(403, "You can't book your own car space.")
    @catch_errors
    def post(self):
        user = authorize(request)
        user_id = user.id

        j = get_request_json()
        [car_space_id, start_date, end_date, price, picked_dates, provider_id] = unpack(
            j, 'car_space_id', 'start_date', 'end_date', 'price', 'picked_dates', 'provider_id')

        if user_id == provider_id:
            abort(403, "You can't book your own car space.")

        car_space = CarSpaceModel.query.get(car_space_id)
        if not car_space:
            abort(400, 'Invalid Car Space')
        car_space_string = json.dumps(CarSpaceSnapShotSchema().dump(car_space))

        new_booking = BookingModel(customer_id=user_id,
                                   car_space_id=car_space_id,
                                   start_date=parser.parse(start_date),
                                   end_date=parser.parse(end_date),
                                   price=price,
                                   picked_dates=picked_dates,
                                   provider_id=provider_id,
                                   car_space_snapshot=car_space_string
                                   )
        session.add(new_booking)
        session.commit()
        t = threading.Thread(target=payment_check, args=(new_booking.id,))
        t.start()

        return jsonify({"new_booking_id": new_booking.id})


@booking.route('/current-provider')
class BookingsByProvider(Resource):
    @booking.expect(auth_details)
    @booking.doc(description='Get a list of bookings made to current user as the provider')
    @booking.response(200, 'Success', [booking_return])
    @catch_errors
    def get(self):
        provider = authorize(request)
        bookings = BookingModel.query.filter_by(provider_id=provider.id).all()
        return jsonify(BookingSchemaWithRelationships(many=True).dump(bookings))


@booking.route('/<bk_id>')
class Booking(Resource):
    @booking.expect(auth_details)
    @booking.doc(description='Get a particular booking by id')
    @booking.response(200, 'Success', booking_return)
    @booking.response(400, 'Booking not found')
    @booking.response(403, 'Invalid User Request')
    @catch_errors
    def get(self, bk_id):
        user = authorize(request)
        one_bk = BookingModel.query.get(bk_id)
        if not one_bk:
            abort(400, 'Booking not found')
        if one_bk.customer_id != user.id and not isinstance(user, AdminModel):
            abort(403, 'Invalid User Request')
        bookings = BookingModel.query.filter(BookingModel.id != one_bk.id,
                                             BookingModel.car_space_id == one_bk.car_space_id,
                                             BookingModel.status.in_(['pending', 'paid'])).all()
        setattr(one_bk, 'bookings_to_same_car_space', map(
            lambda bk: {"picked_dates": bk.picked_dates, "id": bk.id}, bookings))
        provider = UserModel.query.get(one_bk.provider_id)
        setattr(one_bk, 'provider', provider)
        return jsonify(BookingSchemaWithRelationships().dump(one_bk))

    @booking.expect(auth_details, booking_update_details)
    @booking.doc(description='Update a particular booking details by id')
    @booking.response(200, 'Success')
    @booking.response(400, 'Booking not found')
    @catch_errors
    def put(self, bk_id):
        authorize(request)

        j = get_request_json()
        [start_date, end_date, price, picked_dates] = unpack(
            j, 'start_date', 'end_date', 'price', 'picked_dates')

        one_bk = BookingModel.query.get(bk_id)

        if not one_bk:
            abort(400, "Booking not found")

        count = BookingModel.query.filter_by(id=bk_id).update({'start_date': parser.parse(start_date),
                                                               'end_date': parser.parse(end_date),
                                                               'price': price,
                                                               'picked_dates': picked_dates,
                                                               }, synchronize_session=False)
        session.commit()
        return jsonify({'updated': count})


@booking.route('/<bk_id>/commit')
class Booking(Resource):
    @booking.expect(auth_details)
    @booking.doc(description='Complete a particular booking')
    @booking.response(200, 'Success')
    @catch_errors
    def put(self, bk_id):
        user = authorize(request)
        UserModel.query.filter_by(id=user.id).update(
            {'first_timer': False}, synchronize_session=False)
        count = BookingModel.query.filter_by(id=bk_id).update(
            {'status': 'paid'}, synchronize_session=False)

        bk = BookingModel.query.get(bk_id)
        cs = CarSpaceModel.query.get(bk.car_space_id)
        provider = UserModel.query.get(bk.provider_id)

        title = 'Where2Park invoice'

        # completion time, car space title, car space address, start date and end date,
        # total days, total price, provider name, provider email, booking id

        content = invoice_email.format(datetime.now().strftime('%d-%m-%Y %H:%M:%S'),
                                       cs.title,
                                       cs.address,
                                       bk.start_date.strftime('%d-%m-%Y'),
                                       bk.end_date.strftime('%d-%m-%Y'),
                                       len(bk.picked_dates.split(',')),
                                       bk.price,
                                       provider.name,
                                       provider.email,
                                       bk_id)

        t = threading.Thread(target=email_sender, args=(
            title, user.name, content, user.email,))

        t.start()

        session.commit()
        return jsonify({'updated': count})


@booking.route('/<bk_id>/cancel')
class Booking(Resource):
    @booking.expect(auth_details)
    @booking.doc(description='Cancel a particular booking')
    @booking.response(200, 'Success')
    @catch_errors
    def put(self, bk_id):
        authorize(request)
        count = BookingModel.query.filter_by(id=bk_id).update(
            {'status': 'cancelled'}, synchronize_session=False)
        session.commit()
        return jsonify({'updated': count})


@booking.route('/<bk_id>/report-problem')
class ReportProblem(Resource):
    @booking.expect(auth_details, problem_report_detail)
    @booking.doc(description='Report a problem about a car space')
    @booking.response(200, 'Success')
    @booking.response(403, 'Invalid User Request')
    @catch_errors
    def post(self, bk_id):
        user = authorize(request)

        j = get_request_json()
        [problem] = unpack(j, 'content')

        bk = BookingModel.query.get(bk_id)
        cs = CarSpaceModel.query.get(bk.car_space_id)
        provider = UserModel.query.get(bk.provider_id)
        customer = UserModel.query.get(bk.customer_id)

        if user.email != customer.email:
            abort(403, 'Invalid User Request')

        title = 'Where2Park Car Space Problem Report'

        # provider name, carspace title, carspace address, problem,
        # customer name, customer email, provider name
        content = construct_email(problem_report_email,
                                  provider.name,
                                  cs.title,
                                  cs.address,
                                  problem,
                                  customer.name,
                                  customer.email,
                                  )

        t = threading.Thread(target=email_sender, args=(
            title, provider.name, content, provider.email,))
        t.start()

        return jsonify({'message': 'success'})
