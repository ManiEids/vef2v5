import { NextRequest, NextResponse } from 'next/server';

// The base URL of your backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://vef2v3.onrender.com';

export async function GET(request: NextRequest) {
  // Get the path parameter from the URL
  const path = request.nextUrl.searchParams.get('path');
  
  if (!path) {
    return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
  }

  console.log(`Proxying GET request to: ${API_BASE_URL}${path}`);
  
  try {
    // Forward the request to the actual API
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Get the response data
    const data = await response.json();
    
    console.log(`Proxy received response with status: ${response.status}`);
    
    // Return the response from our API
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`Proxy error for ${path}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch data from API' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path');
  
  if (!path) {
    return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    console.log(`Proxying POST request to: ${API_BASE_URL}${path}`, { body });
    
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log(`Proxy received POST response with status: ${response.status}`);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`Proxy error for POST ${path}:`, error);
    return NextResponse.json(
      { error: 'Failed to send data to API' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path');
  
  if (!path) {
    return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    console.log(`Proxying PATCH request to: ${API_BASE_URL}${path}`, { body });
    
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log(`Proxy received PATCH response with status: ${response.status}`);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`Proxy error for PATCH ${path}:`, error);
    return NextResponse.json(
      { error: 'Failed to update data in API' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path');
  
  if (!path) {
    return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
  }

  console.log(`Proxying DELETE request to: ${API_BASE_URL}${path}`);
  
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // For DELETE, we might not always have a JSON response
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { success: response.ok };
    }
    
    console.log(`Proxy received DELETE response with status: ${response.status}`);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`Proxy error for DELETE ${path}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete data from API' },
      { status: 500 }
    );
  }
}
