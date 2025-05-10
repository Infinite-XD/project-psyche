# API Documentation

## Authentication Endpoints

### Register User
- **POST** `/api/auth/register`
- **Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: 
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": "string",
      "username": "string",
      "email": "string"
    }
  }
  ```

### Login
- **POST** `/api/auth/login`
- **Body**:
  ```json
  {
    "usernameOrEmail": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": "string",
      "username": "string",
      "email": "string"
    }
  }
  ```

### Logout
- **POST** `/api/auth/logout`
- **Headers**: Requires authentication
- **Response**:
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

### Change Password
- **POST** `/api/change-password`
- **Headers**: Requires authentication
- **Body**:
  ```json
  {
    "oldPassword": "string",
    "newPassword": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Password changed successfully"
  }
  ```

### Delete Account
- **DELETE** `/api/delete-account`
- **Headers**: Requires authentication
- **Response**:
  ```json
  {
    "message": "Account deleted successfully"
  }
  ```

## Chat Endpoints

### Get Chat History
- **GET** `/api/chat/history`
- **Headers**: Requires authentication
- **Response**:
  ```json
  {
    "history": [
      {
        "sender": "user" | "bot",
        "text": "string",
        "timestamp": "string"
      }
    ]
  }
  ```

### Send Chat Message
- **POST** `/api/chat/message`
- **Headers**: Requires authentication
- **Body**:
  ```json
  {
    "text": "string"
  }
  ```
- **Response**:
  ```json
  {
    "reply": {
      "sender": "bot",
      "text": "string",
      "timestamp": "string"
    }
  }
  ```

## Profile Endpoints

### Get Profile
- **GET** `/api/profile`
- **Headers**: Requires authentication
- **Response**:
  ```json
  {
    "message": "Protected route accessed successfully",
    "user": {
      "id": "string",
      "username": "string",
      "email": "string"
    }
  }
  ```

### Get Public Data
- **GET** `/api/public-data`
- **Headers**: Optional authentication
- **Response**:
  ```json
  {
    "message": "string",
    "publicData": "string"
  }
  ```

## Error Responses
All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "Error message"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid credentials"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal Server Error"
}
```

## Authentication
- All protected endpoints require a valid JWT token
- Token is stored in an HTTP-only cookie named `auth_token`
- Token can also be provided in the Authorization header as `Bearer <token>`

## Rate Limiting
- API endpoints are rate-limited to prevent abuse
- Rate limits are applied per IP address and per user

## CORS
- API supports CORS for development and production environments
- Development: `http://localhost:5173`
- Production: Configured via environment variable `CLIENT_URL` 