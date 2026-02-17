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

    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://antigravity.local",
                "X-Title": "Antigravity Planner Local",
            },
            body: JSON.stringify({
                "model": "mistralai/mistral-7b-instruct:free",
                "messages": [
                    { "role": "system", "content": systemPrompt },
                    { "role": "user", "content": userPrompt }
                ],
                "response_format": { "type": "json_object" }
            })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`API Error: ${err}`);
        }

        const data = await response.json();
        let content = data.choices[0].message.content;

        // Sanitize: ensure only JSON is parsed if there's extra text (common with smaller models)
        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
            content = content.substring(jsonStart, jsonEnd + 1);
        }

        try {
            return JSON.parse(content);
        } catch (e) {
            console.error("JSON Parse Error", content);
            throw new Error("Invalid JSON response from Mentor");
        }

    } catch (error) {
        console.error("Mentor Service Error:", error);
        return null;
    }
};
