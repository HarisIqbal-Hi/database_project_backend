# Chemnitz Cultural Sites API

An Express.js + TypeScript REST API for discovering, collecting, and reviewing cultural sites in Chemnitz, Germany.  
Supports user accounts, favorites, reviews, and a gamified explorer experience!

---

## 🚀 Features

- User registration, login, and JWT authentication (cookie-based)
- Browse, filter, and search categorized cultural sites (from open data)
- Sites displayed as list and on a map (GeoJSON endpoint)
- Mark/unmark favorite places (per user)
- User dashboard: visited places, reviews, and personal achievements
- API documentation with Swagger UI (`/api/docs`)
- Modern backend code: TypeScript, modular structure, PostgreSQL

---

## 🛠 Getting Started
### 1. **Clone the repository**
```bash
git clone https://github.com/your-username/chemnitz-cultural-sites.git
cd chemnitz-cultural-sites
```

### 2. **Install dependencies**
```bash
npm install
```
### 3. **Set up environment variables**
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
ACCESS_SECRET=your_jwt_access_secret
REFRESH_SECRET=your_jwt_refresh_secret
NODE_ENV=development
```
### 4. **Prepare the PostgreSQL database**
```bash
createdb your_db_name
```