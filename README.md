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

TestiFlow is a modern, full-stack platform designed to effortlessly collect customer testimonials and display them beautifully on your website. It provides a seamless experience for businesses to gather feedback and build social proof that converts visitors into customers.

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

## 🚀 Demo

> **Note**: Add screenshots or GIF demos here showing the key features in action

### Key Workflows:
1. **Create a Space** → Get a public link
2. **Share the Link** → Customers submit testimonials
3. **Curate Reviews** → Like the best ones
4. **Embed & Display** → Add to your website

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

## 🚀 Getting Started

### 📋 Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Version | Purpose |
|------|---------|---------|
| **Java JDK** | 21+ | Backend development |
| **Node.js** | 18.17+ | Frontend development |
| **npm/yarn** | Latest | Package management |
| **Git** | Latest | Version control |
| **MongoDB** | 5.0+ | Database (local or Atlas) |

### ⚡ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/TestiFlow.git
   cd TestiFlow
   ```

### 🔧 Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Configure environment variables**
   
   Create `src/main/resources/application.properties`:
   ```properties
   # Database Configuration
   spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/testiflow
   
   # JWT Configuration  
   jwt.secret=your-super-secret-jwt-key-at-least-256-bits-long
   jwt.expiration=86400000
   
   # Server Configuration
   server.port=8080
   
   # CORS Configuration (for development)
   app.cors.allowed-origins=http://localhost:3000
   ```

   > 💡 **Tip**: For production, use environment variables instead of hardcoding values.

3. **Build and run the backend**
   ```bash
   # Build the application
   ./mvnw clean package -DskipTests
   
   # Run the application
   ./mvnw spring-boot:run
   ```

   ✅ Backend should be running at `http://localhost:8080`

### 🎨 Frontend Setup

1. **Open a new terminal and navigate to frontend**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   ✅ Frontend should be running at `http://localhost:3000`

### 🎉 You're Ready!

Open [http://localhost:3000](http://localhost:3000) in your browser to see TestiFlow in action!

---

## 🗄️ Database Setup

### Option 1: MongoDB Atlas (Recommended)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace the `spring.data.mongodb.uri` in your configuration

### Option 2: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/testiflow`

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

### Backend Deployment (Render/Railway)

1. **Prepare for deployment**
   ```bash
   # Ensure Dockerfile exists in backend/
   # Set environment variables in your platform
   ```

2. **Environment Variables for Production**
   ```env
   SPRING_DATA_MONGODB_URI=your-mongodb-atlas-connection
   JWT_SECRET=your-production-jwt-secret
   SPRING_PROFILES_ACTIVE=prod
   ```

3. **Deploy to Render**
   - Connect your GitHub repository
   - Set the build command: `cd backend && ./mvnw clean package -DskipTests`
   - Set the start command: `cd backend && java -jar target/*.jar`

### Frontend Deployment (Vercel)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   cd frontend
   vercel
   ```

2. **Environment Variables**
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
   ```

3. **Auto-deploy** is configured for the `main` branch

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build individually
cd backend && docker build -t testiflow-backend .
cd frontend && docker build -t testiflow-frontend .
```

---

## 🛠️ Development

### Code Style & Standards

- **Backend**: Follow Java/Spring Boot conventions
- **Frontend**: ESLint + Prettier configuration included
- **Git**: Conventional commits recommended

### Running Tests

```bash
# Backend tests
cd backend
./mvnw test

# Frontend tests  
cd frontend
npm run test
```

### Development Scripts

```bash
# Frontend development
npm run dev          # Start development server
npm run build        # Build for production  
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Backend development
./mvnw spring-boot:run              # Run with hot reload
./mvnw clean package -DskipTests    # Build without tests
./mvnw test                         # Run tests
```

---

## 🐛 Troubleshooting

### Common Issues

**❌ Backend won't start**
- Check Java version: `java --version` (should be 21+)
- Verify MongoDB connection string
- Check if port 8080 is available

**❌ Frontend build errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18.17+)
- Verify environment variables in `.env.local`

**❌ Database connection issues**
- Whitelist your IP in MongoDB Atlas
- Check network connectivity
- Verify credentials in connection string

**❌ CORS errors**
- Ensure frontend URL is in backend CORS configuration
- Check if both services are running on expected ports

### Getting Help

1. Check the [Issues](https://github.com/your-username/TestiFlow/issues) page
2. Search existing discussions
3. Create a new issue with:
   - Error messages
   - Steps to reproduce
   - Your environment details

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Commit with conventional commits: `git commit -m "feat: add amazing feature"`
6. Push to your branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Contribution Guidelines

- **Code Quality**: Follow existing patterns and conventions
- **Testing**: Add tests for new features
- **Documentation**: Update README and code comments
- **Commits**: Use conventional commit messages

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- ⚡ Performance optimizations
- 🧪 Test coverage improvements

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙋‍♂️ Support

If you like this project, please consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting features
- 🤝 Contributing code

---

## 📬 Contact

- **GitHub**: [@your-username](https://github.com/your-username)
- **Email**: your.email@example.com
- **Twitter**: [@your-handle](https://twitter.com/your-handle)

---

<div align="center">
  <strong>Made with ❤️ for the developer community</strong>
  <br>
  <sub>Built with Java, Spring Boot, Next.js, and lots of ☕</sub>
</div>
