# TestiFlow Frontend

A modern Next.js frontend for the TestiFlow testimonial collection platform.

## Features

- 🔐 **Authentication**: Secure login/signup with JWT tokens
- 📝 **Space Management**: Create, edit, and manage testimonial collection spaces
- ⭐ **Review Management**: View, approve, and curate customer testimonials
- 🔗 **Embed Integration**: Generate embed codes for displaying testimonials
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🎨 **Modern UI**: Beautiful interface built with Tailwind CSS and shadcn/ui

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Context API
- **HTTP Client**: Fetch API with custom wrapper

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on port 8080

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   The `.env.local` file should already be created with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Login page
│   │   └── signup/        # Signup page
│   ├── dashboard/         # Protected dashboard pages
│   │   ├── layout.tsx     # Dashboard layout with sidebar
│   │   └── spaces/        # Space management
│   │       ├── page.tsx   # Spaces list
│   │       └── [spaceId]/ # Individual space management
│   ├── t/                 # Public testimonial submission
│   │   └── [slug]/        # Public review form
│   ├── embed/             # Embed display pages
│   │   └── [spaceId]/     # Public testimonial display
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── DashboardSidebar.tsx
│   ├── EmbedCodeGenerator.tsx
│   └── ProtectedRoute.tsx
├── contexts/             # React contexts
│   └── AuthContext.tsx  # Authentication state
└── lib/                  # Utility functions
    ├── api.ts           # API client
    ├── auth.ts          # Auth helpers
    ├── spaces.ts        # Space API calls
    ├── reviews.ts       # Review API calls
    └── utils.ts         # General utilities
```

## Key Features

### Authentication
- JWT-based authentication
- Automatic token management
- Protected routes
- Session persistence

### Space Management
- Create testimonial collection spaces
- Custom names and redirect URLs
- Unique slugs for public access
- Full CRUD operations

### Review System
- Public testimonial submission forms
- Star rating system
- Review approval workflow
- Like/unlike functionality

### Embed System
- HTML and React embed codes
- Responsive testimonial display
- Easy integration with any website

## API Integration

The frontend integrates with the following backend endpoints:

- **Authentication**: `/auth/signup`, `/auth/login`, `/auth/me`
- **Spaces**: `/spaces` (CRUD operations)
- **Reviews**: `/reviews/{slug}` (public submission)
- **Reviews**: `/reviews/{spaceId}` (management)
- **Embed**: `/embed/{spaceId}` (public display)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API base URL

## Deployment

The frontend can be deployed to any platform that supports Next.js:

- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- **Railway**
- **Heroku**

## Testing

1. **Start the backend** (if not running):
   ```bash
   cd ../backend
   ./mvnw spring-boot:run
   ```

2. **Check backend connectivity**:
   ```bash
   node ../check-backend.js
   ```

3. **Start the frontend**:
   ```bash
   npm run dev
   ```

4. **Follow the testing guide**: See `../test-frontend.md`

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured for your domain
2. **API Connection**: Verify backend is running on port 8080
3. **Authentication Issues**: Clear browser storage and try again
4. **Build Errors**: Check TypeScript errors and missing dependencies

### Debug Mode

The application includes debug information in development mode:
- API request logging
- Authentication state display
- Error boundary handling

## Contributing

1. Follow the existing code style
2. Use TypeScript for all new files
3. Add proper error handling
4. Test all new features thoroughly
5. Update documentation as needed

## License

This project is part of the TestiFlow platform.