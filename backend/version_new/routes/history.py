from flask import Blueprint, jsonify
import MySQLdb.cursors
from db.db import mysql
from datetime import datetime

history_bp = Blueprint('history', __name__)


# ================== LẤY LỊCH SỬ ==================
@history_bp.route('/history/<int:user_id>', methods=['GET'])
def get_history(user_id):
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

    cursor.execute("""
        SELECT *
        FROM predictions
        WHERE user_id = %s
        ORDER BY created_at DESC
    """, (user_id,))

    rows = cursor.fetchall()

    # format datetime
    for row in rows:
        if isinstance(row.get("created_at"), datetime):
            row["created_at"] = row["created_at"].strftime("%Y-%m-%d %H:%M:%S")

    cursor.close()

    return jsonify(rows)


# ================== XOÁ LỊCH SỬ ==================
@history_bp.route('/history/<int:prediction_id>', methods=['DELETE'])
def delete_prediction(prediction_id):
    try:
        cursor = mysql.connection.cursor()

        cursor.execute(
            "DELETE FROM predictions WHERE id = %s",
            (prediction_id,)
        )

        mysql.connection.commit()
        cursor.close()

        return jsonify({"message": "Đã xóa thành công"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500