# Email Alerts Setup Guide

## Overview
The system sends automatic email alerts to admin when inventory items fall below 20 units. This guide shows how to configure it.

## Option 1: Using Gmail (Recommended for Development)

### Step 1: Set Up Gmail App Password
1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. You'll need 2-Step Verification enabled first:
   - Go to myaccount.google.com → Security
   - Enable "2-Step Verification"
3. Once enabled, go back to App passwords
4. Select "Mail" and "Windows Computer"
5. Copy the generated 16-character password

### Step 2: Configure .env File
Create/edit `backend/.env`:
```env
MONGO_URI=mongodb://localhost:27017/pizza_delivery
PORT=5000

# Email Configuration
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx  # The app password from step 1

# Where to send alerts
ADMIN_EMAIL=admin@gmail.com
```

### Step 3: Restart Backend Server
```bash
npm run dev
```

You should see:
```
✅ Email service ready
📅 Stock check scheduler started (runs every hour at :00)
```

## Option 2: Using Gmail Standard Password

If app passwords don't work:

1. Enable "Less secure app access":
   - Go to myaccount.google.com → Security
   - Scroll down to "Less secure app access"
   - Turn it ON

2. Use your regular Gmail password in .env:
```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-actual-gmail-password
```

## How It Works

### 1. Real-Time Alerts on Order Placement
- **Trigger:** When customer places an order
- **Action:** System deducts stock from inventory
- **Check:** If any item falls below threshold (20 units)
- **Alert:** Email sent immediately to admin
- **Advantage:** Instant notification - no waiting for scheduler

### 2. Scheduled Hourly Check (Backup)
- System checks inventory **every hour at :00** (e.g., 10:00, 11:00, 12:00)
- When items drop below **20 units**, alert is sent
- Runs as a backup to catch any missed real-time alerts
- Includes item name, current stock, category, and timestamp

### 3. Daily Inventory Report
- **Time:** 8 AM every day
- **Content:** Total stock per category
- **Delivery:** Broadcasts to all connected admins via Socket.io
- **Includes:** bases, sauces, cheeses, veggies, meats totals

### Manual Testing

**Option 1: Test via Order Placement (Recommended)**
1. In frontend, build a pizza with an ingredient that's low stock
2. Place an order
3. System automatically deducts stock
4. If stock drops below 20, alert email sent immediately
5. Check console for confirmation: `⚠️ Low stock alert: X items below threshold`

**Option 2: Test via Admin Inventory Update**
1. Go to Admin Inventory page
2. Manually reduce an item's stock to 15 units
3. Click "Update"
4. Trigger alert manually via API:
   ```
   GET http://localhost:5000/api/admin/test-low-stock-alert
   ```

**Option 3: Trigger Scheduler Manually**
- Uncomment this line in `backend/utils/scheduler.js` line 17:
  ```javascript
  // checkLowStockItems(io);  // Uncomment to test immediately
  ```
- Restart server: `npm run dev`
- Will trigger immediately on startup

## Alert Email Format

### Single Item Alert (on order with one low item)
**Subject:** ⚠️ Low Stock Alert - Pizza Delivery

**Content:**
```
Low Stock Alert

Chicken stock is running low!
Current Stock: 15 units
Threshold: 20 units

Please restock immediately.
Time: 2/13/2026, 10:30:45 AM
```

### Batch Alert (multiple items, real-time or scheduled)
**Subject:** ⚠️ Multiple Low Stock Items Alert - X Items

**Content:**
```
🚨 Low Stock Alert

The following items are below the threshold of 20 units:

• bases: Regular Crust (15/20 units)
• sauces: White Sauce (8/20 units)  
• meats: Chicken (10/20 units)

Action Required: Please restock these items immediately.

Alert Time: 2/13/2026, 10:30:45 AM
```

## Real-Time Features

### 1. Instant Email Notification on Order
When stock drops below threshold due to order:
- Email sent immediately to admin
- Email includes all items below threshold
- Format: Category, Item name, Current stock, Threshold

### 2. Socket.io Real-Time Alert to Admin Dashboard
- Admin dashboard receives instant notification
- Event: `low_stock_alert`
- Data includes: items, item count, message, alert time
- Useful for in-app notifications without page refresh

### 3. Hourly Backup Check
- Scheduler runs at hour start (:00) as safety net
- Catches any alerts that might have been missed
- Broadcasts via Socket.io to admin room

### 4. Daily Inventory Report
Runs at **8 AM every day**:
- Shows total stock per category
- Broadcasts to all connected admins
- Event: `daily_inventory_report`
- Includes: bases, sauces, cheeses, veggies, meats totals

## Troubleshooting

### Email not sending?
1. **Check credentials:**
   - Verify EMAIL_USER and EMAIL_PASS in .env
   - Check Gmail "Less secure app access" is ON

2. **Check Console:**
   - Backend console shows `❌ Email service not configured properly`
   - This means Gmail auth failed
   
3. **Fallback:**
   - System logs to console instead: `📦 LOW STOCK ALERT: Item name (15 units)`
   - This is visible in backend terminal

### Not checking at the right time?
- Scheduler runs at hour start (:00)
- To test manually, use the `/admin/test-low-stock-alert` endpoint

## Environment Variables Reference

```env
# Required
MONGO_URI=your-mongodb-connection
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=app-password-or-gmail-password

# Optional (defaults provided)
ADMIN_EMAIL=admin@pizzadelivery.com  # Email to send alerts to
PORT=5000
```

## Testing Workflow

### Quick Test (Order-based - Recommended)
1. **Start backend:** `npm run dev`
2. **Start frontend:** In another terminal, `npm run dev`
3. **Reduce stock beforehand:**
   - Login as admin
   - Go to Admin Inventory
   - Change "Chicken" stock to 5 units
   - Click Update
4. **As regular user:**
   - Build a pizza with Chicken
   - Place an order
   - Check for immediate low stock email
5. **Verify:**
   - Check backend console: `⚠️ Low stock alert: X items below threshold`
   - Check your email inbox (should arrive within 5 seconds)
   - Check spam folder if not received

### Comprehensive Test (Manual inventory update)
1. **Start backend:** `npm run dev`
2. **Login as admin**
3. **Go to Admin Inventory**
4. **Change multiple items below 20:**
   - Chicken: 15
   - Tomato Sauce: 10
   - Mozzarella: 18
5. **Click Update**
6. **Trigger scheduler test:**
   ```
   GET http://localhost:5000/api/admin/test-low-stock-alert
   ```
7. **Watch for:**
   - Console: `⚠️ Found 3 items below threshold`
   - Email: Batch alert with 3 items
   - Email subject: `⚠️ Multiple Low Stock Items Alert - 3 Items`

## Next Steps (Production)

For production deployment:
- Use a dedicated email service: SendGrid, AWS SES, or Mailgun
- Store credentials securely in environment variables
- Set up event logging/monitoring
- Configure admin notification preferences
