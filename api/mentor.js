export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { systemPrompt, userPrompt } = req.body;

    // SECURE: Server-side only key. Never exposed to frontend.
    // Ensure HUGGINGFACE_API_KEY is set in Vercel Environment Variables.
    const apiKey = process.env.HUGGINGFACE_API_KEY;

    if (!apiKey) {
        console.error("CRITICAL: HUGGINGFACE_API_KEY is missing in Vercel env!");
        return res.status(500).json({ error: 'Server misconfiguration: Missing API Key' });
    }

    const MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.3";
    const API_URL = `https://api-inference.huggingface.co/models/${MODEL_ID}`;

    try {
        // Engineering the prompt to force JSON response
        // Concatenating system and user prompt clearly
        const fullPrompt = `<s>[INST] ${systemPrompt}
        
        CONTEXTO DO USUÁRIO:
        ${userPrompt}

        INSTRUÇÃO OBRIGATÓRIA:
        Responda APENAS com um JSON válido seguindo exatamente o formato solicitado.
        NÃO escreva introduções. NÃO escreva explicações. APENAS O JSON.
        [/INST]`;

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "x-use-cache": "false"
            },
            body: JSON.stringify({
                inputs: fullPrompt,
                parameters: {
                    max_new_tokens: 1000, // Sufficient for analysis
                    temperature: 0.7,     // Moderate creativity
                    return_full_text: false // We only want the generated answer
                }
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error(`HF API Error (${response.status}):`, errText);
            throw new Error(`Hugging Face API Error: ${response.status}`);
        }

        const result = await response.json();

        // Hugging Face Inference API returns an array: [{ generated_text: "..." }]
        let aiContent = "";
        if (Array.isArray(result) && result.length > 0) {
            aiContent = result[0].generated_text;
        } else if (result.generated_text) {
            aiContent = result.generated_text;
        } else {
            throw new Error("Formato de resposta inesperado da Hugging Face.");
        }

        // Sanitization: Extract JSON from potential markdown or extra text
        const jsonStart = aiContent.indexOf('{');
        const jsonEnd = aiContent.lastIndexOf('}');

        if (jsonStart !== -1 && jsonEnd !== -1) {
            aiContent = aiContent.substring(jsonStart, jsonEnd + 1);
        } else {
            console.error("Failed to find JSON in response:", aiContent);
            throw new Error("IA não retornou um JSON válido.");
        }

        const jsonResponse = JSON.parse(aiContent);

        res.status(200).json(jsonResponse);

    } catch (error) {
        console.error('Mentor Backend Error:', error);

        // Fallback response structure (Graceful Degradation)
        // Returns a safe JSON to prevent frontend crash
        const fallback = {
            alinhamentoSonho: 50,
            analiseComportamental: "O sistema de IA está em manutenção momentânea (HF).",
            padraoDetectado: "Indisponível",
            ajusteImediato: "Mantenha o foco nas metas básicas.",
            acaoMinimaAmanha: "Revisar prioridades.",
            alertaDisciplina: "Atenção técnica.",
            fraseMentor: "A tecnologia falha, sua vontade não.",
            // Extra fields for Debora to ensure compatibility
            explicacaoNeurocientifica: "Sistema em manutenção.",
            visualizacaoGuiada: "Respire fundo e foca.",
            fraseProsperidade: "Amanhã será melhor."
        };

        res.status(200).json(fallback); // Return 200 with fallback to avoid UI error screens
    }
}
