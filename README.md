# Event & Notification System

A Project which lets you 
- Create an Event  
- Get All Events  
- Get a Particular Event  
- Generate a Notification when the time left for the event is less than or equal to 5 minutes 

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScipt
- **Database**: PostgreSQL
- **Containerization**: Docker
- **Services**:
  - Event Service
  - Notification Service

### Prerequisites

- Node.js v22+ (Recommended)
- Docker & Docker Compose (Optional)
- pnpm v10+ (Recommended)


```bash
# Clone repository
git clone https://github.com/Amman30/event-notification.git
cd event-notification

# Install dependencies
pnpm install
```
### Running the Application

```bash
# Start in development mode
pnpm run start:dev     
```

### Production Build
```bash
# Build all services
pnpm run build
```

### Run with Docker
```bash 
docker compose up --build -d

# Stop and remove containers
docker-compose down
```

### Swagger 
#### Access Swagger documentation at /api endpoint for each service.


### Mermaid Chart
##### Access the ER Diagram on <a href="https://mermaid.live/edit#pako:eNqNUMGKwjAQ_ZUw5yqxTW3NbXEViqALW_aw9BLMWAM2LWmyrNb--6bqrqCXHXJ5M-_Nm5cOtrVE4IDmVYnSiKrQxNfiY7HO30l3RUM5pyTx721177XWKF0Sq-wBn7oS261RjVW1vs-sqrC1omrsiUhhMff4Ou2LG229ybNlNn_Js836vxf4pa0o8YGLX6htJsly9WBxS3c-j0Z192DISQF70ZJK6GMBhYYASqMkcGscBlChqcQA4XJZAXaPPgIMMok74Q52UPVe1gj9WdfVr9LUrtwD34lD65Frhvi3P_-joJZo5rXTFjibXlYA7-AbeJjOxjSMGJ2xaUSTiMUBHIHHdJxMw2QSsSiJEhomfQCniykdp5N4FrFJTJmnJ2na_wAXAJI8">Mermaid</a> 


### If I had more time, I would
-Make the notification service async using a message queue like RabbitMQ or Kafka
<br />
-Add more robust error handling and logging with centralized logging (e.g., ELK stack)


### If this had to serve 10,000 users a day, what would break?

-Database load: single Postgres instance could become a bottleneck.
<br />
-Cron job: synchronous notifications would slow down.
<br />
-API concurrency: single NestJS instance might be overwhelmed.
<br />
-Memory usage: eager loading of notifications could cause issues.
<br />
-Logging: console logging won’t scale for high traffic.
