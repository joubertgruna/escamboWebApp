# 🚀 Quick Start - Application Running

## 📱 Access URLs

### Frontend (Next.js)
- **URL**: http://localhost:5174
- **Login**: http://localhost:5174/login
- **Feed**: http://localhost:5174/feed
- **Profile**: http://localhost:5174/profile
- **Matches**: http://localhost:5174/matches

### Backend API
- **Base URL**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/api/health (GET)

### Database
- **Host**: localhost:3306
- **User**: escambo
- **Password**: escambo123
- **Database**: escambo_dev

## 🔐 Test Credentials

### Primary Test User
```
Email: joao@example.com
Password: password
```

### Additional Test Users
10 more users seeded in database (all with password: "password")

## ✅ All Endpoints Verified

### Auth Routes
```
POST   /auth/login          ✅ Login user, return token
POST   /auth/register       ✅ Register new user
GET    /auth/me             ✅ Get current user profile
PUT    /auth/profile        ✅ Update profile
POST   /auth/avatar         ✅ Upload avatar
```

### Items Routes
```
GET    /items               ✅ Get feed (paginated)
GET    /items/mine          ✅ Get user's items
GET    /items/:id           ✅ Get item details
POST   /items               ✅ Create item
PUT    /items/:id           ✅ Update item
DELETE /items/:id           ✅ Delete item
POST   /items/:id/photos    ✅ Add photo to item
DELETE /items/:id/photos/:photoId ✅ Remove photo
```

### Likes Routes
```
POST   /likes               ✅ Like an item
GET    /likes/my            ✅ Get user's likes (NEWLY FIXED)
GET    /likes/received      ✅ Get received likes
DELETE /likes/:id           ✅ Unlike item
```

### Matches Routes
```
GET    /matches             ✅ Get all matches
GET    /matches/:id         ✅ Get match details
GET    /matches/:id/messages ✅ Get messages in match
POST   /matches/:id/messages ✅ Send message
POST   /matches/:id/read    ✅ Mark as read
PUT    /matches/:id         ✅ Update match status
```

## 🛠 Common Commands

### View Backend Logs
```bash
docker logs -f escambo-backend
```

### View MySQL
```bash
docker exec -it escambo-mysql mysql -u escambo -pescambo123 escambo_dev
```

### Run Migrations (if needed)
```bash
docker exec escambo-backend npm run migrate
```

### Run Seeds (if needed)
```bash
docker exec escambo-backend npm run seed
```

### Restart Services
```bash
# Stop all
docker-compose down

# Start all
docker-compose up -d
```

## 📊 Current Status

| Component | Status | Port |
|-----------|--------|------|
| Next.js Frontend | ✅ Running | 5174 |
| Node.js Backend | ✅ Running | 3000 |
| MySQL Database | ✅ Running | 3306 |

## 🎯 What Works

✅ User registration & login
✅ Browse items (feed)
✅ View your items
✅ View your likes *(newly fixed)*
✅ Create/Edit/Delete items
✅ Like/Unlike items
✅ Automatic match creation on mutual likes
✅ View matches
✅ Chat with matches
✅ User profile management

## 🧪 Test Flow

1. Go to http://localhost:5174/login
2. Login with joao@example.com / password
3. Navigate to /feed - browse items
4. Navigate to /my-items - see your items
5. Navigate to /likes - see items you've liked *(newly working)*
6. Navigate to /profile - see stats
7. Navigate to /matches - see matches
8. Click on a match to open chat

## 💾 Database Info

- **Tables**: users, items, likes, matches, messages, photos, categories, notifications
- **Test Data**: 
  - 1 primary user + 10 additional users
  - 15+ items across all users
  - Multiple likes and matches pre-seeded
  - Sample messages in matches

## 🚀 Ready For

- E2E Testing
- User flow validation
- UI/Design improvements
- Deployment

---

**Application Status**: ✅ FULLY FUNCTIONAL
**Last Checked**: 2026-03-17
