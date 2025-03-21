'use client';

import React, { useState, useEffect } from 'react';

interface ApiEndpoint {
  name: string;
  path: string;
  method: string;
}

export function ApiDiagnostics() {
  const [visible, setVisible] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<Record<string, {success: boolean, message: string}>>({});
  
  // Define key API endpoints to test
  const endpoints: ApiEndpoint[] = [
    { name: 'Get Categories', path: '/categories', method: 'GET' },
    { name: 'Get Single Category', path: '/categories/html', method: 'GET' },
    { name: 'Get Questions', path: '/questions', method: 'GET' },
  ];

  // Add a log entry
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toISOString()}] ${message}`]);
  };

  // Test an endpoint
  const testEndpoint = async (endpoint: ApiEndpoint) => {
    addLog(`Testing ${endpoint.name} (${endpoint.method} ${endpoint.path})`);
    
    // First try direct API
    try {
      const directUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint.path}`;
      addLog(`Direct API call to: ${directUrl}`);
      
      const directResponse = await fetch(directUrl, { method: endpoint.method });
      if (directResponse.ok) {
        setTestResults(prev => ({
          ...prev,
          [`direct_${endpoint.path}`]: {
            success: true,
            message: `Direct API access successful (${directResponse.status})`
          }
        }));
        addLog(`✅ Direct API call successful: ${directResponse.status}`);
      } else {
        setTestResults(prev => ({
          ...prev,
          [`direct_${endpoint.path}`]: {
            success: false,
            message: `Failed with status ${directResponse.status}`
          }
        }));
        addLog(`❌ Direct API call failed: ${directResponse.status}`);
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [`direct_${endpoint.path}`]: {
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
      addLog(`❌ Direct API call threw an error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    // Then try proxy API
    try {
      const proxyUrl = `/api/proxy?path=${encodeURIComponent(endpoint.path)}`;
      addLog(`Proxy API call to: ${proxyUrl}`);
      
      const proxyResponse = await fetch(proxyUrl, { method: endpoint.method });
      if (proxyResponse.ok) {
        setTestResults(prev => ({
          ...prev,
          [`proxy_${endpoint.path}`]: {
            success: true,
            message: `Proxy API access successful (${proxyResponse.status})`
          }
        }));
        addLog(`✅ Proxy API call successful: ${proxyResponse.status}`);
      } else {
        setTestResults(prev => ({
          ...prev,
          [`proxy_${endpoint.path}`]: {
            success: false,
            message: `Failed with status ${proxyResponse.status}`
          }
        }));
        addLog(`❌ Proxy API call failed: ${proxyResponse.status}`);
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [`proxy_${endpoint.path}`]: {
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
      addLog(`❌ Proxy API call threw an error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Run all tests
  const runAllTests = () => {
    setLogs([]);
    setTestResults({});
    addLog(`API Base URL: ${process.env.NEXT_PUBLIC_API_BASE_URL}`);
    addLog(`Environment: ${process.env.NODE_ENV}`);
    
    endpoints.forEach(endpoint => {
      testEndpoint(endpoint);
    });
  };

  return (
    <div className="fixed bottom-4 left-4 z-10">
      {!visible ? (
        <button 
          onClick={() => setVisible(true)} 
          className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-gray-700"
        >
          API Diagnostics
        </button>
      ) : (
        <div className="bg-gray-800 text-white p-4 rounded shadow-lg w-[500px] max-w-full max-h-[80vh] overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">API Diagnostics</h3>
            <button 
              onClick={() => setVisible(false)} 
              className="text-gray-300 hover:text-white"
            >
              Close
            </button>
          </div>
          
          <button 
            onClick={runAllTests} 
            className="bg-blue-600 text-white px-3 py-1 rounded mb-4 hover:bg-blue-700"
          >
            Run API Tests
          </button>
          
          {Object.keys(testResults).length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Test Results:</h4>
              <div className="space-y-2">
                {Object.entries(testResults).map(([key, result]) => (
                  <div 
                    key={key}
                    className={`p-2 rounded ${result.success ? 'bg-green-900' : 'bg-red-900'}`}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">{result.success ? '✅' : '❌'}</span>
                      <span>{key}: {result.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <h4 className="font-semibold mb-2">Logs:</h4>
            <div className="bg-black text-green-400 p-2 rounded font-mono text-sm h-40 overflow-auto">
              {logs.length > 0 ? logs.map((log, idx) => (
                <div key={idx} className="whitespace-pre-wrap mb-1">
                  {log}
                </div>
              )) : (
                <div className="opacity-50">Run tests to see logs...</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
