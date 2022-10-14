from flask_restx import Resource
from sqlalchemy.exc import NoResultFound
from utils.globals import unpack, authorize, catch_errors, wish_list_sender, \
    competitive_notification, recommendation, email_interval_sending
from utils.api_models import *
from models import CarSpace as CarSpaceModel, Booking as BookingModel, \
    Admin as AdminModel, CarSpaceSchemaForList, Comment as CommentModel, \
    User as UserModel
from app import session
from utils.request_handling import *
from flask import jsonify, request
from dateutil import parser
import threading

car_space = api.namespace('car-spaces', description='Car Space Management')


@car_space.route('')
class CarSpaces(Resource):
    @car_space.expect(auth_details)
    @car_space.param(name='ids', description='A list of car space id',
                     example='1,2,3,4,5')
    @car_space.doc(description="Get a list of car spaces")
    @car_space.response(200, "Success", [car_space_schema_for_list_return])
    @catch_errors
    def get(self):
        user = authorize(request)
        id_list = get_request_arg('ids', str)
        if id_list:
            id_list = id_list.split(',')
            car_spaces = CarSpaceModel.query.filter(
                CarSpaceModel.id.in_([cs_id for cs_id in id_list])).all()
        else:
            car_spaces = CarSpaceModel.query.filter_by(
                provider_id=user.id).all()
            for cs in car_spaces:
                booking_count = BookingModel.query.filter_by(
                    car_space_id=cs.id).count()
                setattr(cs, 'booking_count', booking_count)
                # as we only have mock data, the condition of no booking past
                # six months is relaxed to be no booking at all
                setattr(cs, 'no_booking_past_six_months', booking_count == 0)
        return jsonify(CarSpaceSchemaForList(many=True).dump(car_spaces))

    @car_space.expect(auth_details, car_spaces_details)
    @car_space.doc(description='Register a new car space')
    @car_space.response(200, 'Success')
    @catch_errors
    def post(self):
        user = authorize(request)

        j = get_request_json()
        (title, bond, image, size_length, size_width, max_height, max_allowed_vehicle, car_space_type, amenities,
         access_type, price_per_day, price_per_week, price_per_month, address_id, address, latitude,
         longitude, unavailable_type, unavailable_dates, unavailable_from_date, unavailable_to_date, available_type,
         available_from_time, available_to_time, available_from_date, available_to_date, available_week_days,
         description, instructions) = unpack(j, 'title', 'bond', 'image', 'size_length', 'size_width', 'max_height',
                                             'max_allowed_vehicle', 'car_space_type', 'amenities', 'access_type',
                                             'price_per_day', 'price_per_week', 'price_per_month',
                                             'address_id', 'address', 'latitude', 'longitude', 'unavailable_type',
                                             'unavailable_dates', 'unavailable_from_date', 'unavailable_to_date',
                                             'available_type', 'available_from_time', 'available_to_time',
                                             'available_from_date', 'available_to_date', 'available_week_days',
                                             'description', 'instructions', required=False)
        new_cs = CarSpaceModel(title=title,
                               bond=bond,
                               image=image,
                               size_length=size_length,
                               size_width=size_width,
                               max_height=max_height,
                               max_allowed_vehicle=max_allowed_vehicle,
                               car_space_type=car_space_type,
                               amenities=amenities,
                               access_type=access_type,
                               provider_id=user.id,
                               price_per_day=price_per_day,
                               price_per_week=price_per_week,
                               price_per_month=price_per_month,
                               address_id=address_id,
                               address=address,
                               latitude=latitude,
                               longitude=longitude,
                               unavailable_type=unavailable_type,
                               # empty string when None
                               unavailable_dates=unavailable_dates if unavailable_dates else None,
                               unavailable_from_date=parser.parse(
                                   unavailable_from_date) if unavailable_from_date else None,
                               unavailable_to_date=parser.parse(
                                   unavailable_to_date) if unavailable_to_date else None,
                               available_type=available_type,
                               available_from_time=parser.isoparse(
                                   available_from_time) if available_from_time else None,
                               available_to_time=parser.isoparse(
                                   available_to_time) if available_to_time else None,
                               available_from_date=parser.parse(
                                   available_from_date) if available_from_date else None,
                               available_to_date=parser.parse(
                                   available_to_date) if available_to_date else None,
                               # possibly pass-in empty string
                               available_week_days=available_week_days if available_week_days else None,
                               description=description,
                               instructions=instructions)
        session.add(new_cs)
        session.commit()
        email_dict = {'Where2Park Wish List Notification': wish_list_sender(new_cs),
                      'Where2Park Lower Price Notification': competitive_notification(new_cs),
                      'Where2Park Recommendation Notification': recommendation(new_cs)}
        t = threading.Thread(target=email_interval_sending, args=(email_dict,))
        t.start()
        return jsonify({"new_car_space_id": new_cs.id})


@car_space.route('/<cs_id>')
class CarSpace(Resource):
    @car_space.expect(auth_details, car_spaces_details)
    @car_space.doc(description='Update a particular car space details by id')
    @car_space.response(200, "Success")
    @car_space.response(400, "Car space not found")
    @car_space.response(403, 'Invalid User Request')
    @catch_errors
    def put(self, cs_id):
        user = authorize(request)
        j = get_request_json()
        one_cs = CarSpaceModel.query.get(cs_id)

        if not one_cs:
            abort(400, "Car space not found")
        if one_cs.provider_id != user.id and not isinstance(user, AdminModel):
            abort(403, 'Invalid User Request')

        (title, bond, image, size_length, size_width, max_height, max_allowed_vehicle, car_space_type, amenities,
         access_type, price_per_day, price_per_week, price_per_month, unavailable_type, unavailable_dates,
         unavailable_from_date, unavailable_to_date, available_type, available_from_time, available_to_time,
         available_from_date, available_to_date, available_week_days, description, instructions) = \
            unpack(j, 'title', 'bond', 'image', 'size_length', 'size_width', 'max_height',
                   'max_allowed_vehicle', 'car_space_type', 'amenities', 'access_type',
                   'price_per_day', 'price_per_week', 'price_per_month',
                   'unavailable_type', 'unavailable_dates', 'unavailable_from_date',
                   'unavailable_to_date', 'available_type', 'available_from_time',
                   'available_to_time', 'available_from_date', 'available_to_date',
                   'available_week_days', 'description', 'instructions', required=False)

        count = CarSpaceModel.query.filter_by(id=cs_id).update(
            {'title': title,
             'bond': bond,
             'image': image,
             'size_length': size_length,
             'size_width': size_width,
             'max_height': max_height,
             'max_allowed_vehicle': max_allowed_vehicle,
             'car_space_type': car_space_type,
             'amenities': amenities,
             'access_type': access_type,
             'price_per_day': price_per_day,
             'price_per_week': price_per_week,
             'price_per_month': price_per_month,
             'unavailable_type': unavailable_type,
             'unavailable_dates': unavailable_dates
             if unavailable_dates else None,
             'unavailable_from_date': parser.parse(unavailable_from_date)
             if unavailable_from_date else None,
             'unavailable_to_date': parser.parse(unavailable_to_date)
             if unavailable_to_date else None,
             'available_type': available_type,
             'available_from_time': parser.isoparse(available_from_time)
             if available_from_time else None,
             'available_to_time': parser.isoparse(available_to_time)
             if available_to_time else None,
             'available_from_date': parser.parse(available_from_date)
             if available_from_date else None,
             'available_to_date': parser.parse(available_to_date)
             if available_to_date else None,
             'available_week_days': available_week_days
             if available_week_days else None,
             'description': description,
             'instructions': instructions
             }, synchronize_session=False)
        session.commit()
        return jsonify({"updated": count})


@car_space.route('/<cs_id>/unpublish')
class CarSpace(Resource):
    @car_space.expect(auth_details)
    @car_space.doc(description='Unpublish particular car space by id')
    @car_space.response(200, 'Success')
    @car_space.response(400, 'Car Space Not Found')
    @car_space.response(403, 'Invalid User Request')
    @catch_errors
    def put(self, cs_id):
        user = authorize(request)
        cs = CarSpaceModel.query.get(int(cs_id))
        if not cs:
            abort(400, 'Car Space Not Found')
        if cs.provider_id != user.id and not isinstance(user, AdminModel):
            abort(403, 'Invalid User Request')
        count = CarSpaceModel.query.filter_by(id=cs_id).update(
            {'status': 'offline'}, synchronize_session=False)

        session.commit()

        return jsonify({'updated': count})


@car_space.route('/<cs_id>/publish')
class CarSpace(Resource):
    @car_space.expect(auth_details)
    @car_space.doc(description='publish particular car space by id')
    @car_space.response(200, 'Success')
    @car_space.response(400, 'Car Space Not Found')
    @car_space.response(403, 'Invalid User Request')
    @catch_errors
    def put(self, cs_id):
        user = authorize(request)
        cs = CarSpaceModel.query.get(int(cs_id))
        if not cs:
            abort(400, 'Car Space Not Found')
        if cs.provider_id != user.id and not isinstance(user, AdminModel):
            abort(403, 'Invalid User Request')
        count = CarSpaceModel.query.filter_by(id=cs_id).update(
            {'status': 'online'}, synchronize_session=False)

        session.commit()

        return jsonify({'updated': count})


@car_space.route('/<cs_id>/comment')
class Comment(Resource):
    @car_space.expect(auth_details, new_comment_details)
    @car_space.doc(description='Post a comment by a user to a car space')
    def post(self, cs_id):
        user = authorize(request)
        j = get_request_json()
        [rating, content] = unpack(j, 'rating', 'content')

        comment = CommentModel(
            rating=rating, content=content, user_id=user.id, car_space_id=cs_id)

        session.add(comment)
        session.commit()
        return jsonify({'message': 'success'})


@car_space.route('/<cs_id>/like')
class LikeCarSpace(Resource):
    @car_space.expect(auth_details)
    @car_space.doc(description='Like particular car space by id')
    @car_space.response(200, 'Success')
    @car_space.response(400, 'User Not Found')
    @catch_errors
    def put(self, cs_id):
        user = authorize(request)

        try:
            one_user = UserModel.query.filter_by(email=user.email).one()
            like_list = one_user.liked_car_spaces.split(
                ',') if one_user.liked_car_spaces else []
            dislike_list = one_user.disliked_car_spaces.split(
                ',') if one_user.disliked_car_spaces else []
            if cs_id in like_list:
                return jsonify({'updated': 0})
            if cs_id in dislike_list:
                dislike_list.remove(cs_id)
                UserModel.query.filter_by(email=user.email).update({'disliked_car_spaces': ','.join(dislike_list) if dislike_list else None},
                                                                   synchronize_session=False)
            like_list.append(cs_id)
            count = UserModel.query.filter_by(email=user.email).update({'liked_car_spaces': ','.join(like_list)},
                                                                       synchronize_session=False)

            session.commit()
            return jsonify({'updated': count})
        except NoResultFound:
            abort(400, 'User Not Found')


@car_space.route('/<cs_id>/cancel-like')
class CancelLikeCarSpace(Resource):
    @car_space.expect(auth_details)
    @car_space.doc(description='Cancel like particular car space by id')
    @car_space.response(200, 'Success')
    @car_space.response(400, 'User Not Found')
    @car_space.response(403, 'Car space is not in like list')
    @catch_errors
    def put(self, cs_id):
        user = authorize(request)

        try:
            one_user = UserModel.query.filter_by(email=user.email).one()
            like_list = one_user.liked_car_spaces.split(
                ',') if one_user.liked_car_spaces else []
            if cs_id not in like_list:
                abort(403, 'Car space {} is not in like list'.format(cs_id))
            like_list.remove(cs_id)
            count = UserModel.query.filter_by(email=user.email).update({'liked_car_spaces': ','.join(like_list) if like_list else None},
                                                                       synchronize_session=False)

            session.commit()
            return jsonify({'updated': count})
        except NoResultFound:
            abort(400, 'User Not Found')


@car_space.route('/<cs_id>/dislike')
class DisLikeCarSpace(Resource):
    @car_space.expect(auth_details)
    @car_space.doc(description='Dislike particular car space by id')
    @car_space.response(200, 'Success')
    @car_space.response(400, 'User Not Found')
    @catch_errors
    def put(self, cs_id):
        user = authorize(request)

        try:
            one_user = UserModel.query.filter_by(email=user.email).one()
            like_list = one_user.liked_car_spaces.split(
                ',') if one_user.liked_car_spaces else []
            dislike_list = one_user.disliked_car_spaces.split(
                ',') if one_user.disliked_car_spaces else []
            if cs_id in dislike_list:
                return jsonify({'updated': 0})
            if cs_id in like_list:
                like_list.remove(cs_id)
                UserModel.query.filter_by(email=user.email).update({'liked_car_spaces': ','.join(like_list) if like_list else None},
                                                                   synchronize_session=False)

            dislike_list.append(cs_id)
            count = UserModel.query.filter_by(email=user.email).update({'disliked_car_spaces': ','.join(dislike_list)},
                                                                       synchronize_session=False)
            session.commit()
            return jsonify({'updated': count})
        except NoResultFound:
            abort(400, 'User Not Found')


@car_space.route('/<cs_id>/cancel-dislike')
class CancelDislikeCarSpace(Resource):
    @car_space.expect(auth_details)
    @car_space.doc(description='Cancel dislike particular car space by id')
    @car_space.response(200, 'Success')
    @car_space.response(400, 'User Not Found')
    @car_space.response(403, 'Car space is not in dislike list')
    @catch_errors
    def put(self, cs_id):
        user = authorize(request)

        try:
            one_user = UserModel.query.filter_by(email=user.email).one()
            dislike_list = one_user.disliked_car_spaces.split(
                ',') if one_user.disliked_car_spaces else []
            if cs_id not in dislike_list:
                abort(403, 'Car space {} is not in dislike list'.format(cs_id))
            dislike_list.remove(cs_id)
            count = UserModel.query.filter_by(email=user.email).update({'disliked_car_spaces': ','.join(dislike_list) if dislike_list else None},
                                                                       synchronize_session=False)
            session.commit()
            return jsonify({'updated': count})
        except NoResultFound:
            abort(400, 'User Not Found')
