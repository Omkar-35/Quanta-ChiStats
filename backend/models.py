from sqlalchemy import Column, String, Float
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Options Chain Models 

class OptionsChainData_0_1_0(Base):
    __tablename__ = 'options_chain_data_0_1_0'

    Datetime = Column(String, primary_key=True)
    strike = Column(Float, nullable=False)
    expiry = Column(String, nullable=False)  
    buy_price = Column(Float, nullable=False)
    sell_price = Column(Float, nullable=False)
    iv = Column(Float, nullable=False)
    volume = Column(Float, nullable=False)
    oi = Column(Float, nullable=False)
    delta = Column(Float, nullable=False)
    theta = Column(Float, nullable=False)
    Date = Column(String, nullable=False)
    Time = Column(String, nullable=False)


class OptionsChainData_0_5_0(Base):
    __tablename__ = 'options_chain_data_0_5_0'

    Datetime = Column(String, primary_key=True)
    strike = Column(Float, nullable=False)
    expiry = Column(String, nullable=False)  
    buy_price = Column(Float, nullable=False)
    sell_price = Column(Float, nullable=False)
    iv = Column(Float, nullable=False)
    volume = Column(Float, nullable=False)
    oi = Column(Float, nullable=False)
    delta = Column(Float, nullable=False)
    theta = Column(Float, nullable=False)
    Date = Column(String, nullable=False)
    Time = Column(String, nullable=False)


# Price Data Models 

class PriceData_0_1_0(Base):
    __tablename__ = 'price_data_0_1_0'

    Datetime = Column(String, primary_key=True)
    open = Column(Float, nullable=False)
    high = Column(Float, nullable=False)
    low = Column(Float, nullable=False)
    close = Column(Float, nullable=False)
    volume = Column(Float, nullable=False)
    Date = Column(String, nullable=False)
    Time = Column(String, nullable=False)


class PriceData_0_5_0(Base):
    __tablename__ = 'price_data_0_5_0'

    Datetime = Column(String, primary_key=True)
    open = Column(Float, nullable=False)
    high = Column(Float, nullable=False)
    low = Column(Float, nullable=False)
    close = Column(Float, nullable=False)
    volume = Column(Float, nullable=False)
    Date = Column(String, nullable=False)
    Time = Column(String, nullable=False)
