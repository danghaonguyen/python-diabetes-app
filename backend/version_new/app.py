from flask import Flask
from flask_cors import CORS
from db import init_db, mysql
from routes.predict import predict_bp
from routes.auth import auth_bp
from routes.history import history_bp
import config

print("🚀 APP IS RUNNING VERSION 999")

def create_app():
    app = Flask(__name__)

    app.secret_key = "super_secret_key_123"

    # 🔥 FIX QUAN TRỌNG
    app.config.from_object(config)

    CORS(app, supports_credentials=True, origins=["http://127.0.0.1:3000"])

    init_db(app)

    app.register_blueprint(predict_bp, url_prefix='/api')
    app.register_blueprint(history_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api')

    return app


app = create_app()

# 🔥 TEST DB CONNECTION
@app.route("/test-db")
def test_db():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT 1")
        cur.close()
        return "DB OK"
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    app.run(debug=True)