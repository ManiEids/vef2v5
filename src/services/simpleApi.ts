/**
 * Simple API helper that abstracts away complexities of data transformation
 */

// Use our proxy API instead of directly hitting the backend
const useProxy = process.env.NODE_ENV === 'production'; // Use proxy in production to avoid CORS issues
console.log('API mode:', useProxy ? 'Using proxy to avoid CORS' : 'Direct API access');

// F: Hjálparfall til að fá rétta vefslóð fyrir API
export function getApiUrl(endpoint: string): string {
  // For production, use our API proxy
  if (process.env.NODE_ENV === 'production') {
    // Remove leading slash if present for consistency
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `/api/proxy?path=${path}`;
  }
  
  // For development, use the direct API URL
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${path}`;
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
      console.error(`❌ 404 Fannst ekki: ${endpoint}`);
      throw new Error('Auðlind fannst ekki');
    }
    
    // Handle other errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Villa í svari: ${errorText}`);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
        console.error(`❌ Villa gögn:`, errorData);
      } catch (e) {
        errorData = { message: errorText || 'Óþekkt villa' };
        console.error(`❌ Gat ekki túlkað villu sem JSON`);
      }
      
      throw new Error(errorData.message || `API villa: ${response.status}`);
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
    console.error(`❌ API VILLA fyrir ${endpoint}:`, error);
    
    // Enhanced error logging
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error(`🔥 Netvilla - mögulegar orsakir: 
        1. CORS vandamál (athugaðu vafrann fyrir CORS villur)
        2. Nettengingarvandamál
        3. Bakendaþjónn niðri eða í svefni
        4. Ógild slóð: ${url}
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
  
  // Update question - simplify to focus on reliability
  update: async (id: number | string, text: string, categoryId: number, answers: any[]): Promise<any> => {
    console.log(`📝 Updating question ${id} with data:`, { text, categoryId, answers });
    
    // Format answers for the backend
    const formattedAnswers = answers.map(answer => ({
      answer: answer.text, // Map text field to answer as expected by backend
      correct: answer.correct
    }));
    
    // Construct payload to match backend expectations
    const payload = {
      question: text,  // Use 'question' as the field name, not 'text'
      categoryId,
      answers: formattedAnswers
    };
    
    console.log(`🚀 Sending payload to backend:`, payload);
    
    const path = `/question/${id}`;
    return apiFetch(path, { 
      method: 'PATCH', 
      body: JSON.stringify(payload) 
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
