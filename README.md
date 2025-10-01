# E-commerce Project with Django

This project is an e-commerce application built using Django for the backend and Python for the frontend. The application utilizes MySQL as the database and incorporates design assets from Figma.

## Project Structure

```
Innt/
├── backend/                 # Django REST API
├── frontend/               # TypeScript Frontend       
├── docs/                   # Documentation
├── docker-compose.yml      # Docker services configuration
├── .env                    # Environment variables
└── README.md              # This file
```

## Quick Start with Docker

### Prerequisites
- [Docker](https://www.docker.com/get-started) 
- [Docker Compose](https://docs.docker.com/compose/install/)

### Setup & Run
```bash
# Clone the repository
git clone https://github.com/nhthai23-05/Innt.git
cd Innt

# Chạy docker lần đầu
docker-compose up --build

# Chạy docker cho các lần sau
docker-compose up

# Chạy docker trong background
docker-compose up -d

# Chỉ cần thay đổi docker nếu như thay đổi về môi trường làm việc như phiên bản Python, các thư viện, framework
```

### Access Applications
- **Backend API**: http://localhost:8000
- **Frontend**: http://localhost:3000  
- **Database**: localhost:3306

## Project Features (Coming Soon)
- User authentication & profiles
- Product catalog with categories
- Shopping cart functionality
- Admin dashboard
- Responsive design based on Figma mockups