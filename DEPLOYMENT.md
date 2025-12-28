# 🚀 Deployment Guide

## Production Deployment Options

### Option 1: Vercel (Recommended - Easiest)

#### Why Vercel?
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ GitHub integration
- ✅ Instant deployment
- ✅ Global CDN

#### Steps:
1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Build your project**
```bash
npm run build
```

3. **Deploy**
```bash
vercel
```

4. **Production deployment**
```bash
vercel --prod
```

Your site will be live at: `https://your-project-name.vercel.app`

---

### Option 2: Netlify

#### Why Netlify?
- ✅ Free tier available
- ✅ Drag-and-drop deployment
- ✅ Form handling
- ✅ Automatic HTTPS

#### Steps:
1. **Build your project**
```bash
npm run build
```

2. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

3. **Deploy**
```bash
netlify deploy
```

4. **Production deployment**
```bash
netlify deploy --prod
```

---

### Option 3: GitHub Pages (Static Only)

#### Steps:
1. **Install gh-pages**
```bash
npm install --save-dev gh-pages
```

2. **Add to package.json**
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/office-order-system"
}
```

3. **Update vite.config.js**
```javascript
export default defineConfig({
  base: '/office-order-system/',
  // ... rest of config
})
```

4. **Deploy**
```bash
npm run deploy
```

---

### Option 4: Traditional Hosting (Any Provider)

#### Build for Production
```bash
npm run build
```

This creates a `dist` folder with optimized files.

#### Upload to Server
1. Upload entire `dist` folder to your web server
2. Configure server to serve `index.html` for all routes
3. Ensure HTTPS is enabled

#### Server Configuration Examples:

**Nginx:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Apache (.htaccess):**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## Backend Integration (Future)

### Recommended Stack

#### Option A: Node.js + Express + MongoDB
```bash
# Backend setup
mkdir backend
cd backend
npm init -y
npm install express mongoose cors dotenv bcrypt jsonwebtoken
```

**Basic Structure:**
```
backend/
├── models/
│   ├── User.js
│   ├── Order.js
│   └── Stock.js
├── routes/
│   ├── auth.js
│   ├── orders.js
│   └── stock.js
├── middleware/
│   └── auth.js
├── config/
│   └── db.js
└── server.js
```

#### Option B: Python + FastAPI + PostgreSQL
```bash
# Backend setup
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-jose passlib
```

**Basic Structure:**
```
backend/
├── models/
│   ├── user.py
│   ├── order.py
│   └── stock.py
├── routes/
│   ├── auth.py
│   ├── orders.py
│   └── stock.py
├── database.py
└── main.py
```

---

## Environment Variables

### Create `.env` file (DO NOT commit to Git!)
```env
# Frontend (.env)
VITE_API_URL=http://localhost:3000
VITE_APP_NAME="Office Order System"

# Backend
DATABASE_URL=mongodb://localhost:27017/office_orders
# OR for PostgreSQL
DATABASE_URL=postgresql://user:password@localhost/office_orders

JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRATION=24h

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

NODE_ENV=production
PORT=3000
```

### Add to `.gitignore`
```
.env
.env.local
.env.production
```

---

## Production Checklist

### Before Deployment

#### 1. Security
- [ ] Change all default passwords
- [ ] Remove demo credentials from production
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Implement CORS properly
- [ ] Sanitize all inputs
- [ ] Add CSP headers

#### 2. Performance
- [ ] Optimize images
- [ ] Enable gzip compression
- [ ] Minify CSS/JS (done automatically by Vite)
- [ ] Add CDN for static assets
- [ ] Enable browser caching
- [ ] Add loading skeletons
- [ ] Implement lazy loading

#### 3. SEO & Analytics
- [ ] Add meta tags
- [ ] Create sitemap.xml
- [ ] Add robots.txt
- [ ] Set up Google Analytics
- [ ] Add Open Graph tags
- [ ] Optimize page titles

#### 4. Database
- [ ] Set up database backups
- [ ] Add database indexes
- [ ] Set up connection pooling
- [ ] Configure database SSL
- [ ] Set up monitoring

#### 5. Monitoring & Logging
- [ ] Set up error tracking (Sentry)
- [ ] Add application logs
- [ ] Monitor uptime
- [ ] Set up alerts
- [ ] Track user analytics

#### 6. Testing
- [ ] Run all tests
- [ ] Test on multiple browsers
- [ ] Test responsive design
- [ ] Test accessibility
- [ ] Performance testing
- [ ] Security audit

---

## Docker Deployment (Advanced)

### Create `Dockerfile`
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Create `docker-compose.yml`
```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: always

  # Add backend service when ready
  # backend:
  #   build: ./backend
  #   ports:
  #     - "3000:3000"
  #   environment:
  #     - DATABASE_URL=${DATABASE_URL}
  #   restart: always

  # database:
  #   image: postgres:15
  #   environment:
  #     - POSTGRES_PASSWORD=${DB_PASSWORD}
  #   volumes:
  #     - postgres_data:/var/lib/postgresql/data
  #   restart: always

volumes:
  postgres_data:
```

### Deploy with Docker
```bash
docker-compose up -d
```

---

## Continuous Deployment

### GitHub Actions (CI/CD)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

---

## Database Migration Strategy

### When Moving from Mock Data to Real Database

1. **Export Current Data**
```javascript
// Save to JSON for initial migration
const exportData = {
  users: initialUsers,
  stock: initialStock,
  orders: orders
};
localStorage.setItem('migration_data', JSON.stringify(exportData));
```

2. **Create Migration Script**
```javascript
// migration.js
const data = JSON.parse(localStorage.getItem('migration_data'));

// Send to backend
fetch('http://your-api.com/migrate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

---

## Performance Optimization

### Code Splitting
```javascript
// Lazy load components
import { lazy, Suspense } from 'react';

const AdminDashboard = lazy(() => import('./AdminDashboard'));
const EmployeeDashboard = lazy(() => import('./EmployeeDashboard'));

// Use with Suspense
<Suspense fallback={<Loading />}>
  <AdminDashboard />
</Suspense>
```

### Image Optimization
```bash
# Install image optimization plugin
npm install vite-plugin-imagemin -D
```

---

## Monitoring Setup

### Sentry (Error Tracking)
```bash
npm install @sentry/react
```

```javascript
// main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

### Google Analytics
```javascript
// Add to index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## Backup Strategy

### Automated Database Backups
```bash
# Cron job for daily backups
0 2 * * * mongodump --db office_orders --out /backups/$(date +\%Y\%m\%d)
```

### Code Backup
- Use Git for version control
- Push to GitHub/GitLab regularly
- Tag releases: `git tag v1.0.0`

---

## Cost Estimation

### Free Tier (Getting Started)
- **Vercel Free**: Unlimited deployments
- **MongoDB Atlas Free**: 512MB storage
- **Total**: $0/month

### Small Business (100-500 users)
- **Vercel Pro**: $20/month
- **MongoDB Atlas M10**: $57/month
- **SendGrid Email**: $15/month
- **Total**: ~$92/month

### Enterprise (1000+ users)
- **AWS/Azure**: ~$200-500/month
- **Dedicated Database**: ~$100-200/month
- **CDN**: ~$50/month
- **Total**: ~$350-750/month

---

## Domain Setup

1. **Buy Domain**: Namecheap, GoDaddy, Google Domains
2. **Configure DNS**:
   - A Record: `@` → Your server IP
   - CNAME: `www` → Your domain
3. **Enable SSL**: Let's Encrypt (free) or Cloudflare

---

## Support & Maintenance

### Regular Tasks
- [ ] Weekly: Check error logs
- [ ] Monthly: Update dependencies
- [ ] Quarterly: Security audit
- [ ] Yearly: Performance review

### Update Dependencies
```bash
# Check for updates
npm outdated

# Update safely
npm update

# Update to latest (careful!)
npx npm-check-updates -u
npm install
```

---

## Getting Help

### Resources
- **Vite Docs**: https://vitejs.dev
- **React Docs**: https://react.dev
- **MDN Web Docs**: https://developer.mozilla.org
- **Stack Overflow**: Tag with 'reactjs', 'vite'

### Community
- React Discord
- r/reactjs on Reddit
- Dev.to community

---

## Summary

**Quick Start (Recommended):**
1. Build: `npm run build`
2. Deploy to Vercel: `vercel --prod`
3. Done! ✨

**For Production:**
1. Set up backend API
2. Configure database
3. Add authentication
4. Set up monitoring
5. Enable HTTPS
6. Deploy with CI/CD

**Current Status:** Frontend-only demo - Perfect for testing and presentations!

---

Need help with deployment? Check the documentation or reach out to your development team! 🚀
