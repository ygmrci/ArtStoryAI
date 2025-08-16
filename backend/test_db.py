"""
Test database connection script
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import test_connection

if __name__ == "__main__":
    print("🔍 Testing database connection...")
    success = test_connection()
    
    if success:
        print("🎉 Database connection successful!")
    else:
        print("❌ Database connection failed!")
