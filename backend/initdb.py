from app import db
from models import User, Booking, CarSpace, Comment, Admin, Wishlist
from datetime import datetime

# mock data to initialize database and to populate the application

# 1 admin - where2park@gmail.com, password: Comp9900!!
# 5 users - 5 members of the team
# 22 car spaces

# value: Comp9900!!
HASHED_PASSWORD = "$2a$10$CwTycUXWue0Thq9StjUM0u6qD0wQ2/DxLWifqwdVpqa2XpQ4lKuFm"


def initdb():
    db.drop_all()
    db.create_all()
    one_user = User.query.first()
    if not one_user:
        print("======= Initialize database =======")
        admin1 = Admin(email="where2park@gmail.com", password=HASHED_PASSWORD)

        db.session.add(admin1)

        user1 = User(
            name="qinjian",
            email="zhengqinjian96@gmail.com",
            password=HASHED_PASSWORD,
            competitive=True,
            rental_history=True,
            liked_car_spaces='1,2,3,4,5',
            disliked_car_spaces='6,7,8,9',
            discount_rate=20,
            first_timer=False
        )
        user2 = User(
            name="zeyang",
            email="where2park2@idrrate.com",
            password=HASHED_PASSWORD,
            competitive=True,
            liked_car_spaces='1,2,3,4',
            rental_history=True,
            first_timer=False
        )
        user3 = User(
            name="jie",
            email="where2park3@idrrate.com",
            password=HASHED_PASSWORD,
            first_timer=False
        )
        user4 = User(
            name="fang",
            email="where2park4@idrrate.com",
            password=HASHED_PASSWORD
        )
        user5 = User(
            name="Huichuan Xu",
            email="freeelements20@gmail.com",
            competitive=True,
            rental_history=True,
            password=HASHED_PASSWORD,
            first_timer=False
        )
        db.session.add_all([user1, user2, user3, user4, user5])

        cs1 = CarSpace(
            title="Car Space 1 Long Long Long Long Title No Height Custom Availabilities",
            bond=1000.0,
            image="https://d2syaugtnopsqd.cloudfront.net/wp-content/uploads/sites/10/2020/10/27135236/How-wide-is-a-parking-space-scaled.jpg",
            size_length=5.4,
            size_width=4.3,
            max_allowed_vehicle="Ute",
            car_space_type="Undercover",
            amenities="CCTV,24/7 Access,Sheltered Parking",
            access_type="Key",
            price_per_day=10.0,
            price_per_week=65.0,
            price_per_month=250.0,
            address_id="1",
            address="UNSW High Street",
            latitude=-33.917697,
            longitude=151.231174,
            unavailable_type=0,
            unavailable_from_date=datetime(2022, 7, 27),
            unavailable_to_date=datetime(2022, 8, 23),
            available_type=1,
            available_from_time=datetime(2022, 6, 28, 9, 40),
            available_to_time=datetime(2022, 6, 28, 21, 40),
            available_from_date=datetime(2022, 1, 31),
            available_to_date=datetime(2023, 6, 30),
            available_week_days="1,2,3,4",
            provider_id=1,
        )
        cs2 = CarSpace(
            title="Car Space 2 Short Title Always Available",
            bond=300.0,
            image="https://d2syaugtnopsqd.cloudfront.net/wp-content/uploads/sites/10/2020/10/27135236/How-wide-is-a-parking-space-scaled.jpg",
            size_length=3,
            size_width=2.3,
            max_height=3.1,
            max_allowed_vehicle="Commercial",
            car_space_type="Undercover",
            amenities="CCTV,Electric Charging",
            access_type="Key",
            price_per_day=15.0,
            price_per_week=80.0,
            price_per_month=300.0,
            address_id="2",
            address="UNSW 2 High Street",
            latitude=-33.927697,
            longitude=151.221174,
            unavailable_type=1,
            unavailable_dates="6/28/2022,6/29/2022,6/30/2022,8/4/2022,8/11/2022,8/18/2022,8/25/2022",
            available_type=0,
            description="Always available except some dates",
            instructions="There should be some instructions, but is not",
            provider_id=1,
        )
        cs3 = CarSpace(
            title="Car Space 3 Tiny Car Space Always Available Except August and September",
            bond=270.0,
            size_length=2,
            size_width=1.5,
            max_height=4,
            price_per_day=27,
            price_per_week=189,
            price_per_month=810,
            max_allowed_vehicle="Hatch",
            car_space_type="Outside",
            amenities="Lighting,Security Patrols",
            access_type="None",
            address_id="524532332b33616f2f7a365863736845414a57564f413d3d",
            address="NSW FIRE BRIGADE CITY OF SYDNEY 211-217 CASTLEREAGH STREET SYDNEY NSW 2000",
            latitude=-33.87510015,
            longitude=151.20867145,
            unavailable_type=0,
            unavailable_from_date=datetime(2022, 6, 30),
            unavailable_to_date=datetime(2022, 9, 21),
            available_type=0,
            description="This outside space is large (not really)",
            instructions="It is outside, just go",
            provider_id=1,
        )
        cs4 = CarSpace(
            title="Car Space 4 Custom Available and Provider Pick Dates Unavailable",
            bond=17000.0,
            size_length=4,
            size_width=3,
            max_height=4,
            price_per_day=17,
            price_per_week=119,
            price_per_month=510,
            max_allowed_vehicle="SUV/4WD",
            car_space_type="Carport",
            amenities="Electric Charging,Car Wash",
            access_type="Passcode",
            address_id="47784442447672556b654d534e39544a375a4c6275673d3d",
            address="SYDNEY HOSPITAL/EYE HOSPITAL 8 MACQUARIE STREET SYDNEY NSW 2000",
            latitude=-33.86821515,
            longitude=151.21286793,
            unavailable_type=1,
            unavailable_dates="8/11/2022,8/12/2022,8/13/2022,8/14/2022,8/15/2022,",
            available_type=1,
            available_from_time=datetime(2022, 6, 28, 4, 0),
            available_to_time=datetime(2022, 6, 28, 17, 40),
            available_from_date=datetime(2022, 6, 30),
            available_to_date=datetime(2023, 1, 30),
            available_week_days="0,1,3,4",
            description="Complex availabilities",
            instructions="Ask me for passcode",
            provider_id=1,
        )
        cs5 = CarSpace(
            title="Car Space 5 West Street Park",
            bond=500.0,
            status="online",
            image="https://bucket-api.commercialrealestate.com.au/v1/bucket/image/2017312987_1_1_211011_120303-w1000-h662",
            size_length=5.0,
            size_width=4.0,
            max_height=4.0,
            max_allowed_vehicle="SUV/4WD",
            car_space_type="Undercover",
            amenities="Arranged Transfers,Lighting",
            access_type="Pay and display",
            price_per_day=10.0,
            price_per_week=50.0,
            price_per_month=200.0,
            address_id="7058645176426a356465745150414e305679775836673d3d",
            address="137 WEST STREET CROWS NEST NSW 2065",
            latitude=-33.82808738,
            longitude=151.20692713,
            unavailable_type=1,
            unavailable_dates="07/28/2022,07/29/2022,07/30/2022,07/31/2022",
            available_type=0,
            description="Rent for cheap",
            instructions="Please contact in advance.",
            provider_id=2,
        )
        cs6 = CarSpace(
            title="Car Space 6 East Hill Park",
            bond=1000.0,
            status="online",
            image="https://image.shutterstock.com/image-photo/empty-space-parking-260nw-332087375.jpg",
            size_length=7.5,
            size_width=5.5,
            max_height=4.9,
            max_allowed_vehicle="SUV/4WD",
            car_space_type="Driveway",
            amenities="24/7 Access,WC,Car Wash",
            access_type="Swipe card",
            price_per_day=5.0,
            price_per_week=30.0,
            price_per_month=100.0,
            address_id="74494b564e7a7a34685763647a6b635a51524f7339773d3d",
            address="3 BASS AVENUE EAST HILLS NSW 2213",
            latitude=-33.95786584,
            longitude=150.98415544,
            unavailable_type=0,
            unavailable_from_date=datetime(2022, 7, 22),
            unavailable_to_date=datetime(2022, 8, 31),
            available_type=0,
            description="Rent for cheap",
            instructions="Please contact in advance.",
            provider_id=2,
        )
        cs7 = CarSpace(
            title="Car Space 7 9th ave",
            bond=1000.0,
            status="online",
            image="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/vacant-car-parking-space-royalty-free-image-1591721505.jpg",
            size_length=10.0,
            size_width=10.0,
            max_height=10.0,
            max_allowed_vehicle="Commercial",
            car_space_type="Other",
            amenities="Car Wash",
            access_type="Boom gate",
            price_per_day=20.0,
            price_per_week=100.0,
            price_per_month=400.0,
            address_id="374a5976574f364d435979616c69353948486a5a2f513d3d",
            address="NINTH AVENUE WOODVILLE NORTH SA 5012",
            latitude=-34.86224298,
            longitude=138.54027941,
            unavailable_type=1,
            unavailable_dates="07/28/2022,07/29/2022,07/30/2022,07/31/2022",
            available_type=1,
            available_from_time=datetime(2022, 7, 22, 7, 0, 0),
            available_to_time=datetime(2022, 7, 23, 17, 0, 0),
            available_from_date=datetime(2022, 7, 22),
            available_to_date=datetime(2022, 8, 1),
            available_week_days="1,2,3,4,5",
            description="N/A",
            instructions="N/A",
            provider_id=2,
        )
        cs8 = CarSpace(
            title="Car Space 8 South centre",
            bond=100.0,
            status="online",
            image="https://www.parkhound.com.au/protected/data/upload/space/xCar-Park-sam-sing-street-waterloo-new-south-wales,,-118327,,-375773_1653668844.5172.jpeg.pagespeed.ic.YECeOIFMrJ.jpg",
            size_length=4.0,
            size_width=3.0,
            max_height=4.0,
            max_allowed_vehicle="Hatch",
            car_space_type="Indoor lot",
            amenities="Electric Charging",
            access_type="Key",
            price_per_day=3.0,
            price_per_week=15.0,
            price_per_month=50.0,
            address_id="2b706f49504e32784d5854527a3074533673555278513d3d",
            address="SOUTH PENRITH YOUTH CENTRE 138 MAXWELL STREET SOUTH PENRITH NSW 2750",
            latitude=-33.77336479,
            longitude=150.69472159,
            unavailable_type=0,
            unavailable_from_date=datetime(2022, 7, 27),
            unavailable_to_date=datetime(2022, 7, 27),
            available_type=1,
            available_from_time=datetime(2022, 7, 22, 7, 0, 0),
            available_to_time=datetime(2022, 7, 23, 17, 0, 0),
            available_from_date=datetime(2022, 7, 22),
            available_to_date=datetime(2022, 7, 30),
            available_week_days="1,2,3,4,5",
            description="N/A",
            instructions="N/A",
            provider_id=2,
        )
        cs9 = CarSpace(
            title="Car Space 9 Near Melbourne Central",
            bond=50.0,
            status='online',
            image="https://s1.ax1x.com/2022/07/31/vFMk8I.jpg",
            size_length=5.0,
            size_width=4.0,
            max_height=2.5,
            max_allowed_vehicle="SUV/4WD",
            car_space_type="Indoor lot",
            amenities="24/7 Access,CCTV,Lighting,Electric Charging",
            access_type="Ticket",
            price_per_day=15.0,
            price_per_week=90.0,
            price_per_month=300.0,
            address_id="7338544c3341516b4c663453634c74415749726935773d3d",
            address="MELBOURNE CENTRAL 300 LONSDALE STREET MELBOURNE VIC 3000",
            latitude=-37.81168719,
            longitude=144.96349219,
            unavailable_type=1,
            unavailable_dates="8/27/2022",
            available_type=0,
            description="This space is easy to be found.",
            instructions="No pets inside.",
            provider_id=3
        )
        cs10 = CarSpace(
            title="Car Space 10 Near QV",
            bond=15.0,
            status='online',
            image="https://s1.ax1x.com/2022/07/31/vFMA2t.jpg",
            size_length=5.0,
            size_width=4.0,
            max_height=3.0,
            max_allowed_vehicle="SUV/4WD",
            car_space_type='Outside',
            amenities="CCTV,24/7 Access,Lighting",
            access_type="None",
            price_per_day=20.0,
            price_per_week=120.0,
            price_per_month=400.0,
            address_id="4d316a494d692b4d486174353673356258556d477a773d3d",
            address="13-15 QV SQUARE MELBOURNE VIC 3000",
            latitude=-37.81034113,
            longitude=144.96553028,
            unavailable_type=1,
            unavailable_dates="6/14/2022",
            available_type=0,
            description="Easy to find from square",
            instructions="Children friendly and pets friendly.",
            provider_id=3
        )
        cs11 = CarSpace(
            title="Car Space 11 Near State Library",
            bond=50.0,
            status='online',
            image="https://s1.ax1x.com/2022/07/31/vFMExP.jpg",
            size_length=4.0,
            size_width=4.0,
            max_height=3.0,
            max_allowed_vehicle="SUV/4WD",
            car_space_type='Outside',
            amenities="24/7 Access,Sheltered Parking,WC",
            access_type="None",
            price_per_day=5.0,
            price_per_week=30.0,
            price_per_month=120.0,
            address_id="496f7758742b70347757764b6b516f6331484d6c59673d3d",
            address="STATE LIBRARY OF VICTORIA 304-328 SWANSTON STREET MELBOURNE VIC 3000",
            latitude=-37.81004335,
            longitude=144.96432102,
            unavailable_type=0,
            unavailable_from_date=datetime(2022, 7, 29),
            unavailable_to_date=datetime(2022, 8, 4),
            available_type=0,
            description="Behind the State Library",
            instructions="No instructions",
            provider_id=3
        )

        cs12 = CarSpace(
            title="Car Space 12 Queen Victoria Market",
            bond=10.0,
            status='online',
            image="https://s1.ax1x.com/2022/07/31/vFMZKf.jpg",
            size_length=5.0,
            size_width=4.5,
            max_height=3.0,
            max_allowed_vehicle="Wagon",
            car_space_type='Undercover',
            amenities="24/7 Access,WC",
            access_type="None",
            price_per_day=10.0,
            price_per_week=65.0,
            price_per_month=250.0,
            address_id="346541574b32484979384b6163334a51536b636934773d3d",
            address="QUEEN VICTORIA MARKET 65-159 VICTORIA STREET MELBOURNE VIC 3000",
            latitude=-37.80632215,
            longitude=144.95821627,
            unavailable_type=1,
            unavailable_dates="8/17/2022",
            available_type=0,
            description="Near qvm behind.",
            instructions="Sometimes crowded",
            provider_id=3
        )
        cs13 = CarSpace(
            title="Car Space 13 Unilodge Car Park",
            bond=20.0,
            status='online',
            image="https://s1.ax1x.com/2022/07/31/vFMer8.jpg",
            size_length=5.5,
            size_width=4.0,
            max_height=2.0,
            max_allowed_vehicle="SUV/4WD",
            car_space_type='Indoor lot',
            amenities="CCTV,24/7 Access,WC,Security Gates,Lighting,Electric Charging,Underground,Sheltered Parking",
            access_type="Swipe card",
            price_per_day=20.0,
            price_per_week=120.0,
            price_per_month=400.0,
            address_id="795a7855694c56487343617a4939536d71704a6951773d3d",
            address="UNILODGE ON LONSDALE 35-41 LONSDALE STREET MELBOURNE VIC 3000",
            latitude=-37.80990619,
            longitude=144.97110713,
            unavailable_type=1,
            unavailable_dates="8/26/2022",
            available_type=0,
            description="Car park inside unilodge.",
            instructions="Apply access from unilodge",
            provider_id=3
        )
        cs14 = CarSpace(
            title="Car Space 14 UNSW Car Space",
            bond=200,
            size_length=6,
            size_width=3,
            max_height=3,
            max_allowed_vehicle="SUV/4WD",
            car_space_type="Undercover",
            amenities="CCTV,24/7 Access",
            access_type="Swipe card",
            price_per_day=10,
            price_per_week=70,
            price_per_month=260,
            address_id="4e2f54627270362f55687641316f3876695a535430513d3d",
            address="7 HIGH STREET KENSINGTON NSW 2033",
            latitude=-33.91558276,
            longitude=151.2310207,
            unavailable_type=1,
            available_type=1,
            available_from_time=datetime(2022, 7, 20, 8, 00, 00),
            available_to_time=datetime(2022, 7, 25, 20, 00, 00),
            available_from_date=datetime(2022, 7, 24),
            available_to_date=datetime(2022, 12, 30),
            available_week_days="2,3,4,5,1",
            description="Contact the provider to get access",
            instructions="Near by unsw main library",
            image="https://s1.ax1x.com/2022/07/31/vFgYVO.jpg",
            provider_id=5,
        )
        cs15 = CarSpace(
            title="Car Space 15 Zetland east village car space",
            bond=500,
            size_length=4,
            size_width=2.5,
            max_allowed_vehicle="Hatch",
            car_space_type="Outside",
            amenities="24/7 Access",
            access_type="None",
            price_per_day=25,
            price_per_week=130,
            price_per_month=500,
            address_id="4b6c68496f4c33585371364962616a3045326d6e48513d3d",
            address="UNIT 4 3 DEFRIES AVENUE ZETLAND NSW 2017",
            latitude=-33.90689678,
            longitude=151.21187708,
            unavailable_type=1,
            available_type=0,
            description="Please tell me the license plate after booking while could be locked by security guard",
            instructions="Nearby the east village shopping centre",
            image="https://s1.ax1x.com/2022/07/31/vFgtaD.jpg",
            provider_id=5,
        )
        cs16 = CarSpace(
            title="Car Space 16 Zetland car space",
            bond=600,
            size_length=4,
            size_width=3,
            max_height=3,
            max_allowed_vehicle="Hatch",
            car_space_type="Undercover",
            amenities="Car Wash,Sheltered Parking",
            access_type="Remote",
            price_per_day=30,
            price_per_week=200,
            price_per_month=600,
            address_id="6e576f6878745266364d516c61626a36747550424e513d3d",
            address="1 LEYLAND GROVE ZETLAND NSW 2017",
            latitude=-33.90632726,
            longitude=151.20912093,
            unavailable_type=1,
            available_type=1,
            available_from_time=datetime(2022, 7, 27, 8, 00, 00),
            available_to_time=datetime(2022, 7, 29, 20, 00, 00),
            available_from_date=datetime(2022, 7, 28),
            available_to_date=datetime(2022, 11, 8),
            available_week_days="0,6",
            image="https://s1.ax1x.com/2022/07/31/vFgGqK.jpg",
            provider_id=5,
        )
        cs17 = CarSpace(
            title="Car Space 17 Mascot Car space",
            bond=450,
            size_length=6,
            size_width=3,
            max_height=3,
            max_allowed_vehicle="SUV/4WD",
            car_space_type="Driveway",
            amenities="24/7 Access",
            access_type="None",
            price_per_day=20,
            price_per_week=120,
            price_per_month=450,
            address_id="45744870567a354c716a6c4250437a553478416869513d3d",
            address="MASCOT INN 952 BOTANY ROAD MASCOT NSW 2020",
            latitude=-33.93083321,
            longitude=151.19402192,
            unavailable_type=1,
            available_type=0,
            description="Near the airport",
            image="https://s1.ax1x.com/2022/07/31/vFgaPH.png",
            provider_id=5,
        )
        cs18 = CarSpace(
            title="Car Space 18 Royal Exhibition Building",
            bond=15.0,
            status='online',
            image="https://s1.ax1x.com/2022/07/31/vkEYgU.jpg",
            size_length=5.0,
            size_width=4.0,
            max_height=3.0,
            max_allowed_vehicle="SUV/4WD",
            car_space_type="Outside",
            amenities="24/7 Access,CCTV,Underground",
            access_type="Ticket",
            price_per_day=15.0,
            price_per_week=90.0,
            price_per_month=325.0,
            address_id="3651685639336c4d55564754564c79684c2b4c3341773d3d",
            address="ROYAL EXHIBITION BUILDING 9 NICHOLSON STREET CARLTON VIC 3053",
            latitude=-37.80473145,
            longitude=144.97151897,
            unavailable_type=1,
            unavailable_dates="7/30/2022",
            available_type=0,
            description="Near exhibition building. Easy to find.",
            instructions="Crowded on holiday",
            provider_id=4
        )
        cs19 = CarSpace(
            title="Car Space 19 inside Unimelb",
            bond=20.0,
            status='offline',
            image="https://s1.ax1x.com/2022/07/31/vkEx5q.jpg",
            size_length=5.0,
            size_width=4.0,
            max_height=3.0,
            max_allowed_vehicle="Sedan",
            car_space_type='Outside',
            amenities="CCTV,24/7 Access,Sheltered Parking,Security Patrols,Lighting",
            access_type="Passcode",
            price_per_day=10.0,
            price_per_week=50.0,
            price_per_month=200.0,
            address_id="642b56667a72716751643037452f7a594a63417651773d3d",
            address="UNIVERSITY OF MELBOURNE 156-290 GRATTAN STREET PARKVILLE VIC 3052",
            latitude=-37.79607112,
            longitude=144.96160684,
            unavailable_type=1,
            unavailable_dates="8/30/2022",
            available_type=0,
            description="Inside university library",
            instructions="No instructions",
            provider_id=4
        )
        cs20 = CarSpace(
            title="Car Space 20 Unimelb Law Building",
            bond=40.0,
            status='offline',
            image="https://s1.ax1x.com/2022/07/31/vkVsds.jpg",
            size_length=5.0,
            size_width=5.0,
            max_height=3.0,
            max_allowed_vehicle="SUV/4WD",
            car_space_type='Outside',
            amenities="Disabled Access,Sheltered Parking,WC,Security Gates",
            access_type="None",
            price_per_day=15.0,
            price_per_week=75.0,
            price_per_month=250.0,
            address_id="6b4e4c4f706f4465454b6e6a39744e326b59694251673d3d",
            address="185 PELHAM STREET CARLTON VIC 3053",
            latitude=-37.80223799,
            longitude=144.95976155,
            unavailable_type=1,
            unavailable_from_date=datetime(2022, 8, 14),
            unavailable_to_date=datetime(2022, 8, 21),
            available_type=0,
            description="Behind the law building",
            instructions="One way out",
            provider_id=4
        )
        cs21 = CarSpace(
            title="Car Space 21 Star Observation Wheel",
            bond=15.0,
            status='online',
            image="https://s1.ax1x.com/2022/07/31/vkZkSf.jpg",
            size_length=6.0,
            size_width=4.0,
            max_height=3.0,
            max_allowed_vehicle="Hatch",
            car_space_type='Carport',
            amenities="24/7 Access,Security Gates,Disabled Access",
            access_type="Ticket",
            price_per_day=15.0,
            price_per_week=75.0,
            price_per_month=300.0,
            address_id="6963776c45334f6a656d72374b39692b327473396c673d3d",
            address="101 WATERFRONT WAY DOCKLANDS VIC 3008",
            latitude=-37.81171877,
            longitude=144.93810203,
            unavailable_type=0,
            unavailable_from_date=datetime(2022, 7, 30),
            unavailable_to_date=datetime(2022, 11, 30),
            available_type=0,
            description="Good place to travel",
            instructions="Ask for access",
            provider_id=4
        )

        cs22 = CarSpace(
            title="Car Space 22 FlagStaff Garden",
            bond=25.0,
            status='online',
            image="https://s1.ax1x.com/2022/07/31/vkZVOg.jpg",
            size_length=6.0,
            size_width=5.0,
            max_height=3.0,
            max_allowed_vehicle="Wagon",
            car_space_type='Carport',
            amenities="CCTV,Disabled Access,Lighting,Electric Charging",
            access_type="None",
            price_per_day=25.0,
            price_per_week=150.0,
            price_per_month=600.0,
            address_id="3467743264396f326e4a4f6569747754574f746a38673d3d",
            address="ROOM 309 205 WILLIAM STREET MELBOURNE VIC 3000",
            latitude=-37.81423144,
            longitude=144.957278973,
            unavailable_type=1,
            unavailable_dates="12/30/2022",
            available_type=0,
            description="East gate of garden",
            instructions="No instructions",
            provider_id=4
        )
        cs23 = CarSpace(
            title="Car space 23 zetland car space",
            bond=400,
            status='offline',
            image="https://s1.ax1x.com/2022/08/02/vE48HA.jpg",
            size_length=4.0,
            size_width=3.0,
            max_height=3.0,
            max_allowed_vehicle="Hatch",
            car_space_type='Undercover',
            amenities="CCTV,24/7 Access",
            access_type="Key",
            price_per_day=15.0,
            price_per_week=100.0,
            price_per_month=400.0,
            address_id="325370376439436b4356776c4e5831644a627a6d6f513d3d",
            address="2 LEYLAND GROVE ZETLAND NSW 2017",
            latitude=-33.9059868,
            longitude=151.2093201,
            unavailable_type=0,
            available_type=0,
            provider_id=1
        )

        cs24 = CarSpace(
            title="Car space 24 zetland early learning centre",
            bond=500,
            status="offline",
            image="https://s1.ax1x.com/2022/08/02/vEqxAg.jpg",
            size_length=4.0,
            size_width=3.0,
            max_allowed_vehicle="Hatch",
            car_space_type="Outside",
            amenities="CCTV,24/7 Access,WC",
            access_type="Key",
            price_per_day=20.0,
            price_per_week=130.0,
            price_per_month=500.0,
            address_id="7a432f74796b4f6474593967554775743236614c70513d3d",
            address="12 DEFRIES AVENUE ZETLAND NSW 2017",
            latitude=-33.9091148,
            longitude=151.2123108,
            unavailable_type=0,
            available_type=0,
            provider_id=1
        )

        db.session.add_all([cs1, cs2, cs3, cs4, cs5, cs6, cs7, cs8, cs9, cs10,
                           cs11, cs12, cs13, cs14, cs15, cs16, cs17, cs18, cs19,
                           cs20, cs21, cs22, cs23, cs24])
        comment1 = Comment(
            rating=4.5,
            content="great",
            user_id=2,
            car_space_id=1
        )
        comment2 = Comment(
            rating=1,
            content="poor",
            user_id=2,
            car_space_id=1
        )
        comment3 = Comment(
            rating=3,
            content="soso",
            user_id=2,
            car_space_id=2
        )
        comment4 = Comment(
            rating=5,
            content="wonderful",
            user_id=2,
            car_space_id=2
        )
        comment5 = Comment(
            rating=2,
            content="could be improved",
            user_id=2,
            car_space_id=3
        )
        comment6 = Comment(
            rating=5,
            content="wonderful",
            user_id=2,
            car_space_id=3
        )
        comment7 = Comment(
            rating=5,
            content="great car space",
            user_id=2,
            car_space_id=4
        )
        comment8 = Comment(
            rating=4,
            content="friendly provider",
            user_id=2,
            car_space_id=4
        )
        comment9 = Comment(
            rating=5,
            content="Great car space.",
            user_id=4,
            car_space_id=11
        )
        comment10 = Comment(
            rating=3,
            content="A nice place despite environment",
            user_id=4,
            car_space_id=14
        )
        comment11 = Comment(
            rating=5,
            content="Near the university",
            user_id=2,
            car_space_id=15
        )
        comment12 = Comment(
            rating=3,
            content="Too many cars at night",
            user_id=2,
            car_space_id=15
        )
        comment13 = Comment(
            rating=5,
            content="Perfect",
            user_id=2,
            car_space_id=13
        )
        comment14 = Comment(
            rating=5,
            content="Near schools",
            user_id=4,
            car_space_id=10
        )
        comment15 = Comment(
            rating=5,
            content="Difficult to find",
            user_id=4,
            car_space_id=10
        )

        comment16 = Comment(
            rating=5,
            content="Good scenario",
            user_id=1,
            car_space_id=6
        )
        comment17 = Comment(
            rating=2,
            content="One way out without instruction",
            user_id=1,
            car_space_id=16
        )
        comment18 = Comment(
            rating=4.0,
            content="near the river",
            user_id=1,
            car_space_id=9
        )
        db.session.add_all([comment1, comment2, comment3,  comment4, comment5, comment6,
                           comment7, comment8, comment9, comment10, comment11, comment12,
                           comment13, comment14, comment15, comment16, comment17, comment18])
        booking1 = Booking(
            car_space_id=1,
            customer_id=2,
            end_date="2022-08-31",
            picked_dates="8/24/2022,8/25/2022,8/29/2022,8/30/2022,8/31/2022",
            price=40,
            provider_id=1,
            start_date="2022-08-24",
            status="paid",
            car_space_snapshot=r'{"instructions": null, "created_at": "2022-08-02T20:23:14", "available_from_date": "2022-01-31", "unavailable_from_date": "2022-07-27", "address_id": "1", "available_from_time": "2022-06-28T09:40:00", "updated_at": "2022-08-02T20:23:14", "amenities": "CCTV,24/7 Access,Sheltered Parking", "max_allowed_vehicle": "Ute", "size_length": 5.4, "image": "https://d2syaugtnopsqd.cloudfront.net/wp-content/uploads/sites/10/2020/10/27135236/How-wide-is-a-parking-space-scaled.jpg", "title": "Car Space 1 Long Long Long Long Title No Height Custom Availabilities", "available_to_time": "2022-06-28T21:40:00", "price_per_day": 10.0, "address": "UNSW High Street", "available_week_days": "1,2,3,4", "max_height": null, "description": null, "provider": {"name": "qinjian", "discount_rate": 20.0}, "latitude": -33.9177, "id": 1, "unavailable_type": 0, "longitude": 151.231, "price_per_week": 65.0, "unavailable_to_date": "2022-08-23", "bond": 1000.0, "price_per_month": 250.0, "size_width": 4.3, "available_type": 1, "unavailable_dates": null, "available_to_date": "2023-06-30", "access_type": "Key", "car_space_type": "Undercover"}'
        )
        booking2 = Booking(
            car_space_id=1,
            customer_id=2,
            end_date="2022-09-15",
            picked_dates="9/1/2022,9/5/2022,9/6/2022,9/7/2022,9/8/2022,9/12/2022,9/13/2022,9/14/2022,9/15/2022",
            price=85,
            provider_id=1,
            start_date="2022-09-01",
            status="cancelled",
            car_space_snapshot=r'{"instructions": null, "created_at": "2022-08-02T20:23:14", "available_from_date": "2022-01-31", "unavailable_from_date": "2022-07-27", "address_id": "1", "available_from_time": "2022-06-28T09:40:00", "updated_at": "2022-08-02T20:23:14", "amenities": "CCTV,24/7 Access,Sheltered Parking", "max_allowed_vehicle": "Ute", "size_length": 5.4, "image": "https://d2syaugtnopsqd.cloudfront.net/wp-content/uploads/sites/10/2020/10/27135236/How-wide-is-a-parking-space-scaled.jpg", "title": "Car Space 1 Long Long Long Long Title No Height Custom Availabilities", "available_to_time": "2022-06-28T21:40:00", "price_per_day": 10.0, "address": "UNSW High Street", "available_week_days": "1,2,3,4", "max_height": null, "description": null, "provider": {"name": "qinjian", "discount_rate": 20.0}, "latitude": -33.9177, "id": 1, "unavailable_type": 0, "longitude": 151.231, "price_per_week": 65.0, "unavailable_to_date": "2022-08-23", "bond": 1000.0, "price_per_month": 250.0, "size_width": 4.3, "available_type": 1, "unavailable_dates": null, "available_to_date": "2023-06-30", "access_type": "Key", "car_space_type": "Undercover"}'
        )
        booking3 = Booking(
            car_space_id=1,
            customer_id=2,
            end_date="2023-03-30",
            picked_dates="9/19/2022,9/20/2022,9/21/2022,9/22/2022,9/26/2022,9/27/2022,9/28/2022,9/29/2022,10/3/2022,10/4/2022,10/5/2022,10/6/2022,10/10/2022,10/11/2022,10/12/2022,10/13/2022,10/17/2022,10/18/2022,10/19/2022,10/20/2022,10/24/2022,10/25/2022,10/26/2022,10/27/2022,10/31/2022,11/1/2022,11/2/2022,11/3/2022,11/7/2022,11/8/2022,11/9/2022,11/10/2022,11/14/2022,11/15/2022,11/16/2022,11/17/2022,11/21/2022,11/22/2022,11/23/2022,11/24/2022,11/28/2022,11/29/2022,11/30/2022,12/1/2022,12/5/2022,12/6/2022,12/7/2022,12/8/2022,12/12/2022,12/13/2022,12/14/2022,12/15/2022,12/19/2022,12/20/2022,12/21/2022,12/22/2022,12/26/2022,12/27/2022,12/28/2022,12/29/2022,1/2/2023,1/3/2023,1/4/2023,1/5/2023,1/9/2023,1/10/2023,1/11/2023,1/12/2023,1/16/2023,1/17/2023,1/18/2023,1/19/2023,1/23/2023,1/24/2023,1/25/2023,1/26/2023,1/30/2023,1/31/2023,2/1/2023,2/2/2023,2/6/2023,2/7/2023,2/8/2023,2/9/2023,2/13/2023,2/14/2023,2/15/2023,2/16/2023,2/20/2023,2/21/2023,2/22/2023,2/23/2023,2/27/2023,2/28/2023,3/1/2023,3/2/2023,3/6/2023,3/7/2023,3/8/2023,3/9/2023,3/13/2023,3/14/2023,3/15/2023,3/16/2023,3/20/2023,3/21/2023,3/22/2023,3/23/2023,3/27/2023,3/28/2023,3/29/2023,3/30/2023",
            price=955,
            provider_id=1,
            start_date="2022-09-19",
            status="paid",
            car_space_snapshot=r'{"instructions": null, "created_at": "2022-08-02T20:23:14", "available_from_date": "2022-01-31", "unavailable_from_date": "2022-07-27", "address_id": "1", "available_from_time": "2022-06-28T09:40:00", "updated_at": "2022-08-02T20:23:14", "amenities": "CCTV,24/7 Access,Sheltered Parking", "max_allowed_vehicle": "Ute", "size_length": 5.4, "image": "https://d2syaugtnopsqd.cloudfront.net/wp-content/uploads/sites/10/2020/10/27135236/How-wide-is-a-parking-space-scaled.jpg", "title": "Car Space 1 Long Long Long Long Title No Height Custom Availabilities", "available_to_time": "2022-06-28T21:40:00", "price_per_day": 10.0, "address": "UNSW High Street", "available_week_days": "1,2,3,4", "max_height": null, "description": null, "provider": {"name": "qinjian", "discount_rate": 20.0}, "latitude": -33.9177, "id": 1, "unavailable_type": 0, "longitude": 151.231, "price_per_week": 65.0, "unavailable_to_date": "2022-08-23", "bond": 1000.0, "price_per_month": 250.0, "size_width": 4.3, "available_type": 1, "unavailable_dates": null, "available_to_date": "2023-06-30", "access_type": "Key", "car_space_type": "Undercover"}'
        )
        booking4 = Booking(
            car_space_id=2,
            customer_id=2,
            end_date="2022-09-27",
            picked_dates="8/9/2022,8/10/2022,8/12/2022,8/13/2022,8/14/2022,8/15/2022,8/16/2022,8/17/2022,8/19/2022,8/20/2022,8/21/2022,8/22/2022,8/23/2022,8/24/2022,8/26/2022,8/27/2022,8/28/2022,8/29/2022,8/30/2022,8/31/2022,9/1/2022,9/2/2022,9/3/2022,9/4/2022,9/5/2022,9/6/2022,9/7/2022,9/8/2022,9/9/2022,9/10/2022,9/11/2022,9/12/2022,9/13/2022,9/14/2022,9/15/2022,9/16/2022,9/17/2022,9/18/2022,9/19/2022,9/20/2022,9/21/2022,9/22/2022,9/23/2022,9/24/2022,9/25/2022,9/26/2022,9/27/2022",
            price=505,
            provider_id=1,
            start_date="2022-08-09",
            status="paid",
            car_space_snapshot=r'{"instructions": "There should be some instructions, but is not", "created_at": "2022-08-02T20:23:14", "available_from_date": null, "unavailable_from_date": null, "address_id": "2", "available_from_time": null, "updated_at": "2022-08-02T20:23:14", "amenities": "CCTV,Electric Charging", "max_allowed_vehicle": "Commercial", "size_length": 3.0, "image": "https://d2syaugtnopsqd.cloudfront.net/wp-content/uploads/sites/10/2020/10/27135236/How-wide-is-a-parking-space-scaled.jpg", "title": "Car Space 2 Short Title Always Available", "available_to_time": null, "price_per_day": 15.0, "address": "UNSW 2 High Street", "available_week_days": null, "max_height": 3.1, "description": "Always available except some dates", "provider": {"name": "qinjian", "discount_rate": 20.0}, "latitude": -33.9277, "id": 2, "unavailable_type": 1, "longitude": 151.221, "price_per_week": 80.0, "unavailable_to_date": null, "bond": 300.0, "price_per_month": 300.0, "size_width": 2.3, "available_type": 0, "unavailable_dates": "6/28/2022,6/29/2022,6/30/2022,8/4/2022,8/11/2022,8/18/2022,8/25/2022", "available_to_date": null, "access_type": "Key", "car_space_type": "Undercover"}'
        )
        booking5 = Booking(
            car_space_id=2,
            customer_id=3,
            end_date="2022-12-13",
            picked_dates="10/20/2022,10/21/2022,10/22/2022,10/23/2022,10/24/2022,10/25/2022,10/26/2022,10/27/2022,10/28/2022,10/29/2022,10/30/2022,10/31/2022,11/1/2022,11/2/2022,11/3/2022,11/4/2022,11/5/2022,11/6/2022,11/7/2022,11/8/2022,11/9/2022,11/10/2022,11/11/2022,11/12/2022,11/13/2022,11/14/2022,11/15/2022,11/16/2022,11/17/2022,11/18/2022,11/19/2022,11/20/2022,11/21/2022,11/22/2022,11/23/2022,11/24/2022,11/25/2022,11/26/2022,11/27/2022,11/28/2022,11/29/2022,11/30/2022,12/1/2022,12/2/2022,12/3/2022,12/4/2022,12/5/2022,12/6/2022,12/7/2022,12/8/2022,12/9/2022,12/10/2022,12/11/2022,12/12/2022,12/13/2022",
            price=600,
            provider_id=1,
            start_date="2022-10-20",
            status="paid",
            car_space_snapshot=r'{"instructions": "There should be some instructions, but is not", "created_at": "2022-08-02T20:23:14", "available_from_date": null, "unavailable_from_date": null, "address_id": "2", "available_from_time": null, "updated_at": "2022-08-02T20:23:14", "amenities": "CCTV,Electric Charging", "max_allowed_vehicle": "Commercial", "size_length": 3.0, "image": "https://d2syaugtnopsqd.cloudfront.net/wp-content/uploads/sites/10/2020/10/27135236/How-wide-is-a-parking-space-scaled.jpg", "title": "Car Space 2 Short Title Always Available", "available_to_time": null, "price_per_day": 15.0, "address": "UNSW 2 High Street", "available_week_days": null, "max_height": 3.1, "description": "Always available except some dates", "provider": {"name": "qinjian", "discount_rate": 20.0}, "latitude": -33.9277, "id": 2, "unavailable_type": 1, "longitude": 151.221, "price_per_week": 80.0, "unavailable_to_date": null, "bond": 300.0, "price_per_month": 300.0, "size_width": 2.3, "available_type": 0, "unavailable_dates": "6/28/2022,6/29/2022,6/30/2022,8/4/2022,8/11/2022,8/18/2022,8/25/2022", "available_to_date": null, "access_type": "Key", "car_space_type": "Undercover"}'
        )
        booking6 = Booking(
            car_space_id=3,
            customer_id=2,
            end_date="2022-11-30",
            picked_dates="9/22/2022,9/23/2022,9/24/2022,9/25/2022,9/26/2022,9/27/2022,9/28/2022,9/29/2022,9/30/2022,10/1/2022,10/2/2022,10/3/2022,10/4/2022,10/5/2022,10/6/2022,10/7/2022,10/8/2022,10/9/2022,10/10/2022,10/11/2022,10/12/2022,10/13/2022,10/14/2022,10/15/2022,10/16/2022,10/17/2022,10/18/2022,10/19/2022,10/20/2022,10/21/2022,10/22/2022,10/23/2022,10/24/2022,10/25/2022,10/26/2022,10/27/2022,10/28/2022,10/29/2022,10/30/2022,10/31/2022,11/1/2022,11/2/2022,11/3/2022,11/4/2022,11/5/2022,11/6/2022,11/7/2022,11/8/2022,11/9/2022,11/10/2022,11/11/2022,11/12/2022,11/13/2022,11/14/2022,11/15/2022,11/16/2022,11/17/2022,11/18/2022,11/19/2022,11/20/2022,11/21/2022,11/22/2022,11/23/2022,11/24/2022,11/25/2022,11/26/2022,11/27/2022,11/28/2022,11/29/2022,11/30/2022",
            price=1890,
            provider_id=1,
            start_date="2022-09-22",
            status="paid",
            car_space_snapshot=r'{"instructions": "It is outside, just go", "created_at": "2022-08-02T20:23:14", "available_from_date": null, "unavailable_from_date": "2022-06-30", "address_id": "524532332b33616f2f7a365863736845414a57564f413d3d", "available_from_time": null, "updated_at": "2022-08-02T20:23:14", "amenities": "Lighting,Security Patrols", "max_allowed_vehicle": "Hatch", "size_length": 2.0, "image": null, "title": "Car Space 3 Tiny Car Space Always Available Except August and September", "available_to_time": null, "price_per_day": 27.0, "address": "NSW FIRE BRIGADE CITY OF SYDNEY 211-217 CASTLEREAGH STREET SYDNEY NSW 2000", "available_week_days": null, "max_height": 4.0, "description": "This outside space is large (not really)", "provider": {"name": "qinjian", "discount_rate": 20.0}, "latitude": -33.8751, "id": 3, "unavailable_type": 0, "longitude": 151.209, "price_per_week": 189.0, "unavailable_to_date": "2022-09-21", "bond": 270.0, "price_per_month": 810.0, "size_width": 1.5, "available_type": 0, "unavailable_dates": null, "available_to_date": null, "access_type": "None", "car_space_type": "Outside"}'
        )
        booking7 = Booking(
            car_space_id=3,
            customer_id=2,
            end_date="2023-05-22",
            picked_dates="3/29/2023,3/30/2023,3/31/2023,4/1/2023,4/2/2023,4/3/2023,4/4/2023,4/5/2023,4/6/2023,4/7/2023,4/8/2023,4/9/2023,4/10/2023,4/11/2023,4/12/2023,4/13/2023,4/14/2023,4/15/2023,4/16/2023,4/17/2023,4/18/2023,4/19/2023,4/20/2023,4/21/2023,4/22/2023,4/23/2023,4/24/2023,4/25/2023,4/26/2023,4/27/2023,4/28/2023,4/29/2023,4/30/2023,5/1/2023,5/2/2023,5/3/2023,5/4/2023,5/5/2023,5/6/2023,5/7/2023,5/8/2023,5/9/2023,5/10/2023,5/11/2023,5/12/2023,5/13/2023,5/14/2023,5/15/2023,5/16/2023,5/17/2023,5/18/2023,5/19/2023,5/20/2023,5/21/2023,5/22/2023",
            price=1485,
            provider_id=1,
            start_date="2023-03-29",
            status="paid",
            car_space_snapshot=r'{"instructions": "It is outside, just go", "created_at": "2022-08-02T20:23:14", "available_from_date": null, "unavailable_from_date": "2022-06-30", "address_id": "524532332b33616f2f7a365863736845414a57564f413d3d", "available_from_time": null, "updated_at": "2022-08-02T20:23:14", "amenities": "Lighting,Security Patrols", "max_allowed_vehicle": "Hatch", "size_length": 2.0, "image": null, "title": "Car Space 3 Tiny Car Space Always Available Except August and September", "available_to_time": null, "price_per_day": 27.0, "address": "NSW FIRE BRIGADE CITY OF SYDNEY 211-217 CASTLEREAGH STREET SYDNEY NSW 2000", "available_week_days": null, "max_height": 4.0, "description": "This outside space is large (not really)", "provider": {"name": "qinjian", "discount_rate": 20.0}, "latitude": -33.8751, "id": 3, "unavailable_type": 0, "longitude": 151.209, "price_per_week": 189.0, "unavailable_to_date": "2022-09-21", "bond": 270.0, "price_per_month": 810.0, "size_width": 1.5, "available_type": 0, "unavailable_dates": null, "available_to_date": null, "access_type": "None", "car_space_type": "Outside"}'
        )
        booking8 = Booking(
            car_space_id=4,
            customer_id=2,
            end_date="2022-10-26",
            picked_dates="8/17/2022,8/18/2022,8/21/2022,8/22/2022,8/24/2022,8/25/2022,8/28/2022,8/29/2022,8/31/2022,9/1/2022,9/4/2022,9/5/2022,9/7/2022,9/8/2022,9/11/2022,9/12/2022,9/14/2022,9/15/2022,9/18/2022,9/19/2022,9/21/2022,9/22/2022,9/25/2022,9/26/2022,9/28/2022,9/29/2022,10/2/2022,10/3/2022,10/5/2022,10/6/2022,10/9/2022,10/10/2022,10/12/2022,10/13/2022,10/16/2022,10/17/2022,10/19/2022,10/20/2022,10/23/2022,10/24/2022,10/26/2022",
            price=697,
            provider_id=1,
            start_date="2022-08-17",
            status="paid",
            car_space_snapshot=r'{"instructions": "Ask me for passcode", "created_at": "2022-08-02T20:23:14", "available_from_date": "2022-06-30", "unavailable_from_date": null, "address_id": "47784442447672556b654d534e39544a375a4c6275673d3d", "available_from_time": "2022-06-28T04:00:00", "updated_at": "2022-08-02T20:23:14", "amenities": "Electric Charging,Car Wash", "max_allowed_vehicle": "SUV/4WD", "size_length": 4.0, "image": null, "title": "Car Space 4 Custom Available and Provider Pick Dates Unavailable", "available_to_time": "2022-06-28T17:40:00", "price_per_day": 17.0, "address": "SYDNEY HOSPITAL/EYE HOSPITAL 8 MACQUARIE STREET SYDNEY NSW 2000", "available_week_days": "0,1,3,4", "max_height": 4.0, "description": "Complex availabilities", "provider": {"name": "qinjian", "discount_rate": 20.0}, "latitude": -33.8682, "id": 4, "unavailable_type": 1, "longitude": 151.213, "price_per_week": 119.0, "unavailable_to_date": null, "bond": 17000.0, "price_per_month": 510.0, "size_width": 3.0, "available_type": 1, "unavailable_dates": "8/11/2022,8/12/2022,8/13/2022,8/14/2022,8/15/2022,", "available_to_date": "2023-01-30", "access_type": "Passcode", "car_space_type": "Carport"}'
        )
        booking9 = Booking(
            car_space_id=4,
            customer_id=2,
            end_date="2022-08-10",
            picked_dates="8/1/2022,8/3/2022,8/4/2022,8/7/2022,8/8/2022,8/10/2022",
            price=102,
            provider_id=1,
            start_date="2022-08-01",
            status="cancelled",
            car_space_snapshot=r'{"instructions": "Ask me for passcode", "created_at": "2022-08-02T20:23:14", "available_from_date": "2022-06-30", "unavailable_from_date": null, "address_id": "47784442447672556b654d534e39544a375a4c6275673d3d", "available_from_time": "2022-06-28T04:00:00", "updated_at": "2022-08-02T20:23:14", "amenities": "Electric Charging,Car Wash", "max_allowed_vehicle": "SUV/4WD", "size_length": 4.0, "image": null, "title": "Car Space 4 Custom Available and Provider Pick Dates Unavailable", "available_to_time": "2022-06-28T17:40:00", "price_per_day": 17.0, "address": "SYDNEY HOSPITAL/EYE HOSPITAL 8 MACQUARIE STREET SYDNEY NSW 2000", "available_week_days": "0,1,3,4", "max_height": 4.0, "description": "Complex availabilities", "provider": {"name": "qinjian", "discount_rate": 20.0}, "latitude": -33.8682, "id": 4, "unavailable_type": 1, "longitude": 151.213, "price_per_week": 119.0, "unavailable_to_date": null, "bond": 17000.0, "price_per_month": 510.0, "size_width": 3.0, "available_type": 1, "unavailable_dates": "8/11/2022,8/12/2022,8/13/2022,8/14/2022,8/15/2022,", "available_to_date": "2023-01-30", "access_type": "Passcode", "car_space_type": "Carport"}'
        )
        booking10 = Booking(
            price=340.00,
            start_date=datetime(2022, 7, 29),
            end_date=datetime(2022, 8, 16),
            picked_dates="7/30/2022,7/31/2022,8/1/2022,8/2/2022,8/3/2022,8/4/2022,8/5/2022,8/6/2022,8/7/2022,8/8/2022,8/9/2022,8/10/2022,8/11/2022,8/12/2022,8/13/2022,8/14/2022,8/15/2022,8/16/2022,8/17/2022",
            status='cancelled',
            provider_id=4,
            customer_id=1,
            car_space_id=20,
            car_space_snapshot=r'{"instructions": "One way out", "created_at": "2022-08-02T20:23:14", "available_from_date": null, "unavailable_from_date": "2022-08-14", "address_id": "6b4e4c4f706f4465454b6e6a39744e326b59694251673d3d", "available_from_time": null, "updated_at": "2022-08-02T20:23:14", "amenities": "Disabled Access,Sheltered Parking,WC,Security Gates", "max_allowed_vehicle": "SUV/4WD", "size_length": 5.0, "image": "https://s1.ax1x.com/2022/07/31/vkVsds.jpg", "title": "Car Space 20 Unimelb Law Building", "available_to_time": null, "price_per_day": 15.0, "address": "185 PELHAM STREET CARLTON VIC 3053", "available_week_days": null, "max_height": 3.0, "description": "Behind the law building", "provider": {"name": "fang", "discount_rate": null}, "latitude": -37.8022, "id": 20, "unavailable_type": 1, "longitude": 144.96, "price_per_week": 75.0, "unavailable_to_date": "2022-08-21", "bond": 40.0, "price_per_month": 250.0, "size_width": 5.0, "available_type": 0, "unavailable_dates": null, "available_to_date": null, "access_type": "None", "car_space_type": "Outside"}'
        )
        booking11 = Booking(
            price=300.0,
            start_date=datetime(2022, 8, 31),
            end_date=datetime(2022, 9, 29),
            picked_dates='9/1/2022,9/2/2022,9/3/2022,9/4/2022,9/5/2022,9/6/2022,9/7/2022,9/8/2022,9/9/2022,9/10/2022,9/11/2022,9/12/2022,9/13/2022,9/14/2022,9/15/2022,9/16/2022,9/17/2022,9/18/2022,9/19/2022,9/20/2022,9/21/2022,9/22/2022,9/23/2022,9/24/2022,9/25/2022,9/26/2022,9/27/2022,9/28/2022,9/29/2022,9/30/2022',
            status='paid',
            provider_id=3,
            customer_id=2,
            car_space_id=11,
            car_space_snapshot=r'{"instructions": "No instructions", "created_at": "2022-08-02T20:23:14", "available_from_date": null, "unavailable_from_date": "2022-07-29", "address_id": "496f7758742b70347757764b6b516f6331484d6c59673d3d", "available_from_time": null, "updated_at": "2022-08-02T20:23:14", "amenities": "24/7 Access,Sheltered Parking,WC", "max_allowed_vehicle": "SUV/4WD", "size_length": 4.0, "image": "https://s1.ax1x.com/2022/07/31/vFMExP.jpg", "title": "Car Space 11 Near State Library", "available_to_time": null, "price_per_day": 5.0, "address": "STATE LIBRARY OF VICTORIA 304-328 SWANSTON STREET MELBOURNE VIC 3000", "available_week_days": null, "max_height": 3.0, "description": "Behind the State Library", "provider": {"name": "jie", "discount_rate": null}, "latitude": -37.81, "id": 11, "unavailable_type": 0, "longitude": 144.964, "price_per_week": 30.0, "unavailable_to_date": "2022-08-04", "bond": 50.0, "price_per_month": 120.0, "size_width": 4.0, "available_type": 0, "unavailable_dates": null, "available_to_date": null, "access_type": "None", "car_space_type": "Outside"}'
        )
        booking12 = Booking(
            price=140.0,
            start_date=datetime(2022, 8, 31),
            end_date=datetime(2022, 9, 14),
            picked_dates='9/1/2022,9/2/2022,9/3/2022,9/4/2022,9/5/2022,9/6/2022,9/7/2022,9/8/2022,9/9/2022,9/10/2022,9/11/2022,9/12/2022,9/13/2022,9/14/2022,9/15/2022',
            status='cancelled',
            provider_id=5,
            customer_id=2,
            car_space_id=14,
            car_space_snapshot=r'{"instructions": "Near by unsw main library", "created_at": "2022-08-02T20:23:14", "available_from_date": "2022-07-24", "unavailable_from_date": null, "address_id": "4e2f54627270362f55687641316f3876695a535430513d3d", "available_from_time": "2022-07-20T08:00:00", "updated_at": "2022-08-02T20:23:14", "amenities": "CCTV,24/7 Access", "max_allowed_vehicle": "SUV/4WD", "size_length": 6.0, "image": "https://s1.ax1x.com/2022/07/31/vFgYVO.jpg", "title": "Car Space 14 UNSW Car Space", "available_to_time": "2022-07-25T20:00:00", "price_per_day": 10.0, "address": "7 HIGH STREET KENSINGTON NSW 2033", "available_week_days": "2,3,4,5,1", "max_height": 3.0, "description": "Contact the provider to get access", "provider": {"name": "Huichuan Xu", "discount_rate": null}, "latitude": -33.9156, "id": 14, "unavailable_type": 1, "longitude": 151.231, "price_per_week": 70.0, "unavailable_to_date": null, "bond": 200.0, "price_per_month": 260.0, "size_width": 3.0, "available_type": 1, "unavailable_dates": null, "available_to_date": "2022-12-30", "access_type": "Swipe card", "car_space_type": "Undercover"}'
        )
        booking13 = Booking(
            price=250.0,
            start_date=datetime(2022, 8, 31),
            end_date=datetime(2022, 9, 29),
            picked_dates='9/1/2022,9/2/2022,9/3/2022,9/4/2022,9/5/2022,9/6/2022,9/7/2022,9/8/2022,9/9/2022,9/10/2022,9/11/2022,9/12/2022,9/13/2022,9/14/2022,9/15/2022,9/16/2022,9/17/2022,9/18/2022,9/19/2022,9/20/2022,9/21/2022,9/22/2022,9/23/2022,9/24/2022,9/25/2022,9/26/2022,9/27/2022,9/28/2022,9/29/2022,9/30/2022',
            status='paid',
            provider_id=5,
            customer_id=2,
            car_space_id=14,
            car_space_snapshot=r'{"instructions": "Near by unsw main library", "created_at": "2022-08-02T20:23:14", "available_from_date": "2022-07-24", "unavailable_from_date": null, "address_id": "4e2f54627270362f55687641316f3876695a535430513d3d", "available_from_time": "2022-07-20T08:00:00", "updated_at": "2022-08-02T20:23:14", "amenities": "CCTV,24/7 Access", "max_allowed_vehicle": "SUV/4WD", "size_length": 6.0, "image": "https://s1.ax1x.com/2022/07/31/vFgYVO.jpg", "title": "Car Space 14 UNSW Car Space", "available_to_time": "2022-07-25T20:00:00", "price_per_day": 10.0, "address": "7 HIGH STREET KENSINGTON NSW 2033", "available_week_days": "2,3,4,5,1", "max_height": 3.0, "description": "Contact the provider to get access", "provider": {"name": "Huichuan Xu", "discount_rate": null}, "latitude": -33.9156, "id": 14, "unavailable_type": 1, "longitude": 151.231, "price_per_week": 70.0, "unavailable_to_date": null, "bond": 200.0, "price_per_month": 260.0, "size_width": 3.0, "available_type": 1, "unavailable_dates": null, "available_to_date": "2022-12-30", "access_type": "Swipe card", "car_space_type": "Undercover"}'
        )
        booking14 = Booking(
            price=260.0,
            start_date=datetime(2022, 7, 31),
            end_date=datetime(2022, 8, 14),
            picked_dates='8/1/2022,8/2/2022,8/3/2022,8/4/2022,8/5/2022,8/6/2022,8/7/2022,8/8/2022,8/9/2022,8/10/2022,8/11/2022,8/12/2022,8/13/2022,8/14/2022,8/15/2022',
            customer_id=2,
            status='cancelled',
            provider_id=3,
            car_space_id=12,
            car_space_snapshot=r'{"instructions": "Sometimes crowded", "created_at": "2022-08-02T20:23:14", "available_from_date": null, "unavailable_from_date": null, "address_id": "346541574b32484979384b6163334a51536b636934773d3d", "available_from_time": null, "updated_at": "2022-08-02T20:23:14", "amenities": "24/7 Access,WC", "max_allowed_vehicle": "Wagon", "size_length": 5.0, "image": "https://s1.ax1x.com/2022/07/31/vFMZKf.jpg", "title": "Car Space 12 Queen Victoria Market", "available_to_time": null, "price_per_day": 10.0, "address": "QUEEN VICTORIA MARKET 65-159 VICTORIA STREET MELBOURNE VIC 3000", "available_week_days": null, "max_height": 3.0, "description": "Near qvm behind.", "provider": {"name": "jie", "discount_rate": null}, "latitude": -37.8063, "id": 12, "unavailable_type": 1, "longitude": 144.958, "price_per_week": 65.0, "unavailable_to_date": null, "bond": 10.0, "price_per_month": 250.0, "size_width": 4.5, "available_type": 0, "unavailable_dates": "8/17/2022", "available_to_date": null, "access_type": "None", "car_space_type": "Undercover"}'
        )
        booking15 = Booking(
            price=140.0,
            start_date=datetime(2022, 7, 31),
            end_date=datetime(2022, 8, 7),
            picked_dates='8/1/2022,8/2/2022,8/3/2022,8/4/2022,8/5/2022,8/6/2022,8/7/2022,8/8/2022',
            status='paid',
            provider_id=5,
            customer_id=2,
            car_space_id=15,
            car_space_snapshot=r'{"instructions": "Nearby the east village shopping centre", "created_at": "2022-08-02T20:23:14", "available_from_date": null, "unavailable_from_date": null, "address_id": "4b6c68496f4c33585371364962616a3045326d6e48513d3d", "available_from_time": null, "updated_at": "2022-08-02T20:23:14", "amenities": "24/7 Access", "max_allowed_vehicle": "Hatch", "size_length": 4.0, "image": "https://s1.ax1x.com/2022/07/31/vFgtaD.jpg", "title": "Car Space 15 Zetland east village car space", "available_to_time": null, "price_per_day": 20.0, "address": "UNIT 4 3 DEFRIES AVENUE ZETLAND NSW 2017", "available_week_days": null, "max_height": null, "description": "Please tell me the license plate after booking while could be locked by security guard", "provider": {"name": "Huichuan Xu", "discount_rate": null}, "latitude": -33.9069, "id": 15, "unavailable_type": 1, "longitude": 151.212, "price_per_week": 120.0, "unavailable_to_date": null, "bond": 450.0, "price_per_month": 450.0, "size_width": 2.5, "available_type": 0, "unavailable_dates": null, "available_to_date": null, "access_type": "None", "car_space_type": "Outside"}'
        )
        booking16 = Booking(
            price=140.00,
            start_date=datetime(2022, 7, 29),
            end_date=datetime(2022, 8, 5),
            picked_dates="7/30/2022,7/31/2022,8/1/2022,8/2/2022,8/3/2022,8/4/2022,8/5/2022,8/6/2022",
            status='paid',
            provider_id=4,
            customer_id=1,
            car_space_id=18,
            car_space_snapshot=r'{"instructions": "Crowded on holiday", "created_at": "2022-08-02T20:23:14", "available_from_date": null, "unavailable_from_date": null, "address_id": "3651685639336c4d55564754564c79684c2b4c3341773d3d", "available_from_time": null, "updated_at": "2022-08-02T20:23:14", "amenities": "24/7 Access,CCTV,Underground", "max_allowed_vehicle": "SUV/4WD", "size_length": 5.0, "image": "https://s1.ax1x.com/2022/07/31/vkEYgU.jpg", "title": "Car Space 18 Royal Exhibition Building", "available_to_time": null, "price_per_day": 15.0, "address": "ROYAL EXHIBITION BUILDING 9 NICHOLSON STREET CARLTON VIC 3053", "available_week_days": null, "max_height": 3.0, "description": "Near exhibition building. Easy to find.", "provider": {"name": "fang", "discount_rate": null}, "latitude": -37.8047, "id": 18, "unavailable_type": 1, "longitude": 144.972, "price_per_week": 90.0, "unavailable_to_date": null, "bond": 15.0, "price_per_month": 325.0, "size_width": 4.0, "available_type": 0, "unavailable_dates": "7/30/2022", "available_to_date": null, "access_type": "Ticket", "car_space_type": "Outside"}'
        )
        booking17 = Booking(
            price=230.00,
            start_date=datetime(2022, 7, 31),
            end_date=datetime(2022, 8, 30),
            picked_dates="8/1/2022,8/2/2022,8/3/2022,8/4/2022,8/5/2022,8/8/2022,8/9/2022,8/10/2022,8/11/2022,8/12/2022,8/15/2022,8/16/2022,8/17/2022,8/18/2022,8/19/2022,8/22/2022,8/23/2022,8/24/2022,8/25/2022,8/26/2022,8/29/2022,8/30/2022,8/31/2022",
            status='paid',
            provider_id=5,
            customer_id=1,
            car_space_id=17,
            car_space_snapshot=r'{"instructions": null, "created_at": "2022-08-02T20:23:14", "available_from_date": null, "unavailable_from_date": null, "address_id": "45744870567a354c716a6c4250437a553478416869513d3d", "available_from_time": null, "updated_at": "2022-08-02T20:23:14", "amenities": "24/7 Access", "max_allowed_vehicle": "SUV/4WD", "size_length": 6.0, "image": "https://s1.ax1x.com/2022/07/31/vFgaPH.png", "title": "Car Space 17 Mascot Car space", "available_to_time": null, "price_per_day": 20.0, "address": "MASCOT INN 952 BOTANY ROAD MASCOT NSW 2020", "available_week_days": null, "max_height": 3.0, "description": "Near the airport", "provider": {"name": "Huichuan Xu", "discount_rate": null}, "latitude": -33.9308, "id": 17, "unavailable_type": 1, "longitude": 151.194, "price_per_week": 120.0, "unavailable_to_date": null, "bond": 450.0, "price_per_month": 450.0, "size_width": 3.0, "available_type": 0, "unavailable_dates": null, "available_to_date": null, "access_type": "None", "car_space_type": "Driveway"}'
        )
        booking18 = Booking(
            price=220.00,
            start_date=datetime(2022, 8, 31),
            end_date=datetime(2022, 9, 29),
            picked_dates="9/1/2022,9/2/2022,9/5/2022,9/6/2022,9/7/2022,9/8/2022,9/9/2022,9/12/2022,9/13/2022,9/14/2022,9/15/2022,9/16/2022,9/19/2022,9/20/2022,9/21/2022,9/22/2022,9/23/2022,9/26/2022,9/27/2022,9/28/2022,9/29/2022,9/30/2022",
            status='paid',
            provider_id=5,
            customer_id=2,
            car_space_id=17,
            car_space_snapshot=r'{"instructions": null, "created_at": "2022-08-02T20:23:14", "available_from_date": null, "unavailable_from_date": null, "address_id": "45744870567a354c716a6c4250437a553478416869513d3d", "available_from_time": null, "updated_at": "2022-08-02T20:23:14", "amenities": "24/7 Access", "max_allowed_vehicle": "SUV/4WD", "size_length": 6.0, "image": "https://s1.ax1x.com/2022/07/31/vFgaPH.png", "title": "Car Space 17 Mascot Car space", "available_to_time": null, "price_per_day": 20.0, "address": "MASCOT INN 952 BOTANY ROAD MASCOT NSW 2020", "available_week_days": null, "max_height": 3.0, "description": "Near the airport", "provider": {"name": "Huichuan Xu", "discount_rate": null}, "latitude": -33.9308, "id": 17, "unavailable_type": 1, "longitude": 151.194, "price_per_week": 120.0, "unavailable_to_date": null, "bond": 450.0, "price_per_month": 450.0, "size_width": 3.0, "available_type": 0, "unavailable_dates": null, "available_to_date": null, "access_type": "None", "car_space_type": "Driveway"}'
        )
        booking19 = Booking(
            price=48.00,
            start_date=datetime(2022, 8, 3),
            end_date=datetime(2022, 8, 6),
            picked_dates="8/3/2022,8/4/2022,8/5/2022,8/6/2022",
            status='paid',
            provider_id=1,
            customer_id=5,
            car_space_id=23,
            car_space_snapshot=r'{"address": "2 LEYLAND GROVE ZETLAND NSW 2017", "amenities": "CCTV,24/7 Access", "created_at": "2022-08-02T20:11:15", "car_space_type": "Undercover", "price_per_month": 400.0, "id": 23, "max_allowed_vehicle": "Hatch", "latitude": -33.9059868, "title": "Car space 23 zetland car space", "max_height": null, "access_type": "Key", "address_id": "325370376439436b4356776c4e5831644a627a6d6f513d3d", "updated_at": "2022-08-02T20:11:15", "instructions": null, "description": null, "longitude": 151.2093201, "price_per_day": 15.0, "bond": 400.0, "size_length": 4.0, "size_width": 3.0, "price_per_week": 100.0, "provider": {"discount_rate": 20.0, "name": "qinjian"}, "image": "", "available_type": 0, "unavailable_type": 0}'
        )
        booking20 = Booking(
            price=100.00,
            start_date=datetime(2022, 8, 4),
            end_date=datetime(2022, 8, 8),
            picked_dates="8/4/2022,8/5/2022,8/6/2022,8/7/2022,8/8/2022",
            status='paid',
            provider_id=1,
            customer_id=5,
            car_space_id=24,
            car_space_snapshot=r'{"address": "12 DEFRIES AVENUE ZETLAND NSW 2017", "amenities": "CCTV,24/7 Access,WC", "created_at": "2022-08-02T20:19:07", "car_space_type": "Driveway", "price_per_month": 500.0, "id": 24, "max_allowed_vehicle": "Hatch", "latitude": -33.9091148, "title": "Car space 24 zetland early learning centre", "max_height": null, "access_type": "Key", "address_id": "7a432f74796b4f6474593967554775743236614c70513d3d", "updated_at": "2022-08-02T20:19:07", "instructions": null, "description": null, "longitude": 151.2123108, "price_per_day": 20.0, "bond": 500.0, "size_length": 4.0, "size_width": 3.0, "price_per_week": 130.0, "provider": {"discount_rate": 20.0, "name": "qinjian"}, "image": "", "available_type": 0, "unavailable_type": 0}'
        )

        db.session.add_all([booking1, booking2, booking3, booking4, booking5, booking6, booking7, booking8, booking9,
                            booking10, booking11, booking12, booking13, booking14, booking15, booking16, booking17,
                            booking18, booking19, booking20])
        wl1 = Wishlist(
            min_price=10,
            max_price=100,
            price_type="week",
            address_id="6750686c6e4477366d564e5441467a726a38756956413d3d",
            address="UNIT 3005 28 TIMOTHY LANE MELBOURNE VIC 3000",
            latitude=-37.81217370,
            longitude=144.96114570,
            distance=200,
            car_space_types="Undercover,Indoor lot",
            max_allowed_vehicle="Hatch",
            customer_id=2
        )
        wl2 = Wishlist(
            min_price=100,
            max_price=1000,
            price_type="month",
            address_id="6b7971695645685a4443417a656763685851457731513d3d",
            address="200A GEORGE STREET SYDNEY NSW 2000",
            latitude=-33.86263026,
            longitude=151.2079821,
            distance=100,
            car_space_types="Undercover,Lock up garage",
            max_allowed_vehicle="Bike",
            customer_id=2
        )
        wl3 = Wishlist(
            min_price=50,
            max_price=120,
            price_type="Week",
            address_id="7669794a666661666e487048465063503650766943673d3d",
            address="3 VICTORIA PARK PARADE ZETLAND NSW 2017",
            latitude=-33.905316,
            longitude=151.210933,
            distance=1,
            car_space_types="Driveway,Undercover,Outside",
            max_allowed_vehicle="Hatch",
            customer_id=5
        )
        db.session.add_all([wl1, wl2, wl3])

        db.session.commit()
