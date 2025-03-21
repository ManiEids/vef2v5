/**
 * Simple API helper that abstracts away complexities of data transformation
 */

// Use our proxy API instead of directly hitting the backend
const useProxy = process.env.NODE_ENV === 'production'; // Use proxy in production to avoid CORS issues
console.log('API mode:', useProxy ? 'Using proxy to avoid CORS' : 'Direct API access');

// Function to determine the right API URL based on environment
export function getApiUrl(endpoint: string): string {
  if (useProxy) {
    // In production, use our proxy API endpoint
    return `/api/proxy?path=${encodeURIComponent(endpoint)}`;
  } else {
    // In development, use the direct API URL
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://vef2v3.onrender.com';
    return `${API_URL}${endpoint}`;
  }
}

// Enhanced logging helper
const logEndpointActivity = (action: string, endpoint: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 🔄 ${action}: ${endpoint}`, data ? data : '');
};

// Unified fetch wrapper with enhanced error handling and detailed logging
async function apiFetch(endpoint: string, options?: RequestInit) {
  const url = getApiUrl(endpoint);
  const method = options?.method || 'GET';
  
  // Log the request details
  logEndpointActivity(`${method} Request`, endpoint);
  
  // Show request body for debugging if present
  if (options?.body) {
    try {
      const bodyData = JSON.parse(options.body as string);
      console.log(`📤 Request Body for ${endpoint}:`, bodyData);
    } catch (e) {
      console.log(`📤 Request Body (non-JSON):`, options.body);
    }
  }
  
  try {
    // Add explicit no-cache headers for mutation operations
    const finalOptions = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        ...options?.headers,
      }
    };
    
    // Show full URL being fetched
    console.log(`🔗 Full URL: ${url} (${useProxy ? 'via proxy' : 'direct'})`);
    
    const response = await fetch(url, finalOptions);
    
    // Log detailed response info
    console.log(`📥 Response from ${endpoint}:`, {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });
    
    // Handle 404 specially
    if (response.status === 404) {
      console.error(`❌ 404 Not Found: ${endpoint}`);
      throw new Error('Resource not found');
    }
    
    // Handle other errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Error Response Text: ${errorText}`);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
        console.error(`❌ Parsed Error Data:`, errorData);
      } catch (e) {
        errorData = { message: errorText || 'Unknown error' };
        console.error(`❌ Failed to parse error as JSON`);
      }
      
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    // For DELETE requests, some APIs don't return content
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      console.log(`✅ Success with no content for ${endpoint}`);
      return { success: true, status: response.status };  // Added status field
    }
    
    // Parse and log successful response
    const responseData = await response.json();
    console.log(`✅ Successful ${method} response data:`, responseData);
    return responseData;
  } catch (error) {
    console.error(`❌ API ERROR for ${endpoint}:`, error);
    
    // Enhanced error logging
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error(`🔥 Network error - possible causes: 
        1. CORS issues (check browser console for CORS errors)
        2. Network connectivity issues
        3. Backend server is down or sleeping
        4. Invalid URL: ${url}
      `);
    }
    
    throw error;
  }
}

// CATEGORIES API
export const categoryApi = {
  // Get all categories
  getAll: () => apiFetch('/categories'),
  
  // Get single category by slug
  getBySlug: (slug: string) => apiFetch(`/categories/${slug}`),
  
  // Create new category - Notice this matches your listed endpoint
  create: (title: string) => apiFetch('/category', {
    method: 'POST',
    body: JSON.stringify({ title })
  }),
  
  // Update existing category
  update: (slug: string, title: string) => apiFetch(`/category/${slug}`, {
    method: 'PATCH',
    body: JSON.stringify({ title })
  }),
  
  // Delete category
  delete: (slug: string) => apiFetch(`/category/${slug}`, {
    method: 'DELETE'
  })
};

// QUESTIONS API
export const questionApi = {
  // Get questions by category
  getByCategory: (slug: string) => apiFetch(`/questions/category/${slug}`),
  
  // Get single question
  getById: (id: string | number) => apiFetch(`/questions/${id}`),
  
  // Create question (using /question not /questions)
  create: (categoryId: number, questionText: string, formAnswers: any[]) => {
    // Transform answers from form format to API format
    const answers = formAnswers.map(a => ({
      answer: a.answer || a.text, // Accept either answer or text field
      correct: a.correct
    }));
    
    const requestData = { 
      question: questionText, 
      categoryId,
      answers
    };
    
    console.log('🔍 Creating question - Request structure:', JSON.stringify(requestData, null, 2));
    
    return apiFetch('/question', { // Endpoint should be /question not /questions
      method: 'POST',
      body: JSON.stringify(requestData)
    });
  },
  
  // Update question - improved version
  update: (id: string | number, questionText: string, categoryId: number, formAnswers: any[]) => {
    // Ensure answers have the correct structure for API
    const answers = formAnswers.map(a => {
      // Base answer object with required fields
      const answer: any = {
        answer: a.text || a.answer, // Accept either text (from form) or answer
        correct: a.correct
      };
      
      // Only include ID for existing answers
      if (a.id !== undefined) {
        answer.id = a.id;
      }
      
      return answer;
    });
    
    const requestData = { 
      question: questionText, 
      categoryId,
      answers
    };
    
    console.log('🔍 Improved updating question request structure:', JSON.stringify(requestData, null, 2));
    
    return apiFetch(`/question/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(requestData),
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  },
  
  // Delete question - improved robustness
  delete: (id: string | number) => {
    console.log(`🗑️ Sending DELETE request for question ID: ${id}`);
    
    return apiFetch(`/question/${id}`, {
      method: 'DELETE',
      // Add explicit cache control headers
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  }
};

// Export a combined API object for simpler imports
export const api = {
  categories: categoryApi,
  questions: questionApi
};
