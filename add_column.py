import sqlite3
import os

db_path = "sql_app.db"

if not os.path.exists(db_path):
    print(f"Database file {db_path} not found.")
else:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN profile_image VARCHAR")
        conn.commit()
        print("Column profile_image added successfully to users table.")
    except Exception as e:
        print(f"Error adding column: {e}")
    finally:
        conn.close()
