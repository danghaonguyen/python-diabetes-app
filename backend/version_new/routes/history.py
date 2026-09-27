from contextlib import closing
from datetime import datetime

import MySQLdb.cursors
from flask import Blueprint, jsonify, session

from db.db import mysql

history_bp = Blueprint('history', __name__)

DATETIME_FORMAT = "%Y-%m-%d %H:%M:%S"


def _format_datetime(value):
    """Chuẩn hoá cột created_at (datetime -> chuỗi) để JSON hoá được."""
    if isinstance(value, datetime):
        return value.strftime(DATETIME_FORMAT)
    return value


# ================== LẤY LỊCH SỬ ==================
@history_bp.route('/history/<int:user_id>', methods=['GET'])
def get_history(user_id):
    if session.get('user_id') != user_id:
        return jsonify({"message": "Không có quyền truy cập"}), 403

    try:
        # closing() đảm bảo cursor luôn được đóng, kể cả khi query lỗi.
        with closing(mysql.connection.cursor(MySQLdb.cursors.DictCursor)) as cursor:
            cursor.execute("""
                SELECT *
                FROM predictions
                WHERE user_id = %s
                ORDER BY created_at DESC
            """, (user_id,))

            rows = cursor.fetchall()
    except Exception:
        return jsonify({"message": "Không thể tải lịch sử. Vui lòng thử lại."}), 500

    for row in rows:
        row["created_at"] = _format_datetime(row.get("created_at"))

    return jsonify(rows)


# ================== XOÁ LỊCH SỬ ==================
@history_bp.route('/history/<int:prediction_id>', methods=['DELETE'])
def delete_prediction(prediction_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"message": "Vui lòng đăng nhập"}), 401

    cursor = mysql.connection.cursor()
    try:
        cursor.execute(
            "DELETE FROM predictions WHERE id = %s AND user_id = %s",
            (prediction_id, user_id),
        )

        if cursor.rowcount == 0:
            mysql.connection.rollback()
            return jsonify({"message": "Không thấy bản ghi hoặc không có quyền xóa"}), 404

        mysql.connection.commit()
        return jsonify({"message": "Đã xóa thành công"}), 200
    except Exception:
        # Rollback để không bỏ treo transaction dang dở.
        mysql.connection.rollback()
        return jsonify({"message": "Xoá thất bại. Vui lòng thử lại."}), 500
    finally:
        cursor.close()
