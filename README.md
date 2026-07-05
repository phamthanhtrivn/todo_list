# Todo List Application (Fullstack)

A modern, full-stack Task Management application built with **Next.js (React)**, **Spring Boot (Java)**, and **PostgreSQL**.

## 🚀 How to Run Locally (For Reviewers/Recruiters)

You do **not** need to install Node.js, Java, Maven, or PostgreSQL on your machine to test this application. Everything is fully containerized with Docker.

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/) installed.

### 1. Clone the repository
```bash
git clone https://github.com/phamthanhtrivn/todo_list.git
cd todo_list
```

### 2. Configure Environment Variables
A `.env` file is required to provide database configurations to Docker.
Create a `.env` file in the root folder (`todo_list/.env`) and paste the following:

```env
# Database configurations
DB_PORT=5434
POSTGRES_DB=todo_db
POSTGRES_USER=todo_user
POSTGRES_PASSWORD=123456
```

### 3. Start the application
Run the following command in your terminal (at the root of the project):
```bash
docker-compose up -d --build
```

Docker will automatically:
1. Pull the PostgreSQL image and start the database.
2. Build the Spring Boot Backend (using Maven and JDK 17) and start it on `http://localhost:8080`.
3. Build the Next.js Frontend and start it on `http://localhost:3000`.

*Note: The first build might take a few minutes as Docker needs to download the dependencies.*

### 4. Access the Application
- **Frontend (UI)**: Open [http://localhost:3000](http://localhost:3000) in your browser.
- **Backend API**: Running on `http://localhost:8080/api`.

### To Stop the Application
To safely shut down the containers and clean up networks, run:
```bash
docker-compose down
```
*(Add `-v` to remove the database volume if you want to wipe the data).*

---
## 🛠 Tech Stack
- **Frontend**: Next.js, React, Tailwind CSS, Lucide Icons, SweetAlert2.
- **Backend**: Java 17, Spring Boot, Spring Data JPA.
- **Database**: PostgreSQL.
- **Infrastructure**: Docker, Docker Compose.
