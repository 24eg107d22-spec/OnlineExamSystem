
# Online Examination and Result Management System

## Project Overview
A web-based examination management application developed
using the MERN stack.

The system allows administrators to create examinations,
manage multiple-choice questions, and view student results.

Students can take timed examinations, navigate between
questions, mark questions for review, and receive
automatically calculated scores.

## Technologies Used
- Frontend: React.js, Vite, HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB Atlas
- Database Library: Mongoose

## Main Features
- Student and Admin login interfaces (demo mode)
- Create examinations
- Add and manage examination questions
- Student examination dashboard
- Timed examinations
- Question navigation
- Mark questions for review
- Automatic score calculation
- PASS/FAIL result generation
- Results stored in MongoDB
- Admin results dashboard
- Examination statistics

## How to Run

### Backend
1. Open a terminal in the backend folder.
2. Run: npm install
3. Configure the MongoDB connection in a .env file.
4. Run: node server.js

### Frontend
1. Open another terminal in the frontend folder.
2. Run: npm install
3. Run: npm run dev
4. Open http://localhost:5173

## Important Notes
- MongoDB Atlas connection and internet access are required.
- Login forms are demonstration interfaces, not secure authentication.
- Student management is not implemented.
- Examination scoring currently happens in the frontend.

## Future Enhancements
- Secure JWT authentication
- Role-based access control
- Server-side examination scoring
- Student management
- Result analytics
- Question editing and deletion
