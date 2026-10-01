# Aeobiome User End

A React-based user interface for the Aeobiome application.

## Features

- User registration with form validation
- Redux state management for authentication
- Responsive design with Tailwind CSS
- Floating label input components

## API Integration

The application integrates with the backend API running on `http://localhost:7000`.

### Registration Endpoint

- **URL**: `POST /api/v1/auth/register`
- **Body**:
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "phoneNumber": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User registered successfully",
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "firstName": "string",
      "lastName": "string",
      "phoneNumber": "string",
      "email": "string"
    }
  }
  ```

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Make sure the backend API is running on port 7000

## Dependencies

- React 19.1.0
- Redux Toolkit
- React Router DOM
- Axios
- Tailwind CSS

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
│   └── Authentication/ # Auth pages (Login, Register)
├── redux/              # Redux store and slices
├── services/           # API service functions
├── axios/              # Axios configuration
└── utils/              # Utility functions
```

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
