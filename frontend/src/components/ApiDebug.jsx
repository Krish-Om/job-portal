import { useState } from 'react';
import axios from 'axios';

export default function ApiDebug() {
  const [endpoint, setEndpoint] = useState('/auth/login');
  const [method, setMethod] = useState('POST');
  const [contentType, setContentType] = useState('json');
  const [payload, setPayload] = useState('{\n  "username": "test",\n  "password": "password"\n}');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      let data;
      let headers = {};
      
      if (contentType === 'json') {
        try {
          data = JSON.parse(payload);
          headers['Content-Type'] = 'application/json';
        } catch (err) {
          setError('Invalid JSON payload');
          setLoading(false);
          return;
        }
      } else if (contentType === 'form') {
        try {
          const jsonData = JSON.parse(payload);
          data = new URLSearchParams();
          for (const key in jsonData) {
            data.append(key, jsonData[key]);
          }
          headers['Content-Type'] = 'application/x-www-form-urlencoded';
        } catch (err) {
          setError('Invalid form data payload');
          setLoading(false);
          return;
        }
      }

      const url = `http://localhost:8000/api${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
      
      let result;
      switch (method) {
        case 'GET':
          result = await axios.get(url, { headers });
          break;
        case 'POST':
          result = await axios.post(url, data, { headers });
          break;
        case 'PUT':
          result = await axios.put(url, data, { headers });
          break;
        case 'DELETE':
          result = await axios.delete(url, { headers, data });
          break;
        default:
          result = await axios.get(url, { headers });
      }

      setResponse({
        status: result.status,
        statusText: result.statusText,
        data: result.data,
        headers: result.headers,
      });
    } catch (err) {
      console.error('API Debug Error:', err);
      setError({
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        headers: err.response?.headers,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md my-8">
      <h2 className="text-xl font-bold mb-4">API Debugger</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="flex space-x-4">
          <div className="w-1/4">
            <label className="block text-sm font-medium mb-1">Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
          
          <div className="w-2/4">
            <label className="block text-sm font-medium mb-1">Endpoint</label>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="/auth/login"
            />
          </div>
          
          <div className="w-1/4">
            <label className="block text-sm font-medium mb-1">Content Type</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="json">JSON</option>
              <option value="form">Form Data</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            {contentType === 'json' ? 'JSON Payload' : 'Form Data (as JSON)'}
          </label>
          <textarea
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            className="w-full p-2 border rounded font-mono text-sm"
            rows={5}
          />
          {contentType === 'form' && (
            <p className="text-xs text-gray-500 mt-1">
              Enter as JSON, will be converted to form data
            </p>
          )}
        </div>
        
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Request'}
        </button>
      </form>
      
      {error && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error</h3>
          <pre className="bg-red-50 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}
      
      {response && (
        <div>
          <h3 className="text-lg font-semibold text-green-600 mb-2">Response</h3>
          <pre className="bg-green-50 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 