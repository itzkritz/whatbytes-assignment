#  Healthcare Backend API

A secure, scalable RESTful backend system for a healthcare application built with **Node.js**, **Express**, **Sequelize ORM**, and **PostgreSQL**. The system provides user authentication via JWT, role-aware record management for patients and doctors, and relational patient-doctor appointment mappings.

---

##  Tech Stack

| Component | Technology | Description |
|---|---|---|
| **Runtime** | Node.js (v18+) | JavaScript runtime environment |
| **Framework** | Express.js | Fast, unopinionated REST API framework |
| **ORM** | Sequelize v6 | Promise-based ORM (Django ORM equivalent for Node) |
| **Database** | PostgreSQL | Relational database (Supabase / local) |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`) | Stateless Bearer token authentication |
| **Password Hashing** | `bcryptjs` | Salted 12-round password hashing |
| **Validation** | `express-validator` | Request payload schema and type validation |
| **Environment** | `dotenv` | Secure configuration management |

---

##  Project Structure

```text
whatbytes-assignment/
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Sequelize connection & SSL handling
│   │   ├── models/
│   │   │   ├── User.js              # User model with bcrypt hooks & UUID
│   │   │   ├── Patient.js           # Patient model (belongsTo User)
│   │   │   ├── Doctor.js            # Doctor model with email unique constraint
│   │   │   ├── PatientDoctorMapping.js # Junction table with unique constraint
│   │   │   └── index.js             # Model associations & central export
│   │   ├── controllers/
│   │   │   ├── authController.js    # Register & Login logic
│   │   │   ├── patientController.js # Patient CRUD with owner isolation
│   │   │   ├── doctorController.js  # Doctor CRUD logic
│   │   │   └── mappingController.js # Doctor-patient mapping handlers
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # /api/auth routes + validation
│   │   │   ├── patientRoutes.js     # /api/patients routes (protected)
│   │   │   ├── doctorRoutes.js      # /api/doctors routes (protected)
│   │   │   └── mappingRoutes.js     # /api/mappings routes (protected)
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT Bearer token authentication guard
│   │   │   └── errorHandler.js      # Centralized error & 404 handler
│   │   └── index.js                 # Express server & DB initialization
│   ├── postman_collection.json      # Pre-configured Postman test suite
│   ├── .env.example                 # Environment variables template
│   ├── .gitignore                   # Ignored files (node_modules, .env)
│   └── package.json                 # Dependencies & scripts
└── README.md                        # Documentation
```

---

##  Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL Database** (Local instance or Cloud provider like Supabase/Neon)

### 1. Clone the Repository
```bash
git clone https://github.com/itzkritz/whatbytes-assignment.git
cd whatbytes-assignment/server
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `.env` with your PostgreSQL credentials:
```env
PORT=5000
NODE_ENV=development

# Option A: Cloud Database URL (Supabase, Neon, etc.)
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/[DB_NAME]

# Option B: Local PostgreSQL Credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=healthcare_db
# DB_USER=postgres
# DB_PASSWORD=your_password

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
```

### 4. Start the Application
```bash
# Development mode with hot-reload
npm run dev

# Production mode
npm start
```
The server will connect to PostgreSQL, synchronize all model schemas automatically, and start at `http://localhost:5000`.

---

##  API Documentation

All protected endpoints require the HTTP Authorization header:
```http
Authorization: Bearer <your_jwt_token>
```

### 1. Authentication APIs
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public | Log in user and return signed JWT token |

#### Example: Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Dr. John Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "237208a1-776b-421d-8c41-2ab5093121ef",
    "name": "Dr. John Doe",
    "email": "john.doe@example.com"
  }
}
```

---

### 2. Patient Management APIs
*Protected by JWT. Patients are scoped to the authenticated user who created them.*

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/patients/` | Authenticated | Create a new patient record |
| `GET` | `/api/patients/` | Authenticated | Retrieve all patients created by the authenticated user |
| `GET` | `/api/patients/:id` | Authenticated | Get details of a specific patient |
| `PUT` | `/api/patients/:id` | Authenticated | Update patient details |
| `DELETE` | `/api/patients/:id` | Authenticated | Delete a patient record |

#### Example: Create Patient
```http
POST /api/patients/
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Alice Smith",
  "age": 32,
  "gender": "female",
  "contact": "+1-555-0199",
  "medical_history": "Hypertension, seasonal allergies"
}
```

---

### 3. Doctor Management APIs
*Protected by JWT.*

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/doctors/` | Authenticated | Add a new doctor |
| `GET` | `/api/doctors/` | Authenticated | Retrieve all doctors |
| `GET` | `/api/doctors/:id` | Authenticated | Get details of a specific doctor |
| `PUT` | `/api/doctors/:id` | Authenticated | Update doctor details |
| `DELETE` | `/api/doctors/:id` | Authenticated | Delete a doctor record |

#### Example: Create Doctor
```http
POST /api/doctors/
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Dr. Gregory House",
  "specialization": "Diagnostic Medicine",
  "contact": "+1-555-0188",
  "experience_years": 15,
  "email": "dr.house@hospital.com"
}
```

---

### 4. Patient-Doctor Mapping APIs
*Protected by JWT. Maps doctors to patients with duplicate-assignment prevention.*

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/mappings/` | Authenticated | Assign a doctor to a patient |
| `GET` | `/api/mappings/` | Authenticated | Retrieve all patient-doctor mappings |
| `GET` | `/api/mappings/:patient_id` | Authenticated | Get all doctors assigned to a specific patient |
| `DELETE` | `/api/mappings/:id` | Authenticated | Remove a doctor from a patient (delete mapping) |

#### Example: Assign Doctor to Patient
```http
POST /api/mappings/
Authorization: Bearer <token>
Content-Type: application/json

{
  "patient_id": "3a623f49-d85d-4aa6-ae45-3008f84fce93",
  "doctor_id": "f817db23-8cfb-4d7a-85b2-3e2849b38029"
}
```

---

##  Testing with Postman

An automated Postman collection is included in the project:
`server/postman_collection.json`

### Features of the collection:
- **Automatic Token Management**: Registering or logging in automatically sets the `{{token}}` variable for all subsequent requests.
- **Dynamic ID Chaining**: Creating a patient or doctor automatically stores `{{patientId}}` and `{{doctorId}}` for mapping tests.
- **Pre-configured Bodies**: Complete request bodies and tests for every endpoint.

### How to use:
1. Open **Postman** and click **Import**.
2. Select `server/postman_collection.json`.
3. Run requests individually or click **Run collection** to execute the entire test suite in batch!

---

##  Security & Architecture Decisions

1. **UUID Primary Keys**: All models use random UUIDv4 identifiers instead of sequential integers to prevent enumeration attacks.
2. **Data Ownership & Isolation**: `GET /api/patients` and related endpoints strictly enforce user scoping (`where: { created_by: req.user.id }`), preventing users from accessing or modifying records created by others.
3. **Password Security**: Passwords are never stored in plain text. Hashing is enforced via Sequelize `beforeCreate` and `beforeUpdate` model hooks using `bcryptjs` with 12 salt rounds.
4. **Relational Integrity**: 
   - A unique composite index `(patient_id, doctor_id)` on the junction table prevents duplicate mappings.
   - Foreign key constraints ensure mappings cannot reference non-existent patients or doctors.
5. **Centralized Error Handling**: A unified error handler formats all runtime errors, validation errors, and Sequelize constraint violations into predictable `{ success: false, message: "..." }` responses.
