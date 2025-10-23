    // Basic localStorage functions for token management
    // Ensure this runs only on the client-side when accessing localStorage

    const AUTH_TOKEN_KEY = 'authToken';

    export function saveAuthToken(token: string): void {
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
      }
    }

    export function getAuthToken(): string | null {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(AUTH_TOKEN_KEY);
      }
      return null;
    }

    export function clearAuthToken(): void {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
    }
    
