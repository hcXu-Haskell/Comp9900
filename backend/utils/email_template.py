# pass email body
email_layout = """
<div style="width:700px;margin:0 auto;border-bottom:1000px ;margin-bottom:-15;">
  <a href="#"><img src="https://s3.bmp.ovh/imgs/2022/07/22/9ce8debd302112db.png" alt="Where2Park logo" width="180"></a>
</div>
<table style="width: 99.8%; height: 95%;">
  <tbody>
    <tr>
      <td>
        <div style="width:700px;margin:0 auto;border-bottom:1px solid #ccc;margin-bottom:30px;">
        </div>
        <div style="width:680px;padding:0 10px;margin:0 auto;">
          <div style="line-height:1.5;font-size:14px;margin-bottom:25px;color:#4d4d4d;">
            <strong style="display:block;margin-bottom:15px;color:#4d4d4d;">Dear {},</strong>{}<strong style="display:block;margin-bottom:15px;color:#4d4d4d;">Regards<br>Where2Park Team</strong>
          </div>
        </div>
        <div style="width:700px;margin:0 auto;">
          <div style="padding:10px 10px 0;border-top:1px solid #ccc;color:#747474;margin-bottom:20px;line-height:1.3em;font-size:12px;">
            <p>This is a system email, please do not reply
            </p>
            <p>© Where2Park.com</p>
          </div>
        </div>
      </td>
    </tr>
  </tbody>
</table>
"""

# pass verification code
verification_code_email = """
<strong style="display:block;margin-bottom:15px;margin-left: 2em;">
  You are in the process of a 
  <span style="color: red">
    password reset 
  </span>
  . Your verification code is： 
</strong>
<br>
<div style="text-align:center;color:#f60;font-size: 24px">{}</div>
<br>
<strong style="display:block;margin-bottom:15px;margin-left: 2em;">
  The code is valid for five minutes, please complete verification as soon as possible.
</strong>
"""

# completion time, car space tittle, car space address, start date and end date,
# total days, total price, provider name, provider email, booking id
invoice_email = """
<head>
<style type="text/css">
    body {{
        margin: 0;
        background-color: #cccccc;
    }}
    table {{
        border-spacing: 0;
    }}
    td {{
        padding: 0;
    }}
    img {{
        border: 0;
    }}
    p{{
        margin: 0;
    }}
    .wrapper{{
        width: 100%;
        table-layout: fixed;
        background-color: #cccccc;
        padding-bottom:60px;
    }}
    .main{{
        background-color: #ffffff;
        margin: 0 auto;
        width: 100%;
        max-width:600px;
        border-spacing: 0;
        font-family: sans-serif;
        color:#171a1b;
    }}
</style>
</head>
<body>
<center class="wrapper">
<table class="main" width="100%" style="padding:10px 10px 10px 10px;">
<tr>
    <td style="padding: 0 0 0 30px;">
        <a href="#"><img src="https://s3.bmp.ovh/imgs/2022/07/22/9ce8debd302112db.png" alt="Where2Park" Title="Where2Park Logo" width="180"></a>
    </td>
</tr>
<tr>
    <td style="padding-top: 10px;;">
    <p style="font-size:15px;padding: 0 0 0 30px;">{}</p>
    </td>
</tr>
<tr>
<td>
    <table width="100%">
        <tr>
            <td style="padding: 0 0 0 30px;" width="70%">
                <br>
                <h1>Thanks for your payment!</h1>
                <h2><font size="3">The car space you booked is</font></h2>
                <h2><font size="3">{}</font></h2>
                <h2><font size="3">{}</font></h2>
                <h2><font size="3">{} ~ {}</font></h2>
            </td>
        </tr>
    </table>
</td>
</tr>
<td>
<table width="98%" style="padding:20px 0 20px 0">
    <tr>
        <td width="85%" style="padding:20px 0 5px 20px">
            <p>  Total days</p>
        </td>
        <td width="15%">
            <p>Total price</p>
        </td>
    </tr>
</table>
</td>
<tr>
<td style="background-color:#d3d3d3" height="1"></td>
</tr>
<tr>
<td>
    <table width="100%" style="padding:20px 0 20px 0">
        <tr>
            <td width="85%" style="padding-left: 30px;">
                <p>{}</p>
            </td>
            <td width="15%" style="" >
                <p>{}</p>
            </td>
        </tr>
    </table>
</td>
</tr>

<tr>
<td style="background-color:#171a1b;" height="1"></td>
</tr>

<tr>
<td>
    <table width="100%" style="padding-top: 20px;">
        <tr>
            <td width="78%" style="padding-left:15px;">
                <p style="font-size: 14;">You may need to contact the provider to get access</p>
                <p style="font-size: 14;">The provider {}'s email is:</p>
                <p style="font-size: 14;">{}</p><br><br>
           </td>
        </tr>
    </table>
</td>
</tr>

<tr>
<td>
    <table width="100%"style="background-color:#f5f5f5;">
        <tr>
            <td style="text-align:center;padding-bottom:30px;">
                <br>
                <p style="font-size: 14px;">Booking # {}</p>
            </td>
        </tr>
        <tr>
            <td style="text-align:center;">
                <p style="font-size: 14px; line-height: 20px;">
                    This is a system email, please do not reply.<br>
                    © Where2Park.com<br>
                </p>
            </td>
        </tr>

    </table>
</td>
</tr>
</body>
"""

# provider name, carspace title, carspace address, problem, customer name, customer email, provider name
problem_report_email = """
<strong style="display:block;margin-bottom:15px;margin-left: 2em;color:#4d4d4d;">
    There is a problem report about your car space {} in {}
    <br>
    "{}"
</strong>
<strong style="display:block;margin-bottom:15px;margin-left: 2em;color:#4d4d4d;">
    You may want to contact reporter {} (Email: {}) for more details.
</strong>
"""

# username,new carspace link, new carspace title, new carspace address,
# price per day, week, month, car space type, max allowed vehicle, amenities,
# username
car_space_recommendation_email = """

<strong style="display:block;margin-bottom:15px;margin-left: 2em;color:#4d4d4d;">
  According to your booking history, here is a new car space <a href="{}">{}</a> at {} you might be interested in.<br>
</strong>
<strong style="display:block;margin-bottom:15px;margin-left: 2em;color:#4d4d4d;">
  Car spaces details are as follows:<br>
</strong>
<strong style="display:block;margin-bottom:15px;margin-left: 4em;color:#4d4d4d;">
  Price per day: {};<br>
  Price per week: {};<br>
  Price per month: {};<br>
  Car space type: {};<br>
  Max allowed vehicle: {};<br>
  Amenities: {};<br>
</strong>
<strong style="display:block;margin-bottom:15px;margin-left: 2em;color:#4d4d4d;">
  You're receiving this email because you are subscribed to <a href="http://localhost:3000">Where2Park.com</a>.
  <br>
  If you don't want to receive this email in the future, uncheck the box before 
  "I want to receive emails of recommended car spaces based on my booking history" 
  in user profile system setting on the website.
</strong>
"""

# The higher price car space is A
# The lower price car space is B
# A username, B carspace id, B carspace title, B carspace address, A carspace list, A username
competitive_car_space_notification_email = """
<strong style="display:block;margin-bottom:15px;margin-left: 2em;color:#4d4d4d;">
  <p>
    A competitive car space <a href="http://localhost:3000/car-space-detail/{}">{}</a> at {} was just posted on the website.
  </p>
  <p>Your nearby parking space is listed below:</p>
  {}
</strong>
<strong style="display:block;margin-bottom:15px;margin-left: 2em;color:#4d4d4d;">
  You're receiving this email because you are subscribed to <a href="http://localhost:3000">Where2Park.com</a>.<br>
  If you don't want to receive this email in the future, uncheck the box before 
  "I want to receive an email when there is a new competitive car space posted" 
  in user profile system setting on the website.
</strong>
"""

# A car space id, A car space title
car_space_hyperlink = """
&emsp;&emsp;<a href="http://localhost:3000/car-space-detail/{}">{}</a><br>
"""

# username,new carspace link, new carspace title, new carspace address,
# wishlist min price, wishlist max price, wishlist location
# wishlist car space type,wishlist max allowed vehicle, username
wish_list_notification_email = """
<strong style="display:block;margin-bottom:15px;margin-left: 2em;color:#4d4d4d;">
    A new car space <a href="{}">{}</a> at {} was just posted on <a href="http://localhost:3000">Where2Park.com</a>. 
    This car space was recommended to you because you registered a wishlist on the website. 
</strong>
<strong style="display:block;margin-bottom:15px;margin-left: 2em;color:#4d4d4d;">
    Your wish list details are as follows:<br>
</strong>
<strong style="display:block;margin-bottom:15px;margin-left: 4em;color:#4d4d4d;">
    Price range: {} ~ {};<br>
    Location: {};<br>
    Car space type: {};<br>
    Max allowed vehicle: {};<br>
</strong>
<strong style="display:block;margin-bottom:15px;margin-left: 2em;color:#4d4d4d;">
    You're receiving this email because you are subscribed to <a href="http://localhost:3000">Where2Park.com</a>.<br>
    If you don't want to receive this email in the future, 
    delete the wish list item in user profile page on the website.
</strong>
"""

# pass bookings table
statement_email = """
<strong style="display:block;margin-bottom:15px;margin-left: 2em;color:#4d4d4d;">
  <p>Thanks for using <a href="http://localhost:3000">Where2Park.com</a>.</p>
  {}
</strong>
"""


def construct_email(email_template: str, name: str, *args):
    return email_layout.format(name, email_template.format(*args))
