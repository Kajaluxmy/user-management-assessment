# User Management Assessment

A simple full-stack user management application developed as part of a Software Engineer Intern assessment.

The application provides user authentication and basic user management functionality using Next.js, NestJS, MongoDB, and JWT authentication.

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- NestJS
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcrypt

## Features

### Authentication

- User registration
- User login
- Password hashing with bcrypt
- JWT authentication
- JWT stored in an HTTP-only cookie
- User logout
- Protected authenticated routes

### User Management

- View list of users
- View a single user
- Update own profile
- Delete own account

## Project Structure

```text
user-management-assessment/
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── login/
│   │   ├── register/
│   │   ├── users/
│   │   └── profile/
│   ├── components/
│   ├── lib/
│   └── package.json
│
├── README.md
└── .gitignore
