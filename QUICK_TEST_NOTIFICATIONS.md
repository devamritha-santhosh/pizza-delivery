# Quick Start: Low Stock Notifications Testing

## ⚡ 5-Minute Setup & Test

### Step 1: Configure Email (2 minutes)
```bash
# Edit backend/.env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@pizzadelivery.com
```

[Get Gmail App Password](https://myaccount.google.com/apppasswords)

### Step 2: Start Backend (1 minute)
```bash
cd backend
npm run dev
```

Watch for:
```
✅ Email service ready
📅 Stock check scheduler started (runs every hour at :00)
```

### Step 3: Test Scenario (2 minutes)

#### Option A: Order-Based Test (Recommended)
```
1. Admin Portal → Admin Inventory
2. Change "Chicken" to 5 units → Update
3. Customer builds pizza with Chicken → Place order
4. Check email within 5 seconds ✉️
```

#### Option B: Manual Test
```
1. Admin Portal → Admin Inventory
2. Change multiple items to < 20 units
3. Run in browser: http://localhost:5000/api/admin/test-low-stock-alert
4. Check email within 2 seconds ✉️
```

---

## 📧 What You'll Receive

### Email Subject
```
⚠️ Multiple Low Stock Items Alert - 1 Items
```

### Email Body
```
🚨 Low Stock Alert

The following items are below the threshold of 20 units:

• bases: Regular Crust (5/20 units)

Action Required: Please restock these items immediately.

Alert Time: 2/13/2026, 14:32:45 PM
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Email not received | Check spam folder, verify ADMIN_EMAIL in .env |
| "Email service not configured" | Enable 2-Step Verification on Gmail account |
| No console alerts | Check MONGO_URI in .env, verify inventory created |
| Scheduler not running | Restart server with `npm run dev` |

---

## 🔧 Common Customizations

### Change Threshold (Default: 20)
Edit `backend/utils/scheduler.js` line 6:
```javascript
const THRESHOLD = 30;  // Change to desired value
```

### Change Alert Time (Default: Every hour at :00)
Edit `backend/utils/scheduler.js` line 12:
```javascript
cron.schedule("*/30 * * * *", async () => {  // Every 30 minutes
```

[Cron Expression Help](https://crontab.guru)

### Change Report Time (Default: 8 AM daily)
Edit `backend/utils/scheduler.js` line 83:
```javascript
cron.schedule("0 9 * * *", async () => {  // 9 AM daily
```

---

## 📊 How It Works

```
Customer Places Order
        ↓
    Stock Deducted
        ↓
    Check if < 20 units
        ↓
    YES → Send Email Immediately ← 2-5 seconds
    NO → Continue normally
        ↓
    Hourly Scheduler (backup)
        ↓
    Broadcasts to admin dashboard (Socket.io)
```

---

## ✅ Verification Checklist

- [ ] Backend starts without errors
- [ ] Console shows "✅ Email service ready"
- [ ] Admin Inventory page loads
- [ ] Can update inventory items
- [ ] Email account configured in .env
- [ ] Test email received in 5 seconds
- [ ] Low stock items shown in Admin Inventory
- [ ] Socket.io connects (admin dashboard updates)

---

## 📝 Testing Checklist

### Round 1: Real-Time Alert
- [ ] Reduce stock below 20
- [ ] Place order deducting that item
- [ ] Receive email within 5 seconds
- [ ] Email shows correct item + stock level

### Round 2: Batch Alert
- [ ] Reduce 3 items below 20
- [ ] Trigger test endpoint
- [ ] Receive email with all 3 items
- [ ] Email formatting looks good

### Round 3: Scheduled Check
- [ ] Keep stock below 20
- [ ] Wait for hour boundary (:00)
- [ ] Should receive email automatically
- [ ] Works without manual trigger

---

## 🚀 Production Checklist

Before deploying to production:

- [ ] Use SendGrid/Mailgun instead of Gmail (optional but recommended)
- [ ] Store threshold in database
- [ ] Add admin UI for threshold settings
- [ ] Set up email logs/monitoring
- [ ] Test with real data volumes
- [ ] Configure alert recipient list
- [ ] Set up email templates separately
- [ ] Add SMS/Slack notifications (optional)

---

## 📞 Support

If emails aren't sending:

1. Check Gmail "Less secure app access" is ON
2. Verify app password doesn't have spaces
3. Make sure ADMIN_EMAIL is valid
4. Check console for error messages
5. Try test endpoint: `/api/admin/test-low-stock-alert`

If scheduler isn't running:
1. Verify timezone on server
2. Check cron syntax with [crontab.guru](https://crontab.guru)
3. Check Node.js can execute cron jobs
4. Restart server after changes

---

## 💡 Pro Tips

1. **Manual Test First**: Use the test endpoint before relying on orders
2. **Check Spam**: Gmail often filters automated emails
3. **Monitor Logs**: Backend console shows all alerts
4. **Use Real Inventory**: Test with actual low stock items
5. **Multiple Admins**: Add multiple email recipients by creating more admin users

---

**Status**: System Ready ✅
**Last Updated**: February 2026
