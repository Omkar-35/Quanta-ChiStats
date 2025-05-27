from pydantic import BaseModel
from datetime import date
# ---------- Options Chain Schemas ----------

class Options_Chain_Data_Schema(BaseModel):
    strike: float
    expiry: str
    buy_price: float
    sell_price: float
    iv: float
    volume: float
    oi: float
    delta: float
    theta: float
    Date: date
    Time: str
        
    class Config:
        from_attributes = True
        json_encoders = {
            date: lambda v: v.strftime('%d-%m-%Y')
        }


# ---------- Price Data Schemas ----------
class Price_Data_Schema(BaseModel):
    open: float
    high: float
    low: float
    close: float
    volume: float
    Date: date
    Time: str

    class Config:
        from_attributes = True
        json_encoders = {
            date: lambda v: v.strftime('%d-%m-%Y')
        }

