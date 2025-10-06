"""
Test script to verify admin dashboard API endpoints
Run this to check if the backend is returning data correctly
"""

import requests
import json

BASE_URL = "http://localhost:5000"

def test_endpoint(endpoint_name, url):
    print(f"\n{'='*60}")
    print(f"Testing: {endpoint_name}")
    print(f"URL: {url}")
    print(f"{'='*60}")
    
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)[:500]}...")
            
            if 'success' in data:
                if data['success']:
                    print(f"✅ SUCCESS: {endpoint_name}")
                    if 'stocks' in data:
                        print(f"   Stock count: {len(data['stocks'])}")
                    if 'screenings' in data:
                        print(f"   Screening count: {len(data['screenings'])}")
                else:
                    print(f"❌ FAILED: {data.get('error', 'Unknown error')}")
            else:
                print(f"⚠️  WARNING: Response missing 'success' field")
        else:
            print(f"❌ HTTP Error: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
            
    except requests.exceptions.ConnectionError:
        print(f"❌ CONNECTION ERROR: Cannot connect to {BASE_URL}")
        print(f"   Make sure Flask server is running (python app.py)")
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")

def main():
    print("""
╔══════════════════════════════════════════════════════════╗
║     Admin Dashboard API Endpoint Test Script             ║
╚══════════════════════════════════════════════════════════╝

This script tests all API endpoints used by the admin dashboard.

NOTE: You must be logged in as admin for these to work.
If you get 401 errors, login at /admin/login first.
    """)
    
    # Test endpoints
    endpoints = {
        "Entry Zone Stocks": f"{BASE_URL}/admin/api/entry-zone-stocks",
        "Breakout Stocks": f"{BASE_URL}/admin/api/breakout-stocks",
        "Stock Screenings": f"{BASE_URL}/admin/api/stock-screenings",
    }
    
    for name, url in endpoints.items():
        test_endpoint(name, url)
    
    print(f"\n{'='*60}")
    print("Test Complete!")
    print(f"{'='*60}")
    print("\nIf all tests show ✅ SUCCESS, your dashboard should work!")
    print("If you see ❌ errors:")
    print("  - 401: Not logged in as admin")
    print("  - Connection Error: Flask server not running")
    print("  - Other errors: Check Flask logs")
    
    print("\nNext step: Open http://localhost:5000/admin/dashboard")

if __name__ == "__main__":
    main()
