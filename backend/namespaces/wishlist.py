from flask_restx import Resource
from flask import jsonify, request
from app import session
from utils.globals import unpack, authorize, catch_errors
from utils.api_models import *
from utils.request_handling import *
from models import Wishlist as WishlistModel, WishlistSchema, Admin as AdminModel


wishlist = api.namespace('wishlist', description='User Wishlist Service')


@wishlist.route('')
class Wishlists(Resource):
    @wishlist.expect(auth_details)
    @wishlist.doc(description="Get current user's wishlist")
    @wishlist.response(200, 'Success', [wish_list_schema_return])
    @catch_errors
    def get(self):
        user = authorize(request)
        wls = WishlistModel.query.filter_by(customer_id=user.id).all()
        return jsonify(WishlistSchema(many=True).dump(wls))

    @wishlist.expect(auth_details, wishlist_post_details)
    @wishlist.doc(description="Get current user's wishlist")
    @wishlist.response(200, 'Success')
    @catch_errors
    def post(self):
        one_user = authorize(request)
        j = get_request_json()
        [min_price, max_price, price_type, address_id, address, latitude,
            longitude, distance, car_space_types, max_allowed_vehicle] = unpack(
            j, "min_price", "max_price", "price_type", "address_id", "address",
            "latitude", "longitude", "distance", "car_space_types",
            "max_allowed_vehicle")
        wl = WishlistModel(
            min_price=min_price,
            max_price=max_price,
            price_type=price_type,
            address_id=address_id,
            address=address,
            latitude=latitude,
            longitude=longitude,
            distance=distance,
            car_space_types=car_space_types,
            max_allowed_vehicle=max_allowed_vehicle,
            customer_id=one_user.id
        )
        session.add(wl)
        session.commit()
        return jsonify({"message": "success"})


@wishlist.route('/<wl_id>')
class Wishlist(Resource):
    @wishlist.expect(auth_details)
    @wishlist.doc(description="Delete a particular wishlist item by id")
    @wishlist.response(200, 'Success')
    @catch_errors
    def delete(self, wl_id):
        user = authorize(request)
        v = WishlistModel.query.get(wl_id)
        if not v:
            abort(400, "Wishlist Not Found")
        if v.customer_id != user.id and not isinstance(user, AdminModel):
            abort(403, "Invalid User Request")
        count = WishlistModel.query.filter_by(
            id=wl_id).delete(synchronize_session=False)
        session.commit()
        return jsonify({'deleted': count})
