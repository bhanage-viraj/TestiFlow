# ✨ TestiFlow - Collect & Showcase Testimonials

<div align="center">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=java" alt="Java">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/Spring_Boot-3-green?style=for-the-badge&logo=spring" alt="Spring Boot">
  <img src="https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb" alt="MongoDB">
</div>

<p align="center">
  <strong>Transform scattered reviews into beautiful testimonials that convert</strong>
</p>

<p align="center">
  Tired of juggling Google Forms and scattered reviews for testimonials? TestiFlow offers a streamlined, modern solution for collecting, managing, and showcasing customer feedback that builds trust and drives conversions.
</p>

<div align="center">
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#contributing">Contributing</a>
</div>

---

## 📖 About

TestiFlow is a modern, full-stack platform that transforms how businesses collect and showcase customer testimonials. Say goodbye to scattered Google Forms and manual testimonial management. With TestiFlow, you get a streamlined solution that automatically collects, curates, and displays beautiful testimonials that convert visitors into customers.

### Why TestiFlow?

- **Save Time**: Automate your testimonial collection process
- **Increase Conversions**: Beautiful displays build trust and social proof  
- **Stay Organized**: Manage all testimonials in one central dashboard
- **Easy Integration**: Embed anywhere with simple code snippets
- **Professional Appearance**: Multiple templates that match your brand

## ✨ Features

### 🏢 **Dedicated Spaces**
Create isolated environments for different products or businesses to manage their testimonials separately.

### 🔗 **Unique Public Links** 
Each Space generates a shareable public link for easy customer review submission - no complex forms needed.

### 🔄 **Custom Redirects**
Automatically redirect customers back to your website after they submit a review, maintaining a seamless user experience.

### 📊 **Intuitive Dashboard**
View, manage, and curate all collected testimonials in one centralized, easy-to-use interface.

### ❤️ **Like & Feature System**
Select ("like") the best testimonials you want to showcase and hide the rest.

### 🎨 **Easy Embedding**
Generate simple HTML or React code snippets to embed selected testimonials directly onto your website with multiple beautiful templates.

### 🏆 **Wall of Love**
Showcase your best feedback by creating a dedicated testimonials page with customizable templates.

### 🔐 **Secure Authentication**
User accounts protected by JWT authentication with Spring Security.

### 📱 **Responsive Design**
Beautiful, modern UI that works perfectly on desktop, tablet, and mobile devices.

---

## 🎯 Use Cases

- **SaaS Companies**: Collect and display customer success stories
- **E-commerce**: Showcase product reviews and customer experiences
- **Agencies**: Gather client testimonials for different services
- **Freelancers**: Build credibility with client feedback
- **Startups**: Create social proof to attract investors and customers

---

## 🚀 How to Use TestiFlow

### Step 1: Create Your Space
1. Sign up and log into your TestiFlow dashboard
2. Click "Create New Space" 
3. Name your space (e.g., "Product Reviews", "Client Testimonials")
4. Set a custom redirect URL (optional)

### Step 2: Collect Testimonials
1. Copy your unique public link from the space dashboard
2. Share this link with your customers via:
   - Email campaigns
   - Website buttons/forms
   - Social media
   - QR codes
3. Customers click the link and submit their testimonials directly

### Step 3: Curate Your Best Reviews
1. View all submissions in your dashboard
2. Click the ❤️ (heart) icon on testimonials you want to showcase
3. Liked testimonials become available for embedding
4. Delete spam or inappropriate submissions

### Step 4: Display on Your Website
1. Go to the "Wall of Love" section
2. Choose from multiple beautiful templates:
   - **Grid Layout**: Clean card-based design
   - **Carousel**: Rotating testimonials
   - **List View**: Simple vertical layout
3. Select HTML, React, or Next.js code format
4. Copy the generated code and paste it into your website

### Step 5: Embed Individual Testimonials  
1. Use the embed generator for specific testimonials
2. Perfect for landing pages, product pages, or marketing materials
3. Customize the appearance to match your brand

---

## 💡 Pro Tips

- **Email Integration**: Add your testimonial link to email signatures
- **Social Proof**: Display testimonials on high-traffic pages
- **Regular Updates**: Fresh testimonials improve credibility
- **Mobile Optimization**: All templates are fully responsive
- **SEO Benefits**: Testimonials add valuable user-generated content

---

## �️ Tech Stack

<table>
<tr>
<td>

### Backend
- **Java** 21+
- **Spring Boot** 3.x
- **Spring Security** (JWT)
- **Spring Data MongoDB**
- **MongoDB Atlas**
- **Maven** for dependency management

</td>
<td>

### Frontend
- **Next.js** 14+ (App Router)
- **React** 18+
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Shadcn/UI** components
- **React Hook Form** for forms

</td>
</tr>
<tr>
<td>

### Deployment
- **Backend**: Docker + Render/Railway
- **Frontend**: Vercel (recommended)
- **Database**: MongoDB Atlas
- **CDN**: Vercel Edge Network

</td>
<td>

### Development Tools
- **ESLint** + **Prettier**
- **TypeScript** strict mode
- **Hot reloading** for development
- **Environment-based** configuration

</td>
</tr>
</table>

---

## 📁 Project Structure

```
TestiFlow/
├── 🗂️ backend/                 # Spring Boot API
│   ├── src/main/java/com/       # Java source code
│   │   ├── controller/          # REST API endpoints
│   │   ├── service/             # Business logic
│   │   ├── repository/          # Data access layer
│   │   ├── model/               # Entity models
│   │   ├── config/              # Spring configuration
│   │   └── security/            # JWT & security config
│   ├── src/main/resources/      # Configuration files
│   ├── src/test/                # Unit & integration tests
│   ├── Dockerfile               # Container configuration
│   └── pom.xml                  # Maven dependencies
│
├── 🎨 frontend/                 # Next.js Application  
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   ├── components/          # Reusable UI components
│   │   ├── contexts/            # React contexts
│   │   ├── lib/                 # Utilities & API client
│   │   └── hooks/               # Custom React hooks
│   ├── public/                  # Static assets
│   ├── package.json             # Node dependencies
│   └── next.config.js           # Next.js configuration
│
├── 📋 docs/                     # Documentation
├── 🐳 docker-compose.yml        # Local development setup
├── 📄 .gitignore               # Git ignore rules
└── 📖 README.md                # You are here!
```

---

## 🚀 Quick Setup

### 📋 Prerequisites
- **Java JDK** 21+
- **Node.js** 18.17+
- **MongoDB** (Atlas recommended)

### ⚡ Installation

1. **Clone and setup**
   ```bash
   git clone https://github.com/your-username/TestiFlow.git
   cd TestiFlow
   ```

2. **Backend setup**
   ```bash
   cd backend
   # Configure src/main/resources/application.properties
   ./mvnw spring-boot:run
   # Runs on http://localhost:8080
   ```

3. **Frontend setup**
   ```bash
   cd frontend
   npm install
   # Create .env.local with NEXT_PUBLIC_API_URL=http://localhost:8080/api
   npm run dev
   # Runs on http://localhost:3000
   ```

### 🗄️ Database Setup
- **MongoDB Atlas**: Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
- **Local MongoDB**: Use `mongodb://localhost:27017/testiflow`

---

## 📚 API Documentation

### Authentication Endpoints
```http
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
GET  /api/auth/me          # Get current user
```

### Spaces Management
```http
GET    /api/spaces         # Get user's spaces
POST   /api/spaces         # Create new space
GET    /api/spaces/{id}    # Get specific space
PUT    /api/spaces/{id}    # Update space
DELETE /api/spaces/{id}    # Delete space
```

### Reviews Management
```http
GET    /api/spaces/{id}/reviews        # Get space reviews
POST   /api/spaces/{id}/reviews        # Submit review (public)
PUT    /api/reviews/{id}/like          # Toggle like status
DELETE /api/reviews/{id}               # Delete review
GET    /api/embed/{spaceId}/reviews    # Public embed endpoint
```

> 📖 **Full API Documentation**: Visit `/api/swagger-ui.html` when running the backend for complete interactive documentation.

---

## 🚀 Deployment

### Quick Deployment Options

**Frontend (Vercel)**
- Connect GitHub repo to Vercel
- Set `NEXT_PUBLIC_API_URL` environment variable
- Auto-deploys on push to main

**Backend (Render/Railway)**  
- Connect GitHub repo
- Set MongoDB connection string
- Configure JWT secret

### Docker
```bash
docker-compose up --build
```

---

##  License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 📬 Contact

- **GitHub**: [@your-username](https://github.com/your-username)  
- **Email**: your.email@example.com

---

<div align="center">
  <strong>Made with ❤️ for converting testimonials into customers</strong>
  <br>
  <sub>Built with Java Spring Boot & Next.js</sub>
</div>
