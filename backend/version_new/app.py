from flask import Flask
from flask_cors import CORS

import config
from db.db import init_db, mysql
from routes.auth import auth_bp
from routes.history import history_bp
from routes.predict import predict_bp


def create_app():
    app = Flask(__name__)

    app.config.from_object(config)

    # SECRET_KEY dùng để ký cookie session.
    app.secret_key = config.SECRET_KEY

    CORS(app, supports_credentials=True, origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ])

    init_db(app)

    app.register_blueprint(predict_bp, url_prefix='/api')
    app.register_blueprint(history_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api')

    return app


app = create_app()


# Kiểm tra kết nối DB. Chỉ trả thông báo chung, không lộ chi tiết lỗi ra ngoài.
@app.route("/test-db")
def test_db():
    try:
        cur = mysql.connection.cursor()
        try:
            cur.execute("SELECT 1")
        finally:
            cur.close()
        return "DB OK"
    except Exception:
        app.logger.exception("Kết nối DB thất bại")
        return "DB ERROR", 500
if __name__ == "__main__":
    app.run(debug=config.DEBUG)