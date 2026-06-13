# Employee Management System

A full-stack web application built to help organizations manage their employees efficiently. The system covers everything from attendance tracking with biometric face verification, to leave management, payroll generation, and department administration — all under a single unified platform.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Tailwind CSS, React Query, React Router |
| Backend | Express 5, Node.js |
| Database | MySQL (via Prisma ORM) |
| Face Recognition | face-api.js |
| Authentication | JWT, Argon2 |

---

## Features

### Face Verification & Login
Employees log in using **face recognition** powered by `face-api.js`. During check-in, the system captures the employee's face via webcam and matches it against the stored face descriptor in the database. This ensures only the authenticated employee can mark their own attendance — no proxy attendance.

### Location-Based Attendance
In addition to face verification, attendance check-in is **location-verified** using the Haversine formula. The employee's GPS coordinates at check-in and check-out are captured and validated against the allowed office location radius.

### Attendance Management
- Employees can check in and check out with face + location verification
- Admins can view attendance records for any employee or department
- Monthly attendance summary with Present, Absent, Half Day, and Leave counts
- Department-wise attendance summary with date range filters
- Auto-absent marking for employees who miss check-in

### Leave Management
- Employees can apply for leaves (Casual, Sick, Paid, Unpaid)
- Admins can **approve or reject** leave requests
- Leave balance tracking per employee per year
- Leave history visible to both employee and admin

### Employee Management
- Admins can **add, update, and deactivate** employees
- Assign employees to departments and designations
- Store personal details: name, email, gender, DOB, phone number, monthly salary
- Face descriptor stored per employee for biometric login

### Department Management
- Admins can **create and manage departments**
- Assign employees to departments
- View department-wise attendance and headcount

### Payroll Generation
- Generate monthly payroll for each employee
- Calculates **gross salary, PF, tax, and net salary**
- Tracks total working days vs payable days
- Payroll records stored per employee per month

### Role-Based Access Control
- Two roles: **Admin** and **Employee**
- Protected routes and API endpoints per role
- Admins have full system access; employees see only their own data

---

## Project Structure

```
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-level pages
│   │   ├── hooks/           # React Query custom hooks
│   │   ├── api/             # Axios API functions
│   │   └── context/         # Auth context
├── server/                  # Express backend
│   ├── controllers/         # Route handlers
│   ├── routes/              # API routes
│   ├── middleware/          # Auth, error handling
│   ├── utils/               # Helpers (date range, async handler)
│   └── generated/prisma/    # Prisma client
└── prisma/
    └── schema.prisma        # Database schema
```

---

## Key Concepts

### Face Verification Flow
1. Employee opens check-in page
2. Webcam activates and detects face in real time
3. `face-api.js` computes a 128-point face descriptor
4. Descriptor is compared against the stored descriptor for the logged-in employee
5. If match confidence is above threshold, check-in is allowed

### Attendance Status Values
| Status | Meaning |
|---|---|
| PRESENT | Full-day attendance marked |
| ABSENT | No check-in recorded (auto-marked) |
| HALF_DAY | Worked less than the required hours |
| LEAVE_PAID | On approved paid leave |
| LEAVE_UNPAID | On approved unpaid leave |

### Payroll Calculation
```
Gross Salary  = Monthly Salary
PF            = 12% of Basic Salary
Tax           = calculated based on gross
Net Salary    = Gross - PF - Tax
Payable Days  = Working Days - Absent Days
```

<img width="953" height="440" alt="image" src="https://github.com/user-attachments/assets/3a93adb7-dcd8-4834-8d48-ec622dc59c54" />

<img width="950" height="445" alt="image" src="https://github.com/user-attachments/assets/51d58ec3-3988-468b-ba87-1f1e30619d6d" />

<img width="949" height="437" alt="image" src="https://github.com/user-attachments/assets/361dd70d-b4c8-405b-8613-60081a2c35cb" />

<img width="949" height="445" alt="image" src="https://github.com/user-attachments/assets/990a3da2-349f-44f4-91c3-cbb61f62e55e" />



