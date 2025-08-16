"""
Create database script
"""

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def create_database():
    """Create artstory_db database"""
    try:
        # Connect to PostgreSQL server
        conn = psycopg2.connect(
            host="localhost",
            port="5432",
            user="postgres",
            password="artstory123",
            database="postgres"  # Connect to default database
        )
        
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Create database
        cursor.execute("CREATE DATABASE artstory_db")
        print("✅ Database 'artstory_db' created successfully!")
        
        cursor.close()
        conn.close()
        
    except psycopg2.Error as e:
        if "already exists" in str(e):
            print("✅ Database 'artstory_db' already exists!")
        else:
            print(f"❌ Error creating database: {e}")

if __name__ == "__main__":
    create_database()
