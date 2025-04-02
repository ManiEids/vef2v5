import { NextRequest, NextResponse } from 'next/server';

// slóð API bakenda
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://vef2v3.onrender.com';

// Hjálparfall fyrir allar beiðniaðferðir með aukinni skráningu
async function handleProxyRequest(request: NextRequest, method: string) {
  const path = request.nextUrl.searchParams.get('path');
  
  if (!path) {
    console.error(`❌ Proxy Villa: Vantar slóðarbreytu`);
    return NextResponse.json({ error: 'Slóðarbreyta er nauðsynleg' }, { status: 400 });
  }

  const fullUrl = `${API_BASE_URL}${path}`;
  console.log(`🔄 Proxying ${method} beiðni til: ${fullUrl}`);
  
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store',
        'Pragma': 'no-cache',
      }
    };

  
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      const body = await request.json();
      console.log(`📤 Proxy sendir beiðnigögn:`, body);
      options.body = JSON.stringify(body);
    }
    
    console.log(`🔍 Proxy ${method} Beiðniupplýsingar:`, {
      url: fullUrl,
      method,
      headers: options.headers,
    });
    
    const startTime = Date.now();
    const response = await fetch(fullUrl, options);
    const elapsedTime = Date.now() - startTime;
    
    console.log(`📥 Proxy fékk ${method} svar á ${elapsedTime}ms með stöðu: ${response.status}`);
    console.log(`📋 Svarhausar:`, Object.fromEntries(response.headers.entries()));

    // sérstök meðhöndlun fyrir villusvör
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Server svaraði með villu ${response.status}:`, errorText);
      
      try {
        // Ef svarið er JSON, skilaðu því sem JSON
        const errorData = JSON.parse(errorText);
        console.error(`📛 Skipulögð villa frá server:`, errorData);
        return NextResponse.json(errorData, { status: response.status });
      } catch (e) {
        // Ef ekki JSON, skilaðu sem hreinni textavillu
        return NextResponse.json({ 
          error: errorText || `Server svaraði með stöðu ${response.status}`,
          status: response.status 
        }, { status: response.status });
      }
    }

    // Ef svarið er 204 
    if (response.status === 204) {
      console.log(`✅ 204 No Content svar frá ${path}`);
      // Skilað réttu NextResponse með 204 stöðu
      return new NextResponse(null, { 
        status: 204,
        headers: {
          'Content-Type': 'application/json',
        }
      });
    }

    // Fyrir öll önnur svör,  lesa sem JSON
    try {
      const responseText = await response.text();
      console.log(`📝 Hrátt svartexti (fyrstu 200 stafir): ${responseText.substring(0, 200)}${responseText.length > 200 ? '...' : ''}`);
      
      try {
        // Reynda JSON
        const data = JSON.parse(responseText);
        console.log(`✅ Tókst að lesa JSON svar frá ${path}:`, data);
        
        return NextResponse.json(data, { 
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
          }
        });
      } catch (jsonError) {
        console.error(`⚠️ Mistókst að lesa svar sem JSON:`, jsonError);
        // Ef svar er ekki JSON,
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
      console.error(`⚠️ Mistókst að lesa svartexta:`, textError);
      return NextResponse.json({ 
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        error: 'Mistókst að lesa svar' 
      }, { status: response.status });
    }
  } catch (error) {
    console.error(`❌ Proxy villa fyrir ${method} ${path}:`, error);
    return NextResponse.json(
      { error: `Mistókst að ${method.toLowerCase()} gögn: ${error instanceof Error ? error.message : 'Óþekkt villa'}` },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  
  if (!path) {
    return new NextResponse(
      JSON.stringify({ error: 'Path parameter is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`;
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API proxy error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch data from API' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  
  if (!path) {
    return new NextResponse(
      JSON.stringify({ error: 'Path parameter is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`;
  
  try {
    const body = await request.json();
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API proxy error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to send data to API' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PUT(request: NextRequest) {
  return handleProxyRequest(request, 'PUT');
}

export async function PATCH(request: NextRequest) {
  //patch
  const path = request.nextUrl.searchParams.get('path');
  if (!path) {
    console.error(`❌ Proxy Villa: Vantar slóðarbreytu`);
    return NextResponse.json({ error: 'Slóðarbreyta er nauðsynleg' }, { status: 400 });
  }

  const fullUrl = `${API_BASE_URL}${path}`;
  console.log(`🔄 Proxying PATCH beiðni til: ${fullUrl}`);
  
  try {
    // Lesa gögn úr beiðni
    const bodyData = await request.json();
    console.log(`📤 PATCH Gögn fyrir ${path}:`, bodyData);
    
    const options: RequestInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
      body: JSON.stringify(bodyData)
    };
    
    const startTime = Date.now();
    const response = await fetch(fullUrl, options);
    const elapsedTime = Date.now() - startTime;
    
    console.log(`📥 Proxy fékk PATCH svar á ${elapsedTime}ms með stöðu: ${response.status}`);
    console.log(`📋 PATCH Svarhausar:`, Object.fromEntries(response.headers.entries()));

    // fyrir villusvör
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ PATCH villa ${response.status} svar:`, errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json(errorData, { status: response.status });
      } catch (e) {
        return NextResponse.json({ 
          error: errorText || `Server svaraði með stöðu ${response.status}` 
        }, { status: response.status });
      }
    }

    // Meðhöndla önnur svör
    try {
      const responseText = await response.text();
      if (!responseText) {
        return NextResponse.json({ success: true });
      }
      
      const data = JSON.parse(responseText);
      return NextResponse.json(data);
    } catch (e) {
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error(`❌ Proxy villa fyrir PATCH ${path}:`, error);
    return NextResponse.json(
      { error: `Mistókst að uppfæra gögn: ${error instanceof Error ? error.message : 'Óþekkt villa'}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  // Deleta
  const path = request.nextUrl.searchParams.get('path');
  if (!path) {
    console.error(`❌ Proxy Villa: Vantar slóðarbreytu`);
    return NextResponse.json({ error: 'Slóðarbreyta er nauðsynleg' }, { status: 400 });
  }

  const fullUrl = `${API_BASE_URL}${path}`;
  console.log(`🔄 Proxying DELETE beiðni til: ${fullUrl}`);
  
  try {
    const options: RequestInit = {
      method: 'DELETE',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      }
    };
    
    const startTime = Date.now();
    const response = await fetch(fullUrl, options);
    const elapsedTime = Date.now() - startTime;
    
    console.log(`📥 Proxy fékk DELETE svar á ${elapsedTime}ms með stöðu: ${response.status}`);
    
    // Fyrir DELETE aðgerðir,
    if (response.status === 204) {
      console.log(`✅ 204 No Content svar frá ${path} - DELETE tókst`);
      return new NextResponse(JSON.stringify({ success: true }), {
        status: 200, // Skila 200 í stað 204 
        headers: {
          'Content-Type': 'application/json',
        }
      });
    }
    
    // Meðhöndla önnur svör
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Server DELETE villa ${response.status}:`, errorText);
      return NextResponse.json({ 
        error: errorText || `Server svaraði með stöðu ${response.status}`,
        status: response.status 
      }, { status: response.status });
    }
    
    // Reyna að lesa svar ef einhver
    try {
      const responseText = await response.text();
      if (responseText) {
        const data = JSON.parse(responseText);
        return NextResponse.json(data);
      } else {
        return NextResponse.json({ success: true });
      }
    } catch (e) {
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error(`❌ Proxy villa fyrir DELETE ${path}:`, error);
    return NextResponse.json(
      { error: `Mistókst að eyða: ${error instanceof Error ? error.message : 'Óþekkt villa'}` },
      { status: 500 }
    );
  }
}
