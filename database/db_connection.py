import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "agroscan.db"

# These class names must exactly match model/class_names.txt
CLASSES = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Blueberry___healthy",
    "Cherry_(including_sour)___Powdery_mildew",
    "Cherry_(including_sour)___healthy",
]


# ---------------------------------------------------------
# Database connection
# ---------------------------------------------------------

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


# ---------------------------------------------------------
# Create database tables
# ---------------------------------------------------------

def create_tables():
    with get_connection() as conn:

        # Prediction history table
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

        # Supported ML classes table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS supported_classes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                class_name TEXT UNIQUE NOT NULL
            )
        """)

        # Disease information table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS disease_information (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                class_name TEXT UNIQUE NOT NULL,
                plant_name TEXT NOT NULL,
                disease_name TEXT NOT NULL,
                symptoms TEXT NOT NULL,
                treatment TEXT NOT NULL,
                prevention TEXT NOT NULL,
                is_healthy INTEGER NOT NULL
            )
        """)

        # Insert the 7 supported classes
        conn.executemany("""
            INSERT OR IGNORE INTO supported_classes (class_name)
            VALUES (?)
        """, [(class_name,) for class_name in CLASSES])


# ---------------------------------------------------------
# Seven disease / healthy information records
# ---------------------------------------------------------

DISEASE_DATA = [

    (
        "Apple___Apple_scab",
        "Apple",
        "Apple Scab",
        "Olive-green or brown spots on leaves and fruit. "
        "Severe infection may cause leaf drop and damaged fruit.",
        "Remove infected leaves and fallen plant debris. "
        "Use appropriate fungicides according to agricultural guidance.",
        "Keep the orchard clean, remove fallen leaves, "
        "provide good air circulation, and avoid prolonged leaf wetness.",
        0
    ),

    (
        "Apple___Black_rot",
        "Apple",
        "Black Rot",
        "Brown or purple spots on leaves, fruit rot, "
        "and dark sunken lesions on branches.",
        "Remove and destroy infected fruit, branches, and plant debris. "
        "Use suitable fungicide when recommended.",
        "Remove dead wood and mummified fruit, maintain orchard sanitation, "
        "and improve air circulation.",
        0
    ),

    (
        "Apple___Cedar_apple_rust",
        "Apple",
        "Cedar Apple Rust",
        "Yellow or orange spots on apple leaves. "
        "Infected leaves may develop dark structures on the underside.",
        "Remove severely infected plant material where practical "
        "and use appropriate fungicide according to local recommendations.",
        "Remove nearby alternate host plants when appropriate, "
        "maintain good air circulation, and monitor plants regularly.",
        0
    ),

    (
        "Apple___healthy",
        "Apple",
        "Healthy",
        "Leaves appear normally green and healthy with no visible "
        "major disease symptoms.",
        "No disease treatment is required. Continue normal plant care "
        "and provide suitable water and nutrients.",
        "Maintain proper watering, balanced nutrition, sanitation, "
        "good air circulation, and regular monitoring.",
        1
    ),

    (
        "Blueberry___healthy",
        "Blueberry",
        "Healthy",
        "Leaves appear healthy and green without obvious disease symptoms.",
        "No disease treatment is required. Continue normal blueberry care "
        "and provide suitable water and nutrients.",
        "Maintain proper watering, good drainage, adequate nutrition, "
        "sanitation, and regular monitoring.",
        1
    ),

    (
        "Cherry_(including_sour)___Powdery_mildew",
        "Cherry",
        "Powdery Mildew",
        "White or gray powder-like growth on leaves and young shoots. "
        "Leaves may curl or become distorted.",
        "Remove severely affected plant material where practical "
        "and use an appropriate fungicide according to local guidance.",
        "Provide good air circulation, avoid excessive nitrogen, "
        "maintain proper spacing, and monitor new growth.",
        0
    ),

    (
        "Cherry_(including_sour)___healthy",
        "Cherry",
        "Healthy",
        "Leaves appear normally green and healthy without obvious "
        "powdery mildew or other major disease symptoms.",
        "No disease treatment is required. Continue normal plant care "
        "and provide appropriate water and nutrients.",
        "Maintain good sanitation, proper watering, balanced nutrition, "
        "good air circulation, and regular monitoring.",
        1
    )
]


# ---------------------------------------------------------
# Insert or update disease information
# ---------------------------------------------------------

def insert_or_update_disease_data():

    with get_connection() as conn:

        for record in DISEASE_DATA:

            conn.execute("""
                INSERT INTO disease_information
                (
                    class_name,
                    plant_name,
                    disease_name,
                    symptoms,
                    treatment,
                    prevention,
                    is_healthy
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)

                ON CONFLICT(class_name)
                DO UPDATE SET
                    plant_name = excluded.plant_name,
                    disease_name = excluded.disease_name,
                    symptoms = excluded.symptoms,
                    treatment = excluded.treatment,
                    prevention = excluded.prevention,
                    is_healthy = excluded.is_healthy
            """, record)


# ---------------------------------------------------------
# Get disease information using exact ML class name
# ---------------------------------------------------------

def get_disease_info(class_name):

    with get_connection() as conn:

        result = conn.execute("""
            SELECT
                id,
                class_name,
                plant_name,
                disease_name,
                symptoms,
                treatment,
                prevention,
                is_healthy
            FROM disease_information
            WHERE class_name = ?
        """, (class_name,)).fetchone()

        if result:
            return dict(result)

        return None


# ---------------------------------------------------------
# Save prediction result
# ---------------------------------------------------------

def save_prediction(
    image_name,
    plant_name,
    disease_name,
    confidence
):

    with get_connection() as conn:

        cursor = conn.execute("""
            INSERT INTO prediction_history
            (
                image_name,
                plant_name,
                disease_name,
                confidence
            )
            VALUES (?, ?, ?, ?)
        """, (
            image_name,
            plant_name,
            disease_name,
            confidence
        ))

        return cursor.lastrowid


# ---------------------------------------------------------
# Get prediction history
# ---------------------------------------------------------

def get_predictions():

    with get_connection() as conn:

        return conn.execute("""
            SELECT *
            FROM prediction_history
            ORDER BY id DESC
        """).fetchall()


# ---------------------------------------------------------
# Get all supported ML classes
# ---------------------------------------------------------

def get_supported_classes():

    with get_connection() as conn:

        return conn.execute("""
            SELECT class_name
            FROM supported_classes
            ORDER BY id
        """).fetchall()


# ---------------------------------------------------------
# Main database setup and testing
# ---------------------------------------------------------

if __name__ == "__main__":

    create_tables()

    insert_or_update_disease_data()

    print("AgroScan database connected successfully!")
    print("Disease information table updated successfully!")

    classes = get_supported_classes()

    print("\nTotal supported classes:", len(classes))

    for row in classes:
        print("-", row["class_name"])

    print("\nDisease information test:")

    test_class = "Apple___Apple_scab"

    disease = get_disease_info(test_class)

    if disease:
        print("Class:", disease["class_name"])
        print("Plant:", disease["plant_name"])
        print("Disease:", disease["disease_name"])
        print("Symptoms:", disease["symptoms"])
        print("Treatment:", disease["treatment"])
        print("Prevention:", disease["prevention"])
        print("Healthy:", bool(disease["is_healthy"]))
    else:
        print("Disease information not found.")