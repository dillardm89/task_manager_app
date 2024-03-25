# task_manager_app
Task manager app using React + Typescript

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXo0cjFpOTV0cm1tZ2diZnFicThhNm0ydDhtOWhwNWNja2trZ3A5cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/PxMs5AkfOKubTJOut1/giphy.gif)

### Project Specifications:

- Create task management site
- Build frontend with React and Typescript
- Build backend with Node and Express
- Utilize MongoDB for database

### Features:

- Main page for user to view tasks planned for today, pending tasks, and completed tasks
- Add Task modal to create new tasks that are added to the pending list
- Drag and drop functionality to move tasks between today, pending, and completed lists
- Conditional styling for pending, past-due, and completed tasks

## Installation

### Backend Env Variables

- API_PORT = 'your_api_port' (ex: 5000)
- MONGODB_URL = 'your_mongo_connection_url:port' (ex: 'mongodb://localhost:27017')

### Frontend Env Variables

- VITE_APP_API_URL = 'your_api_url_here' (ex: 'http://localhost:5000')

### mongoDB

- Create a database 'tasks' with collection 'tasks'
- Import data from 'database-files': tasks.json

### Node_Modules

- cd to 'backend' directory
- 'npm install' to install necessary modules from package.json

- cd to 'frontend' directory
- 'npm install' to install necessary modules from package.json

### Run in Development

- cd to 'backend' directory
- 'npm run start'
- uses 'localhost:5000'

- cd to 'frontend' directory
- 'npm run dev'
- uses 'localhost:5174'
