import { NextRequest, NextResponse } from 'next/server';

// The base URL of your backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://vef2v3.onrender.com';

// Helper function for all request methods with enhanced logging
async function handleProxyRequest(request: NextRequest, method: string) {
  // Get the path parameter from the URL
  const path = request.nextUrl.searchParams.get('path');
  
  if (!path) {
    console.error(`❌ Proxy Error: Missing path parameter`);
    return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
  }

  const fullUrl = `${API_BASE_URL}${path}`;
  console.log(`🔄 Proxying ${method} request to: ${fullUrl}`);
  
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store',
        'Pragma': 'no-cache',
      }
    };

    // Add body for methods that need it and log it
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      const body = await request.json();
      console.log(`📤 Proxy forwarding request body:`, body);
      options.body = JSON.stringify(body);
    }
    
    // Log the complete request details
    console.log(`🔍 Proxy ${method} Request Details:`, {
      url: fullUrl,
      method,
      headers: options.headers,
    });
    
    // Forward the request to the actual API
    const startTime = Date.now();
    const response = await fetch(fullUrl, options);
    const elapsedTime = Date.now() - startTime;
    
    console.log(`📥 Proxy received ${method} response in ${elapsedTime}ms with status: ${response.status}`);
    console.log(`📋 Response headers:`, Object.fromEntries(response.headers.entries()));

    // If response is not ok, log detailed error information
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Server responded with error ${response.status}:`, errorText);
      
      try {
        // Try to parse error response as JSON for structured error
        const errorData = JSON.parse(errorText);
        console.error(`📛 Structured error from server:`, errorData);
        return NextResponse.json(errorData, { status: response.status });
      } catch (e) {
        // If not JSON, return as plain text error
        return NextResponse.json({ 
          error: errorText || `Server responded with status ${response.status}`,
          status: response.status 
        }, { status: response.status });
      }
    }

    // If the response is 204 No Content, return an empty successful response
    if (response.status === 204) {
      console.log(`✅ 204 No Content response from ${path}`);
      return NextResponse.json({ success: true }, { status: 204 });
    }

    // For all other responses, try to parse as JSON, but handle cases where response might not be JSON
    try {
      const responseText = await response.text();
      console.log(`📝 Raw response text (first 200 chars): ${responseText.substring(0, 200)}${responseText.length > 200 ? '...' : ''}`);
      
      try {
        // Try to parse the response as JSON
        const data = JSON.parse(responseText);
        console.log(`✅ Successfully parsed JSON response from ${path}:`, data);
        
        return NextResponse.json(data, { 
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
          }
        });
      } catch (jsonError) {
        console.error(`⚠️ Failed to parse response as JSON:`, jsonError);
        // If response isn't JSON, return the raw text with a success indicator
        return NextResponse.json({ 
          success: response.ok,
          status: response.status,
          statusText: response.statusText,
          rawResponse: responseText
        }, { 
          status: response.status 
        });
      }
    } catch (textError) {
      console.error(`⚠️ Failed to read response text:`, textError);
      return NextResponse.json({ 
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        error: 'Failed to read response' 
      }, { status: response.status });
    }
  } catch (error) {
    console.error(`❌ Proxy error for ${method} ${path}:`, error);
    return NextResponse.json(
      { error: `Failed to ${method.toLowerCase()} data: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return handleProxyRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
  return handleProxyRequest(request, 'POST');
}

export async function PUT(request: NextRequest) {
  return handleProxyRequest(request, 'PUT');
}

export async function PATCH(request: NextRequest) {
  return handleProxyRequest(request, 'PATCH');
}

export async function DELETE(request: NextRequest) {
  return handleProxyRequest(request, 'DELETE');
}
