# ACID Banking Application

A full-stack banking application built with React, Node.js, and MongoDB, implementing ACID (Atomicity, Consistency, Isolation, Durability) principles for secure financial transactions.

## Features
- User authentication and authorization
- Secure money transfers between accounts
- Real-time balance tracking
- User dashboard with transaction history
- Account management system

## Tech Stack

### Frontend
- **React.js**
- **React Router DOM** for navigation
- Modern component architecture
- Responsive design with CSS

### Backend
- **Node.js**
- **Express.js**
- **MongoDB** for database
- **JWT** for authentication

## Project Structure
- ├── backend/ │ ├── routes/ │ │ ├── account.js │ │ ├── user.js │ │ └── index.js │ ├── middleware.js │ └── db.js ├── frontend1/ │ ├── src/ │ │ ├── components/ │ │ │ ├── Appbar.jsx │ │ │ ├── Balance.jsx │ │ │ ├── Button.jsx │ │ │ └── ... │ │ ├── pages/ │ │ │ ├── Dashboard.jsx │ │ │ ├── SignIn.jsx │ │ │ ├── SignUp.jsx │ │ │ └── SendMoney.jsx │ │ └── App.jsx

## API Endpoints

### Authentication
- **POST** `/api/v1/user/Sign-up` - User registration
- **POST** `/api/v1/user/Sign-in` - User login
- **PUT** `/api/v1/user/update` - Update user profile

### Transactions
- **GET** `/api/v1/account/balance` - Get account balance
- **POST** `/api/v1/account/transfer` - Make a money transfer
- **GET** `/api/v1/user/bulk` - Get user information

## ACID Implementation

This application follows ACID principles for transaction integrity:
- **Atomicity**: Transactions are all-or-nothing operations.
- **Consistency**: Database remains in a valid state before and after transactions.
- **Isolation**: Concurrent transactions don't interfere with each other.
- **Durability**: Completed transactions are permanent.

## Getting Started

### Clone the repository
- bash
- **git clone <repository-url>**
### Install dependencies
- Backend

- **npm install**

- Frontend

- **cd frontend1**
- **npm install**

## Set up environment variables

### Create a .env file in the backend directory:

- env

- PORT=3000
- MONGODB_URI=<your-mongodb-uri>
- JWT_SECRET=<your-jwt-secret>

### Run the application

- Backend

- **cd backend**
- **node index.js**

- Frontend

- **Copy code**
- **cd frontend1**
- **npm run dev**

## Security Features

- JWT-based authentication
- Protected API routes
- Secure password handling
- Input validation and sanitization

## Contributing
- Fork the repository.
- Create your feature branch (git checkout -b feature/AmazingFeature).
- Commit your changes (git commit -m 'Add some AmazingFeature').
- Push to the branch (git push origin feature/AmazingFeature).
- Open a Pull Request.

