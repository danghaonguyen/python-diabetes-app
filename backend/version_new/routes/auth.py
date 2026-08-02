from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import random
import MySQLdb.cursors

from db.db import mysql
from services.email_service import send_email

auth_bp = Blueprint('auth', __name__)

# ================== HELPER ==================
def clean(value):
    return str(value).strip().lower() if value is not None else None


def get_user_by_email(email):
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    return cursor.fetchone()


# ================== SEND VERIFY CODE ==================
@auth_bp.route('/send_verification_code', methods=['POST'])
def send_verification_code():
    data = request.get_json()
    email = clean(data.get('email'))

    if not email:
        return jsonify({"message": "Thiếu email"}), 400

    code = str(random.randint(100000, 999999))

    session['verify_code'] = code
    session.modified = True

    try:
        send_email(email, "Mã xác thực", f"Mã của bạn là: {code}")
    except Exception as e:
        return jsonify({"message": "Gửi email lỗi", "error": str(e)}), 500

    return jsonify({"message": "Đã gửi mã xác thực"}), 200


# ================== REGISTER ==================
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    username = data.get('username')
    email = clean(data.get('email'))
    password = data.get('password')
    code = clean(data.get('code'))

    if not all([username, email, password, code]):
        return jsonify({"message": "Thiếu thông tin"}), 400

    session_code = clean(session.get('verify_code'))

    if code != session_code:
        return jsonify({"message": "Mã xác thực không đúng"}), 400

    if get_user_by_email(email):
        return jsonify({"message": "Email đã tồn tại"}), 409

    hashed = generate_password_hash(password)

    cursor = mysql.connection.cursor()
    cursor.execute("""
        INSERT INTO users (username, email, password)
        VALUES (%s, %s, %s)
    """, (username, email, hashed))

    mysql.connection.commit()
    cursor.close()

    session.pop('verify_code', None)

    return jsonify({"message": "Đăng ký thành công"}), 201


# ================== LOGIN ==================
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = clean(data.get('email'))
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Thiếu dữ liệu"}), 400

    user = get_user_by_email(email)

    if not user:
        return jsonify({"message": "Tài khoản không tồn tại"}), 404

    stored_password = user.get("password")

    if not stored_password:
        return jsonify({"message": "Dữ liệu mật khẩu lỗi"}), 500

    try:
        ok = check_password_hash(stored_password, password)
    except Exception:
        return jsonify({"message": "Lỗi kiểm tra mật khẩu"}), 500

    if not ok:
        return jsonify({"message": "Sai mật khẩu"}), 401

    return jsonify({
        "message": "Đăng nhập thành công",
        "user_id": user["id"],
        "username": user["username"]
    }), 200


# ================== SEND RESET CODE ==================
@auth_bp.route('/send_password_reset', methods=['POST'])
def send_password_reset():
    data = request.get_json()
    email = clean(data.get('email'))

    if not email:
        return jsonify({"message": "Thiếu email"}), 400

    user = get_user_by_email(email)

    if not user:
        return jsonify({"message": "Email không tồn tại"}), 404

    reset_code = str(random.randint(100000, 999999))
    expiry = datetime.now() + timedelta(minutes=15)

    cursor = mysql.connection.cursor()
    cursor.execute("""
        UPDATE users
        SET reset_code=%s,
            reset_code_expiry=%s
        WHERE email=%s
    """, (reset_code, expiry, email))

    mysql.connection.commit()

    send_email(email, "Reset mật khẩu", f"Mã của bạn là: {reset_code}")

    return jsonify({"message": "Đã gửi mã reset"}), 200


# ================== VERIFY RESET CODE ==================
@auth_bp.route('/verify_reset_code', methods=['POST'])
def verify_reset_code():
    data = request.get_json()

    email = clean(data.get("email"))
    code = clean(data.get("code"))

    if not email or not code:
        return jsonify({"message": "Thiếu dữ liệu"}), 400

    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

    cursor.execute("""
        SELECT reset_code, reset_code_expiry
        FROM users
        WHERE email = %s
    """, (email,))

    result = cursor.fetchone()

    if not result:
        return jsonify({"message": "Email không tồn tại"}), 404

    db_code = clean(result.get("reset_code"))
    expiry = result.get("reset_code_expiry")

    if not db_code:
        return jsonify({"message": "Chưa có mã xác thực"}), 400

    if db_code != code:
        return jsonify({"message": "Sai mã xác thực"}), 400

    if not expiry or datetime.now() > expiry:
        return jsonify({"message": "Mã đã hết hạn"}), 400

    return jsonify({"message": "OK"}), 200


# ================== RESET PASSWORD ==================
@auth_bp.route('/reset_password', methods=['POST'])
def reset_password():
    data = request.get_json()

    email = clean(data.get("email"))
    code = clean(data.get("code"))
    new_password = data.get("new_password")

    if not all([email, code, new_password]):
        return jsonify({"message": "Thiếu dữ liệu"}), 400

    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

    cursor.execute("""
        SELECT reset_code, reset_code_expiry
        FROM users
        WHERE email = %s
    """, (email,))

    result = cursor.fetchone()

    if not result:
        return jsonify({"message": "Email không tồn tại"}), 404

    db_code = clean(result.get("reset_code"))
    expiry = result.get("reset_code_expiry")

    if db_code != code:
        return jsonify({"message": "Sai mã xác thực"}), 400

    if not expiry or datetime.now() > expiry:
        return jsonify({"message": "Mã đã hết hạn"}), 400

    hashed = generate_password_hash(new_password)

    cursor.execute("""
        UPDATE users
        SET password=%s,
            reset_code=NULL,
            reset_code_expiry=NULL
        WHERE email=%s
    """, (hashed, email))

    mysql.connection.commit()

    return jsonify({"message": "Đổi mật khẩu thành công"}), 200