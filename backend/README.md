# Xafari backend

## **Setup Instructions**

### **1. Clone the Repository**
```bash
git clone git@github.com:TototEstudio/Xafari.git
cd Xafari
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Set Up Environment Variables**
Create a `.env` file in the root directory and add the following variables:

```bash
POSTGRES_USER=USERNAME
POSTGRES_PASSWORD=PASSWORD
POSTGRES_DB=DATABASE_NAME
POSTGRES_HOST=HOST
POSTGRES_PORT=PORT

JWT_SECRET=SECRET
```

### **4. Set Up the Database**
1. Create a PostgreSQL database.
2. Run migrations to set up the schema:
   ```bash
   npx sequelize-cli db:migrate
   ```

### **5. Start the Server**
```bash
npm run start
```

## **6. Tests coverage**

- controllers:
    - [x] userController
    - [x] guardianModel
    - [x] activityModel
    - [ ] userActivityModel
    - [ ] userGuardianModel
    - [ ] winsModel
- models: 
    - [ ] userModel
    - [ ] guardianModel
    - [ ] activityModel
    - [ ] userActivityModel
    - [ ] userGuardianModel
    - [ ] winsModel
- services:
    - [ ] userService
    - [ ] guardianService
    - [ ] activityService
    - [ ] userActivityService
    - [ ] userGuardianService
    - [ ] winsService






## **Features**

- **User Management:**
  - Create, read, update, and delete users.
  - Register users for games.
  - Track user activities and wins.

- **Game Management:**
  - Create and manage games.
  - Define activities for each game.

- **API Documentation:**
  - OpenAPI specification for API endpoints.
  - Interactive API documentation using Swagger UI.

- **Testing:**
  - Unit tests for controllers, services, and middleware.
  - Integration tests for database interactions.
  - Code coverage reports using Jest.

