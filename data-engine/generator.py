import random
from datetime import datetime

ENDPOINTS = ["/api/users", "/api/payments", "/api/products", "/auth/login"]
METHODS = ["GET", "POST"]

def generate_log():
    """
    Simulates a single API request log.
    Returns a tuple: (endpoint, method, status_code, latency_ms, timestamp)
    """
    endpoint = random.choice(ENDPOINTS)
    
    # Force POST for payments to make the fake data realistic
    method = "POST" if "payments" in endpoint else random.choice(METHODS)
    
    # 5% chance to simulate a server error and massive latency spike
    if random.random() > 0.95:
        status = random.choice([500, 502, 503])
        latency = random.randint(1000, 5000) # 1 to 5 seconds
    else:
        status = random.choice([200, 201, 400, 404])
        latency = random.randint(20, 300)    # 20 to 300 milliseconds
        
    return (endpoint, method, status, latency, datetime.now())

# You can test just the generator by running this file directly
if __name__ == "__main__":
    print("Testing the generator. Here is a sample log:")
    print(generate_log())