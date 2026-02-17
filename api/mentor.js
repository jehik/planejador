export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { systemPrompt, userPrompt } = req.body;
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Missing API Key' });
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://antigravity.app", // Optional
                "X-Title": "Antigravity Planner", // Optional
            },
            body: JSON.stringify({
                "model": "mistralai/mistral-7b-instruct:free", // Using free/low-cost model as requested or similar
                // Update: The prompt requested "mistral-7b-instruct". OpenRouter ID: "mistralai/mistral-7b-instruct"
                "messages": [
                    { "role": "system", "content": systemPrompt },
                    { "role": "user", "content": userPrompt }
                ],

            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const aiContent = data.choices[0].message.content;
        const jsonResponse = JSON.parse(aiContent);

        res.status(200).json(jsonResponse);

    } catch (error) {
        console.error('OpenRouter Error:', error);
        res.status(500).json({ error: 'Failed to fetch mentor response', details: error.message });
    }
}
