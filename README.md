# Portfolio Builder

A web application that allows users to create customizable portfolios from their CV/resume.

## Features

- User registration and login
- Upload CV/resume (PDF or DOCX)
- Automatic parsing of CV to extract details
- Customize portfolio profile
- Generate live portfolio website

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose
- Frontend: React
- CV Parsing: pdf-parse, mammoth

## Setup

1. Install dependencies:
   - Backend: `cd backend && npm install`
   - Frontend: `cd frontend && npm install`

2. Start MongoDB locally on port 27017.

3. Start the backend:
   `cd backend && npm start`

4. Start the frontend:
   `cd frontend && npm start`

5. Open http://localhost:3000 for the app, and portfolios at http://localhost:5000/portfolios/username.html

## Usage

- Register a new account
- Login
- Upload your CV
- Edit profile details
- Generate portfolio
- Access your portfolio at the provided URL