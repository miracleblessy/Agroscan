
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "agroscan.db"

CLASSES = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Blueberry___healthy",
    "Cherry_(including_sour)___Powdery_mildew",
    "Cherry_(including_sour)___healthy",
]


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def create_tables():
    with get_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS prediction_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                image_name TEXT NOT NULL,
                plant_name TEXT NOT NULL,
                disease_name TEXT NOT NULL,
                confidence REAL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        conn.execute("""
            CREATE TABLE IF NOT EXISTS supported_classes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                class_name TEXT UNIQUE NOT NULL
            )
        """)

        conn.executemany("""
            INSERT OR IGNORE INTO supported_classes (class_name)
            VALUES (?)
        """, [(name,) for name in CLASSES])


def save_prediction(image_name, plant_name, disease_name, confidence):
    with get_connection() as conn:
        conn.execute("""
            INSERT INTO prediction_history
            (image_name, plant_name, disease_name, confidence)
            VALUES (?, ?, ?, ?)
        """, (image_name, plant_name, disease_name, confidence))


def get_predictions():
    with get_connection() as conn:
        return conn.execute("""
            SELECT * FROM prediction_history
            ORDER BY id DESC
        """).fetchall()


def get_supported_classes():
    with get_connection() as conn:
        return conn.execute("""
            SELECT class_name FROM supported_classes
            ORDER BY id
        """).fetchall()


if __name__ == "__main__":
    create_tables()
    print("AgroScan database connected successfully!")
    print("Supported classes:", len(get_supported_classes()))
