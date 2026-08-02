from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_mysqldb import MySQL
import MySQLdb.cursors
import random
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB
from prediction import predict_from_input
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta



app = Flask(__name__)
app.secret_key = os.urandom(24)
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False

CORS(app, supports_credentials=True, origins=["http://127.0.0.1:3000"])

app.config['MYSQL_HOST'] = MYSQL_HOST
app.config['MYSQL_USER'] = MYSQL_USER
app.config['MYSQL_PASSWORD'] = MYSQL_PASSWORD
app.config['MYSQL_DB'] = MYSQL_DB
mysql = MySQL(app)

# Gửi mã xác thực code Gmail
@app.route('/send_verification_code', methods=['POST'])
def send_verification_code():
    data = request.get_json()
    email = data['email']
    code = str(random.randint(100000, 999999))
    session['verify_code'] = code
    print(f"[DEBUG] Mã xác thực gửi tới {email}: {code}")
    send_email(email, "Mã xác thực", f"Mã xác thực của bạn là: {code}")
    return jsonify({"message": "Đã gửi mã xác thực"}), 200


#--------------------------------------------------------------------------------#
# Đăng ký
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    code = data.get('code')

    print("[DEBUG] Mã từ client:", code)
    print("[DEBUG] Mã lưu trong session:", session.get("verify_code"))

    if not username or not email or not password or not code:
        return jsonify({'message': 'Thiếu thông tin'}), 400
    if code != session.get('verify_code'):
        return jsonify({'message': 'Mã xác thực không đúng'}), 400

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    if cursor.fetchone():
        return jsonify({'message': 'Email đã tồn tại'}), 409

    hashed = generate_password_hash(password)
    cursor.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)", (username, email, hashed))
    mysql.connection.commit()
    cursor.close()
    session.pop('verify_code', None)
    return jsonify({'message': 'Đăng ký thành công'}), 201


#--------------------------------------------------------------------------------#
# Đăng nhập
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"message": "Thiếu thông tin"}), 400
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    if not user:
        return jsonify({"message": "Tài khoản không tồn tại"}), 404
    if not check_password_hash(user['password'], password):
        return jsonify({"message": "Sai mật khẩu"}), 401
    return jsonify({
        "message": "Đăng nhập thành công",
        "user_id": user["id"],
        "username": user["username"]
    }), 200


#--------------------------------------------------------------------------------#
# Gửi mã xác thực đặt lại mật khẩu
@app.route('/send_password_reset', methods=['POST'])
def send_password_reset():
    data = request.get_json()
    email = data.get('email')

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    if not user:
        return jsonify({'message': 'Email không tồn tại'}), 404

    reset_code = str(random.randint(100000, 999999))
    expiry_time = datetime.now() + timedelta(minutes=15)

    cursor.execute(
        "UPDATE users SET reset_code = %s, reset_code_expiry = %s WHERE email = %s",
        (reset_code, expiry_time, email)
    )
    mysql.connection.commit()

    send_email(email, "Mã đặt lại mật khẩu", f"Mã đặt lại mật khẩu của bạn là: {reset_code}")

    return jsonify({'message': 'Đã gửi mã đặt lại mật khẩu'}), 200



#--------------------------------------------------------------------------------#
# Xác thực mã reset code
@app.route('/verify_reset_code', methods=['POST'])
def verify_reset_code():
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT reset_code, reset_code_expiry FROM users WHERE email = %s", (email,))
    result = cursor.fetchone()

    if not result:
        return jsonify({'message': 'Email không tồn tại'}), 404

    saved_code, expiry = result

    if saved_code != code:
        return jsonify({'message': 'Mã xác nhận không đúng'}), 400

    if expiry < datetime.now():
        return jsonify({'message': 'Mã xác nhận đã hết hạn'}), 400

    return jsonify({'message': 'Xác thực thành công'}), 200


#--------------------------------------------------------------------------------#
# Đổi mật khẩu mới
@app.route('/reset_password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')
    new_password = data.get('new_password')

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT reset_code, reset_code_expiry FROM users WHERE email = %s", (email,))
    result = cursor.fetchone()

    if not result:
        return jsonify({'message': 'Email không tồn tại'}), 404

    saved_code, expiry = result

    if saved_code != code:
        return jsonify({'message': 'Mã xác nhận không đúng'}), 400

    if expiry < datetime.now():
        return jsonify({'message': 'Mã xác nhận đã hết hạn'}), 400

    hashed_password = generate_password_hash(new_password)

    cursor.execute(
        "UPDATE users SET password = %s, reset_code = NULL, reset_code_expiry = NULL WHERE email = %s",
        (hashed_password, email)
    )
    mysql.connection.commit()

    return jsonify({'message': 'Đổi mật khẩu thành công'}), 200

#--------------------------------------------------------------------------------#
# Dự đoán
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        user_id = data.get("user_id")
        prediction_text = predict_from_input(data)
        save_prediction_to_db(data, user_id, prediction_text)
        return jsonify({"result": prediction_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 400


#--------------------------------------------------------------------------------#
# Lưu lịch sử dự đoán 
def save_prediction_to_db(data, user_id, prediction_text):
    import re
    probability_match = re.search(r"Xác suất: ([\d.]+)%", prediction_text)
    probability = float(probability_match.group(1)) / 100 if probability_match else None

    if "🔴 CAO" in prediction_text:
        outcome = "Cao"
    elif "🟠 TRUNG BÌNH" in prediction_text:
        outcome = "Trung bình"
    else:
        outcome = "Thấp"

    created_at = datetime.utcnow() + timedelta(hours=7)

    cursor = mysql.connection.cursor()
    cursor.execute("""
        INSERT INTO predictions (
            user_id, age, gender, pulse_rate, systolic_bp, diastolic_bp,
            glucose, height, weight, bmi, family_diabetes, hypertensive,
            family_hypertension, cardiovascular_disease, stroke,
            prediction_result, prediction_probability,  created_at
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        user_id,
        data["age"], data["gender"], data["pulse_rate"], data["systolic_bp"], data["diastolic_bp"],
        data["glucose"], data["height"], data["weight"], data["bmi"],
        data["family_diabetes"], data["hypertensive"],
        data["family_hypertension"], data["cardiovascular_disease"], data["stroke"],
        outcome, probability, created_at
    ))
    mysql.connection.commit()
    cursor.close()

#--------------------------------------------------------------------------------#

# Gọi GET để lấy dự liệu
@app.route("/history/<int:user_id>", methods=["GET"])
def get_history(user_id):
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("""
        SELECT *
        FROM predictions
        WHERE user_id = %s
        ORDER BY created_at DESC
    """, (user_id,))
    rows = cursor.fetchall()

    # Chuyển datetime sang chuỗi "YYYY-MM-DD HH:MM:SS" trước khi trả về
    for row in rows:
        if isinstance(row.get("created_at"), datetime):
            row["created_at"] = row["created_at"].strftime("%Y-%m-%d %H:%M:%S")

    cursor.close()
    return jsonify(rows)

#--------------------------------------------------------------------------------#
# Xóa lịch sử dự đoán
@app.route("/history/<int:prediction_id>", methods=["DELETE"])
def delete_prediction(prediction_id):
    try:
        
        cursor = mysql.connection.cursor()
        cursor.execute("DELETE FROM predictions WHERE id = %s", (prediction_id,))
        mysql.connection.commit()
        cursor.close()
        return jsonify({"message": "Đã xóa dự đoán thành công."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#--------------------------------------------------------------------------------#

# Kiểm tra mã session
@app.route("/check_session")
def check_session():
    return jsonify({"verify_code": session.get("verify_code")})

def send_email(to, subject, body):
    try:
        sender_email = "thayhkk@gmail.com"
        app_password = "tcxbblwjwukysutk"
        msg = MIMEMultipart()
        msg["From"] = sender_email
        msg["To"] = to
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, app_password)
        server.sendmail(sender_email, to, msg.as_string())
        server.quit()
        print(f"[✅] Đã gửi email tới {to}")
    except Exception as e:
        print(f"[❌] Gửi email lỗi: {e}")

if __name__ == "__main__":
    app.run(debug=True)
