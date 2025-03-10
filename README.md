# it-patagonia-challange

Challange for IT Patagonia

## 🏗 Project Structure

```bash
src/
├── companies/
│ ├── application/
│ │ ├── dto/
│ │ │ └── create-company.dto.ts # Company DTO
│ │ │ ├── company.response.ts # Company response
│ │ ├── ports/
│ │ │ ├── company.port.ts # Company port
│ │ │ ├── transfer.port.ts # Transfer port
│ │ ├── use-cases/
│ │ │ ├── create-company.use-case.ts # Create company use case
│ │ │ ├── get-company.use-case.ts # Get company use case
│ │ │ ├── get-companies.use-case.ts # Get companies use case
│ └── domain/
│ │ ├── company.entity.ts # Company entity
│ │ ├── transfers.entity.ts # Transfers entity
│ └── infrastructure/
│ │ ├── repositories/
│ │ │ └── company.repository.ts # Company repository
│ │ ├── controllers/
│ │ │ └── company.controller.ts # Company controller
├── shared/
│ ├── infraestructure/
│ │ ├── database/
│ │ │ ├── typeorm.config.ts # TypeORM configuration
│ │ ├── scripts/
│ │ │ ├── seed.ts # Seed script
│ │ swagger.ts # Swagger configuration
├── app.module.ts # Main module
```
