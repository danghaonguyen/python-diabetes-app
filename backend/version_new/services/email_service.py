import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email(to, subject, body):
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