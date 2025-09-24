// Environment configuration
const getApiUrl = () => {
  // Check for explicit API URL override
  if (import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // For mobile testing, try to use the current host
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    
    // If not localhost, use the current host with port 5000
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      // For mobile devices, ensure we're using the correct protocol
      const isHttps = protocol === 'https:';
      const port = isHttps ? '' : ':5000'; // No port for HTTPS, 5000 for HTTP
      return `${protocol}//${hostname}${port}`;
    }
  }
  
  return 'http://localhost:5000';
};

export const API_URL = getApiUrl();
export const GOOGLE_CLIENT_ID = import.meta.env?.VITE_GOOGLE_CLIENT_ID || '';