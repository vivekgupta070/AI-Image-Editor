import sqlite3
import os

for db_file in ['sql_app.db', 'database.db']:
    if os.path.exists(db_file):
        print(f"--- Checking {db_file} ---")
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        print(f"Tables: {tables}")
        if ('users',) in tables:
            cursor.execute("PRAGMA table_info(users)")
            print(f"Users schema: {cursor.fetchall()}")
            cursor.execute("SELECT email, password FROM users LIMIT 1")
            print(f"One user entry: {cursor.fetchall()}")
        conn.close()
    else:
        print(f"{db_file} does not exist")
