# ⚡ Pizza Delivery - Quick Start Guide

## 🎯 Get Running in 5 Minutes

### Terminal 1: Start Backend
```bash
cd backend
npm run dev
```

Wait for: `🚀 Server running on port 5000`

### Terminal 2: Start Frontend  
```bash
cd frontend
npm run dev
```

Visit: **http://localhost:5173**

---

## 📝 Basic Setup (First Time)

### Backend .env File
Create `backend/.env`:
```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/pizza_db
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=16-char-app-password
PORT=5000
```

### MongoDB Setup (30 seconds)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Copy connection string
4. Paste in MONGO_URI (replace username/password)

### Gmail Setup (30 seconds)
1. Go to [Gmail App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Windows Computer"
3. Copy 16-character password
4. Paste in EMAIL_PASS

---

## 🧪 Test the System (2 minutes)

### Step 1: Create User Account
```
1. Go to http://localhost:5173
2. Click "Register" 
3. Fill: Name, Email, Password
4. Click "Create Account"
5. Check email for verification link
6. Click link to verify
```

### Step 2: Place Order
```
1. Go to http://localhost:5173 (Login)
2. Enter your email/password
3. Click "Customize" on any pizza
4. Select: Base, Sauce, Cheese, Veggies, Meats
5. Click "Proceed to Checkout"
6. See order confirmation
```

### Step 3: Admin Dashboard
```
1. Create ADMIN account (Or ask another admin)
2. Login with admin credentials
3. Click "Admin" button → /admin
4. You now see 3 tabs: Inventory, Orders, Analytics
```

### Step 4: Test Features
```
INVENTORY TAB:
  ✅ Click [+5] → Stock increases
  ✅ Click [-1] → Stock decreases
  ✅ See changes in real-time

ORDERS TAB:
  ✅ See your order
  ✅ Click status dropdown
  ✅ Change to "In Kitchen"
  ✅ Go back to user account
  ✅ See status update in real-time! 🎉
```

---

## 🔑 Key Features At a Glance

| Feature | How to Use |
|---------|-----------|
| **Place Order** | Dashboard → Pick pizza → Customize → Checkout |
| **Track Order** | Click "My Orders" → See live status |
| **Update Stock** | Admin Dashboard → Inventory Tab → [+/-] buttons |
| **Change Status** | Admin Dashboard → Orders Tab → Dropdown |
| **See Alerts** | Admin Dashboard → Red banner at top (low stock) |
| **View Analytics** | Admin Dashboard → Analytics Tab |

---

## 📱 Pages & URLs

```
User Pages:
  / or /dashboard          → Pizza menu
  /pizza-builder           → Customize pizza
  /orders                  → Track your orders
  /login                   → Sign in
  /register                → Create account

Admin Pages:
  /admin                   → Admin dashboard (3 tabs)

Password Recovery:
  /forgot                  → Reset password
  /verify/{token}          → Verify email
  /reset-password/{token}  → Set new password
```

---

## 💬 Real-Time Features

### What's Happening Behind the Scenes

**When you place an order:**
1. ✅ Stock automatically reduces
2. ✅ Admin gets notified instantly
3. ✅ Email sent (if low stock)

**When admin updates status:**
1. ✅ You see notification instantly
2. ✅ Progress bar updates
3. ✅ No page refresh needed (Socket.io!)

**Hourly check:**
1. ✅ Cron job runs every hour
2. ✅ Email sent if low stock

**Daily report:**
1. ✅ Every day at 8 AM
2. ✅ Email with inventory summary

---

## 🐛 Troubleshooting

### Backend won't start?
```bash
# Port 5000 already in use?
# Windows PowerShell:
Get-Process -Name node | Stop-Process -Force

# Then try again
npm run dev
```

### Frontend won't connect?
```bash
# Check backend is running on port 5000
# Check browser console for errors (F12)
# Try refreshing page (Ctrl+R)
```

### Emails not sending?
```
✅ Check EMAIL_USER and EMAIL_PASS in .env
✅ Verify Gmail app password (not regular password)
✅ Check backend logs for errors
```

### Admin features not working?
```
✅ Verify logged-in user has isAdmin: true
✅ Check browser console for errors
✅ Verify Socket.io connected (🟢 in admin dashboard)
```

---

## 📊 What's Working

✅ User authentication (email verification)
✅ Pizza customization  
✅ Real-time order tracking
✅ Admin inventory management
✅ Admin order status updates
✅ Automatic stock deduction
✅ Low stock notifications (email + dashboard)
✅ Scheduled reports (hourly + daily)
✅ Socket.io real-time updates
✅ Responsive design (mobile/tablet/desktop)
✅ Modern purple gradient UI

---

## 🎓 Learn More

**Want details?** Read these guides:
- [Complete README](./README.md) - Full setup guide
- [Admin Dashboard Guide](./ADMIN_DASHBOARD_COMPLETE_GUIDE.md) - Feature details
- [Inventory System](./INVENTORY_SYSTEM_GUIDE.md) - Stock management
- [UI Design Guide](./UI_CONSISTENCY_GUIDE.md) - Design system
- [Implementation Checklist](./IMPLEMENTATION_CHECKLIST.md) - What's done
- [Project Summary](./PROJECT_SUMMARY.md) - Overview

---

## 🚀 Ready to Explore?

1. **Start servers** (see top of this guide)
2. **Visit** http://localhost:5173
3. **Register** a test account
4. **Place** a test order
5. **Login as admin** → see real-time updates
6. **Update stock** → see instant broadcasts
7. **Change status** → user sees update instantly

---

## 💡 Pro Tips

**For Testing:**
- Use temp emails (Gmail: `username+test@gmail.com`)
- Create multiple accounts to test user/admin
- Keep admin dashboard + user dashboard open side-by-side
- Watch Stock.io updates in real-time

**For Debugging:**
- Backend logs show all events
- Browser DevTools → Network tab → check API calls  
- Browser DevTools → Console → check errors
- Check email spam folder for notifications

---

## 🎉 That's It!

Your Pizza Delivery app has:
- ✅ Full ordering system
- ✅ Real-time admin controls
- ✅ Inventory management
- ✅ Email notifications
- ✅ Professional UI
- ✅ Complete documentation

**Start the servers and enjoy! 🍕**

---

**Questions?** Check the [README.md](./README.md) or relevant guide above.

**Issues?** See Troubleshooting section above.

**Ready to deploy?** All code is production-ready!
