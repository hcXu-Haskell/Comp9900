from flask_restx import Resource
from flask import jsonify, request
from app import session
from utils.globals import unpack, authorize, catch_errors
from utils.api_models import *
from utils.request_handling import *
from models import Vehicle as VehicleModel, VehicleSchema, Admin as AdminModel

vehicle = api.namespace("vehicles", description="User Vehicle Management")


@vehicle.route('')
class Vehicles(Resource):
    @vehicle.expect(auth_details)
    @vehicle.doc(description='Get a list of vehicles by user id')
    @catch_errors
    def get(self):
        # check token
        one_user = authorize(request)

        vehicles = VehicleModel.query.filter_by(customer_id=one_user.id).all()

        # serialize
        return jsonify(VehicleSchema(many=True).dump(vehicles))

    @vehicle.expect(auth_details, new_vehicle_post)
    @vehicle.doc(description='Register a car')
    @catch_errors
    def post(self):
        one_user = authorize(request)
        j = get_request_json()
        [plate, vehicle_type, state] = unpack(
            j, 'plate', 'vehicle_type', 'state')
        current_car = VehicleModel.query.filter_by(plate=plate).first()
        if current_car:
            abort(409, 'Car with same plate is registered')
        one_car = VehicleModel(
            plate=plate, vehicle_type=vehicle_type, state=state, customer_id=one_user.id)
        session.add(one_car)
        session.commit()
        return jsonify({"message": "success"})


@vehicle.route('/<v_id>')
class Vehicle(Resource):
    @vehicle.expect(auth_details)
    @vehicle.doc(description="Delete vehicle by id")
    @vehicle.response(200, 'Success')
    @vehicle.response(400, 'Vehicle Not Found')
    @vehicle.response(403, 'Invalid User Request')
    @catch_errors
    def delete(self, v_id):
        user = authorize(request)
        v = VehicleModel.query.get(int(v_id))
        if not v:
            abort(400, "Vehicle Not Found")
        if v.customer_id != user.id and not isinstance(user, AdminModel):
            abort(403, "Invalid User Request")
        count = VehicleModel.query.filter_by(
            id=v_id).delete(synchronize_session=False)
        session.commit()
        return jsonify({'deleted': count})
