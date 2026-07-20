from backend import models, database
print("Connecting to:", database.SQLALCHEMY_DATABASE_URL)
models.Base.metadata.create_all(bind=database.engine)
print("Tables created manually.")
