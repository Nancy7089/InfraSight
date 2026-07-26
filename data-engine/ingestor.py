import os
import psycopg2
import time
from dotenv import load_dotenv
from generator import generate_log

# Load the environment variables from the .env file
load_dotenv()

# Fetch credentials securely
DB_CONFIG = {
    "dbname": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "host": os.getenv("DB_HOST", "localhost"), # Defaults to localhost if not found
    "port": os.getenv("DB_PORT", "5432")
}

def ingest_data():
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
    
    print("Starting data ingestion...")
    try:
        while True:
            log = generate_log() 
            
            cursor.execute("""
                INSERT INTO api_logs (endpoint, method, status_code, response_time_ms, timestamp)
                VALUES (%s, %s, %s, %s, %s)
            """, log)
            conn.commit()
            
            print(f"Inserted log: {log}")
            time.sleep(2)
            
    except KeyboardInterrupt:
        print("\nIngestion stopped safely.")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    ingest_data()