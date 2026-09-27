import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

import config


def send_email(to, subject, body):
    """Gửi email qua SMTP. Cấu hình lấy từ .env (config.SMTP_*)."""
    sender_email = config.SMTP_EMAIL
    app_password = config.SMTP_APP_PASSWORD

    if not sender_email or not app_password:
        raise RuntimeError(
            "Thiếu cấu hình SMTP_EMAIL / SMTP_APP_PASSWORD. Hãy điền vào file .env."
        )

    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = to
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    server = smtplib.SMTP(config.SMTP_HOST, config.SMTP_PORT)
    try:
        server.starttls()
        server.login(sender_email, app_password)
        server.sendmail(sender_email, to, msg.as_string())
    finally:
        server.quit()