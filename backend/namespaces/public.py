from flask_restx import Resource
from utils.globals import catch_errors, authorize
from utils.api_models import *
from models import CarSpace as CarSpaceModel, CarSpaceSchemaWithRelationships, \
    CarSpaceSchemaForList, Booking as BookingModel
from utils.request_handling import *
from flask import jsonify
from geopy.distance import distance
from operator import attrgetter
import requests

public = api.namespace(
    'public', description='Public API for the user who has not logged in')


@public.route('/car-spaces')
class CarSpaces(Resource):
    @public.doc(description='Get a list of filtered/sorted car spaces')
    @public.expect(public_car_space_filter_details)
    @public.response(200, 'Success', [car_space_schema_for_list_return])
    @public.response(400, 'Price type cannot be empty')
    @ catch_errors
    def get(self):
        is_login = get_request_arg('is_login', str, required=True) == 'true'
        user = None
        if is_login:
            user = authorize(request)

        latitude = get_request_arg('latitude', float, required=True)
        longitude = get_request_arg('longitude', float, required=True)
        dist = get_request_arg('distance', int, required=True)  # km
        cs_type = get_request_arg('cs_type', str)
        price = get_request_arg('price', str)
        sortby = get_request_arg('sortby', str)
        order = get_request_arg('order', str)

        queries = [CarSpaceModel.status == 'online']

        # input process, construct query
        if cs_type is not None:
            cs_type = cs_type.split(',')
            queries.append(CarSpaceModel.car_space_type.in_(cs_type))

        if price is not None:
            [min_p, max_p, price_type] = price.split(',')
            if price_type == '':
                abort(400, 'Price type cannot be empty')
            min_p = -1 if min_p == '' else float(min_p)
            max_p = float('inf') if max_p == '' else float(max_p)

            price_column = CarSpaceModel.price_per_month

            if price_type == 'week':
                price_column = CarSpaceModel.price_per_week
            elif price_type == 'day':
                price_column = CarSpaceModel.price_per_day

            queries.append(price_column.between(min_p, max_p))

        stmt = CarSpaceModel.query.filter(*queries)

        if (sortby and order) is not None and sortby == 'price':
            if order == 'desc':
                stmt = stmt.order_by(CarSpaceModel.price_per_month.desc())
            else:
                stmt = stmt.order_by(CarSpaceModel.price_per_month)

        all_car_spaces = stmt.all()
        car_spaces = []
        for cs in all_car_spaces:
            is_disliked = user \
                and user.disliked_car_spaces \
                and str(cs.id) in user.disliked_car_spaces.split(',')

            d = distance((cs.latitude, cs.longitude),
                         (latitude, longitude)).km
            if d < dist and not is_disliked:
                setattr(cs, 'distance', d)
                car_spaces.append(cs)

        if (sortby and order) is not None and sortby == 'distance':
            car_spaces.sort(key=attrgetter('distance'))
            if order == 'desc':
                car_spaces.reverse()

        return jsonify(CarSpaceSchemaForList(many=True).dump(car_spaces))


@public.route('/car-spaces/<cs_id>')
class CarSpace(Resource):
    @public.doc(description='Get a particular car spaces by cs_id')
    @public.response(200, 'Success', car_space_schema_with_comments_return)
    @public.response(400, 'Car space not found')
    @catch_errors
    def get(self, cs_id):
        one_cs = CarSpaceModel.query.get(int(cs_id))
        if not one_cs:
            abort(400, 'Car space not found')
        bookings = BookingModel.query.filter(
            BookingModel.car_space_id == one_cs.id, BookingModel.status.in_(['pending', 'paid'])).all()
        setattr(one_cs, 'bookings_to_same_car_space', map(
            lambda bk: {"picked_dates": bk.picked_dates, "id": bk.id}, bookings))
        return jsonify(CarSpaceSchemaWithRelationships(exclude=['bookings']).dump(one_cs))


@public.route('/australian-addresses')
class AustraliaAddresses(Resource):
    @public.doc(description='Wrapper for Free Australian Address API, https://australianaddresses.net.au')
    @public.param(name='q', description='Query for addresses', required=True, example='Sydney')
    @public.response(200, 'Success', [australian_addresses_return])
    @public.response(400, 'No Address Found')
    @catch_errors
    def get(self):
        q = get_request_arg('q', str, True)
        res = requests.get(
            'https://australianaddresses.net.au/d?q={}'.format(q)).json()
        if len(res) == 1 and (res[0].get('id') == 0 or res[0].get('highlighted') == "could not perform query"):
            abort(400, 'No Address Found')

        ret = list(map(lambda x: {'id': x.get('id'), 'address': x.get('address'), 'latitude': float(x.get(
            'location').split(',')[0]), 'longitude': float(x.get('location').split(',')[1])}, res))
        return jsonify(ret)
