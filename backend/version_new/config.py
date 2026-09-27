# config.py
import os
from dotenv import load_dotenv
# Nạp biến từ file .env (nếu có) vào os.environ.
# File .env đã được .gitignore chặn nên không bị đẩy lên Git.
load_dotenv()

# ===== Database =====
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
MYSQL_DB = os.getenv("MYSQL_DB", "diabetes_app")
MYSQL_CURSORCLASS = "DictCursor"

# ===== Flask =====
# Bắt buộc đặt SECRET_KEY trong .env khi deploy production.
SECRET_KEY = os.getenv("SECRET_KEY", "dev-only-insecure-key")

# Cấu hình cookie session: chỉ gửi qua HTTP, không cho JS đọc.
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = "Lax"

# ===== Email (SMTP) =====
# KHÔNG hardcode trong mã nguồn — luôn đặt trong .env.
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_EMAIL = os.getenv("SMTP_EMAIL", "")
SMTP_APP_PASSWORD = os.getenv("SMTP_APP_PASSWORD", "")