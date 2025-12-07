# DeepClean.AI - Women's Safety Platform

A deepfake detection tool built to protect women from digital harassment and manipulation. This project helps detect fake images and videos that are often used to harm women online.

**My Mission:** Creating a safer digital space for women. This is my dream - to help women protect themselves from deepfake abuse, revenge porn, and online harassment.

**Last Updated:** December 7, 2025

## Why This Matters

Women are the primary targets of deepfake abuse. Fake intimate images, manipulated videos, and AI-generated content are used to:
- Harass and blackmail women
- Damage reputations and careers
- Cause emotional trauma
- Spread without consent

This platform gives women the tools to detect and report this abuse.

---

## What's Running

- Backend runs on port 8001 (FastAPI with OpenCV)
- Frontend runs on port 3000 (Next.js)
- Uses OpenCV for image analysis
- JWT authentication for users
- Stats pulled from actual database

---

## Getting Started

Start the backend:
```powershell
cd backend
python main_api.py
```

Start the frontend (in another terminal):
```powershell
cd frontend
npm run dev
```

Then open your browser:
- Frontend: <http://localhost:3000>
- API docs: <http://localhost:8001/docs>

Test accounts you can use:
- Admin: `admin@deepclean.ai` / `admin123`
- Regular user: `suman@deepclean.ai` / `suman123`

---

## How It Helps Women

### Protection Features

This platform helps women:
- Verify if images/videos are real or fake
- Get evidence reports for legal action
- Track and report abusive content
- Protect their digital identity
- Get analysis reports they can share with authorities

### Detection Methods

The system checks images and videos using:
- Laplacian variance to measure blur and sharpness
- Canny edge detection for boundary analysis
- Noise pattern checks across the image
- Color histogram comparisons
- Frame-by-frame video inspection

### Security

- JWT tokens for logging in
- SHA-256 hashing for evidence tracking
- Admin and regular user roles
- Session management

### What You Can Analyze

- Images: JPEG, PNG, BMP, GIF
- Videos: MP4, AVI, MOV
- Audio files: MP3, WAV, M4A
- Documents: PDF files
- You can upload multiple files at once

### Interface

The web interface lets you:
- Upload and analyze files
- See your analysis history
- View detailed reports
- Check platform statistics
- Login with test accounts

---

## Tech Stack

Frontend:
- Next.js 14 with React
- TypeScript
- Tailwind CSS

Backend:
- FastAPI (Python)
- OpenCV for image processing
- Pillow for image handling
- NumPy for math operations
- Uvicorn as the server

Security:
- JWT for authentication
- SHA-256 for hashing
- CORS enabled

---

## Folder Structure

```text
DeepClean.AI/
├── backend/
│   ├── main_api.py          # FastAPI application (733 lines)
│   ├── requirements.txt      # Python dependencies
│   ├── Dockerfile           # Backend containerization
│   └── venv/                # Virtual environment
├── frontend/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx        # Homepage with real stats
│   │   ├── login/          # Simple login page
│   │   ├── dashboard/      # User dashboard
│   │   ├── analysis/       # 12-tool analysis page
│   │   └── about/          # Company information
│   ├── components/          # React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── package.json        # Node dependencies
│   └── next.config.js      # Next.js configuration
├── docs/                    # Documentation
│   └── system-design/      # Architecture docs
├── docker-compose.yml       # Docker orchestration
├── README.md               # This file
└── START.ps1               # Quick start script
```

---

## Installation

You'll need:
- Python 3.9 or higher
- Node.js 18 or higher
- npm or yarn

Setting up the backend:
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main_api.py
```

Setting up the frontend:
```powershell
cd frontend
npm install
npm run dev
```

---

## API Routes

Authentication:
- `POST /api/v1/auth/login` - Log in
- `POST /api/v1/auth/register` - Create account
- `GET /api/v1/auth/me` - Get your info

Analysis:
- `POST /api/v1/analyze/image` - Check an image
- `POST /api/v1/analyze/video` - Check a video
- `POST /api/v1/analyze/audio` - Check audio
- `GET /api/v1/analyze/history` - See past analyses

Statistics:
- `GET /api/v1/stats` - Get platform stats

For more details, check <http://localhost:8001/docs> when the backend is running.

---

## Test Accounts

| Email | Password | Role |
|-------|----------|------|
| `admin@deepclean.ai` | `admin123` | Admin |
| `suman@deepclean.ai` | `suman123` | User |
| `user@example.com` | `password123` | User |

---

## Features

Detection:
- Uses OpenCV's Laplacian variance
- Canny edge detection
- Checks noise patterns
- Analyzes color histograms
- Compares video frames

Statistics:
- Shows actual user count
- Tracks files analyzed
- Measures processing time
- Calculates detection accuracy
- Everything from the database

Auth & UI:
- JWT for login
- Admin and user roles
- Simple, clean interface
- Works on mobile
- Shows errors clearly

---

## Deployment

Using Docker:
```powershell
docker-compose up -d
```

Manual deployment:
1. Set your environment variables
2. Set up a production database
3. Enable HTTPS
4. Change the JWT secret key
5. Deploy frontend and backend separately

---

## Development

Working on the backend:
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python main_api.py
```
Runs on <http://localhost:8001>

Working on the frontend:
```powershell
cd frontend
npm run dev
```
Runs on <http://localhost:3000>

Both have hot reload enabled.

---

## Security Notes

Before going live, make sure to:
- Change the JWT secret key
- Use bcrypt for passwords
- Turn on HTTPS
- Set up CORS correctly
- Use environment variables for secrets
- Add rate limiting
- Validate all inputs
- Set up logging

---

## License

All rights reserved.

## About the Developer

**Suman Singh**  
GitHub: [@sumansingh20](https://github.com/sumansingh20)

I'm building this platform because I believe every woman deserves to feel safe online. Deepfake technology is being misused to harm women, and I want to give them tools to fight back. This is my contribution to making the internet safer for women.

## My Vision

Women's safety is my first priority. I dream of a world where:
- Women can trust what they see online
- Abusers can be caught and stopped
- Technology protects women instead of harming them
- Every woman has access to tools that keep them safe

This platform is just the beginning. I'm committed to continuously improving it to better serve women who need protection from digital abuse.

## Credits

Thanks to:
- OpenCV for the computer vision tools
- FastAPI for the backend framework
- Next.js for the frontend
- Tailwind CSS for styling

## Questions?

Found a bug or have questions? Open an issue on GitHub or email suman@deepclean.ai
