# TestiFlow Frontend Testing Guide

## Setup Instructions

1. **Start the Backend** (if not already running):
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

2. **Start the Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api

## Testing Checklist

### 1. Landing Page
- [ ] Visit http://localhost:3000
- [ ] Verify beautiful landing page loads
- [ ] Check navigation links work
- [ ] Test "Get Started" and "Sign In" buttons

### 2. Authentication
- [ ] **Sign Up**:
  - Click "Get Started" or "Sign up"
  - Fill in name, email, password
  - Verify successful signup redirects to login
- [ ] **Login**:
  - Enter email and password
  - Verify successful login redirects to dashboard
- [ ] **Logout**:
  - Click logout in sidebar
  - Verify redirects to login page

### 3. Space Management
- [ ] **Create Space**:
  - Click "Create New Space"
  - Fill in space name and redirect URL
  - Verify space appears in list
- [ ] **View Space**:
  - Click "Manage" on a space
  - Verify space details load correctly
- [ ] **Edit Space**:
  - Click "Edit" button
  - Modify name or redirect URL
  - Click "Save"
  - Verify changes are saved
- [ ] **Delete Space**:
  - Click "Delete" button
  - Confirm deletion
  - Verify space is removed from list

### 4. Review Submission
- [ ] **Public Review Page**:
  - Click "View Public Page" on a space
  - Verify testimonial submission form loads
  - Fill in name, rating, testimonial
  - Submit and verify redirect works
- [ ] **Review Management**:
  - Go back to space management
  - Verify submitted review appears
  - Test like/unlike functionality
  - Test delete review functionality

### 5. Embed Functionality
- [ ] **Embed Code Generation**:
  - In space management, check embed code section
  - Copy HTML embed code
  - Copy React embed code
  - Verify public URL works
- [ ] **Embed Display**:
  - Visit the embed URL directly
  - Verify testimonials display correctly
  - Check responsive design

## Expected API Endpoints

The frontend should successfully call these backend endpoints:

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/spaces` - List user's spaces
- `POST /api/spaces` - Create new space
- `GET /api/spaces/{id}` - Get space details
- `PUT /api/spaces/{id}` - Update space
- `DELETE /api/spaces/{id}` - Delete space
- `POST /api/reviews/{slug}` - Submit testimonial
- `GET /api/reviews/{spaceId}` - Get space reviews
- `PUT /api/reviews/{reviewId}/like` - Toggle review like
- `DELETE /api/reviews/{reviewId}` - Delete review
- `GET /api/embed/{spaceId}` - Get public testimonials

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Ensure backend CORS is configured for localhost:3000
2. **API Connection**: Check that backend is running on port 8080
3. **Authentication**: Clear browser storage if login issues persist
4. **Environment Variables**: Ensure .env.local has correct API URL

### Debug Information:
- Check browser console for errors
- Verify network requests in DevTools
- Check backend logs for API errors
