# Admin Dashboard - Visual Layout Guide

## Dashboard Layout Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Admin Dashboard                              │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      SUMMARY STATISTICS CARDS                        │
├───────────┬───────────┬───────────┬───────────┬────────────────────┤
│  Total    │  Entry    │ Breakout  │   Avg     │      Avg           │
│  Stocks   │   Zone    │  Stocks   │  Market   │     Volume         │
│           │  Stocks   │           │    Cap    │                    │
│   [###]   │   [###]   │   [###]   │  [$###B]  │    [###M]          │
│  (Blue)   │  (Green)  │ (Yellow)  │  (Orange) │   (Purple)         │
└───────────┴───────────┴───────────┴───────────┴────────────────────┘

┌──────────────────────────────────┬──────────────────────────────────┐
│      CHARTS SECTION              │                                  │
├──────────────────────────────────┼──────────────────────────────────┤
│   Top Industries (Bar Chart)     │  Market Cap Distribution (Pie)   │
│                                  │                                  │
│   ┌────┐                         │         ┌─────────┐              │
│   │    │                         │        /           \             │
│   │    │  ┌────┐                 │       │   Small    │             │
│   │    │  │    │  ┌────┐         │       │   Mid      │             │
│   │    │  │    │  │    │  ┌────┐ │       │   Large    │             │
│   └────┘  └────┘  └────┘  └────┘ │        \   Mega   /              │
│   Tech   Auto   Health   Finance │         └─────────┘              │
│                                  │    (Color-coded segments)        │
└──────────────────────────────────┴──────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│               ENTRY ZONE STOCKS TABLE                                │
│  Entry Zone Stocks (XXX)                                            │
├─────────┬─────────────┬──────────────────┬─────────────────────────┤
│ Symbol  │  Industry   │   Market Cap     │      Volume             │
├─────────┼─────────────┼──────────────────┼─────────────────────────┤
│  AAPL   │ Technology  │      $2.5T       │       100M              │
│  MSFT   │ Technology  │      $2.3T       │        75M              │
│  GOOGL  │ Technology  │      $1.8T       │        50M              │
│  ...    │   ...       │       ...        │        ...              │
├─────────┴─────────────┴──────────────────┴─────────────────────────┤
│  Showing 10 of XXX stocks                                           │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│               BREAKOUT STOCKS TABLE                                  │
│  Breakout Stocks (XXX)                                              │
├─────────┬─────────────┬──────────────────┬─────────────────────────┤
│ Symbol  │  Industry   │   Market Cap     │      Volume             │
├─────────┼─────────────┼──────────────────┼─────────────────────────┤
│  TSLA   │ Automotive  │      $800B       │        50M              │
│  NVDA   │ Technology  │      $1.2T       │       120M              │
│  AMD    │ Technology  │      $200B       │        80M              │
│  ...    │   ...       │       ...        │        ...              │
├─────────┴─────────────┴──────────────────┴─────────────────────────┤
│  Showing 10 of XXX stocks                                           │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│               STOCK SCREENINGS TABLE                                 │
│  Stock Screenings                                                    │
├──────────────────┬─────────────┬──────────────┬────────────────────┤
│      Name        │    Date     │ Stocks Count │      Actions       │
├──────────────────┼─────────────┼──────────────┼────────────────────┤
│  CSV Upload      │  2024-03-15 │      50      │  [View Details]    │
│  High Growth     │  2024-03-10 │      25      │  [View Details]    │
│  Tech Sector     │  2024-03-05 │      30      │  [View Details]    │
│  ...             │    ...      │     ...      │       ...          │
└──────────────────┴─────────────┴──────────────┴────────────────────┘
```

## Color Scheme

### Statistics Cards
- **Total Stocks**: Blue (#0088FE)
- **Entry Zone**: Green (#00C49F)
- **Breakout Stocks**: Yellow/Orange (#FFBB28)
- **Avg Market Cap**: Orange (#FF8042)
- **Avg Volume**: Purple (#8884D8)

### Charts
- **Bar Chart**: Blue (#0088FE) bars with grid lines
- **Pie Chart**: Multi-color segments
  - Segment 1: #0088FE (Blue)
  - Segment 2: #00C49F (Green)
  - Segment 3: #FFBB28 (Yellow)
  - Segment 4: #FF8042 (Orange)

### Tables
- **Headers**: Light gray background (#f8f9fa)
- **Alternating Rows**: White and light gray
- **Borders**: Light gray (#dee2e6)
- **Entry Zone Title**: Green (#00C49F)
- **Breakout Title**: Yellow/Orange (#FFBB28)

## Interactive Elements

### Buttons
```
┌─────────────────────┐
│   View Details      │  ← Blue background (#0088FE)
└─────────────────────┘      White text
                             Rounded corners
                             Hover effect

┌─────────────────────┐
│  ← Back to Dashboard│  ← Gray background
└─────────────────────┘      Standard padding
```

### Chart Tooltips
```
On hover over bar or pie segment:

┌──────────────────┐
│  Technology      │
│  Count: 15       │
│  32% of total    │
└──────────────────┘
```

## Responsive Breakpoints

### Desktop (> 1200px)
- 5 statistics cards in a row
- 2 charts side by side
- Full tables with all columns visible

### Tablet (768px - 1200px)
- 3 statistics cards per row
- Charts stack vertically or remain side by side
- Tables remain full width with scroll

### Mobile (< 768px)
- 1-2 statistics cards per row
- Charts stack vertically
- Tables have horizontal scroll
- Reduced padding for better space utilization

## Data Formatting Examples

### Market Cap Formatting
```
Value                   Display
2,500,000,000,000   →   $2.5T
800,000,000,000     →   $800B
50,000,000,000      →   $50B
2,500,000,000       →   $2.5B
500,000,000         →   $500M
```

### Volume Formatting
```
Value               Display
1,000,000,000   →   1B
100,000,000     →   100M
50,000,000      →   50M
5,000,000       →   5M
500,000         →   500K
```

## Loading & Error States

### Loading State
```
┌─────────────────────────────────────┐
│                                     │
│   Loading dashboard data...         │
│                                     │
└─────────────────────────────────────┘
```

### Error State
```
┌─────────────────────────────────────┐
│                                     │
│   ⚠ Error: Failed to load data     │
│   Please try again later            │
│                                     │
└─────────────────────────────────────┘
```

### Empty State (No Data)
```
┌─────────────────────────────────────┐
│  Entry Zone Stocks (0)              │
├─────────────────────────────────────┤
│                                     │
│   No entry zone stocks available.   │
│                                     │
└─────────────────────────────────────┘
```

## Navigation Flow

```
Admin Dashboard (Main View)
        │
        │ Click "View Details" on screening
        ↓
Stock Screening Detail View
        │
        │ Click "← Back to Dashboard"
        ↓
Admin Dashboard (Main View)
```

## Performance Considerations

1. **Chart Rendering**: Uses ResponsiveContainer for optimal performance
2. **Table Pagination**: Shows only top 10 stocks by default
3. **Data Caching**: Fetches all data once on component mount
4. **Lazy Loading**: Charts render only when data is available
5. **Memoization**: Could be added for complex calculations

## Accessibility Features

1. **Semantic HTML**: Proper table structure with thead/tbody
2. **Color Contrast**: Sufficient contrast ratios for text
3. **Alt Text**: Would be added for chart screenshots
4. **Keyboard Navigation**: Buttons are keyboard accessible
5. **Screen Reader Support**: Proper labels and ARIA attributes could be added

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Print Styling (Future Enhancement)

Could add print-specific CSS for:
- Removing backgrounds
- Optimizing chart sizes
- Page break control for tables
- Header/footer for printed reports
