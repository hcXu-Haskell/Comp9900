from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text, \
    Boolean, TIMESTAMP, Date
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema, SQLAlchemySchema, auto_field
from sqlalchemy.orm import relationship
from app import db
from datetime import datetime
from marshmallow import fields


# Models
class Comment(db.Model):
    __tablename__ = 'comments'
    id = Column(Integer, primary_key=True)
    rating = Column(Float, nullable=False)
    content = Column(Text)
    created_at = Column(TIMESTAMP, default=datetime.now)
    updated_at = Column(TIMESTAMP, default=datetime.now, onupdate=datetime.now)
    # relationship
    user_id = Column(Integer, ForeignKey('users.id'))
    car_space_id = Column(Integer, ForeignKey('car_spaces.id'))


class Booking(db.Model):
    __tablename__ = 'bookings'
    id = Column(Integer, primary_key=True)
    price = Column(Float, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    # picked dates, comma separated string
    picked_dates = Column(Text, nullable=False)
    status = Column(String(255), default='pending', nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.now)
    updated_at = Column(TIMESTAMP, default=datetime.now, onupdate=datetime.now)

    provider_id = Column(Integer, nullable=False)
    # relationship
    customer_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    car_space_id = Column(Integer, ForeignKey('car_spaces.id'), nullable=False)
    car_space_snapshot = Column(Text, nullable=False)  # car space snapshot


class CarSpace(db.Model):
    __tablename__ = 'car_spaces'
    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    bond = Column(Float, nullable=False)
    status = Column(String(7), default='online', nullable=False)

    # image, base64
    image = Column(Text)

    # size
    size_length = Column(Float, nullable=False)
    size_width = Column(Float, nullable=False)
    max_height = Column(Float)

    # attributes
    # comma separated string e.g. Hatchback,Sedan,Van
    max_allowed_vehicle = Column(String(20), nullable=False)
    # [open, undercover, garage, basement] enum enforced by frontend
    car_space_type = Column(String(20), nullable=False)
    # comma separated string, many amenities
    amenities = Column(Text)
    # [none, card, key, password ...] enum enforced by frontend
    access_type = Column(String(20), nullable=False)

    # price
    price_per_day = Column(Float, nullable=False)
    price_per_week = Column(Float, nullable=False)
    price_per_month = Column(Float, nullable=False)

    # address, will receive from frontend
    address_id = Column(String(255), nullable=False)
    address = Column(String(255), nullable=False)
    latitude = Column(Float(precision="12,7"), nullable=False)
    longitude = Column(Float(precision="12,7"), nullable=False)

    # functional fields
    unavailable_type = Column(Integer, nullable=False)  # range 0, picker 1
    # comma separated Javascript ISO string
    unavailable_dates = Column(Text)
    unavailable_from_date = Column(Date)
    unavailable_to_date = Column(Date)
    available_type = Column(Integer, nullable=False)
    available_from_time = Column(TIMESTAMP)  # customer av == > date, else null
    available_to_time = Column(TIMESTAMP)
    available_from_date = Column(Date)
    available_to_date = Column(Date)
    # comma separated string, int[], 0-6, Sun - Sat
    available_week_days = Column(String(20))

    # supplementary doc
    description = Column(Text)
    instructions = Column(Text)

    # relationships
    provider_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    bookings = relationship(
        'Booking', backref='car_space', lazy=True, cascade="all, delete")
    comments = relationship('Comment', backref='car_space',
                            lazy=True, cascade="all, delete")

    created_at = Column(TIMESTAMP, default=datetime.now)
    updated_at = Column(TIMESTAMP, default=datetime.now, onupdate=datetime.now)


class Vehicle(db.Model):
    __tablename__ = 'vehicles'
    id = Column(Integer, primary_key=True)
    plate = Column(String(20), unique=True, nullable=False)
    vehicle_type = Column(String(20), nullable=False)
    state = Column(String(20), nullable=False)
    # relationship
    customer_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    created_at = Column(TIMESTAMP, default=datetime.now)
    updated_at = Column(TIMESTAMP, default=datetime.now, onupdate=datetime.now)


class Wishlist(db.Model):
    __tablename__ = 'wishlist'
    id = Column(Integer, primary_key=True)
    min_price = Column(Float, nullable=False)
    max_price = Column(Float, nullable=False)
    price_type = Column(String(8), nullable=False)  # month/week/day
    address_id = Column(String(255), nullable=False)
    address = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    distance = Column(Integer, nullable=False)
    car_space_types = Column(String(255), nullable=False)
    max_allowed_vehicle = Column(String(20), nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.now)
    updated_at = Column(TIMESTAMP, default=datetime.now, onupdate=datetime.now)
    # relationship
    customer_id = Column(Integer, ForeignKey('users.id'), nullable=False)


class User(db.Model):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String(64), nullable=False)
    email = Column(String(64), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    bank_account_name = Column(String(64))
    bank_account_number = Column(String(32))
    bank_account_bsb = Column(String(32))

    # recommendations
    nearby_parking = Column(Boolean, default=False)
    rental_history = Column(Boolean, default=False)
    # subscriptions
    competitive = Column(Boolean, default=False)
    # discount
    discount_rate = Column(Float)

    created_at = Column(TIMESTAMP, default=datetime.now)
    updated_at = Column(TIMESTAMP, default=datetime.now, onupdate=datetime.now)

    liked_car_spaces = Column(Text)
    disliked_car_spaces = Column(Text)
    first_timer = Column(Boolean, nullable=False, default=True)
    # relationship
    car_spaces = relationship(
        'CarSpace', backref='provider', lazy=True, cascade="all, delete")
    vehicles = relationship('Vehicle', backref='customer',
                            lazy=True, cascade="all, delete")
    bookings = relationship('Booking', backref='customer',
                            lazy=True, cascade="all, delete")
    comments = relationship('Comment', backref='customer',
                            lazy=True, cascade="all, delete")
    wishlist = relationship('Wishlist', backref='customer',
                            lazy=True, cascade="all, delete")


class Admin(db.Model):
    __tablename__ = 'admins'
    id = Column(Integer, primary_key=True)
    email = Column(String(64), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.now)
    updated_at = Column(TIMESTAMP, default=datetime.now, onupdate=datetime.now)


class WishlistSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Wishlist
        include_fk = True
        load_instance = True


class AdminSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Admin
        include_fk = True
        load_instance = True


class CarSpaceSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = CarSpace
        include_fk = True
        load_instance = True


class VehicleSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Vehicle
        include_fk = True
        load_instance = True


class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        include_fk = True
        load_instance = True


class UserSchemaWithOnlyName(SQLAlchemySchema):
    class Meta:
        model = User
        load_instance = True

    name = auto_field()
    discount_rate = auto_field()


class BookingSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Booking
        include_fk = True
        load_instance = True


class CommentSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Comment
        include_fk = True
        include_relationship = True
        load_instance = True

    customer = fields.Nested(UserSchemaWithOnlyName())


class UserSchemaWithRelationships(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        include_fk = True
        load_instance = True

    comments = fields.List(fields.Nested(CommentSchema()))
    vehicles = fields.List(fields.Nested(VehicleSchema()))
    wishlist = fields.List(fields.Nested(WishlistSchema()))
    bookings = fields.List(fields.Nested(BookingSchema()))
    car_spaces = fields.List(fields.Nested(CarSpaceSchema()))


class BookingSchemaSecure(SQLAlchemySchema):
    class Meta:
        model = Booking
        load_instance = True
    id = auto_field()
    picked_dates = auto_field()


class CarSpaceSchemaWithRelationships(SQLAlchemyAutoSchema):
    class Meta:
        model = CarSpace
        include_fk = True
        load_instance = True

    comments = fields.List(fields.Nested(CommentSchema()))
    bookings = fields.List(fields.Nested(BookingSchema()))
    provider = fields.Nested(UserSchemaWithOnlyName())
    bookings_to_same_car_space = fields.List(
        fields.Nested(BookingSchemaSecure()))


class BookingSchemaWithRelationships(SQLAlchemyAutoSchema):
    class Meta:
        model = Booking
        include_fk = True
        load_instance = True
    customer = fields.Nested(UserSchemaWithOnlyName())
    provider = fields.Nested(UserSchemaWithOnlyName())
    bookings_to_same_car_space = fields.List(
        fields.Nested(BookingSchemaSecure()))


class CarSpaceSchemaForList(SQLAlchemySchema):
    class Meta:
        model = CarSpace
        load_instance = True

    id = auto_field()
    title = auto_field()
    image = auto_field()
    price_per_day = auto_field()
    price_per_week = auto_field()
    price_per_month = auto_field()
    address_id = auto_field()
    address = auto_field()
    latitude = auto_field()
    longitude = auto_field()
    amenities = auto_field()
    car_space_type = auto_field()
    status = auto_field()
    distance = fields.Float()
    no_booking_past_six_months = fields.Boolean()
    booking_count = fields.Integer()
    provider = fields.Nested(UserSchemaWithOnlyName())


class CarSpaceSnapShotSchema(SQLAlchemySchema):
    class Meta:
        model = CarSpace
        load_instance = True

    id = auto_field()
    title = auto_field()
    image = auto_field()
    price_per_day = auto_field()
    price_per_week = auto_field()
    price_per_month = auto_field()
    bond = auto_field()
    access_type = auto_field()
    address_id = auto_field()
    address = auto_field()
    latitude = auto_field()
    longitude = auto_field()
    amenities = auto_field()
    car_space_type = auto_field()
    max_allowed_vehicle = auto_field()
    description = auto_field()
    instructions = auto_field()
    size_length = auto_field()
    size_width = auto_field()
    max_height = auto_field()
    created_at = auto_field()
    updated_at = auto_field()
    available_type = auto_field()
    available_from_date = auto_field()
    available_to_date = auto_field()
    available_from_time = auto_field()
    available_to_time = auto_field()
    available_week_days = auto_field()
    unavailable_type = auto_field()
    unavailable_from_date = auto_field()
    unavailable_to_date = auto_field()
    unavailable_dates = auto_field()
    provider = fields.Nested(UserSchemaWithOnlyName())
