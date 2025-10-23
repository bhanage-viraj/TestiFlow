#!/usr/bin/env node

import fetch from 'node-fetch';

const testApiConnection = async () => {
  const baseUrl = 'http://localhost:8080/api';
  
  console.log('Testing API connection...');
  console.log('Base URL:', baseUrl);
  
  try {
    // Test 1: Check if server is running
    console.log('\n1. Testing server connectivity...');
    const healthResponse = await fetch(`${baseUrl}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Health check status:', healthResponse.status);
    console.log('Health check headers:', Object.fromEntries(healthResponse.headers.entries()));
    
    if (healthResponse.status === 401) {
      console.log('✅ Server is running (401 is expected for unauthenticated request)');
    } else {
      console.log('⚠️  Unexpected status:', healthResponse.status);
    }
    
    // Test 2: Test CORS
    console.log('\n2. Testing CORS...');
    const corsResponse = await fetch(`${baseUrl}/auth/me`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'authorization,content-type',
      }
    });
    
    console.log('CORS preflight status:', corsResponse.status);
    console.log('CORS headers:', Object.fromEntries(corsResponse.headers.entries()));
    
    if (corsResponse.headers.get('access-control-allow-origin')) {
      console.log('✅ CORS is configured');
    } else {
      console.log('❌ CORS might not be properly configured');
    }
    
    // Test 3: Test signup
    console.log('\n3. Testing signup...');
    const signupResponse = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    console.log('Signup status:', signupResponse.status);
    const signupData = await signupResponse.text();
    console.log('Signup response:', signupData);
    
    if (signupResponse.status === 201) {
      console.log('✅ Signup endpoint is working');
    } else if (signupResponse.status === 409) {
      console.log('✅ Signup endpoint is working (user already exists)');
    } else {
      console.log('❌ Signup endpoint issue:', signupResponse.status);
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure the backend is running: cd backend && ./mvnw spring-boot:run');
    console.log('2. Check if port 8080 is available');
    console.log('3. Verify CORS configuration');
  }
};

testApiConnection();
