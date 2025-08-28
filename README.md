# AutoFiks - Spare Part and Automobile Service Management System

AutoFiks is a comprehensive web-based system designed to streamline automobile service center operations, spare parts inventory management, and customer service interactions. The platform connects customers, employees, and administrators in a seamless digital environment, enhancing operational efficiency and customer satisfaction.

## University Project Information

- University: SLIIT - Sri Lanka Institute of Information Technology
- Module: ITP - Information Technology Project
- Academic Year: 2nd Year, 2nd Semester
- Group: ITP25_B6_C1-128

## Team Members

| Name | Student ID | Contribution |
|------|-----------|------|
| Senarath S A M S (Leader) | IT23284784 | Employee Management |
| Fernando P T A N | IT23271364 | User Management |
| Kumara N M A C D U | IT23286450 | Spare Parts Management |
| Jayathilake J D  | IT23279698  | Service Shedule Management |
| Kodikara P R | IT23296114  | Customer Affair Management |

## Table of Contents

- [Technology Stack](#technology-stack)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [License](#license)

## Technology Stack

Backend
- Node.js
- Express.js
- MongoDB (Database)
- JWT for Authentication
- Mongoose ORM

Frontend
- React + Vite
- Tailwind CSS
- React Router
- Axios for API requests
- React Icons

## Features

User Management & Authentication

AutoFiks provides a comprehensive user management system with advanced security features:

- User Registration: New users can create accounts with personal details including name, email, phone number, and address
- Enhanced Security: OTP verification via email ensures account security
- Password Management: Secure password reset functionality through email verification
- Profile Management: Users can view and update their profile information
- Service History: Access to past service records and appointments
- Location Management: Users can save preferred service locations
- Anomaly Detection: System monitors login activity patterns and flags suspicious behavior
- Role-based Access Control: Different access levels for customers, employees, and administrators

Employee Management

The employee management module streamlines workforce operations:

- Task Management: Employees can view and manage daily assigned tasks
- QR-based Attendance: Administrators track employee attendance using QR code scanning
- Leave Management: Employees can request time off with automated balance verification
- Leave Approval Workflow: System validates leave requests based on type and available balance
- Supervision Tools: Managers can monitor attendance records and service request allocations
- Salary Calculation: Automated monthly salary computation based on attendance and approved leaves
- Support Ticketing: Employees can raise support tickets for workplace issues
- Reporting: Generation of paysheets and attendance reports for administrative purposes

Service Scheduling

The appointment scheduling system ensures efficient service delivery:

- Online Booking: Customers can schedule maintenance and repair appointments
- Location Selection: Option to choose preferred service centers
- Availability Check: System verifies technician availability before confirming slots
- Appointment Reminders: Automated notifications sent to customers before scheduled service
- Modification Options: Customers can reschedule or cancel appointments when needed
- Management Dashboard: Supervisors can oversee all appointments and handle urgent requests
- Technician Allocation: System helps assign technicians to specific service requests
- Real-time Notifications: Updates sent to both customers and service staff during the process

Spare Parts Management

The inventory system manages spare parts with the following features:

- Catalog Browsing: Customers can explore available spare parts by category or brand
- Shopping Cart: Users can add items to cart for purchase
- Real-time Inventory: System updates stock availability instantly
- Invoice Generation: Automated creation of purchase documentation
- Payment Integration: Seamless connection to payment gateways
- Inventory Management: Administrators can add, update, and remove spare parts
- Stock Alerts: System notifies when inventory reaches low thresholds
- Analytics Reports: Generation of usage statistics and sales trend analysis

Customer Affairs Management

The customer support system ensures excellent service:

- Support Portal: Dedicated section for customer assistance
- Request Types: Options for inquiries, feedback, and complaints
- Request Tracking: Customers can monitor the status of their submissions
- Notification System: Alerts sent when issues are addressed
- Request Modification: Ability to update or cancel support requests
- Admin Review: Management interface for addressing customer concerns
- Communication Tools: Features to maintain proper customer communication
- Satisfaction Metrics: Tools to measure and improve customer experience

## System Architecture

[System architecture diagram or description to be added]

## Installation & Setup

Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

Backend Setup

1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the backend directory (see Environment Variables section below).
4. Start the backend server:
   ```sh
   npm start
   ```
   The backend will run on http://localhost:5000 by default.

Frontend Setup

Admin Frontend
1. Navigate to the admin directory:
   ```sh
   cd admin
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. (Optional) Create a `.env` file for environment-specific variables (e.g., API base URL):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the admin frontend:
   ```sh
   npm run dev
   ```
   The admin dashboard will run on http://localhost:5173 by default.

User Frontend
1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. (Optional) Create a `.env` file for environment-specific variables (e.g., API base URL):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the user frontend:
   ```sh
   npm run dev
   ```
   The user-facing frontend will run on http://localhost:5174 or another available port.

Environment Variables

Backend `.env` example:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
EMAIL_SERVICE=brevo_or_mailtrap
# Add any other required variables as needed
```

Frontend/Admin `.env` example:
```env
VITE_API_URL=http://localhost:5000/api
```

Running the Application

1. Start MongoDB (if not running as a service).
2. Start the backend server:
   ```sh
   cd backend
   npm start
   ```
3. In a new terminal, start the admin frontend:
   ```sh
   cd admin
   npm run dev
   ```
4. In another terminal, start the user frontend:
   ```sh
   cd frontend
   npm run dev
   ```

## API Documentation

The backend exposes RESTful APIs for all major modules. You can explore the endpoints in the `backend/routes/` directory. Common endpoints include:

- Authentication: `/api/auth` (login, register, JWT)
- Employee Management: `/api/employees` (CRUD, attendance, leave, salary)
- Admin Dashboard: `/api/admindashboard`
- Attendance: `/api/attendance`
- Tasks: `/api/tasks`
- Inventory/Spare Parts: `/api/spareparts`
- Booking/Appointments: `/api/booking`
- Help Requests: `/api/helprequests`
- Inquiries: `/api/inquiries`
- User Dashboard: `/api/userdashboard`

For detailed request/response formats, refer to the controller files in `backend/controllers/` and the route files in `backend/routes/`.

## Testing

To run backend tests (if available):

```sh
cd backend
npm test
```

For frontend testing, use your preferred React testing library (e.g., Jest, React Testing Library).

## License

This project is licensed under the MIT License. See the LICENSE file for details.


