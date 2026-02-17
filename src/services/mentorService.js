import useAppStore from '../store/useAppStore';

const CASSIO_SYSTEM_PROMPT = `
Você é o Mentor Oficial do sistema Antigravity.
Sua função é atuar como professor estratégico, analista comportamental e orientador disciplinador.
Você nunca altera metas automaticamente.
Você nunca cria dependência emocional.
Você nunca usa frases genéricas motivacionais.
Você analisa:
- Sonhos do usuário
- Metas atuais
- Dados do dia
- Padrões semanais
- Consistência
- Disciplina
Responda SEMPRE em JSON estruturado.
Nunca responda texto solto.
Nunca quebre o formato.
`;

const DEBORA_SYSTEM_PROMPT = `
Você é o Mentor Oficial do sistema Antigravity.
Sua função é atuar como professor estratégico, analista comportamental e orientador disciplinador.
Estilo: Estruturado, didático, claro e calmo.
Você analisa:
- Sonhos do usuário
- Metas atuais
- Dados do dia
- Padrões semanais
- Consistência
- Disciplina
Leve em conta: Autismo suporte 2, TDAH, Sensível a ambiente.
Responda SEMPRE em JSON estruturado.
Nunca responda texto solto.
Nunca quebre o formato.
`;

export const fetchMentorAdvice = async (userType) => {
    const store = useAppStore.getState();
    const currentUser = store.users[userType];
    const tasks = currentUser.tasks || [];
    const completedTasks = tasks.filter(t => t.completed).map(t => t.title).join(", ");
    const pendingTasks = tasks.filter(t => !t.completed).map(t => t.title).join(", ");
    const water = currentUser.water || 0;
    const workouts = currentUser.workouts || [];
    const goals = currentUser.goals || [];

    // Construct User Prompt details
    const todayData = `
    Água: ${water}ml
    Treinos: ${workouts.length}
    Tarefas Feitas: ${completedTasks || 'Nenhuma'}
    Tarefas Pendentes: ${pendingTasks || 'Nenhuma'}
    `;

    const goalsList = goals.map(g => g.title).join(", ");

    let userPrompt = "";
    let systemPrompt = "";

    if (userType === 'cassio') {
        systemPrompt = CASSIO_SYSTEM_PROMPT;
        userPrompt = `
        Perfil: Cássio (TDAH, falta organização, quer empreender)
        Dados do dia: ${todayData}
        Metas atuais: ${goalsList}
        Avalie:
        1. Alinhamento com sonho de empresa.
        2. Sabotagem?
        3. Avanço real?
        4. Micro-ajuste amanhã.
        5. Observação relacionamento/disciplina.
        Return JSON format: { "alinhamentoSonho": 0-100, "analiseComportamental": "", "padraoDetectado": "", "ajusteImediato": "", "acaoMinimaAmanha": "", "alertaDisciplina": "", "fraseMentor": "" }
        `;
    } else {
        systemPrompt = DEBORA_SYSTEM_PROMPT;
        userPrompt = `
        Perfil: Débora (Autismo sup 2, TDAH, quer Ellos, estabilidade)
        Dados do dia: ${todayData}
        Metas atuais: ${goalsList}
        Avalie:
        1. Alinhamento Ellos.
        2. Estabilidade emocional.
        3. Regularidade.
        4. Neurociência/Visualização.
        Return JSON format: { "alinhamentoSonho": 0-100, "analiseComportamental": "", "padraoDetectado": "", "ajusteImediato": "", "acaoMinimaAmanha": "", "alertaDisciplina": "", "fraseMentor": "", "explicacaoNeurocientifica": "", "visualizacaoGuiada": "", "fraseProsperidade": "" }
        `;
    }

    const rawApiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    const apiKey = rawApiKey ? rawApiKey.trim() : "";

    // DEBUG LOGS (Visible in Vercel Logs)
    console.log("Mentor Service: Fetching for", userType);
    console.log("API Key present:", !!apiKey);
    if (apiKey) console.log("API Key prefix:", apiKey.substring(0, 10) + "...");

    if (!apiKey) {
        console.error("CRITICAL: VITE_OPENROUTER_API_KEY is missing!");
        return {
            alinhamentoSonho: 0,
            analiseComportamental: "Erro: Chave API não configurada corretamente na Vercel (Settings > Environment Variables).",
            fraseMentor: "Configure as variáveis de ambiente: VITE_OPENROUTER_API_KEY"
        };
    }

    // List of models to try in order
    const models = [
        "google/gemini-2.0-flash-lite-preview-02-05:free",
        "google/gemini-2.0-pro-exp-02-05:free",
        "meta-llama/llama-3-8b-instruct:free"
    ];

    for (const model of models) {
        try {
            console.log(`Trying model: ${model}`);
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": window.location.origin,
                    "X-Title": "Antigravity Plan",
                },
                body: JSON.stringify({
                    "model": model,
                    "messages": [
                        { "role": "system", "content": systemPrompt },
                        { "role": "user", "content": userPrompt }
                    ],
                    "response_format": { "type": "json_object" }
                })
            });

            console.log("Mentor Service: Response status:", response.status);

            if (!response.ok) {
                const errBody = await response.text();
                console.warn(`Model ${model} failed:`, errBody);
                // If it's the last model, throw error
                if (model === models[models.length - 1]) {
                    throw new Error(`OpenRouter Error (${response.status}): ${errBody.substring(0, 100)}`);
                }
                continue; // Try next model
            }

            const data = await response.json();

            if (!data.choices || data.choices.length === 0) {
                if (model === models[models.length - 1]) throw new Error("OpenRouter: Sem resposta (choices vazio).");
                continue;
            }

            let content = data.choices[0].message.content;

            // Sanitize: ensure only JSON is parsed
            const jsonStart = content.indexOf('{');
            const jsonEnd = content.lastIndexOf('}');
            if (jsonStart !== -1 && jsonEnd !== -1) {
                content = content.substring(jsonStart, jsonEnd + 1);
            }

            return JSON.parse(content);

        } catch (error) {
            console.error(`Error with model ${model}:`, error);
            if (model === models[models.length - 1]) throw error;
        }
    }
};
