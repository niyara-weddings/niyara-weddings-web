# Niyara Wedding Planner Frontend

![Next.js](https://img.shields.io/badge/-Next.js-000000?logo=nextdotjs&logoColor=white&style=for-the-badge)
![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=000000&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge)
![Material UI](https://img.shields.io/badge/-Material_UI-007FFF?logo=mui&logoColor=white&style=for-the-badge)
![ESLint](https://img.shields.io/badge/-ESLint-4B32C3?logo=eslint&logoColor=white&style=for-the-badge)
![Render](https://img.shields.io/badge/-Render-46E3B7?logo=render&logoColor=000000&style=for-the-badge)

**Niyara Wedding Planner Frontend** is a polished Next.js client for the Wedding Planning API. It gives couples a premium dashboard for tracking wedding progress, managing tasks, organizing guests, maintaining vendor details, and updating their wedding profile from one responsive interface.

The frontend is designed as the user-facing experience for the Django REST backend and uses cookie-based JWT authentication through API proxy routes.

## Table of Contents

- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Live Demo](#live-demo)
- [Demo Access](#demo-access)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configure Environment Variables](#configure-environment-variables)
  - [Run the Application](#run-the-application)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Backend API](#backend-api)
- [Testing & Quality](#testing--quality)
- [Deployment Notes](#deployment-notes)
- [License](#license)

## Key Features

- **Authentication Flow** - Login, registration, logout, route protection, and session refresh handling
- **Dashboard Overview** - Wedding progress, task, guest, and vendor summaries
- **Task Management** - Create, update, filter, complete, and delete wedding planning tasks
- **Guest Management** - Track guest details, RSVP status, dietary restrictions, and notes
- **Vendor Management** - Manage vendor categories, contact details, quotes, and search/filter workflows
- **Wedding Profile** - Store couple details, wedding date, colors, budget, and profile image
- **Responsive UI** - Mobile-friendly public pages, authenticated layouts, and dashboard screens
- **Premium Branding** - Niyara visual identity, themed Material UI components, and branded assets

## Tech Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **UI:** React 19, Material UI 7
- **Styling:** Material UI theme system and global CSS
- **Auth:** Cookie-based JWT session flow through the backend API
- **API Layer:** Shared fetch helpers with response normalization and refresh handling
- **Quality:** ESLint, TypeScript compiler checks

## Live Demo

- **Frontend:** [https://wedding-planner-frontend-od7k.onrender.com/login](https://wedding-planner-frontend-od7k.onrender.com/login)
- **Backend API:** [https://niyara-wedding-planner-backend.onrender.com/api/docs/](https://niyara-wedding-planner-backend.onrender.com/api/docs/)

## Demo Access

Demo access is available directly on the login page, with a one-click fill option for quick review.

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- Running Wedding Planning API backend

### Installation

Clone the repository:

```bash
git clone git@github.com:CynthiaWahome/wedding-planner-frontend.git
cd wedding-planner-frontend
```

Install dependencies:

```bash
npm install
```

### Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_FALLBACK_API_URL=https://niyara-wedding-planner-backend.onrender.com
DEMO_USERNAME=admin
DEMO_PASSWORD=<demo-password>
```

`NEXT_PUBLIC_API_URL` points the frontend proxy to the primary Django API server. `NEXT_PUBLIC_FALLBACK_API_URL` can point to the Render backend URL as a backup when a custom API subdomain is unavailable. `DEMO_USERNAME` and `DEMO_PASSWORD` power the one-click demo access button without committing demo credentials to source control.

### Run the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```text
src/
  app/                 Next.js app routes and pages
  components/          Shared UI components and modals
  context/             Auth and theme providers
  styles/              Theme configuration
  types/               Shared TypeScript types
  utils/               API helpers and media URL utilities
public/                Brand assets, favicon files, and hero imagery
```

## Available Scripts

```bash
npm run dev      # Start the local Next.js development server
npm run build    # Create a production build
npm run start    # Start the production server after building
npm run lint     # Run ESLint checks
```

## Backend API

This frontend pairs with the Wedding Planning API:

- **Local API:** [http://localhost:8000](http://localhost:8000)
- **Swagger Docs:** [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)
- **API Schema:** [http://localhost:8000/api/schema/](http://localhost:8000/api/schema/)
- **Live Swagger Docs:** [https://niyara-wedding-planner-backend.onrender.com/api/docs/](https://niyara-wedding-planner-backend.onrender.com/api/docs/)

Core API areas:

- Authentication
- Wedding profile
- Tasks
- Guests
- Vendors

## Testing & Quality

Run the frontend quality checks before opening a pull request:

```bash
npm run lint
npm run build
```

## Deployment Notes

- Configure `NEXT_PUBLIC_API_URL` for the deployed backend URL.
- Configure `NEXT_PUBLIC_FALLBACK_API_URL` with the Render backend URL if the primary API uses a custom domain.
- Confirm the backend CORS and CSRF trusted origins include the deployed frontend URL.
- Confirm backend CORS allows the deployed frontend origin before relying on direct fallback API requests.
- Use HTTPS in production so secure cookies work correctly across the frontend and backend.

## License

This project is licensed under the MIT License.
