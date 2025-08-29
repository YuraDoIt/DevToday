# Environment Setup
Create a `.env` file in the root of your project and add the following:

# Env
DATE_NAGER_API_BASE_URL=
COUNTRIES_NOW_API_BASE_URL=
PORT=3000

# To run
write npm run start:dev

src/
├── calendar/          # Calendar module (service, controller, entities)
├── country/           # Country module (service, controller, entities)
├── user/              # User entities and related logic
├── config/            # Common config for project 
test/                  # Unit and integration tests


Technologies

NestJS — Framework
TypeORM — ORM for DB access
Jest — Testing
Axios — HTTP client for external API calls
TypeScript — Language