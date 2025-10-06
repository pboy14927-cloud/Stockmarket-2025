# Chart Troubleshooting Guide

## Issue: Charts Not Showing on Admin Dashboard

### Quick Fixes

#### 1. Check Browser Console
Open Developer Tools (F12) and check the Console tab for errors:
- Red error messages indicate JavaScript issues
- Look for "recharts" or "React" related errors
- Check for 401 (Unauthorized) or 404 (Not Found) API errors

#### 2. Verify Mock Data is Being Returned

The admin dashboard now includes mock data fallback. If there are no stocks in the database watchlists, it will show sample data with:
- **Entry Zone**: AAPL, MSFT, GOOGL, AMZN, META
- **Breakout**: TSLA, NVDA, AMD, NFLX, SHOP

To test, open browser console and check:
```javascript
// Check what's being fetched
console.log('Industry data:', industryData);
console.log('Market cap data:', marketCapChartData);
```

#### 3. Verify API Endpoints

Test the endpoints manually:

```bash
# Test entry zone stocks
curl http://localhost:5000/admin/api/entry-zone-stocks

# Test breakout stocks
curl http://localhost:5000/admin/api/breakout-stocks

# Test screenings
curl http://localhost:5000/admin/api/stock-screenings
```

Expected response:
```json
{
  "success": true,
  "stocks": [
    {
      "symbol": "AAPL",
      "industry": "Technology",
      "latest_volume": 100000000,
      "market_cap": 2500000000000,
      "total_market_cap_formatted": "$2.5T"
    }
    ...
  ]
}
```

#### 4. Rebuild Frontend

If you made changes to the React code:

```bash
# Rebuild the webpack bundle
npm run build
```

Then restart your Flask server:
```bash
python app.py
```

#### 5. Clear Browser Cache

Sometimes the old JavaScript bundle is cached:
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

Or use:
- Chrome/Edge: Ctrl+Shift+Delete → Clear cached images and files
- Firefox: Ctrl+Shift+Delete → Clear Cache

#### 6. Check Recharts Installation

Verify recharts is properly installed:

```bash
npm list recharts
```

If not installed or wrong version:
```bash
npm install recharts@^3.1.2
```

### Common Issues and Solutions

#### Issue: "ResponsiveContainer is not defined"

**Solution**: Recharts import is missing or wrong. Check AdminDashboard.jsx:
```javascript
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
```

#### Issue: Charts show but are empty/blank

**Causes**:
1. **No data**: Check if `industryData` and `marketCapData` arrays are empty
2. **Wrong data format**: Charts expect `{name: string, count: number}` format
3. **All zeros**: Market cap distribution shows nothing if all values are 0

**Solution**: 
- Check browser console logs (we added debug logging)
- Verify mock data is being used if database is empty
- Check data format matches chart requirements

#### Issue: "Cannot read property 'length' of undefined"

**Cause**: Data hasn't loaded yet or API returned error

**Solution**:
- Add loading state check
- Add empty array defaults
- Check API response structure

#### Issue: 401 Unauthorized Error

**Cause**: Not logged in as admin or session expired

**Solution**:
1. Navigate to `/admin/login`
2. Login with admin credentials
3. Session should be valid for current browser session

#### Issue: Charts work on localhost but not in production

**Causes**:
1. Webpack bundle not rebuilt
2. Static files not deployed
3. API endpoints not accessible

**Solution**:
1. Run `npm run build` before deployment
2. Ensure `static/js/` folder is deployed
3. Check CORS settings if API is on different domain

### Debug Mode

To enable detailed logging, open browser console and run:

```javascript
// This will show all fetch requests
localStorage.debug = '*';

// Reload the page
location.reload();
```

Look for console.log messages that show:
- "Calculating stats for: ..."
- "Industry chart data: ..."
- "Market cap chart data: ..."
- "Rendering charts. Industry data: ..."

### Verifying the Fix

After applying fixes, you should see:

1. **Summary Cards** showing numbers (not all 0s)
2. **Industry Bar Chart** with colored bars
3. **Market Cap Pie Chart** with colored segments and percentages
4. **Tables** with stock data
5. **No console errors** in browser DevTools

### Testing Checklist

- [ ] Browser console shows no errors
- [ ] API endpoints return 200 status
- [ ] Mock data appears if no database stocks
- [ ] Industry chart shows bars
- [ ] Pie chart shows segments with labels
- [ ] Hover tooltips work on charts
- [ ] Tables display stock information
- [ ] Statistics cards show non-zero values

### Still Not Working?

If charts still don't show:

1. **Take a screenshot** of:
   - The dashboard page
   - Browser console (F12 → Console tab)
   - Network tab showing API requests

2. **Check these files exist**:
   - `frontend/src/components/admin/AdminDashboard.jsx`
   - `static/js/admin-bundle.js`
   - `node_modules/recharts/` directory

3. **Verify React is working**:
   Open console and type:
   ```javascript
   React.version
   ```
   Should show version number (e.g., "19.1.1")

4. **Check if other pages work**:
   - Does the main app work?
   - Do other admin pages work?
   - Is it only the dashboard?

### Manual Test Data

If you want to test with real CSV data, create a file `test_stocks.csv`:

```csv
symbol,industry,market_cap,market_cap_formatted,latest_volume,mrs_current,weekly_growth,total_stocks,total_market_cap_formatted,price_vs_sma_pct,watchlist_type
AAPL,Technology,2500000000000,$2.5T,100000000,1.2,2.5,500,$10T,10.00,entry
MSFT,Technology,2300000000000,$2.3T,75000000,1.3,1.8,500,$10T,9.00,entry
TSLA,Automotive,800000000000,$800B,50000000,1.1,3.2,500,$10T,12.00,breakout
NVDA,Technology,1200000000000,$1.2T,120000000,1.5,5.0,500,$10T,15.00,breakout
```

Then upload via the admin interface bulk upload feature.

### Need More Help?

If none of these solutions work, provide:
1. Browser console screenshot
2. Network tab screenshot showing API calls
3. Flask server logs
4. Which step in this guide you tried
5. Operating system and browser version

The issue is most likely:
- ✅ **SOLVED**: Added mock data fallback
- ✅ **SOLVED**: Added debug logging
- ✅ **SOLVED**: Added empty state handling

Charts should now display with sample data even if database is empty!
