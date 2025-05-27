from fastapi import FastAPI, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List

from database import get_call_db, get_put_db
from models import (
    OptionsChainData_0_1_0,
    OptionsChainData_0_5_0,
    PriceData_0_1_0,
    PriceData_0_5_0
)

from schemas import Options_Chain_Data_Schema, Price_Data_Schema

app = FastAPI()

def parse_date(date_str: str):
    try:
        return datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Date must be in YYYY-MM-DD format")


# ======== Call Database ======== #

@app.get("/call/options_chain_data_0_1_0/filter", response_model=List[Options_Chain_Data_Schema])
def filter_call_options_chain_010(start: str, end: str, db: Session = Depends(get_call_db)):
    return db.query(OptionsChainData_0_1_0).filter(
        OptionsChainData_0_1_0.Datetime.between(parse_date(start), parse_date(end))
    ).limit(50).all()


@app.get("/call/options_chain_data_0_5_0", response_model=List[Options_Chain_Data_Schema])
def get_call_options_chain_050(db: Session = Depends(get_call_db)):
    return db.query(OptionsChainData_0_5_0).order_by(OptionsChainData_0_5_0.Datetime.desc()).limit(50).all()


@app.get("/call/options_chain_data_0_5_0/filter", response_model=List[Options_Chain_Data_Schema])
def filter_call_options_chain_050(start: str, end: str, db: Session = Depends(get_call_db)):
    return db.query(OptionsChainData_0_5_0).filter(
        OptionsChainData_0_5_0.Datetime.between(parse_date(start), parse_date(end))
    ).limit(50).all()


@app.get("/call/price_data_0_1_0/filter", response_model=List[Price_Data_Schema])
def filter_call_price_data_010(start: str, end: str, db: Session = Depends(get_call_db)):
    return db.query(PriceData_0_1_0).filter(
        PriceData_0_1_0.Datetime.between(parse_date(start), parse_date(end))
    ).limit(50).all()


@app.get("/call/price_data_0_5_0/filter", response_model=List[Price_Data_Schema])
def filter_call_price_data_050(start: str, end: str, db: Session = Depends(get_call_db)):
    return db.query(PriceData_0_5_0).filter(
        PriceData_0_5_0.Datetime.between(parse_date(start), parse_date(end))
    ).limit(50).all()


# ======== Put Database ======== #

@app.get("/put/options_chain_data_0_1_0/filter", response_model=List[Options_Chain_Data_Schema])
def filter_put_options_chain_010(start: str, end: str, db: Session = Depends(get_put_db)):
    return db.query(OptionsChainData_0_1_0).filter(
        OptionsChainData_0_1_0.Datetime.between(parse_date(start), parse_date(end))
    ).limit(50).all()


@app.get("/put/options_chain_data_0_5_0", response_model=List[Options_Chain_Data_Schema])
def get_put_options_chain_050(db: Session = Depends(get_put_db)):
    return db.query(OptionsChainData_0_5_0).order_by(OptionsChainData_0_5_0.Datetime.desc()).limit(50).all()


@app.get("/put/options_chain_data_0_5_0/filter", response_model=List[Options_Chain_Data_Schema])
def filter_put_options_chain_050(start: str, end: str, db: Session = Depends(get_put_db)):
    return db.query(OptionsChainData_0_5_0).filter(
        OptionsChainData_0_5_0.Datetime.between(parse_date(start), parse_date(end))
    ).limit(50).all()


@app.get("/put/price_data_0_1_0/filter", response_model=List[Price_Data_Schema])
def filter_put_price_data_010(start: str, end: str, db: Session = Depends(get_put_db)):
    return db.query(PriceData_0_1_0).filter(
        PriceData_0_1_0.Datetime.between(parse_date(start), parse_date(end))
    ).limit(50).all()


@app.get("/put/price_data_0_5_0/filter", response_model=List[Price_Data_Schema])
def filter_put_price_data_050(start: str, end: str, db: Session = Depends(get_put_db)):
    return db.query(PriceData_0_5_0).filter(
        PriceData_0_5_0.Datetime.between(parse_date(start), parse_date(end))
    ).limit(50).all()
