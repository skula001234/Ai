// Made by: https://t.me/Ashlynn_Repository
// Gemini API Made by Ashlynn Repository
// Use this code responsibly and do not abuse the API.

export default {
  async fetch(request, env) {
    try {
      if (request.method === 'OPTIONS') {
        return handleOptions(request);
      }
// Made by: https://t.me/Ashlynn_Repository
      let params;
      if (request.method === 'GET') {
        const url = new URL(request.url);
        params = {
          question: url.searchParams.get('question'),
          imageurl: url.searchParams.get('imageurl'),
          model: url.searchParams.get('model') || 'gemini-2.0-flash-lite'
        };
      } else if (request.method === 'POST') {
        try {
          params = await request.json();
        } catch (e) {
          return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      } else {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
      }

// Made by: https://t.me/Ashlynn_Repository
      if (!params.question) {
        return new Response(JSON.stringify({ error: 'Question is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

// Made by: https://t.me/Ashlynn_Repository
      const gemini = new GeminiAPI();
      const response = await gemini.chat({
        prompt: params.question,
        model: params.model,
        imgUrl: params.imageurl
      });

      return new Response(JSON.stringify(response), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });

    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};

// Made by: https://t.me/Ashlynn_Repository
function handleOptions(request) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
// Made by: https://t.me/Ashlynn_Repository
class GeminiAPI {
  constructor() {
    this.baseUrl = "https://us-central1-infinite-chain-295909.cloudfunctions.net/gemini-proxy-staging-v1";
    this.headers = {
      accept: "*/*",
      "accept-language": "en-IN,en;q=0.9",
      "content-type": "application/json",
      priority: "u=1, i",
      "sec-ch-ua": '"Chromium";v="131", "Not_A Brand";v="24", "Microsoft Edge Simulate";v="131", "Lemur";v="131"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "x-powered-by": "https://api.ashlynn-repo.tech/",
      "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36"
    }; 
  }
// Made by: https://t.me/Ashlynn_Repository
  async getImage(imgUrl) {
    try {
      const response = await fetch(imgUrl);
      const arrayBuffer = await response.arrayBuffer();
      const mimeType = response.headers.get('content-type') || 'application/octet-stream';
      
      return {
        mime_type: mimeType,
        data: arrayBufferToBase64(arrayBuffer)
      };
    } catch (error) {
      console.error("Error fetching image:", error);
      throw error;
    }
  }
// Made by: https://t.me/Ashlynn_Repository
  async chat({ prompt, model = "gemini-2.0-flash-lite", imgUrl }) {
    try {
      const requestData = {
        model: model,
        contents: [{
          parts: [
            ...(imgUrl ? [{ inline_data: await this.getImage(imgUrl) }] : []),
            { text: prompt }
          ]
        }]
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error during chat request:", error);
      throw error;
    }
  }
}

// Made by: https://t.me/Ashlynn_Repository
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
// Made by: https://t.me/Ashlynn_Repository