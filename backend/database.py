from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from fastapi import Depends

call_db_URL = "postgresql://postgres:Omkar%4016@localhost/options_ce_db"
put_db_URL = "postgresql://postgres:Omkar%4016@localhost/options_pe_db"

call_engine = create_engine(call_db_URL)
put_engine = create_engine(put_db_URL)

CallSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=call_engine)
PutSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=put_engine)

Base = declarative_base()

def get_call_db():
    db = CallSessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_put_db():
    db = PutSessionLocal()
    try:
        yield db
    finally:
        db.close()
