# MongoDB + Visual Enhancements Setup

## ⚠️ IMPORTANT: MongoDB Installation Required

This project now uses MongoDB instead of SQLite. You must install MongoDB before running the backend.

## Quick Start

### 1. Install MongoDB

**Windows:**
- Download: https://www.mongodb.com/try/download/community
- Or use Chocolatey: `choco install mongodb`

**Mac:**
```bash
brew install mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
```

### 2. Start MongoDB

```bash
# Windows (as service)
net start MongoDB

# Mac/Linux
mongod

# Custom port (if needed)
mongod --port 27017
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

### 5. Access the App

Open: http://localhost:5173

## What's New?

### ✅ MongoDB Database
- Scalable NoSQL database
- Cloud-ready (MongoDB Atlas compatible)
- Auto-seeding for initial data
- 19 stock items across 4 categories

### ✅ Dark Mode Fixed
- Toggle now works perfectly
- Applies to HTML element correctly
- Smooth theme transitions

### ✅ Beautiful Backgrounds
- Animated gradients for all portals
- Login: Purple/violet theme
- Employee: Pink/orange theme
- Admin: Blue/green theme
- Office Boy: Teal/pink theme
- Registration: Peach/coral theme

## Default Credentials

**Employee:** john.doe / emp123  
**Office Boy:** office.boy / boy123  
**Admin:** admin / admin123

## Environment Variables

Optional - Set custom MongoDB URI:
```bash
export MONGODB_URI="mongodb://localhost:27017/office_order_system"
```

For MongoDB Atlas (cloud):
```bash
export MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/office_order_system"
```

## Troubleshooting

**Error: "Cannot connect to MongoDB"**
- Ensure MongoDB is installed
- Check if MongoDB service is running
- Verify connection URI

**Error: "Dark mode not working"**
- Clear browser cache
- Hard reload (Ctrl+Shift+R)
- Check browser console for errors

---

For full documentation, see [walkthrough.md](file:///C:/Users/Omar%20Khaled/.gemini/antigravity/brain/c6bcd14c-43b7-4ac2-bcab-fe4210ea3b67/walkthrough.md)
