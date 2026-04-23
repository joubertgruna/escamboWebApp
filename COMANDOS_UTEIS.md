# 🛠️ COMANDOS ÚTEIS - PWA & Push Notifications

## 🚀 Quick Commands

### Start Application
```bash
# Inicia backend + frontend
cd /Users/joubertgabriel/Documents/CodePlace/EscamboWebApp
bash start.sh

# Ou manualmente:
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

### Access Application
```bash
# Frontend (Vite Dev Server)
http://localhost:5173

# Backend API
http://localhost:3000/api

# Health Check
curl http://localhost:3000/api/health
```

---

## 🔧 Development Commands

### Frontend

```bash
cd frontend

# Development
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview build

# Code Quality
npm run lint            # ESLint check
npm run format          # Format code
```

### Backend

```bash
cd backend

# Development
npm run dev             # Start with nodemon
npm start               # Production start

# Database
npm run migrate         # Run migrations
npm run seed            # Seed database
npm run rollback        # Rollback migrations

# Testing
npm test                # Run tests
npm run test:watch      # Watch mode
```

---

## 📱 PWA & Notifications

### Generate New VAPID Keys
```bash
cd backend
npx web-push generate-vapid-keys

# Output:
# Public Key: ...
# Private Key: ...
# 
# Copie para .env
```

### Check Service Worker
```javascript
// DevTools Console (F12)
navigator.serviceWorker.getRegistrations().then(reg => {
  console.log('Service Workers:', reg);
  reg.forEach(r => console.log('Ativo:', r.active));
});
```

### Check Push Subscription
```javascript
// DevTools Console (F12)
navigator.serviceWorker.ready.then(reg => {
  return reg.pushManager.getSubscription();
}).then(sub => {
  console.log('Subscription:', sub);
  if (sub) {
    console.log('Endpoint:', sub.endpoint);
    console.log('Keys:', {
      auth: sub.getKey('auth').toString(),
      p256dh: sub.getKey('p256dh').toString()
    });
  }
});
```

### Check Notification Permission
```javascript
// DevTools Console (F12)
Notification.permission  // "default", "granted", "denied"

// Request permission
Notification.requestPermission().then(perm => {
  console.log('Permission:', perm);
});
```

### Send Test Notification
```javascript
// DevTools Console (F12)
new Notification('Test', {
  body: 'This is a test notification',
  icon: 'https://via.placeholder.com/128',
  badge: 'https://via.placeholder.com/64'
});
```

---

## 🗄️ Database Commands

### Initialize MySQL
```bash
# Via Docker
docker-compose up -d mysql

# Via Homebrew (macOS)
brew services start mysql-server

# Manual on macOS
/usr/local/mysql/support-files/mysql.server start
```

### Run Migrations
```bash
cd backend

# All pending migrations
npx knex migrate:latest

# Specific migration
npx knex migrate:up

# Rollback last batch
npx knex migrate:rollback

# Rollback all
npx knex migrate:rollback --all
```

### Seed Database
```bash
cd backend

# Run seeders
npx knex seed:run

# Specific seeder
npx knex seed:run --specific=01_sample_ads.js
```

### Query Database
```bash
# Via MySQL CLI
mysql -h localhost -u escambo -pescambo123 escambo_dev

# Or use GUI: MySQL Workbench, TablePlus, DBeaver
```

---

## 🔍 Debugging & Troubleshooting

### Check Ports
```bash
# macOS/Linux
lsof -i :3000       # Backend
lsof -i :5173       # Frontend
lsof -i :3306       # MySQL

# Windows
netstat -ano | findstr :3000
```

### Clear Cache & Reload
```bash
# DevTools (F12)
# 1. Application → Storage → Clear site data
# 2. Ctrl+Shift+R (hard refresh)
# 3. Uninstall PWA app

# Or via Console
localStorage.clear();
sessionStorage.clear();
indexedDB.databases().then(dbs => {
  dbs.forEach(db => indexedDB.deleteDatabase(db.name));
});
```

### Check Logs
```bash
# Backend logs (if running with logs)
tail -f backend.log

# Browser Console (F12)
# Search for: 🔌 📨 🔔 ✅ ❌

# Network traffic (F12)
# Tab: Network → Filter by "ws" (WebSocket) or "fetch"
```

### Reset Everything
```bash
# Kill processes
pkill -f "node server.js"
pkill -f "vite"

# Clear cache
rm -rf backend/node_modules/.cache
rm -rf frontend/node_modules/.vite

# Restart
bash start.sh
```

---

## 🚨 Common Issues & Fixes

### Issue: Port already in use
```bash
# Kill process on port
kill -9 $(lsof -ti :3000)  # Kill port 3000
kill -9 $(lsof -ti :5173)  # Kill port 5173

# Or change port in code/env
```

### Issue: CORS errors
```bash
# Check .env
echo $CORS_ORIGIN  # Should be http://localhost:5173

# Verify backend config
grep -n "cors" backend/src/app.js
```

### Issue: Service Worker not registering
```bash
# In DevTools Console
navigator.serviceWorker.ready.then(reg => {
  console.log('SW registered:', reg);
}).catch(err => {
  console.error('SW error:', err);
});
```

### Issue: Notifications not working
```javascript
// Check permission
if (Notification.permission === 'denied') {
  console.error('Notifications are blocked');
  // User needs to enable in browser settings
}

// Check subscription
navigator.serviceWorker.ready.then(reg => {
  reg.pushManager.getSubscription().then(sub => {
    if (!sub) {
      console.error('No push subscription');
      // User needs to click "Enable Notifications"
    }
  });
});
```

---

## 📊 Useful DevTools Tips

### DevTools Shortcuts
```
F12              Open DevTools
Ctrl+Shift+I     DevTools alternate
Ctrl+Shift+J     Console only
Ctrl+Shift+C     Element picker

# In DevTools
Ctrl+P           File search
Ctrl+G           Go to line
Ctrl+O           Open file
$0               Selected element
$_               Last console result
```

### DevTools Tabs
```
Elements         DOM inspector
Console          JS console (F12 → Console)
Network          HTTP/WebSocket traffic
Storage          LocalStorage, SessionStorage, IndexedDB, Cookies
Service Workers  SW status and cache
Performance      Profile app performance
```

### Useful Console Commands
```javascript
// Network info
navigator.onLine                    // true/false
navigator.connection.effectiveType  // 4g, 3g, 2g

// Service Worker
navigator.serviceWorker.getRegistrations()
navigator.serviceWorker.controller

// Push notifications
Notification.permission
PushManager.getSubscription()

// Storage usage
navigator.storage.estimate().then(est => {
  console.log('Usage:', est.usage, 'Quota:', est.quota);
});
```

---

## 📈 Performance Commands

### Measure Page Load
```javascript
// DevTools Console
performance.timing.navigationStart
performance.timing.loadEventEnd - performance.timing.navigationStart

// Or use
performance.getEntriesByType('navigation')[0].duration
```

### Profile JavaScript
```
DevTools → Performance → Record → Run actions → Stop
Check: Scripting time, Rendering time, Painting time
```

### Audit PWA
```
DevTools → Lighthouse → Generate report
Check: Performance, PWA, Best Practices, SEO, Accessibility
```

---

## 🔐 Security Commands

### Check VAPID Configuration
```bash
# Backend
grep "VAPID" backend/.env

# Frontend
grep "VAPID" frontend/.env
```

### Validate Certificates (HTTPS only)
```bash
# Check SSL certificate
openssl s_client -connect domain.com:443

# Generate self-signed cert
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365
```

---

## 📚 Documentation Commands

### Build Documentation
```bash
# Generate markdown documentation
npm run docs:build

# Or manually with markdown generators
```

### Search Documentation
```bash
# Search files
grep -r "PWA\|Push\|Notification" docs/

# Search code
grep -r "usePushNotifications\|PWAControls" frontend/src/
```

---

## 🔄 Git Commands

### View Changes
```bash
# See all modified files
git status

# See diff
git diff

# See staged changes
git diff --staged

# See changes in specific file
git diff frontend/src/views/ChatView.vue
```

### Commit Changes
```bash
# Add files
git add .

# Commit
git commit -m "feat: add PWA and push notifications"

# Push
git push origin master
```

### View History
```bash
# See commits
git log --oneline -20

# See specific file history
git log -p frontend/src/main.js
```

---

## 🌐 Browser Console Snippets

### Full PWA Status Check
```javascript
(async () => {
  console.group('🔍 PWA Status Check');
  
  // Service Worker
  const sws = await navigator.serviceWorker.getRegistrations();
  console.log('Service Workers:', sws.length > 0 ? '✅' : '❌', sws);
  
  // Push Subscription
  const sw = await navigator.serviceWorker.ready;
  const sub = await sw.pushManager.getSubscription();
  console.log('Push Subscription:', sub ? '✅' : '❌', sub);
  
  // Notification Permission
  console.log('Notification Permission:', Notification.permission, 
    Notification.permission === 'granted' ? '✅' : '❌');
  
  // Online Status
  console.log('Online:', navigator.onLine ? '✅' : '❌');
  
  // Manifest
  const manifest = await fetch('/manifest.json').then(r => r.json());
  console.log('Manifest:', manifest);
  
  console.groupEnd();
})();
```

### Send Test Notification
```javascript
(async () => {
  const sw = await navigator.serviceWorker.ready;
  sw.getNotifications().then(notifs => {
    console.log('Current notifications:', notifs);
  });
  
  await sw.showNotification('Test Notification', {
    body: 'This is a test from console',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'test-notification'
  });
})();
```

---

## 📞 Emergency Commands

```bash
# Kill everything and restart
pkill -f "node"
sleep 2
bash start.sh

# Full reset
rm -rf frontend/node_modules backend/node_modules
rm -rf .git/index.lock
npm install --legacy-peer-deps
bash start.sh

# View all running processes
ps aux | grep -E "node|vite|mysql"

# Check system resources
top -b -n 1 | head -20
```

---

## 📋 Useful Aliases (Add to .bashrc or .zshrc)

```bash
# Add these to your shell config:

alias escambo='cd /Users/joubertgabriel/Documents/CodePlace/EscamboWebApp'
alias start-escambo='cd /Users/joubertgabriel/Documents/CodePlace/EscamboWebApp && bash start.sh'
alias backend='cd /Users/joubertgabriel/Documents/CodePlace/EscamboWebApp/backend && npm run dev'
alias frontend='cd /Users/joubertgabriel/Documents/CodePlace/EscamboWebApp/frontend && npm run dev'
alias logs='tail -f /Users/joubertgabriel/Documents/CodePlace/EscamboWebApp/backend.log'
alias check-ports='lsof -i :3000; lsof -i :5173; lsof -i :3306'
```

---

**Happy coding! 🚀**

Last Updated: 5 de Março de 2026
