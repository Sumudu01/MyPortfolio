# MyPortfolio Builder

A full-stack web application for creating and managing professional portfolios. Users can build personalized portfolio websites and generate downloadable PDF versions.

## Features

- **User Authentication**: Register and login with email/password or Google OAuth
- **Profile Management**: Comprehensive dashboard to edit personal details, skills, experience, education, projects, and contact information
- **Profile Picture Upload**: Upload and display profile photos
- **Live Portfolio View**: Interactive portfolio website with modern design
- **PDF Generation**: Generate and download professional PDF portfolios using Puppeteer
- **Responsive Design**: Mobile-friendly interface built with Material-UI and Framer Motion animations

## Tech Stack

### Backend
- **Node.js** with **Express.js** framework
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **Passport.js** for Google OAuth integration
- **Puppeteer** for PDF generation
- **EJS** templating for PDF layout
- **Multer** for file uploads

### Frontend
- **React** with hooks
- **Material-UI** for components
- **Framer Motion** for animations
- **Axios** for API calls

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Google OAuth credentials (for Google login)

## Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd MyPortfolio
   ```

2. **Install dependencies**:
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Environment Configuration**:
   Create `backend/.env` file with:
   ```
   MONGO_URI=mongodb://localhost:27017/myportfolio
   JWT_SECRET=your_jwt_secret_here
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Start MongoDB**:
   Ensure MongoDB is running on port 27017 (default).

5. **Start the application**:
   ```bash
   # Backend (from backend directory)
   npm start

   # Frontend (from frontend directory, in new terminal)
   npm start
   ```

6. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Usage

1. **Register/Login**: Create an account or sign in with Google
2. **Dashboard**: Fill in your profile information including:
   - Personal details (name, bio, position)
   - Skills (categorized as language, programming, other)
   - Work experience
   - Education history
   - Projects with links
   - Contact information
   - Profile picture
3. **View Portfolio**: See your live portfolio at the Portfolio page
4. **Download PDF**: Click the download button to generate and download a professional PDF version

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth login

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/upload` - Upload profile picture

### Portfolios
- `POST /portfolios/generate` - Generate PDF portfolio
- `GET /portfolios/:username` - Download PDF portfolio

## Project Structure

```
MyPortfolio/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── public/
│   │   └── portfolios/
│   ├── templates/
│   ├── uploads/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── ...
│   ├── public/
│   └── package.json
├── .gitignore
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.