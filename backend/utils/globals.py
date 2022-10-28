from sqlalchemy.exc import NoResultFound
from werkzeug.exceptions import HTTPException
from app import session
from flask_restx import abort
import jwt
from models import User as UserModel, Booking as BookingModel, Admin as AdminModel,\
    Wishlist as WishlistModel, CarSpace as CarSpaceModel
import time
import random
import string
from sklearn.cluster import DBSCAN

import smtplib
from email.header import Header
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from utils.email_template import *

from geopy.distance import distance as geopy_distance

# for jwt encode/decode
JWT_SECRET = 'iJIUzI1NiJ9W5AZ21haWwuY29tIn'

# verification code dict with email as key, code as value
verification_code = {}

# competitive notification, nearby distance threshold
MAX_DISTANCE = 1

# size for vehicles
VEHICLE_SIZE_DICT = {'Bike': 0,
                     'Hatch': 1,
                     'Sedan': 2,
                     'Wagon': 3,
                     'SUV/4WD': 4,
                     'Ute': 5,
                     'People Mover': 6,
                     'Commercial': 7}

SERVICE_FEE_RATE = 0.15


def unpack(j, *args, **kargs):
    if kargs.get("required", True):
        not_found = [arg for arg in args if arg not in j]
        if not_found:
            expected = ", ".join(map(str, not_found))
            abort(kargs.get("error", 400),
                  "Expected request object to contain: " + expected)
    return [j.get(arg, None) for arg in args]


def authorize(r, isAdmin=False):
    t = r.headers.get('Authorization')
    if not t:
        abort(403, 'Authorization Token is not supplied')
    try:
        t = t.split(" ")[1]
    except (Exception,):
        abort(400, "Authorization token must start with 'Bearer'")

    try:
        person = jwt.decode(t, JWT_SECRET, algorithms=['HS256'])
        if isAdmin:
            return AdminModel.query.filter_by(email=person['email']).one()
        return UserModel.query.filter_by(email=person['email']).one()
    except (NoResultFound, jwt.exceptions.InvalidSignatureError):
        abort(403, 'Invalid authorization token, please log in')


def catch_errors(func):
    def wrapper(*args, **kargs):
        try:
            return func(*args, **kargs)
        except HTTPException as e:
            raise e
        except (Exception,) as e:
            abort(500, 'System Error: {}'.format(e))

    return wrapper


def payment_check(bk_id):
    print(f"Booking {bk_id} payment check starts")

    time.sleep(15 * 60)
    one_bk = BookingModel.query.get(bk_id)

    if one_bk.status == 'pending':
        BookingModel.query.filter_by(id=bk_id).update(
            {'status': 'cancelled'}, synchronize_session=False)
        session.commit()

        print(f"Booking {bk_id} is cancelled.")
    elif one_bk.status == 'cancelled':
        print(f"Booking {bk_id} is cancelled by the customer.")
    else:
        print(f"Booking {bk_id} is paid.")


def generate_verification_code():
    character = string.ascii_letters + string.digits
    code = ''.join(random.SystemRandom().choice(character) for i in range(6))
    return code


def delete_verification_code(email):
    print(f'user {email} verification code countdown begins')

    global verification_code
    time.sleep(5 * 60)
    del verification_code[email]

    print(f'user {email} verification code has been deleted')


def email_sender(title, name, content, email):
    print("send email to {}: {} about {}".format(name, email, title))

    host = 'smtp.gmail.com'
    port = 587
    username = 'yourownemail@pls.com'
    password = 'yourownpassword'

    message = MIMEMultipart()

    sender = 'yourownemail@pls.com'
    message['From'] = sender
    message['To'] = email
    message['Subject'] = Header(title, 'utf-8')
    email_content = MIMEText(content, _subtype='html', _charset='utf-8')
    message.attach(email_content)

    try:
        smtpObj = smtplib.SMTP(host, port)
        smtpObj.ehlo()
        smtpObj.starttls()
        smtpObj.ehlo()
        smtpObj.login(username, password)

        smtpObj.sendmail(sender, email, message.as_string())

        smtpObj.quit()
    except smtplib.SMTPAuthenticationError:
        print("Because the mail is judged to be spam by the mailbox system, the mailbox is blocked")


def wish_list_sender(new_cs):
    email_list = []
    all_wl = WishlistModel.query.all()
    for wl in all_wl:

        is_day_price_in_range = (wl.price_type == 'Day') and (
            wl.min_price <= new_cs.price_per_day <= wl.max_price)
        is_week_price_in_range = (wl.price_type == 'Week') and (
            wl.min_price <= new_cs.price_per_week <= wl.max_price)
        is_month_price_in_range = (wl.price_type == 'Month') and (
            wl.min_price <= new_cs.price_per_month <= wl.max_price)
        is_car_space_type_in_range = new_cs.car_space_type in wl.car_space_types.split(
            ',')
        is_max_allowed_vehicle_in_range = VEHICLE_SIZE_DICT[
            new_cs.max_allowed_vehicle] >= VEHICLE_SIZE_DICT[wl.max_allowed_vehicle]
        is_distance_in_range = (geopy_distance((new_cs.latitude, new_cs.longitude), (wl.latitude, wl.longitude)).km
                                <= wl.distance)

        if is_car_space_type_in_range \
                and is_max_allowed_vehicle_in_range \
                and is_distance_in_range \
                and (is_day_price_in_range or is_week_price_in_range or is_month_price_in_range) \
                and new_cs.provider_id != wl.customer_id:
            user = UserModel.query.get(wl.customer_id)

            # username,new carspace link, new carspace title, new carspace address,
            # wishlist min price, wishlist max price, wishlist location(address)
            # wishlist car space type, wishlist max allowed vehicle, username
            content = construct_email(wish_list_notification_email,
                                      user.name,
                                      'http://localhost:3000/car-space-detail/{}'.format(
                                          new_cs.id),
                                      new_cs.title,
                                      new_cs.address,
                                      wl.min_price,
                                      wl.max_price,
                                      wl.address,
                                      wl.car_space_types,
                                      wl.max_allowed_vehicle,
                                      )
            email_list.append([user.name, content, user.email])
    return email_list


def competitive_notification(new_cs):
    email_list = []
    competitive_users = UserModel.query.filter(
        UserModel.id != new_cs.provider_id, UserModel.competitive == True).all()
    for user in competitive_users:
        cs_list = []
        all_cs = CarSpaceModel.query.filter(
            CarSpaceModel.provider_id == user.id, CarSpaceModel.status == 'online').all()
        for cs in all_cs:

            is_day_price_in_range = cs.price_per_day >= new_cs.price_per_day
            is_week_price_in_range = cs.price_per_week >= new_cs.price_per_week
            is_month_price_in_range = cs.price_per_month >= new_cs.price_per_month
            is_distance_in_range = (geopy_distance((new_cs.latitude, new_cs.longitude), (cs.latitude, cs.longitude)).km
                                    <= MAX_DISTANCE)

            if is_day_price_in_range \
                    and is_week_price_in_range \
                    and is_month_price_in_range \
                    and is_distance_in_range \
                    and new_cs.max_allowed_vehicle == cs.max_allowed_vehicle \
                    and cs.car_space_type == new_cs.car_space_type:
                cs_list.append(cs)
        if cs_list:
            user_car_space_notification_list = ""
            for cs in cs_list:
                # A car space id, A car space title
                user_car_space_notification_list += car_space_hyperlink.format(
                    cs.id, cs.title)

            # The higher price car space is A.
            # The lower price car space is B.
            # A username, B carspace id, B carspace title, B carspace address, A carspace list, A username
            content = construct_email(competitive_car_space_notification_email,
                                      user.name,
                                      new_cs.id,
                                      new_cs.title,
                                      new_cs.address,
                                      user_car_space_notification_list,
                                      )
            email_list.append([user.name, content, user.email])
    return email_list


def recommendation(new_cs):
    email_list = []
    rental_history_users = UserModel.query.filter(
        UserModel.id != new_cs.provider_id, UserModel.rental_history == True).all()
    for user in rental_history_users:
        all_bk = BookingModel.query.filter_by(
            customer_id=user.id, status='paid').all()

        if all_bk:
            coordinates_list = []
            car_space_type_list = []
            max_allowed_vehicle_size = 0

            min_price_per_day = float('inf')
            max_price_per_day = -1

            min_price_per_week = float('inf')
            max_price_per_week = -1

            min_price_per_month = float('inf')
            max_price_per_month = -1

            for bk in all_bk:
                cs = CarSpaceModel.query.get(bk.car_space_id)
                # get the max allowed vehicle from all bookings
                max_allowed_vehicle_size = max(
                    max_allowed_vehicle_size, VEHICLE_SIZE_DICT[cs.max_allowed_vehicle])
                coordinates_list.append([cs.latitude, cs.longitude])
                car_space_type_list.append(cs.car_space_type)

                min_price_per_day = min(min_price_per_day, cs.price_per_day)
                max_price_per_day = max(max_price_per_day, cs.price_per_day)

                min_price_per_week = min(min_price_per_week, cs.price_per_week)
                max_price_per_week = max(max_price_per_week, cs.price_per_week)

                min_price_per_month = min(
                    min_price_per_month, cs.price_per_month)
                max_price_per_month = max(
                    max_price_per_month, cs.price_per_month)

            is_price_in_range = min_price_per_day <= new_cs.price_per_day <= max_price_per_day \
                or min_price_per_week <= new_cs.price_per_week <= max_price_per_week \
                or min_price_per_month <= new_cs.price_per_month <= max_price_per_month

            is_car_space_type_in_range = new_cs.car_space_type in car_space_type_list

            # max allowed vehicle of new car space must not be smaller than one
            # got from bookings
            is_vehicle_in_range = VEHICLE_SIZE_DICT[new_cs.max_allowed_vehicle] >= max_allowed_vehicle_size

            if is_car_space_type_in_range \
                    and is_price_in_range \
                    and is_vehicle_in_range:

                # append the new car space location to bookings location
                coordinates_list.append([new_cs.latitude, new_cs.longitude])

                # clustering the locations into categories
                target = DBSCAN(eps=0.01, min_samples=1).fit_predict(
                    coordinates_list)

                # target is a list of location categories
                # when locations are in the same category, the numbers assigned
                # in the target are the same
                target = [str(t) for t in target]

                # if new car space location belongs to a category with other
                # locations other than itself, the car space is worth recommending
                # to the customer
                if target.count(target[-1]) > 1:
                    # username,new carspace link, new carspace title, new carspace address,
                    # price per day, week, month, car space type, max allowed vehicle, amenities,
                    # username
                    content = construct_email(car_space_recommendation_email,
                                              user.name,
                                              'http://localhost:3000/car-space-detail/{}'.format(
                                                  new_cs.id),
                                              new_cs.title,
                                              new_cs.address,
                                              new_cs.price_per_day,
                                              new_cs.price_per_week,
                                              new_cs.price_per_month,
                                              new_cs.car_space_type,
                                              new_cs.max_allowed_vehicle,
                                              new_cs.amenities,
                                              )

                    email_list.append([user.name, content, user.email])

    return email_list


def email_interval_sending(email_dict):
    for title in email_dict.keys():
        if email_dict[title]:
            for e in email_dict[title]:
                email_sender(title, e[0], e[1], e[2])
                time.sleep(10)
