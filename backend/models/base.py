from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base() 
#This Base variable now holds the base class 
#that all of your SQLAlchemy model classes will inherit from