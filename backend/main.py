from fastapi import FastAPI, Depends, Query, HTTPException, Response
import httpx
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import cast, Date

from database import get_call_db, get_put_db
from models import (
    OptionsChainData_0_1_0,
    OptionsChainData_0_5_0,
    PriceData_0_1_0,
    PriceData_0_5_0
)

from schemas import Options_Chain_Data_Schema, Price_Data_Schema

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

def parse_date(date_str: str) -> Date:
    try:
        return datetime.strptime(date_str, "%d-%m-%Y")
    except ValueError:
        raise HTTPException(status_code=400, detail="Date must be in DD-MM-YYYY format")


# ======== NSE Data ======= #
NSE_URL = "https://www.nseindia.com/api/marketStatus"

HEADERS = {
    "Accept": "application/json, text/plain, */*",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36",
    "Referer": "https://www.nseindia.com",
    "Origin": "https://www.nseindia.com",
}

@app.get("/api/nse-market-status")
async def get_nse_market_status():
    async with httpx.AsyncClient() as client:
        # First request to NSE homepage to get cookies (needed for next request)
        homepage_resp = await client.get("https://www.nseindia.com", headers=HEADERS)
        cookies = homepage_resp.cookies

        # Now request the actual API with cookies
        response = await client.get(NSE_URL, headers=HEADERS, cookies=cookies)
        response.raise_for_status()
        return Response(content=response.content, media_type="application/json")



# ======== Call Database ======== #

@app.get("/call/optionschain/5", response_model=List[Options_Chain_Data_Schema])
def get_call_options_chain_050(db: Session = Depends(get_call_db)):
    return db.query(OptionsChainData_0_5_0).order_by(OptionsChainData_0_5_0.Datetime.desc()).limit(30).all()

@app.get("/filter/call/optionschain/1", response_model=List[Options_Chain_Data_Schema])
def filter_call_options_chain_010(start: str, end: str, db: Session = Depends(get_call_db)):
    start_date = parse_date(start)
    end_date = parse_date(end)
    
    return db.query(OptionsChainData_0_1_0).filter(
        OptionsChainData_0_1_0.Date.between(start_date, end_date)
    ).order_by(OptionsChainData_0_1_0.Date.desc()).limit(30).all()

@app.get("/filter/call/optionschain/5", response_model=List[Options_Chain_Data_Schema])
def filter_call_options_chain_050(start: str, end: str, db: Session = Depends(get_call_db)):
    start_date = parse_date(start)
    end_date = parse_date(end)
    
    return db.query(OptionsChainData_0_5_0).filter(
        OptionsChainData_0_5_0.Date.between(start_date, end_date)
    ).order_by(OptionsChainData_0_5_0.Date.desc()).limit(30).all()

@app.get("/filter/call/price/1", response_model=List[Price_Data_Schema])
def filter_call_price_010(start: str, end: str, db: Session = Depends(get_call_db)):
    start_date = parse_date(start)
    end_date = parse_date(end)
    
    return db.query(PriceData_0_1_0).filter(
        PriceData_0_1_0.Date.between(start_date, end_date)
    ).order_by(PriceData_0_1_0.Date.desc()).limit(30).all()


@app.get("/filter/call/price/5", response_model=List[Price_Data_Schema])
def filter_call_price_010(start: str, end: str, db: Session = Depends(get_call_db)):
    start_date = parse_date(start)
    end_date = parse_date(end)
    
    return db.query(PriceData_0_5_0).filter(
        PriceData_0_5_0.Date.between(start_date, end_date)
    ).order_by(PriceData_0_5_0.Date.desc()).limit(30).all()


# ======== Put Database ======== #

@app.get("/put/optionschain/5", response_model=List[Options_Chain_Data_Schema])
def get_put_options_chain_050(db: Session = Depends(get_put_db)):
    return db.query(OptionsChainData_0_5_0).order_by(OptionsChainData_0_5_0.Datetime.desc()).limit(30).all()

@app.get("/filter/put/optionschain/1", response_model=List[Options_Chain_Data_Schema])
def filter_put_options_chain_010(start: str, end: str, db: Session = Depends(get_put_db)):
    start_date = parse_date(start)
    end_date = parse_date(end)
    
    return db.query(OptionsChainData_0_1_0).filter(
        OptionsChainData_0_1_0.Date.between(start_date, end_date)
    ).order_by(OptionsChainData_0_1_0.Date.desc()).limit(30).all()

@app.get("/filter/put/optionschain/5", response_model=List[Options_Chain_Data_Schema])
def filter_put_options_chain_050(start: str, end: str, db: Session = Depends(get_put_db)):
    start_date = parse_date(start)
    end_date = parse_date(end)
    
    return db.query(OptionsChainData_0_5_0).filter(
        OptionsChainData_0_5_0.Date.between(start_date, end_date)
    ).order_by(OptionsChainData_0_5_0.Date.desc()).limit(30).all()

@app.get("/filter/put/price/1", response_model=List[Price_Data_Schema])
def filter_put_price_010(start: str, end: str, db: Session = Depends(get_put_db)):
    start_date = parse_date(start)
    end_date = parse_date(end)
    
    return db.query(PriceData_0_1_0).filter(
        PriceData_0_1_0.Date.between(start_date, end_date)
    ).order_by(PriceData_0_1_0.Date.desc()).limit(30).all()


@app.get("/filter/put/price/5", response_model=List[Price_Data_Schema])
def filter_put_price_010(start: str, end: str, db: Session = Depends(get_put_db)):
    start_date = parse_date(start)
    end_date = parse_date(end)
    
    return db.query(PriceData_0_5_0).filter(
        PriceData_0_5_0.Date.between(start_date, end_date)
    ).order_by(PriceData_0_5_0.Date.desc()).limit(30).all()