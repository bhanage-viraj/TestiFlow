#!/usr/bin/env node

const http = require('http');

const checkBackend = async () => {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:8080/api/auth/me', (res) => {
      if (res.statusCode === 401) {
        // 401 is expected for unauthenticated requests
        console.log('✅ Backend is running and accessible');
        resolve(true);
      } else {
        console.log(`⚠️  Backend responded with status: ${res.statusCode}`);
        resolve(true);
      }
    });

    req.on('error', (err) => {
      console.log('❌ Backend is not accessible:', err.message);
      console.log('Please ensure the backend is running on port 8080');
      reject(err);
    });

    req.setTimeout(5000, () => {
      console.log('❌ Backend connection timeout');
      reject(new Error('Connection timeout'));
    });
  });
};

checkBackend()
  .then(() => {
    console.log('\n🚀 You can now start the frontend with: npm run dev');
    process.exit(0);
  })
  .catch(() => {
    console.log('\n💡 To start the backend, run: cd backend && ./mvnw spring-boot:run');
    process.exit(1);
  });
