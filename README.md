Hexar Homepage Sections + CMS

A full-stack CMS-driven implementation for the required Hexar homepage sections.

The project includes:

Public website / frontend

Admin CMS panel

Node.js API server

MongoDB database

Cloudinary media storage

Dynamic content management through APIs

The requested homepage sections are:

Banner

About Hexar Family

Mission & Vision

Content managed from the CMS is served dynamically to the frontend through the backend APIs.

Live Links

Frontend Website

https://hexar-frontend-five.vercel.app/

CMS Panel

https://hexar-cms.vercel.app/login

CMS Credentials

Username: admin
Password: 123456

These credentials are provided for task review.

GitHub Repositories

Backend

https://github.com/GauravPatil191d/hexar-backend.git

Frontend Website

https://github.com/GauravPatil191d/hexar-frontend.git

CMS

https://github.com/GauravPatil191d/hexar-cms.git

Project Architecture

                    ┌─────────────────────┐
                    │    Admin CMS        │
                    │  Next / React       │
                    │     Vercel          │
                    └──────────┬──────────┘
                               │
                               │ API Requests
                               ▼
                    ┌─────────────────────┐
                    │   Backend Server    │
                    │ Node.js + Express   │
                    │      Render         │
                    └───────┬───────┬─────┘
                            │       │
                            │       │
                            ▼       ▼
                    ┌──────────┐ ┌─────────────┐
                    │ MongoDB  │ │ Cloudinary  │
                    │ Content  │ │ Images/Video│
                    └──────────┘ └─────────────┘
                            ▲
                            │
                            │ Dynamic API Data
                            │
                    ┌───────┴─────────────┐
                    │  Public Frontend    │
                    │    Next / React     │
                    │       Vercel        │
                    └─────────────────────┘

Tech Stack

Frontend Website

Next.js

React

TypeScript

CSS

API-driven content rendering

CMS

Next.js

React

TypeScript

CSS

Admin authentication

Dynamic forms

Media upload handling

Backend

Node.js

Express.js

TypeScript

MongoDB

Mongoose

CORS

dotenv

Authentication middleware

Media upload service

Database

MongoDB

MongoDB is used to store CMS-managed content and application data.

Media Storage

Cloudinary

Cloudinary is used for storing uploaded media such as:

Banner images

Banner videos

Other CMS-managed images

This keeps media storage separate from the application server and provides cloud-hosted media URLs for the frontend.

Deployment

Frontend Website: Vercel

CMS: Vercel

Backend API: Render

Database: MongoDB

Media Storage: Cloudinary

Why the Backend Uses Render

The backend was deployed as a dedicated Node.js service on Render.

The application includes media uploads, including larger video files. Running the API as a dedicated backend service provides a more suitable setup for handling these upload requests compared with the previous serverless deployment approach used during development.

The frontend and CMS remain deployed on Vercel, while the backend handles API requests and communicates with MongoDB and Cloudinary.

Features

1. Banner Management

The CMS allows the admin to:

Create banners

View banners

Edit banners

Update banners

Delete banners

Upload banner images

Upload banner videos

Manage banner title

Manage banner small tag

The frontend fetches banner data dynamically from the API.

2. About Hexar Family

The CMS manages the required About Hexar Family content.

The frontend retrieves the content through backend APIs instead of using hardcoded page content.

3. Mission & Vision

The CMS manages the Mission & Vision section.

The frontend dynamically fetches the managed content through APIs.

4. Admin Authentication

The CMS includes an admin login flow.

Admin users can access the CMS and manage the required homepage content.

5. Dynamic API Integration

The frontend does not depend on static CMS content for the implemented sections.

Data flow:

Admin updates content
        ↓
CMS sends request to Backend API
        ↓
Backend processes the request
        ↓
MongoDB stores content
        ↓
Cloudinary stores media when required
        ↓
Frontend requests latest API data
        ↓
Updated content is displayed

Backend API Structure

The backend is organized using separate modules and routers.

Main route groups include:

/auth
/upload
/banners
/ribbon
/about
/mission-vision

A simplified backend structure:

src/
├── config/
│   └── db
│
├── modules/
│   ├── login/
│   ├── banners/
│   ├── ribbon/
│   ├── about/
│   └── mission-vission/
│
├── service/
│   └── upload-service/
│
└── index

The Express application connects these route modules and starts the API server.

CORS Configuration

The backend is configured to allow requests from the deployed applications.

Allowed application origins include:

https://hexar-cms.vercel.app
https://hexar-frontend-five.vercel.app

For local development, the API configuration can be extended to allow localhost origins as required.

Media Upload Flow

Media is handled through the backend.

CMS
  ↓
Select Image / Video
  ↓
Backend Upload API
  ↓
Cloudinary
  ↓
Cloudinary Media URL
  ↓
URL Stored With CMS Content
  ↓
Frontend Uses Media URL

This avoids depending on the frontend application server for permanent media storage.

AI-Assisted Development

Due to the limited project timeline, AI tools were used as a development assistant, primarily to accelerate frontend implementation and improve development efficiency.

AI assistance was used for tasks such as:

Accelerating frontend development

Improving component and UI implementation

Assisting with styling

Refining layouts and responsiveness

Speeding up repetitive development work

Supporting debugging and development workflow

The final project was integrated into the full application architecture, including:

Frontend API integration

CMS functionality

Backend routes

Database integration

Media upload flow

Deployment configuration

AI was used as a development tool to improve speed during the available timeframe.

Local Setup

Each application should be installed and run separately.

1. Clone the Repositories

Backend

git clone https://github.com/GauravPatil191d/hexar-backend.git

Frontend

git clone https://github.com/GauravPatil191d/hexar-frontend.git

CMS

git clone https://github.com/GauravPatil191d/hexar-cms.git

Backend Setup

Navigate to the backend directory:

cd hexar-backend

Install dependencies:

npm install

Create the required environment variables.

Example:

PORT=8000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

Run the backend:

npm run dev

For production:

npm run build
npm start

Frontend Setup

Navigate to the frontend directory:

cd hexar-frontend

Install dependencies:

npm install

Configure the backend API URL in the frontend environment configuration.

Example:

NEXT_PUBLIC_API_URL=your_backend_api_url

Run the application:

npm run dev

Build for production:

npm run build
npm start

CMS Setup

Navigate to the CMS directory:

cd hexar-cms

Install dependencies:

npm install

Configure the backend API URL:

NEXT_PUBLIC_API_URL=your_backend_api_url

Run the CMS:

npm run dev

Build for production:

npm run build
npm start

Content Flow

The system is designed so the CMS controls the implemented homepage content.

CMS
 ├── Banner
 ├── About Hexar Family
 └── Mission & Vision
          │
          ▼
      Backend API
          │
          ├── MongoDB
          └── Cloudinary
                  │
                  ▼
            Frontend Website

When the admin updates content through the CMS, the frontend can retrieve the latest content from the backend APIs.

Deployment Summary

Service

Technology / Platform

Frontend

Next.js / React + Vercel

CMS

Next.js / React + Vercel

Backend

Node.js / Express + Render

Database

MongoDB

Media Storage

Cloudinary

Deliverables

The project includes:

React/Next frontend

CMS admin panel

Admin login

Backend APIs

MongoDB integration

Dynamic content management

Banner management

About Hexar Family management

Mission & Vision management

Image upload support

Video upload support

Cloud media storage through Cloudinary

Frontend deployment

CMS deployment

Backend deployment

Separate GitHub repositories

Review Links

Website

https://hexar-frontend-five.vercel.app/

CMS

https://hexar-cms.vercel.app/login

Login

Username: admin
Password: 123456

Notes

Environment variables and secret credentials should not be committed to GitHub.

Production credentials should be changed before public production use.

Cloudinary credentials and MongoDB connection details should remain private.

The repositories are separated into backend, frontend, and CMS applications for clearer project organization.

Project Status

Completed for the requested Hexar homepage sections and CMS functionality.

The implemented system connects the CMS, backend APIs, database, cloud media storage, and frontend website into a dynamic content management workflow.
