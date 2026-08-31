# RiwiMediCare Plus - Supply Chain REST API

Official enterprise backend platform designed to manage and track the medical supply chain replenishment workflow across authorized clinical networks. Built with Node.js, TypeScript, Express, Sequelize ORM, and PostgreSQL, fully orchestrated utilizing Docker containers.

---

## Developer Identification Metadata

* **Coder Name:** Luis Ángel Piña
* **Clan:** Centurión
* **Project Status:** Production Ready / Complete
* **Official Repository Link:** [https://github.com/luisP-max/RiwiMediCare_Plus.git](https://github.com/luisP-max/RiwiMediCare_Plus.git)

---

## Technical Architecture Stack

* **Runtime Environment:** Node.js (v18-alpine)
* **Language Compiler:** TypeScript with strict type checking
* **Web Framework:** Express.js
* **Object-Relational Mapping (ORM):** Sequelize (PostgreSQL Dialect)
* **Database Engine:** PostgreSQL 15
* **Infrastructure Orchestration:** Docker & Docker Compose
* **API Documentation Specs:** Swagger UI (OpenAPI 3.0.0)

---

## Core System Requirements Implemented

1. **Absolute Language Standards:** 100% English variable namings, database catalogs, logs, and system error responses.
2. **Relational Blueprint Integrity:** UUIDv4 generation for primary keys across all operational tables.
3. **Database Catalogs:** Strict prevention of duplicate corporate records (Unique constraints applied to NIT, facility names, and medicine entries).
4. **Logical Soft-Deletions:** Enforced logical data lifecycle management via status columns (`active` / `deleted`) instead of executing physical SQL row destruction.
5. **Business Validation Routines:** Verification gates to guarantee supply quantities are integers strictly greater than zero.
6. **Eager Loading Integrations:** Advanced query mapping using Sequelize includes to render data logs with structural relationships.
7. **Role-Based Access Controls (RBAC):** Token validation gateways restricting write and modification workflows to authenticated `Administrator` roles, while permitting visibility workflows to `Request Manager` profiles.

---

## Infrastructure Installation and Setup

### Environment Configurations
Verify that you have a valid `.env` file present at the root directory of your workspace with the following environment variables mapped:

```env
PORT=3000
DB_HOST=database
DB_PORT=5432
DB_USER=luis
DB_PASSWORD=luis123
DB_NAME=riwicare_db
JWT_SECRET=llave_secreta_de_alta_seguridad_riwicare_2026
```

### Multi-Container Orchestration Blueprint (`docker-compose.yml`)
The infrastructure layout relies on the following structural network mapping definition:

```yaml
version: '3.8'

services:
  # Relational Database Engine Container
  database:
    image: postgres:15-alpine
    container_name: riwicare_postgres_container
    restart: always
    environment:
      POSTGRES_USER: luis
      POSTGRES_PASSWORD: luis123
      POSTGRES_DB: riwicare_db
    ports:
      - "5432:5432"
    volumes:
      - riwicare_db_data:/var/lib/postgresql/data
    networks:
      - riwicare_network

  # Backend REST API Server Container
  api:
    build: .
    container_name: riwicare_api_container
    restart: always
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - DB_HOST=database
      - DB_PORT=5432
      - DB_USER=luis
      - DB_PASSWORD=luis123
      - DB_NAME=riwicare_db
      - JWT_SECRET=llave_secreta_de_alta_seguridad_riwicare_2026
    depends_on:
      - database
    networks:
      - riwicare_network

# Persistent Storage Volumes and Internal Network Bridges
volumes:
  riwicare_db_data:

networks:
  riwicare_network:
    driver: bridge
```

### Orchestration Initialization Commands
Execute the following container compilation sequence inside your terminal workspace to build, link networks, and run the multi-container isolated environment in detached mode:

```bash
docker compose up -d --build
```

To watch the application console logs streaming in live runtime execution mode, run:

```bash
docker compose logs -f api
```

---

## Automated Data Seeding Manual Instruction

To populate the base operational tables (`clinics`, `warehouses`, `medicines`) with test datasets in a single impact sequence using the implemented Multer seed controller framework, execute the following parameters within Postman:

1. **HTTP Request Settings:**
   * **Method:** `POST`
   * **URL:** `http://localhost:3000/api/seeds/upload`

2. **Payload Configuration (Pestaña Body):**
   * Select the **`form-data`** radio selection button.
   * Under the key column name, type exactly: **`seedFile`**.
   * Hover over the right edge of the key text input field and switch the type dropdown selection from **`Text`** to **`File`**.
   * Click on **`Select Files`** and attach your test `.json` file.

3. **Sample Seed JSON File Schema Blueprint:**
   Create a test text file containing the following architectural layout mapping to feed the endpoint streaming execution:

```json
{
  "clinics": [
    {
      "nit": "901234567-1",
      "name": "RiwiMediCare Central Clinic",
      "address": "Avenida El Poblado 45-12, Medellin",
      "managerName": "Dr. Luis Hernandez"
    }
  ],
  "warehouses": [
    {
      "name": "North Distribution Hub",
      "location": "Industrial Zone Row 4, Block C"
    }
  ],
  "medicines": [
    {
      "name": "Acetaminophen 500mg",
      "description": "Analgesic and antipyretic formulation for pain management."
    }
  ]
}
```

---

## Production API Route Endpoints Mapping

### Authentication Module (Public Access Paths)
* `POST /api/auth/register` - Create new system users (`Administrator` or `Request Manager` role enums).
* `POST /api/auth/login` - Authenticate system credentials to retrieve a Bearer JWT access token.

### Clinics Module (RBAC Secured Access Paths)
* `POST /api/clinics` - Register a new medical facility entry (Requires Administrator role privileges).
* `GET /api/clinics` - Fetch all active operational medical facilities (Requires valid JWT signature).
* `PUT /api/clinics/:id` - Modify an active clinic record dataset (Requires Administrator role privileges).
* `DELETE /api/clinics/:id` - Soft-delete a medical facility entry logically (Requires Administrator role privileges).

### Warehouse Logistics Module (RBAC Secured Access Paths)
* `POST /api/warehouses` - Create a new supply storage facility entry (Requires Administrator role privileges).
* `GET /api/warehouses` - Fetch all active operational logistical supply hubs (Requires valid JWT signature).
* `PUT /api/warehouses/:id` - Modify an active warehouse record dataset (Requires Administrator role privileges).
* `DELETE /api/warehouses/:id` - Soft-delete a logistical storage facility logically (Requires Administrator role privileges).

### Pharmaceutical Catalog Module (RBAC Secured Access Paths)
* `POST /api/medicines` - Register a new medicine item into the catalog (Requires Administrator role privileges).
* `GET /api/medicines` - Fetch all active registered pharmaceutical items (Requires valid JWT signature).
* `PUT /api/medicines/:id` - Modify an active medicine catalog record dataset (Requires Administrator role privileges).
* `DELETE /api/medicines/:id` - Soft-delete a medicine item from active inventory logically (Requires Administrator role privileges).

### Replenishment Transactions Module (RBAC Secured Access Paths)
* `POST /api/requests` - Open a new supply request transaction linking clinic, medicine, and storage UUID keys.
* `GET /api/requests` - Fetch all request transactions logs utilizing Sequelize Eager Loading features.
* `PATCH /api/requests/:id/status` - Mutate supply order processing status (`Pending`, `Approved`, `Rejected` enums) (Requires Administrator role privileges).

---

## Interactive Documentation Specification Dashboard

Once the Docker engine containers are reporting stable green execution states, access the premium Swagger UI rendering pipeline to interact with endpoints, schemas, and token authentication locks through your preferred web browser interface at:

```url
http://localhost:3000/api-docs
```
