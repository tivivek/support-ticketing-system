# Support Ticketing System

A modern, responsive enterprise-grade support ticketing system built with React, TypeScript, Material-UI, and Redux.

## Live Demo

Visit the live application: <a href="https://support-ticketing-system-ierz.vercel.app/" target="_blank" rel="noopener noreferrer">Click here</a>

## Features

- **Beautiful, responsive UI** built with Material-UI
- **Real-time updates** (simulated in this frontend-only version)
- **Role-based access control** for different user types
- **Comprehensive ticket management** with filtering, sorting, and search
- **Dashboard** with ticket analytics and metrics
- **Messaging system** for communication between users and support agents

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Redux Toolkit** for state management
- **React Router v6** for routing
- **Material-UI v5** for UI components
- **React Hook Form** with Zod for form validation
- **Mock API** services for frontend-only development

## Getting Started

### Prerequisites

- Node.js 22.x
- npm 11.2

### Installation

1. Clone the repository

`bash`

```
git clone git@github.com:tivivek/support-ticketing-system.git
cd support-ticketing-system
```

## Install dependencies

`npm install`

## Start the development server

`npm run dev`

## Open your browser and navigate to

`http://localhost:5173`

## Login Credentials

### Use these demo credentials to access the system:

- Customer: customer@example.com / password123
- Agent: agent@example.com / password123
- Admin: admin@example.com / password123

## Project Structure

```

src/
├── assets/ # Static assets
├── components/ # UI components
│ ├── common/ # Shared components
│ ├── features/ # Feature-specific components
│ ├── layout/ # Layout components
│ └── pages/ # Page components
├── hooks/ # Custom React hooks
├── mocks/ # Mock data and services
├── services/ # API and WebSocket services
├── store/ # Redux store
│ ├── slices/ # Redux slices
│ └── middleware/ # Custom middleware
├── types/ # TypeScript type definitions
└── utils/ # Utility functions

```

## Building for Production

To build the application for production:
bashnpm run build

This will generate a dist folder with production-ready static files.

## Key Features Explained

Role-Based Access Control

### The system supports three user roles:

- Customer: Can create and view their tickets
- Agent: Can manage assigned tickets and communicate with customers
- Admin: Has full access to all features and user management

- Real-Time Communication (Simulated)
- The application simulates real-time updates using mock WebSocket services:

- Instant message delivery
- Live ticket status updates
- Real-time notifications

- Advanced Filtering and Sorting
- Easily manage tickets using:

- Status filters (Open, In Progress, Pending, Resolved, Closed)
- Priority filters (Low, Medium, High, Critical)
- Text search across ticket titles and descriptions
- Multiple sorting options

## Dashboard Analytics

- The admin and agent dashboard provides visual analytics:

- Ticket volume by status
- Distribution by priority
- Agent performance metrics
- Trend analysis

## Future Enhancements

- Integration with real backend API
- Email notifications
- Knowledge base integration
- Customer satisfaction surveys
- SLA monitoring and reporting

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
License
This project is licensed under the MIT License - see the LICENSE file for details.
Acknowledgments

Icons provided by Material-UI
Charts powered by Recharts

Note: This is a frontend-only implementation using mock data. In a production environment, you would integrate with an actual backend API.
