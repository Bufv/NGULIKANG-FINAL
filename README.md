# 🏗️ Ngulikang - Platform Jasa Tukang

Platform marketplace untuk menghubungkan pengguna dengan tukang profesional. Terdiri dari 3 panel: Admin, Tukang, dan User.

## 📦 Tech Stack

### Frontend
- **Web User**: React + Vite + Framer Motion + Three.js + GSAP
- **Panel Admin**: React + Vite + Material-UI
- **Panel Tukang**: React (CRA) + Three.js

### Backend
- **API**: Node.js + Express.js
- **Database**: PostgreSQL 15
- **Authentication**: JWT (JSON Web Token)
- **Real-time**: Socket.io (Chat & Notifications)
- **File Upload**: Multer

### DevOps
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Nginx
- **Database GUI**: Adminer

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose installed
- Git
- Port 80, 5000, 5432, 8080 available

### Installation

1. **Clone repository**
```bash
git clone https://github.com/your-username/ngulikang.git
cd ngulikang
```

2. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env dengan credentials yang sesuai
```

3. **Start all services**
```bash
docker-compose up -d
```

4. **Wait for services to be ready** (±2 minutes)
```bash
docker-compose ps
# Semua services harus status "Up"
```

5. **Access applications**
- 🌐 **Web User**: http://localhost
- 👨‍💼 **Panel Admin**: http://localhost/admin
- 🔨 **Panel Tukang**: http://localhost/tukang
- 🔌 **Backend API**: http://localhost/api
- 🗄️ **Adminer (Database GUI)**: http://localhost:8080

---

## 👤 Default Credentials

### Login Panel Admin
- Email: `admin@ngulikang.com`
- Password: `admin123`

### Login Panel Tukang
- Email: `tukang1@ngulikang.com`
- Password: `tukang123`

### Login Web User
- Email: `user1@example.com`
- Password: `user123`

### Database Access (Adminer)
- System: `PostgreSQL`
- Server: `postgres`
- Username: `ngulikang_user`
- Password: `ngulikang_pass`
- Database: `ngulikang_db`

---

## 📁 Project Structure

```
ngulikang/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── seeds/                  # Database seeding
│   └── uploads/                # User uploaded files
├── Panel-Admin-Ngulikang/      # Admin Panel (React + Vite)
│   └── src/
├── Ngulikang-Web-Panel/        # Tukang Panel (React CRA)
│   └── src/
├── Web-Ngulikang/              # User Web (React + Vite)
│   └── src/
├── nginx/                      # Nginx reverse proxy config
│   └── nginx.conf
├── docker-compose.yml          # Docker orchestration
├── .env                        # Environment variables (ignored)
├── .env.example                # Environment template
└── README.md                   # This file
```

---

## 🛠️ Development

### Run services individually
```bash
# Start only backend
docker-compose up backend

# Start only frontend
docker-compose up web-user panel-admin panel-tukang

# View logs
docker-compose logs -f backend
docker-compose logs -f web-user
```

### Restart services
```bash
# Restart specific service
docker-compose restart backend

# Restart all
docker-compose restart
```

### Rebuild after code changes
```bash
docker-compose down
docker-compose up --build
```

### Access container shell
```bash
# Backend
docker-compose exec backend sh

# Database
docker-compose exec postgres psql -U ngulikang_user -d ngulikang_db
```

---

## 🗃️ Database Management

### Via Adminer (Recommended)
1. Open http://localhost:8080
2. Login with database credentials
3. Browse tables, edit data, run SQL queries

### Via psql CLI
```bash
docker-compose exec postgres psql -U ngulikang_user -d ngulikang_db
```

### Run SQL file
```bash
docker cp your-script.sql ngulikang-postgres:/tmp/
docker-compose exec postgres psql -U ngulikang_user -d ngulikang_db -f /tmp/your-script.sql
```

### Database backup
```bash
docker-compose exec postgres pg_dump -U ngulikang_user ngulikang_db > backup.sql
```

### Database restore
```bash
cat backup.sql | docker-compose exec -T postgres psql -U ngulikang_user -d ngulikang_db
```

---

## 🔧 Troubleshooting

### Port already in use
```bash
# Find process using port
sudo lsof -i :80
sudo lsof -i :5000

# Kill process
sudo kill -9 <PID>
```

### Services not starting
```bash
# Check logs
docker-compose logs

# Check specific service
docker-compose logs backend
```

### Database connection failed
```bash
# Check if postgres is healthy
docker-compose ps postgres

# Restart postgres
docker-compose restart postgres
```

### Frontend blank/white screen
```bash
# Check console errors (F12 in browser)
# Check if backend is running
curl http://localhost/api

# Restart frontend services
docker-compose restart web-user panel-admin panel-tukang
```

### Hot reload not working
```bash
# Ensure volumes are mounted correctly
docker-compose down
docker-compose up --build
```

---

## 📚 API Documentation

API documentation available at: http://localhost:5000/api/docs

Or import Postman collection from `docs/postman_collection.json`

---

## 🚢 Production Deployment

### Build production images
```bash
docker-compose -f docker-compose.prod.yml build
```

### Deploy
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Important for production:
- [ ] Change all default passwords in `.env`
- [ ] Use strong JWT secrets (min 32 characters)
- [ ] Enable HTTPS (SSL certificates)
- [ ] Setup database backups
- [ ] Configure firewall rules
- [ ] Enable rate limiting
- [ ] Setup monitoring & logging

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details

---

## 🙏 Acknowledgments

- Material-UI for admin panel components
- Three.js for 3D visualizations
- Framer Motion for animations
- PostgreSQL team for excellent database
- Docker for containerization
