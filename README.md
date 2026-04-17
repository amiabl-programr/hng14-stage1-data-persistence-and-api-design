# Profiles API

Backend Wizards Stage 1 — Express + TypeScript + PostgreSQL

## Stack
- **Runtime**: Node.js + TypeScript
- **Framework**: Express
- **Database**: PostgreSQL via Prisma ORM
- **ID generation**: UUID v7

## Local Setup & Running

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **PostgreSQL** v12 or higher ([Download](https://www.postgresql.org/download/) or use Docker)

### Step 1: Clone the Repository

```bash
git clone https://github.com/amiabl-programr/hng14-stage1-data-persistence-and-api-design.git
cd hng14-stage1-data-persistence-and-api-design
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then open `.env` and configure the following:

```env
# Database connection string
# Format: postgresql://user:password@localhost:5432/database_name
DATABASE_URL=postgresql://postgres:password@localhost:5432/profiles_db

# Server port (optional, defaults to 3000)
PORT=3000
```

### Step 4: Set Up the Database

Generate the Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

This will:
- Generate the Prisma client
- Create the database schema
- Set up the profiles table

### Step 5: Run the Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3000` and watch for file changes.

You should see output like:
```
Server listening on port 3000
```

### Verify It's Working

Test the API with a curl request:

```bash
curl http://localhost:3000/api/profiles
```

You should get a response with an empty profiles array.

### Additional Development Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build the TypeScript project for production |
| `npm start` | Run the compiled production build |
| `npm run prisma:studio` | Open Prisma Studio to view/manage database data |
| `npm run lint` | Run ESLint to check code quality |

### Troubleshooting

**Error: `connect ECONNREFUSED 127.0.0.1:5432`**
- PostgreSQL is not running. Start the PostgreSQL service and ensure it's listening on port 5432.

**Error: `database "profiles_db" does not exist`**
- Create the database: `psql -U postgres -c "CREATE DATABASE profiles_db;"`

**Error: `prisma generate` fails**
- Ensure your `.env` file has a valid `DATABASE_URL`
- Try deleting `node_modules` and running `npm install` again

**Port 3000 already in use**
- Change the `PORT` in your `.env` file to another port (e.g., `3001`)
- Or kill the process using port 3000

**Schema changes not reflecting**
- Run `npm run prisma:migrate` to apply new migrations
- Run `npm run prisma:studio` to view and verify database state


## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/profiles` | Create a profile by name |
| GET | `/api/profiles` | Get all profiles (filterable) |
| GET | `/api/profiles/:id` | Get a single profile |
| DELETE | `/api/profiles/:id` | Delete a profile |

---

### 1. Create a Profile
**POST** `/api/profiles`

Creates a new profile based on a name. The server queries external APIs to fetch demographic data (gender, age, country).

**Request:**
```bash
curl -X POST http://localhost:3000/api/profiles \
  -H "Content-Type: application/json" \
  -d '{"name": "John"}'
```

**Success Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "id": "01890a2b-3c4d-5e6f-7890-abcdef123456",
    "name": "john",
    "gender": "male",
    "gender_probability": 0.98,
    "sample_size": 1250,
    "age": 35,
    "age_group": "adult",
    "country_id": "US",
    "country_probability": 0.85
  }
}
```

**If Profile Already Exists (200 OK):**
```json
{
  "status": "success",
  "message": "Profile already exists",
  "data": { ... }
}
```

---

### 2. Get All Profiles
**GET** `/api/profiles`

Retrieve all profiles with optional filtering.

**Request (without filters):**
```bash
curl http://localhost:3000/api/profiles
```

**Request (with filters):**
```bash
# Filter by gender
curl http://localhost:3000/api/profiles?gender=male

# Filter by country
curl http://localhost:3000/api/profiles?country_id=NG

# Filter by age group
curl http://localhost:3000/api/profiles?age_group=adult

# Combine multiple filters
curl http://localhost:3000/api/profiles?gender=female&country_id=GB&age_group=adult
```

**Available Filters:**
- `gender` — `male` or `female` (case-insensitive)
- `country_id` — ISO country code, e.g. `NG`, `US`, `GB` (case-insensitive)
- `age_group` — `child`, `adult`, `senior` (case-insensitive)

**Response (200 OK):**
```json
{
  "status": "success",
  "count": 2,
  "data": [
    {
      "id": "01890a2b-3c4d-5e6f-7890-abcdef123456",
      "name": "john",
      "gender": "male",
      "country_id": "US"
    },
    {
      "id": "01890a2c-3c4d-5e6f-7890-abcdef123457",
      "name": "jane",
      "gender": "female",
      "country_id": "NG"
    }
  ]
}
```

---

### 3. Get a Single Profile
**GET** `/api/profiles/:id`

Retrieve detailed information about a specific profile.

**Request:**
```bash
curl http://localhost:3000/api/profiles/01890a2b-3c4d-5e6f-7890-abcdef123456
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "id": "01890a2b-3c4d-5e6f-7890-abcdef123456",
    "name": "john",
    "gender": "male",
    "gender_probability": 0.98,
    "sample_size": 1250,
    "age": 35,
    "age_group": "adult",
    "country_id": "US",
    "country_probability": 0.85
  }
}
```

**Profile Not Found (404 Not Found):**
```json
{
  "status": "error",
  "message": "Profile not found"
}
```

---

### 4. Delete a Profile
**DELETE** `/api/profiles/:id`

Delete a profile by ID.

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/profiles/01890a2b-3c4d-5e6f-7890-abcdef123456
```

**Response (204 No Content):**
- Empty body on success

**Profile Not Found (404 Not Found):**
```json
{
  "status": "error",
  "message": "Profile not found"
}
```

---

## Error Responses

All error responses follow this format:
```json
{ "status": "error", "message": "..." }
```

| Status Code | Meaning |
|-------------|---------|
| 400 | Missing or empty name |
| 404 | Profile not found |
| 422 | Name must be a string |
| 502 | External API returned invalid/null data |
| 500 | Internal server error |
