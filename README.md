
#Auth Controller Frontend

## Overview

The frontend of the Auth Controller provides a user interface for user authentication, including signup, login, logout, email verification, OTP-based login, password management, and token management. Each function is designed to ensure secure and efficient user authentication and management.

## Features

- User Registration and Login
- Email Verification
- 2FA Verification
- Login with OTP
- Login with Password
- Login with OTP and Password
- Password Management
- Token Management
- Profile Management
- Secure Authentication
- Profile Picture Management
- And Many More ...

## Getting Started

### Prerequisites

- Node.js
- npm (Node Package Manager)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/RaghavOG/auth-controller.git
   cd auth-controller/frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following variables:

   ```env
   VITE_API_URL=http://localhost:7000
   ```

### Running the Project

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Access the application:**

   Open your browser and navigate to `http://localhost:5173` to access the frontend.

## Components

### 1. Navbar

**Description:** The navigation bar provides links to different sections of the application.

**Usage:**
- Displayed at the top of the application.
- Includes links for login, signup, profile, and logout.

### 2. Home

**Description:** The home page provides an overview of the project and the developer information.

**Usage:**
- Displayed as the landing page of the application.
- Includes sections for project description, features, and developer information.

### 3. Profile

**Description:** The profile page allows users to view and update their profile information.

**Usage:**
- Accessible to logged-in users.
- Includes forms for updating profile information and profile picture.

### 4. Login

**Description:** The login page allows users to log in using their email and password or OTP.

**Usage:**
- Accessible to users who are not logged in.
- Includes forms for email/password login and OTP login.

### 5. Signup

**Description:** The signup page allows new users to register for an account.

**Usage:**
- Accessible to users who are not logged in.
- Includes a form for entering registration details.

### 6. Forgot Password

**Description:** The forgot password page allows users to request a password reset link.

**Usage:**
- Accessible to users who are not logged in.
- Includes a form for entering the email address.

### 7. Reset Password

**Description:** The reset password page allows users to reset their password using a reset token.

**Usage:**
- Accessible to users who have requested a password reset.
- Includes a form for entering the new password.

### 8. OTP Verification

**Description:** The OTP verification page allows users to enter the OTP sent to their email for login.

**Usage:**
- Accessible to users who have requested an OTP for login.
- Includes a form for entering the OTP.

## Styling

The frontend uses modern UI elements and a gradient background for a visually appealing design. The components are styled using Tailwind CSS and Framer Motion for animations.

## Contributing

This project is open-source, and contributions are welcome. Feel free to fork the repository, make changes, and submit a pull request.

## License

This project is licensed under the MIT License.
```

