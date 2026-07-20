from backend import database, models, schemas, crud
from sqlalchemy.orm import Session

def check_db():
    db = next(database.get_db())
    try:
        print("Starting manual user creation...")
        user_in = schemas.UserCreate(
            email="manual_test@example.com",
            password="testpassword",
            full_name="Manual Test"
        )
        # Check if exists
        existing = crud.get_user_by_email(db, email=user_in.email)
        if existing:
            print("User already exists, deleting...")
            db.delete(existing)
            db.commit()
            
        new_user = crud.create_user(db, user_in)
        print(f"Created user: {new_user.email}, ID: {new_user.id}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_db()
