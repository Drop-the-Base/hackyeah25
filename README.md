# hackyeah25

This repository contains a full-stack application with three main components:

## Project Structure

```
hackyeah25/
├── backend/    # FastAPI (Python)
├── frontend/   # React (Vite)
└── mobile/     # React Native (Expo)
```

## Backend (FastAPI)

The backend is built with FastAPI, a modern Python web framework.

**Setup:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Run:**
```bash
uvicorn main:app --reload
```

API will be available at http://localhost:8000
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Frontend (React)

The frontend is built with React using Vite.

**Setup:**
```bash
cd frontend
npm install
```

**Run:**
```bash
npm run dev
```

Application will be available at http://localhost:5173

## Mobile (React Native)

The mobile app is built with React Native using Expo.

**Setup:**
```bash
cd mobile
npm install
```

**Run:**
```bash
npm start        # Start Expo dev server
npm run android  # Run on Android
npm run ios      # Run on iOS (macOS only)
npm run web      # Run in web browser
```

## Development

Each component can be developed independently. Refer to the README.md file in each directory for more detailed instructions.
