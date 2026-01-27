export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { messages, apiKey, model } = req.body;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'llama-3.3-70b-versatile',
        messages: [
          { 
            role: "system", 
            content: "You are a helpful and intelligent AI assistant. Provide clear, accurate information on any topic requested. IMPORTANT: Do not use any asterisks (*) or markdown symbols for bolding. Provide plain text responses only." 
          },
          ...messages
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Server Error: Could not connect to Groq" });
  }
}
