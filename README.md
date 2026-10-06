# RepairFlow 

A full-stack repair management system that manages the complete lifecycle of device repairs—from customer submission and technician assignment to diagnosis, customer approval, repair completion, and pickup.

## Overview

RepairFlow is designed around a real-world repair-center workflow with three user roles:

- **Customer** — creates repair requests, tracks repair progress, reviews diagnosis, and approves or rejects proposed repairs.
- **Technician** — manages assigned repairs, performs diagnosis, records repair actions, and completes repairs.
- **Admin** — manages users and technicians, assigns technicians to repairs, and monitors repair activity.

The application implements role-based access control, JWT authentication, validation, status-transition rules, repair history tracking, and a React-based user interface.

## Key Features

### Authentication & Authorization
- User registration and login
- BCrypt password hashing
- JWT-based authentication
- Stateless Spring Security configuration
- Role-based authorization
- Protected frontend routes
- Backend access control for customers, technicians, and admins

### Repair Management
- Customers can create repair requests
- Admins can assign technicians
- Technicians can manage assigned repairs
- Controlled repair status transitions
- Customers can cancel eligible repairs
- Role-based repair access

### Diagnosis & Approval Workflow
- Technicians can create repair diagnoses
- Estimated repair cost is recorded
- Customers can review the diagnosis
- Customers can approve or reject the proposed repair
- Approved repairs continue to the repair stage
- Rejected diagnoses cancel the repair
- Final repair action and final cost are recorded

### Repair History & Audit Trail
- Every important status transition is recorded
- Customers receive a simplified repair history
- Admins can view who performed each action
- Status changes include timestamps and descriptions

### Frontend
- React-based user interface
- Separate dashboards for each role
- Reusable components
- Protected routes
- Axios API integration
- Status badges and workflow-specific UI
- Responsive dashboard layout

### Validation & Error Handling
- Request validation using Jakarta Bean Validation
- Centralized exception handling
- Meaningful HTTP status codes
- Business-rule validation for repair transitions
- Access-control validation

## Repair Workflow

```text
CUSTOMER
   │
   │ Creates repair
   ▼
PENDING
   │
   │ Admin assigns technician
   ▼
ASSIGNED
   │
   │ Technician starts repair
   ▼
IN_PROGRESS
   │
   │ Technician creates diagnosis
   ▼
AWAITING_APPROVAL
   │
   ├───────────────┐
   │               │
Approve          Reject
   │               │
   ▼               ▼
IN_PROGRESS     CANCELLED
   │
   │ Technician completes repair
   ▼
READY_FOR_PICKUP
   │
   │ Technician marks completed
   ▼
COMPLETED
```

## Architecture

RepairFlow follows a layered backend architecture:

```text
React Frontend
       │
       │ REST API / JSON
       ▼
Spring Boot Controllers
       │
       ▼
Service Layer
       │
       ▼
Repository Layer
       │
       ▼
MySQL Database
```

### Backend Layers

- **Controller** — handles HTTP requests and responses
- **Service** — contains business logic and workflow rules
- **Repository** — handles database operations using Spring Data JPA
- **Entity** — represents database models
- **DTO** — controls API request and response data
- **Exception Layer** — centralized error handling
- **Security Layer** — JWT authentication and role-based authorization

## Tech Stack

### Backend
- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- Maven
- JWT
- BCrypt
- Jakarta Bean Validation

### Frontend
- React
- JavaScript
- Vite
- Axios
- React Router

### Database
- MySQL

### Development Tools
- Git
- GitHub
- VS Code
- Postman

## Project Structure

```text
RepairFlow/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── customer/
│   │   │   └── technician/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
│
├── repairflow/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/repairflow/
│   │   │   │   ├── config/
│   │   │   │   ├── controller/
│   │   │   │   ├── dto/
│   │   │   │   ├── entity/
│   │   │   │   ├── exception/
│   │   │   │   ├── repository/
│   │   │   │   ├── response/
│   │   │   │   └── service/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
│
├── .gitignore
└── README.md
```

## Running the Project Locally

### Prerequisites

Make sure the following are installed:

- Java 17+
- Maven
- Node.js
- npm
- MySQL
- Git

### 1. Clone the repository

```bash
git clone https://github.com/csowmiya/RepairFlow.git
cd RepairFlow
```

### 2. Create the database

Create a MySQL database named:

```sql
CREATE DATABASE repairflow;
```

### 3. Configure environment variables

The backend reads database configuration from environment variables.

```text
DB_URL=jdbc:mysql://localhost:3306/repairflow
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
```

Do not commit database credentials to GitHub.

### 4. Start the backend

Open a terminal in:

```text
repairflow/repairflow
```

Then run:

```bash
./mvnw spring-boot:run
```

On Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

### 5. Start the frontend

Open another terminal in:

```text
repairflow/frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Security

RepairFlow uses:

- BCrypt password hashing
- JWT authentication
- Stateless Spring Security
- Role-based authorization
- Backend ownership/access checks
- Environment variables for database credentials
- Protected frontend routes

Sensitive configuration such as database passwords is intentionally excluded from version control.

## Testing

The project includes automated backend tests using Spring Boot testing support.

Manual end-to-end workflow testing was also performed across all three roles:

```text
Customer → Admin → Technician → Customer → Technician
```

The complete repair lifecycle was successfully verified from repair creation through completion.

## Engineering Highlights

The project focuses on implementing real application behavior rather than only basic CRUD operations.

Important engineering decisions include:

- Role-based business rules
- Controlled state transitions
- JWT-based stateless authentication
- DTO-based API design
- Layered architecture
- Centralized exception handling
- Database relationships using JPA
- Repair audit/history tracking
- Customer approval workflow
- Environment-based configuration
- React component reuse
- Backend and frontend separation

## Future Improvements

Potential future improvements include:

- Production deployment
- Cloud-hosted MySQL database
- Automated CI/CD pipeline
- Email/SMS notifications
- File/image uploads for repair devices
- Payment integration
- Advanced analytics dashboard
- AI-assisted repair diagnosis recommendations

##  Author

**Sowmiya C**

MCA Graduate | Full Stack Developer

GitHub: https://github.com/csowmiya