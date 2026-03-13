# TO DO LIST APPLICATION

This is a task management application that allows users to create, manage, update, share, etc. their to-do lists. Its built using React + TypeScript in the frontend and Django + Python in the backend.

## How to run:

1. Clone the repository

```bash
git clone https://github.com/Felipems999/To-Do-List-App.git
```

2. Configure your .env file:

```bash
cp .env.example .env
```

next, open the .env file and add your django API_KEY and Gemini API key:

```env
GEMINI_KEY="your_gemini_api_key" <-- You can get it from https://console.cloud.google.com/apis/credentials
API_KEY="your_django_api_key" <-- You can generate it using the command: python manage.py shell -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

3. Run the application using Docker Compose:

```bash
docker-compose up --build
```

This will build the Docker images and start the containers for both the frontend and backend. The application will be accessible at http://localhost:3000.

4. Make django migrations:

```bash
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
```

or

```bash
docker-compose exec backend python3 manage.py makemigrations
docker-compose exec backend python3 manage.py migrate
```

The application will be available at `http://localhost:5173/` and the backend API will be available at `http://localhost:8000/`.

Author: Felipe M. S. / GitHub: [Felipems999](https://github.com/Felipems999)
