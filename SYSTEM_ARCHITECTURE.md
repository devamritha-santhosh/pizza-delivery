# Low Stock Notification System - Visual Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                     PIZZA DELIVERY SYSTEM                            │
└─────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════
                        REAL-TIME NOTIFICATION FLOW
═══════════════════════════════════════════════════════════════════════

    Customer                Order Controller           Inventory      Email Service
       │                         │                         │              │
       │  Place Order           │                         │              │  
       ├────────────────────→   │                         │              │
       │                        │  deductStock()          │              │
       │                        ├───────────────────────→ │              │
       │                        │                    Reduce Stock        │
       │                        │                     Check: < 20?      │
       │                        │                    ←───────────────    │
       │                        │                                        │
       │                        │            LOW STOCK DETECTED         │
       │                        │                        │               │
       │                        │        Get Admin Email (User DB)      │
       │                        │                        │               │
       │                        │           sendLowStockAlert()         │
       │                        ├─────────────────────────┤──────────→  │
       │                        │                         │     Send     │
       │                        │                         │    Email    │
       │    Order Success      │         ← ← ← ←    Email Sent    Email Received
       │←─────────────────────┤                         │          1-5 sec
       │                      │                         │              │
       └──────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════
                      SCHEDULED BACKUP CHECK FLOW
═══════════════════════════════════════════════════════════════════════

    Scheduler            Inventory              Email Service      Admin Room
       │                    │                         │              │
    Hour :00              │                         │              │
       │  checkLowStockItems()                      │              │
       ├──────────────────→│                         │              │
       │             Scan All Items                 │              │
       │             < 20 Units?                    │              │
       │                ←──────────────────────────  │              │
       │                                             │              │
       │            YES → Multi-Item Alert          │              │
       │                                             │              │
       │            Get Admin Email                 │              │
       ├─────────────────────────────────────────→ │              │
       │                              Send Batch    │              │
       │                              Email         │              │
       │                                             │              │
       │◄────────────────────────────────────────────│              │
       │           Email Sent Successfully          │              │
       │                                                            │
       ├─────────────────────────────────────────────────────────→│
       │                    Socket.io Event: low_stock_alert      │
       │                          Dashboard Updates               │
       │◄─────────────────────────────────────────────────────────│
       │                                                           │
       └───────────────────────────────────────────────────────────┘
```

---

## Component Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        BACKEND SERVER                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              API Routes & Controllers                      │  │
│  │                                                            │  │
│  │  POST /api/order/create  → orderController.createOrder()  │  │
│  │  ├─ deductStock()                                          │  │
│  │  └─ sendLowStockAlert() [if items < 20]                  │  │
│  │                                                            │  │
│  │  GET /api/admin/test-low-stock-alert                      │  │
│  │  └─ checkLowStockItems(io)                               │  │
│  └────────────────────────────────────────────────────────────┘  │
│                           ↕                                       │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │            Scheduler & Utilities                           │  │
│  │                                                            │  │
│  │  scheduler.js                                             │  │
│  │  ├─ scheduleStockCheck(io)       [Every Hour :00]        │  │
│  │  ├─ scheduleDailyReport(io)      [Daily 8 AM]            │  │
│  │  └─ checkLowStockItems()         [Check logic]           │  │
│  │                                                            │  │
│  │  sendemail.js                                             │  │
│  │  ├─ sendLowStockMail(item)       [Single item]           │  │
│  │  └─ sendLowStockAlert(email, items) [Batch alerts]       │  │
│  └────────────────────────────────────────────────────────────┘  │
│                           ↕                                       │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │             Database Models                               │  │
│  │                                                            │  │
│  │  Inventory.js                                             │  │
│  │  ├─ bases: [{name, stock}, ...]                           │  │
│  │  ├─ sauces: [{name, stock}, ...]                          │  │
│  │  ├─ cheeses: [{name, stock}, ...]                         │  │
│  │  ├─ veggies: [{name, stock}, ...]                         │  │
│  │  └─ meats: [{name, stock}, ...]                           │  │
│  │                                                            │  │
│  │  User.js                                                  │  │
│  │  └─ isAdmin, email (for alert routing)                    │  │
│  │                                                            │  │
│  │  Order.js                                                 │  │
│  │  └─ items, totalPrice, paymentId, orderStatus            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                           ↕ ↕ ↕
            ┌──────────────────────────────────┐
            │     EXTERNAL SERVICES            │
            ├──────────────────────────────────┤
            │ Gmail SMTP Service               │
            │ └─ sendMail()                    │
            │                                  │
            │ MongoDB Atlas                    │
            │ └─ find(), save(), create()      │
            │                                  │
            │ Node-Cron                        │
            │ └─ schedule()                    │
            │                                  │
            │ Socket.io                        │
            │ └─ emit(), to("admin").emit()    │
            └──────────────────────────────────┘
```

---

## Data Flow: Stock Deduction & Alert

```
Order Request
    │
    ├─→ Validate User & Items
    │
    ├─→ Create Order Document
    │
    ├─→ deductStock(items)
    │   │
    │   ├─ Get Current Inventory Document
    │   │
    │   ├─ For Each Item in Order:
    │   │  │
    │   │  ├─ Find Item in Categories (bases, sauces, cheeses, etc)
    │   │  │
    │   │  ├─ Calculate: oldStock - quantity = newStock
    │   │  │
    │   │  └─ Update Item.stock = newStock
    │   │
    │   └─ Save Document to MongoDB
    │
    └─→ Check Low Stock in Returned Inventory
        │
        ├─ Loop Through All Categories
        │  │
        │  ├─ For Each Item:
        │  │  │
        │  │  ├─ IF item.stock < 20:
        │  │  │   │
        │  │  │   └─ Add to lowItems Array
        │  │  │       {category, name, stock, threshold}
        │  │  │
        │  │  └─ ELSE: Skip
        │  │
        │  └─ Continue to Next Category
        │
        ├─ IF lowItems.length > 0:
        │   │
        │   ├─ Query User Collection for Admin
        │   │  adminEmail = admin.email || env.ADMIN_EMAIL
        │   │
        │   ├─ Call sendLowStockAlert(adminEmail, lowItems)
        │   │   │
        │   │   ├─ Format Email HTML Template
        │   │   │
        │   │   ├─ Connect to Gmail SMTP
        │   │   │
        │   │   ├─ Send Email Message
        │   │   │
        │   │   ├─ LOG: "Low stock email sent"
        │   │   │
        │   │   └─ Return Promise (resolved)
        │   │
        │   └─ LOG: "⚠️ Low stock alert: X items"
        │
        └─ Return Order Response (Success)
```

---

## Threshold Checking Logic

```
Current Stock Analysis
    │
    for category in [bases, sauces, cheeses, veggies, meats]:
    │
    └─→ for item in category:
        │
        └─→ if item.stock < THRESHOLD (20):
            │
            ├─ ✅ ADD TO ALERT LIST
            │
            └─ Properties:
               {
                 category: "bases",
                 name: "Regular Crust",
                 stock: 15,           ← Current amount
                 threshold: 20        ← Alert trigger
               }
            
            Example Alerts:
            • 15 units → RED (Alert)
            • 20 units → GREEN (OK)
            • 21 units → GREEN (OK)
```

---

## Email Generation Flow

```
Batch Alert Email
    │
    └─ Template Creation:
       │
       ├─ Subject: "⚠️ Multiple Low Stock Items Alert - X Items"
       │
       ├─ HTML Header:
       │  └─ "🚨 Low Stock Alert"
       │
       ├─ Item List Formation:
       │  │
       │  for each lowItem:
       │  │
       │  └─ "• {category}: {name} ({stock}/{threshold} units)"
       │     Examples:
       │     • bases: Regular Crust (15/20 units)
       │     • sauces: Tomato (8/20 units)
       │     • meats: Chicken (5/20 units)
       │
       ├─ Action Text:
       │  └─ "Action Required: Please restock immediately."
       │
       ├─ Footer:
       │  └─ Timestamp: Current Date & Time
       │
       └─ Send via nodemailer:
          │
          ├─ from: process.env.EMAIL_USER
          ├─ to: adminEmail
          ├─ subject: "⚠️ Multiple Low Stock Items Alert - 3 Items"
          └─ html: [Formatted HTML above]
```

---

## Scheduler Cron Schedule

```
┌────────────────────────────────────────────────────┐
│          Stock Check Schedule                       │
├────────────────────────────────────────────────────┤
│                                                    │
│  Schedule Expression: "0 * * * *"                 │
│                      │ │ │ │ │                    │
│                      │ │ │ │ └─ Day of Week (0-6)│
│                      │ │ │ └─── Month (1-12)     │
│                      │ │ └───── Day (1-31)       │
│                      │ └─────── Hour (0-23)      │
│                      └───────── Minute (0-59)    │
│                                                    │
│  Result: Runs at EVERY HOUR START (:00)           │
│                                                    │
│  Examples:                                         │
│  08:00 ← Check 1                                  │
│  09:00 ← Check 2                                  │
│  10:00 ← Check 3                                  │
│  ...and so on every hour                          │
│                                                    │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│     Daily Report Schedule                          │
├────────────────────────────────────────────────────┤
│                                                    │
│  Schedule Expression: "0 8 * * *"                 │
│                      │ │ │ │ │                    │
│                      │ │ │ │ └─ Day of Week      │
│                      │ │ │ └─── Month            │
│                      │ │ └───── Day              │
│                      │ └─────── Hour (08 = 8 AM)│
│                      └───────── Minute (00)      │
│                                                    │
│  Result: Runs DAILY AT 8:00 AM                   │
│                                                    │
│  Examples:                                         │
│  Mon 08:00 ← Report 1                            │
│  Tue 08:00 ← Report 2                            │
│  Wed 08:00 ← Report 3                            │
│  ...daily                                         │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## Error Handling Flow

```
Alert Process Error Scenarios
    │
    ├─ Scenario 1: Email Service Fails
    │  │
    │  ├─ Try: await sendLowStockAlert(email, items)
    │  │
    │  ├─ Catch: (error)
    │  │  │
    │  │  ├─ LOG: "⚠️ Email notification failed..."
    │  │  │
    │  │  ├─ Order Status: ✅ STILL COMPLETES
    │  │  │
    │  │  └─ Next Check: Hourly scheduler will retry
    │  │
    │  └─ Return: Success (email not required)
    │
    ├─ Scenario 2: Inventory Not Found
    │  │
    │  ├─ Check: if (!inventory)
    │  │
    │  ├─ Action: LOG "❌ No inventory found"
    │  │
    │  ├─ Order: ✅ STILL COMPLETES
    │  │
    │  └─ Return: Graceful fallback
    │
    ├─ Scenario 3: Admin User Not Found
    │  │
    │  ├─ Check: const admin = await User.findOne({isAdmin})
    │  │
    │  ├─ Action: Use fallback email
    │  │  adminEmail = admin?.email 
    │  │            || process.env.ADMIN_EMAIL 
    │  │            || "admin@pizzadelivery.com"
    │  │
    │  ├─ Result: Email still sent to fallback
    │  │
    │  └─ Order: ✅ STILL COMPLETES
    │
    ├─ Scenario 4: Database Connection Lost
    │  │
    │  ├─ Catch: (error)
    │  │
    │  ├─ LOG: Error details
    │  │
    │  ├─ Order: ❌ FAILS (database required)
    │  │
    │  └─ Return: 500 Server Error
    │
    └─ Principle: 
       Alert failures NEVER block orders
       Only database failures prevent orders
```

---

## Socket.io Event Broadcasting

```
Real-Time Admin Dashboard Updates
    │
    ├─ Low Stock Alert Event
    │  │
    │  └─ io.to("admin").emit("low_stock_alert", {
    │       items: [
    │         {category: "bases", name: "Crust", stock: 15, threshold: 20},
    │         {category: "meats", name: "Chicken", stock: 5, threshold: 20}
    │       ],
    │       itemCount: 2,
    │       alertTime: "2026-02-13T14:32:45.000Z",
    │       message: "2 items are below the threshold of 20 units"
    │     })
    │
    ├─ Daily Report Event
    │  │
    │  └─ io.to("admin").emit("daily_inventory_report", {
    │       report: {
    │         bases: 250,
    │         sauces: 150,
    │         cheeses: 200,
    │         veggies: 300,
    │         meats: 100
    │       },
    │       totalStock: 1000,
    │       timestamp: "2026-02-13T08:00:00.000Z"
    │     })
    │
    └─ Admin Room Membership
       │
       ├─ socket.on("admin_join")
       │  └─ socket.join("admin")  ← Admin added to room
       │
       └─ All admins in "admin" room receive events
```

---

## File Dependencies

```
server.js
├─ scheduler.js
│  ├─ cron (node-scheduler)
│  ├─ Inventory Model
│  ├─ User Model
│  └─ sendemail.js
│     └─ nodemailer (Gmail SMTP)
│
├─ orderController.js
│  ├─ Order Model
│  ├─ Inventory Model
│  ├─ User Model
│  ├─ InventoryController
│  │  ├─ deductStock()
│  │  └─ Uses Inventory Model
│  └─ sendemail.js
│     ├─ sendLowStockMail()
│     └─ sendLowStockAlert()
│
└─ Socket.io (io)
   └─ Broadcasts to admin room
```

---

**Last Updated:** February 13, 2026
**System Status:** Production Ready ✅
