# it-patagonia-challange

## 📖 Description

This project is a backend application developed for IT Patagonia, implementing a hexagonal architecture with NestJS and TypeORM. It manages companies and their transfers, providing endpoints to create, retrieve, and query data, with a focus on scalability and maintainability.

## 🏗 Project Structure

```bash
src/
├── companies/
│ ├── application/
│ │ ├── dto/
│ │ │ └── create-company.dto.ts # Company DTO
│ │ │ └─ company.response.ts # Company response
│ │ ├── use-cases/
│ │ │ ├── create-company.use-case.ts # Create company use case
│ │ │ ├── get-company.use-case.ts # Get company use case
│ │ │ └── get-companies.use-case.ts # Get companies use case
│ ├── domain/
│ │   ├── entities/
│ │   │   ├── company.entity.ts # Company entity
│ │   │   └── transfers.entity.ts # Transfers entity
│ │   ├── ports/
│ │       ├── company.port.ts # Company port
│ │       └── transfer.port.ts # Transfer port
│ └── infrastructure/
│ │ ├── repositories/
│ │ │ └── company.repository.ts # Company repository
│ │ ├── controllers/
│ │ │ └── company.controller.ts # Company controller
├── shared/
│ ├── infraestructure/
│ │ ├── database/
│ │ │ ├── migrations/
│ │ │ ├── scripts/
│ │ │ │ └── reset-database.ts # Reset database script
│ │ │ │ └── seed-dev.ts # Seed script
│ │ │ └── typeorm.config.ts # TypeORM configuration
│ │ ├── swagger/
│ │   └── swagger.config.ts # Swagger configuration
│ ├── utils/
│ │ └── date.utils.ts # Date utils
├── app.module.ts # Main module
Dockerfile                                   # Dockerfile for production
Dockerfile.dev                               # Dockerfile for development with hot-reloading
docker-compose.yml                           # Docker Compose configuration for services
```

## 🛠 Prerequisites

- Node.js: v16.x or higher (optional if using Docker)

- npm: v8.x or higher (optional if using Docker)

- Docker: Latest version

- Docker Compose: Latest version

## 🚀 Getting Started

### 1. Clone the Repository

Download the project from the repository:

```bash
git clone https://github.com/SebaTOSS/it-patagonia-challange.git
cd it-patagonia-challange
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory with the following environment variables:

```bash
# Database configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=it_patagonia_db

# Application environment
NODE_ENV=development
PORT=3000
```

### 4. Set Up the Database

Ensure PostgreSQL is running and the database specified in DATABASE_NAME exists. Then, apply the migrations:

```bash
npm run db:migration:run
```

To reset and seed the database with development data:

```bash
npm run db:reset-and-seed-dev
```

### 5. Build the Project

Compile the TypeScript code to JavaScript:

```bash
npm run build
```

### 6. Start the Application

Run the application in development mode:

```bash
npm run start:dev
```

The application will be available at <http://localhost:3000>.

### 📜 Available Scripts

Here are the key scripts defined in package.json for managing the project:

- #### Build and Run

```bash
npm run build         # Compile TypeScript to JavaScript
npm run start         # Start the application (production mode)
npm run start:dev     # Start with hot-reloading (development mode)
npm run start:prod    # Start compiled app in production mode
```

- #### Database Management

```bash
npm run db:reset             # Reset the database (drops all tables)
npm run db:migration:run     # Apply pending migrations
npm run db:migration:generate -- --name=NewMigration  # Generate a new migration
npm run db:seed-dev          # Seed the database with development data
npm run db:seed-test         # Seed the database with test data
npm run db:reset-and-seed-dev  # Reset, migrate, and seed for development
npm run db:reset-and-seed-test # Reset, migrate, and seed for testing
```

- #### Testing

```bash
npm run test          # Run all unit tests
npm run test:coverage # Run tests with coverage
```

- #### Linting

```bash
npm run lint          # Run ESLint to check code quality
npm run format        # Format code with Prettier
```

### 🌐 API Endpoints

The API documentation is available at <http://localhost:3000/api/documentation>

Below are the three main use cases implemented in the API:

1.- **Create Company**

- Description: Allows creating a new company in the system.

- Method: POST

- Endpoint: /companies

- Request Body:

```json
{
    "name": "Company Name",
    "cuit": "30-12345678-9",
}
```

- Response (201 Created)

```json
{
  "id": "generated-uuid",
  "cuit": "30123456789",
  "name": "Test Company",
  "adhesionDate": "2023-01-01T00:00:00.000Z",
  "createdAt": "2023-09-01T12:00:00.000Z",
  "updatedAt": "2023-09-01T12:00:00.000Z"
}
```

2.- **Get companies adhered last in the last month**

- Description: Allows retrieving a list of companies that adhered within a specific date range.

- Method: GET

- Endpoint: /companies/adhered-last-month

- Response (200 OK)

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "cuit": "30-12345678-9",
    "name": "Company S.A.",
    "adhesionDate": "2023-01-15",
    "createdAt": "2023-01-15",
    "updatedAt": "2023-01-15"
  }
]
```

3.- **Get companies with transfers last in the last month**

- Description: Allows retrieving a list of unique companies that have made transfers in the last month.

- Method: GET

- Endpoint: /companies/transfers-last-month

- Response (200 OK)

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "cuit": "30-12345678-9",
    "name": "Company S.A.",
    "adhesionDate": "2023-01-15",
    "createdAt": "2023-01-15",
    "updatedAt": "2023-01-15"
  }
]
```

### 🧪 Testing

```bash
npm run test
```

And for coverage:

```bash
npm run test:coverage
```

### 🐳 Docker Files

- Dockerfile: Production-ready image for the NestJS application.

- Dockerfile.dev: Development image with hot-reloading enabled.

- docker-compose.yml: Defines services for the app and PostgreSQL database.

## 📝License

This project is licensed under the MIT License.

See the [LICENSE](LICENSE) file for details.
