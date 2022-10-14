from app import api
from flask_restx import fields


token_details = api.model('token_details', {
    'token': fields.String()
})

login_details = api.model('login_details', {
    'email': fields.String(required=True, example='greg@fred.com'),
    'password': fields.String(required=True, example='1234'),
})

register_details = api.model('register_details', {
    'name': fields.String(required=True, example='greg'),
    'email': fields.String(required=True, example='greg@fred.com'),
    'password': fields.String(required=True, example='1234'),
})

auth_details = api.parser().add_argument('Authorization',
                                         help="Your Authorization Token in the form 'Bearer <AUTH_TOKEN>'",
                                         location='headers')

car_spaces_filter_details = api.model('car_spaces_filter_details', {
    'latitude': fields.Float(description='float, -1 for no latitude',
                             example='31.15'),
    'longitude': fields.Float(description='float, -1 for no longitude',
                              example='40.15'),
    'pay_type': fields.Integer(description='price type, 0 for day, 1 for week, 2 for month',
                               example='1'),
    'max_price': fields.Float(description='float, -1 for no max price',
                              example='800'),
    'min_price': fields.Float(description='float, -1 for no min price',
                              example='-1'),
    'max_allowed_vehicle': fields.String(description='max allowed vehicle, string, NULL for no type',
                                         example='SUV')
})

car_spaces_details = api.model('car_spaces_details', {
    'title': fields.String(description='string, name of car space',
                           required=True, example='UNSW CSE Car space'),
    'bond': fields.Float(description='Float, bound', required=True, example=1000.00),
    'image': fields.String(description='string, image path', example='https://www.google.com/image/xx'),
    'size_length': fields.Float(description='Float, length', example=10.5),
    'size_width': fields.Float(description='Float, width', example=5.1),
    'max_height': fields.Float(description='Float, max height, 0 for no max height', example=3.8),
    'max_allowed_vehicle': fields.String(description='String, max allowed vehicle', example='Van'),
    'car_space_type': fields.String(description='string, car space type',
                                    required=True, example='undercover'),
    'amenities': fields.String(description='string, amenities', example='cctv'),
    'access_type': fields.String(description='string, access type', example='key'),
    'user_id': fields.Integer(description='int, user ID', required=True, example=152154),
    'price_per_day': fields.Float(description='Float, price per day',
                                  required=True, example=50.8),
    'price_per_week': fields.Float(description='Float, price per week',
                                   required=True, example=150.99),
    'price_per_month': fields.Float(description='Float, price per month',
                                    required=True, example=300.98),
    'unavailable_type': fields.Integer(description='int, unavailable type', required=True, example='1'),
    'unavailable_dates': fields.String(description='DateTime, Unavailable dates',
                                       example='07-06-2022'),
    'unavailable_from_date': fields.DateTime(description='DateTime, unavailable from date',
                                             example='2022-06-30 00:00:00.000000'),
    'unavailable_to_date': fields.DateTime(description='DateTime, unavailable to date',
                                           example='2022-06-30 00:00:00.000000'),
    'available_type': fields.Integer(description='int, available type', required=True, example='0'),
    'available_from_time': fields.DateTime(description='DateTime, available From Time',
                                           example='2022-06-30 00:00:00.000000'),
    'available_to_time': fields.DateTime(description='DateTime, available To Time',
                                         example='2022-06-30 00:00:00.000000'),
    'available_from_date': fields.DateTime(description='DateTime, available From Date',
                                           example='2022-06-30 00:00:00.000000'),
    'available_to_date': fields.DateTime(description='DateTime, available To Date',
                                         example='2022-06-30 00:00:00.000000'),
    'available_week_days': fields.String(description='String, available Week Days, 0 for sunday, 1~6 for monday to saturday',
                                         example='12345'),
    'description': fields.String(description='string, description'),
    'instruction': fields.String(description='string, instruction')
})


comments_return = api.model('comments_return ', {
    'content': fields.String(description='String, content', example='great'),
    'created_at': fields.DateTime(description='DateTime, created_at',
                                  example='2022-07-03T13:49:32.123976'),
    'id': fields.Integer(description='Integer, car space id', example=1),
    'rating': fields.Float(description='Float, rating', example=4.5),
    'updated_at': fields.DateTime(description='DateTime, updated_at',
                                  example='2022-07-03T13:49:32.123976')
})

provider_return = api.model('provider_return', {
    'bank_account_bsb': fields.String(description='String, bank_account_bsb',
                                      example='130xxx'),
    'bank_account_name': fields.String(description='String, bank_account_name',
                                       example='test name'),
    'bank_account_number': fields.String(description='String, bank_account_number',
                                         example='2000xxxxyyyy'),
    'created_at': fields.DateTime(description='DateTime, created_at',
                                  example='2022-07-03T13:49:32.123976'),
    'email': fields.String(description='String, email',
                           example='qinjian1@gmail.com'),
    'id': fields.Integer(description='Integer, id', example=1),
    'name': fields.String(description='String, name', example='qinjian1'),
    'updated_at': fields.DateTime(description='DateTime, updated_at',
                                  example='2022-07-03T13:49:32.123976')
})

car_space_schema_with_comments_return = api.model('car_space_schema_with_comments_return', {
    'access_type': fields.String(description='String, access_type', example='Key'),
    'address': fields.String(description='String, address',
                             example='UNSW High Street'),
    'address_id': fields.String(description='String, address_id', example='1'),
    'amenities': fields.String(description='String, amenities',
                               example='CCTV,Charging'),
    'available_from_date': fields.DateTime(description='DateTime, available_from_date',
                                           example='2022-01-28T09:31:30.886981'),
    'available_from_time': fields.DateTime(description='DateTime, available_from_time',
                                           example='2022-06-28T09:30:30.886981'),
    'available_to_date': fields.DateTime(description='DateTime, available_to_date',
                                         example='2023-06-28T09:31:30.886981'),
    'available_to_time': fields.DateTime(description='DateTime, available_to_time',
                                         example='2022-06-28T21:30:30.886981'),
    'available_type': fields.Integer(description='Integer, available_type', example=1),
    'available_week_days': fields.String(description='String, available_week_days',
                                         example='1,2,3,4'),
    'bond': fields.Float(description='Integer, bond', example=1000.0),
    'car_space_type': fields.String(description='String, car_space_type',
                                    example='Undercover'),
    'comments': fields.List(fields.Nested(comments_return)),
    'created_at': fields.DateTime(description='DateTime, created_at',
                                  example='2022-07-03T13:49:32.123976'),
    'description': fields.String(description='String, description',
                                 example='test description'),
    'id': fields.Integer(description='Integer, car space id', example=1),
    'image': fields.String(description='String, image',
                           example='https://d2syaugtnopsqd.cloudfront.net/wp-content/uploads/sites/10/2020/10/27135236/How-wide-is-a-parking-space-scaled.jpg'),
    'instructions': fields.String(description='String, instructions',
                                  example='test instruction'),
    'latitude': fields.Float(description='Float, latitude', example=-33.917697),
    'longitude': fields.Float(description='Float, longitude', example=151.231174),
    'max_allowed_vehicle': fields.String(description='String, max_allowed_vehicle',
                                         example='Ute'),
    'max_height': fields.Float(description='Float, max_height', example=2.1),
    'price_per_day': fields.Float(description='Float, price_per_day', example=10.0),
    'price_per_month': fields.Float(description='Float, price_per_month', example=250.0),
    'price_per_week': fields.Float(description='Float, price_per_month', example=65.0),
    'provider': fields.Nested(provider_return),
    'provider_id': fields.Integer(description='Integer, provider_id', example=1),
    'size_length': fields.Float(description='Float, size_length', example=5.4),
    'size_width': fields.Float(description='Float, size_width', example=4.3),
    'status': fields.String(description='String, status', example='online'),
    'title': fields.String(description='String, title', example='car space 1'),
    'unavailable_dates': fields.DateTime(description='DateTime, unavailable_dates',
                                         example=None),
    'unavailable_from_date': fields.DateTime(description='DateTime, unavailable_from_date',
                                             example='2022-07-28T09:31:30.886981'),
    'unavailable_to_date': fields.DateTime(description='DateTime, unavailable_to_date',
                                           example='2022-08-23T09:31:30.886981'),
    'unavailable_type': fields.Integer(description='Integer, unavailable_type',
                                       example=0),
    'updated_at': fields.DateTime(description='DateTime, updated_at',
                                  example='2022-07-03T13:49:32.123976')
})

booking_return = api.model('booking_return', {
    'id': fields.Integer(description='int, booking id', example=1),
    'created_at': fields.DateTime(description='DateTime, created at',
                                  example='2022-06-29 11:53:24.649327'),
    'updated_at': fields.DateTime(description='DateTime, updated at',
                                  example='2022-06-29 11:53:24.651743'),
    'customer_id': fields.Integer(description='int, customer id',
                                  example=3),
    'car_space_id': fields.Integer(description='int, car space id',
                                   example=22),
    'price': fields.Float(description='Float, price', example=800.04),
    'start_date': fields.DateTime(description='DateTime, start date',
                                  example='2022-06-29 14:00:00.000000'),
    'end_date': fields.DateTime(description='DateTime, start date',
                                example='2022-07-05 14:00:00.000000'),
    'status': fields.String(description='String, status(only cancelled, pending, paid)',
                            example='paid'),
    'car_space_snapshot': fields.String(description='A snapshot of car space details in JSON string format')
})


booking_details = api.model('booking_details', {
    'car_space_id': fields.Integer(description='int, car space id', required=True, example=22),
    'start_date': fields.DateTime(description='DateTime, start date', required=True,
                                  example='2022-06-29 14:00:00.000000'),
    'end_date': fields.DateTime(description='DateTime, end date', required=True,
                                example='2022-07-05 14:00:00.000000'),
    'picked_dates': fields.String(description='Picked dates array as a string with comma as delimiter',
                                  required=True, example='7/13/2022,7/14/2022'),
    'price': fields.Float(description='float, price', required=True, example='100.10'),
})

booking_update_details = api.model('booking_update_details', {
    'start_date': fields.DateTime(description='DateTime, start date', required=True,
                                  example='2022-06-29 14:00:00.000000'),
    'end_date': fields.DateTime(description='DateTime, end date', required=True,
                                example='2022-07-05 14:00:00.000000'),
    'price': fields.Float(description='float, price', required=True, example='100.10'),
    'picked_dates': fields.String(description='Picked dates array as a string with comma as delimiter',
                                  required=True, example='7/13/2022,7/14/2022')
})

public_car_space_filter_details = api.parser()
public_car_space_filter_details.add_argument(
    'latitude', type=float, required=True, help='Latitude of target location')
public_car_space_filter_details.add_argument(
    'longitude', type=float, required=True, help='Longitude of target location')
public_car_space_filter_details.add_argument(
    'distance', type=int, required=True, help='Max distance between target location and car space')
public_car_space_filter_details.add_argument(
    'cs_type', type=str, help='Type of car space')
public_car_space_filter_details.add_argument(
    'price', type=str,
    help='Price filter conditions of car space(min price,max price,price type,'
    'it could be ",50,day", which means min price per day is None but '
    'max price per day is 50')
public_car_space_filter_details.add_argument(
    'sortby', type=str,
    help='Sort by monthly price or distance. Params `sortby` '
    'and `order` must be passed together', choices=('price', 'distance'))
public_car_space_filter_details.add_argument(
    'order', type=str, help='Sort order', choices=('desc', 'asc'))
public_car_space_filter_details.add_argument(
    'is_login', type=str, help='User is logged in', choices=('true', 'false'))

user_schema_with_only_name_return = api.model('user schema with only name and discount', {
    "discount_rate": fields.Float(description="discount rate", example=0.1),
    "name": fields.String(description="name", example="NoBug1")
})

car_space_schema_for_list_return = api.model('car space schema for list return', {
    "address": fields.String(description="car space address", example="MASCOT INN 952 BOTANY ROAD MASCOT NSW 2020"),
    "address_id": fields.String(description="car space address id",
                                example="45744870567a354c716a6c4250437a553478416869513d3d"),
    "amenities": fields.String(description="car space amenities", example="24/7 Access"),
    "car_space_type": fields.String(description="car space type", example="Driveway"),
    "id": fields.Integer(description="id", example=23),
    "image": fields.String(description="image(base64/url)", example="https://s1.ax1x.com/2022/07/31/vFgaPH.png"),
    "latitude": fields.Float(description="latitude", example=-33.93083321),
    "longitude": fields.Float(description="longitude", example=151.19402192),
    "price_per_day": fields.Float(description="price per day", example=20.0),
    "price_per_month": fields.Float(description="price per month", example=450.0),
    "price_per_week": fields.Float(description="price per week", example=120.0),
    "provider": fields.Nested(user_schema_with_only_name_return),
    "status": fields.String(description="status", example="online"),
    "title": fields.String(description="car space title", example="Car Space 20 Mascot car space")
})

new_comment_details = api.model('new_comment_details', {
    "content": fields.String(example='Great car space!'),
    "rating": fields.Float(required=True, example=4),
})

user_profile_put = api.model('user_profile_put', {
    'name': fields.String(description='name', required=False, example='greg'),
    'bank_account_bsb': fields.String(description='bank account bsb', required=False, example='062222'),
    'bank_account_name': fields.String(description='bank account name', required=False, example='greg'),
    'bank_account_number': fields.String(description='bank account number', required=False, example='11112222'),
    'nearby_parking': fields.Boolean(description='Setting to receive recommendation on nearby car spaces when enter the website', required=False, example=False),
    'rental_history': fields.Boolean(description='Setting to receive emails on car spaces based on rental history', required=False, example=False),
    'competitive': fields.Boolean(description='Setting to receive emails when a new competitive car space is posted', required=False, example=False),
    'discount_rate': fields.Float(description='Discount rate to first time user', required=False, example=20)
})

new_vehicle_post = api.model('new_vehicle_post', {
    'plate': fields.String(description='String, vehicle plate', required=True, example='NSW205'),
    'vehicle_type': fields.String(description='String, vehicle type', required=True, example='sedan'),
    'state': fields.String(description='String, state', required=True, example='NSW'),
})

australian_addresses_return = api.model('australian_addresses_return', {
    'id': fields.String(description='Address id', example='53386d6a6f453938784a6a747073774d764d457846673d3d'),
    'address': fields.String(description='Address', example='420 GEORGE STREET SYDNEY NSW 2000'),
    'latitude': fields.Float(description='Address latitude ', example=-33.87510015),
    'longitude': fields.Float(description='Address longitude', example=151.20867145),
})

auth_forget_password_post_detail = api.model('auth_forget_password_post_detail', {
    'email': fields.String(description='user email', required=True, example='greg@fred.com'),
    'code': fields.String(description='verification code', required=True, example='1A2B3c'),
    'password': fields.String(description='password', required=True, example='Comp9900!!'),
})

user_model_return = api.model('user model return list', {
    "bank_account_bsb": fields.String(description='bank account bsb', example='xxx-xxx'),
    "bank_account_name": fields.String(description='bank account name', example='where2park'),
    "bank_account_number": fields.String(description='bank account number', example='xxxx xxxx xxxx xxxx'),
    "created_at": fields.DateTime(description='created at', example='2022-07-24T14:44:55.340229'),
    "disliked_car_spaces": fields.String(description='the car spaces user disliked', example='1,2,3,4,5'),
    "email": fields.String(description='user email', example='where2park1@gmail.com'),
    "id": fields.Integer(description='user id', example=1),
    "liked_car_spaces": fields.String(description='the car spaces user liked', example='6,7,8,9,10'),
    "name": fields.String(description='user name', example='Nobug1'),
    "password": fields.String(description='password', example='Comp9900!!'),
    "updated_at": fields.DateTime(description='updated at', example='2022-07-24T14:44:55.340229')
})

problem_report_detail = api.model('problem_report_detail', {
    'content': fields.String(description='problem content', required=True,
                             example='The garage door is broken.'),
})

car_space_schema_with_relationships_return = api.model("car space schema with relationships return", {
    "access_type": fields.String(description="access type", example="Swipe card"),
    "address": fields.String(description="address", example="7 HIGH STREET KENSINGTON NSW 2033"),
    "address_id": fields.String(description="address id", example="4e2f54627270362f55687641316f3876695a535430513d3d"),
    "amenities": fields.String(description="amenities", example="CCTV,24/7 Access"),
    "available_from_date": fields.Date(description="available from date", example="2022-07-24"),
    "available_from_time": fields.DateTime(description="available from time", example="2022-07-20T08:00:00"),
    "available_to_date": fields.Date(description="available to date", example="2022-12-30"),
    "available_to_time": fields.DateTime(description="available to time", example="2022-07-25T20:00:00"),
    "available_type": fields.Integer(description="available type", example=1),
    "available_week_days": fields.String(description="available week days", example="2,3,4,5,1"),
    "bond": fields.Float(description="bond", example=200.0),
    "car_space_type": fields.Float(description="car space type", example="Undercover"),
    "comments": fields.Nested(comments_return),
    "created_at": fields.DateTime(description="created at", example="2022-07-31T18:37:31.448937"),
    "description": fields.String(description="description", example="Contact the provider to get access"),
    "id": fields.Integer(description="id", example=20),
    "image": fields.String(description="image (base64/url)", example="https://s1.ax1x.com/2022/07/31/vFgYVO.jpg"),
    "instructions": fields.String(description="instructions", example="Near by unsw main library"),
    "latitude": fields.Float(description="latitude", example=-33.91558276),
    "longitude": fields.Float(description="longitude", example=151.2310207),
    "max_allowed_vehicle": fields.String(description="max allowed vehicle", example="SUV/4WD"),
    "max_height": fields.Float(description="max height", example=3.0),
    "price_per_day": fields.Float(description="price per day", example=10.0),
    "price_per_month": fields.Float(description="price per month", example=260.0),
    "price_per_week": fields.Float(description="price per week", example=70.0),
    "provider": fields.Nested(user_schema_with_only_name_return),
    "provider_id": fields.Float(description="provider id", example=5),
    "size_length": fields.Float(description="size length", example=6.0),
    "size_width": fields.Float(description="size width", example=3.0),
    "status": fields.String(description="status", example="online"),
    "title": fields.String(description="title", example="Car Space 17 UNSW Car Space"),
    "unavailable_dates": fields.Date(description="unavailable dates", example="2022-07-06,2022-07-07"),
    "unavailable_from_date": fields.Date(description="unavailable from date", example="2022-07-06"),
    "unavailable_to_date": fields.Date(description="unavailable to date", example="2022-07-07"),
    "unavailable_type": fields.Integer(description="unavailable type", example=1),
    "updated_at": fields.DateTime(description="updated at", example="2022-07-31T18:37:31.448937")
})


booking_schema_with_relationships_return = api.model("booking schema with relationships return", {
    "car_space": fields.Nested(car_space_schema_with_relationships_return),
    "car_space_id": fields.Integer(description="car space id", example=20),
    "created_at": fields.DateTime(description="created at", example="2022-07-31T18:37:31.452927"),
    "customer": fields.Nested(user_schema_with_only_name_return),
    "customer_id": fields.Integer(description="customer id", example=1),
    "end_date": fields.Date(description="end date", example="2022-08-16"),
    "id": fields.Integer(description="id", example=9),
    "picked_dates": fields.String(description="picked dates",
                                  example="7/30/2022,7/31/2022,8/1/2022,8/2/2022,8/3/2022,8/4/2022,8/5/2022,"
                                              "8/6/2022,8/7/2022,8/8/2022,8/9/2022,8/10/2022,8/11/2022,8/12/2022,"
                                              "8/13/2022,8/14/2022,8/15/2022,8/16/2022,8/17/2022"),
    "price": fields.Float(description="price", example=340.0),
    "provider_id": fields.Integer(description="provider_id", example=5),
    "start_date": fields.Date(description="start_date", example="2022-07-29"),
    "status": fields.String(description="status", example="cancelled"),
    "updated_at": fields.DateTime(description="updated at", example="2022-07-31T18:37:31.452927")
})

wish_list_schema_return = api.model("wish list schema return", {
    "address": fields.String(description="address", example="UNIT 3005 28 TIMOTHY LANE MELBOURNE VIC 3000"),
    "address_id": fields.String(description="address id", example="6750686c6e4477366d564e5441467a726a38756956413d3d"),
    "car_space_types":  fields.String(description="car space types", example="Undercover,Indoor lot"),
    "created_at": fields.DateTime(description="created at", example="2022-07-31T19:18:17.650487"),
    "customer_id": fields.Integer(description="customer id", example=5),
    "distance": fields.Integer(description="distance", example=200),
    "id": fields.Integer(description="id", example=1),
    "latitude": fields.Float(description="latitude", example=-37.8121737),
    "longitude": fields.Float(description="longitude", example=144.9611457),
    "max_allowed_vehicle": fields.String(description="max allowed vehicle", example="Hatch"),
    "max_price": fields.Float(description="max_price", example=100.0),
    "min_price": fields.Float(description="min price", example=10.0),
    "price_type": fields.String(description="price type", example="week"),
    "updated_at": fields.DateTime(description="updated at", example="2022-07-31T19:18:17.650487")
})

wishlist_post_details = api.model("wishlist post details", {
    "min_price": fields.Float(description="max_price", required=True, example=10.0),
    "max_price": fields.Float(description="max_price", required=True, example=100.0),
    "price_type": fields.String(description="price type", required=True, example="week"),
    "address_id": fields.String(description="address id", required=True,
                                example="6750686c6e4477366d564e5441467a726a38756956413d3d"),
    "address": fields.String(description="address", required=True, example="UNIT 3005 28 TIMOTHY LANE MELBOURNE VIC 3000"),
    "latitude": fields.Float(description="latitude", required=True, example=-37.8121737),
    "longitude": fields.Float(description="longitude", required=True, example=144.9611457),
    "distance": fields.Integer(description="distance", required=True, example=200),
    "car_space_types":  fields.String(description="car space types", required=True, example="Undercover,Indoor lot"),
    "max_allowed_vehicle": fields.String(description="max allowed vehicle", required=True, example="Hatch")
})
