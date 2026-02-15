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
        // This line dynamically switches the brain based on your settings menu
        model: model || 'llama-3.3-70b-versatile',
        messages: [
          { 
            role: "system", 
            content: "You are a versatile AI assistant. Provide clear, plain-text responses. IMPORTANT: Do not use any asterisks (*) or markdown bolding. Use plain text only." 
          },
          ...messages
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Connection Error" });
  }
}
