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
        Return JSON format.
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
        Return JSON format.
        `;
    }

    console.log("Mentor Service: Calling secure backend /api/mentor");

    // Localhost Check: Vercel Functions don't run on standard `npm run dev`
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.warn("Mentor Service: Backend API not available on localhost (requires 'vercel dev' or deployment). Returning Mock.");
        return {
            alinhamentoSonho: 100,
            analiseComportamental: "MODO LOCAL (MOCK): A IA via Backend só funciona no ambiente Vercel (Deploy).",
            padraoDetectado: "Teste Local Detectado",
            ajusteImediato: "Faça o deploy para testar a inteligência real.",
            acaoMinimaAmanha: "Testar na URL da Vercel.",
            alertaDisciplina: "Ambiente de Desenvolvimento",
            fraseMentor: "Acesse o site publicado para falar comigo de verdade.",
            // Debora compatibility
            explicacaoNeurocientifica: "Simulação local.",
            visualizacaoGuiada: "Imagine o sistema funcionando na nuvem.",
            fraseProsperidade: "O deploy é o caminho."
        };
    }

    try {
        // Calls the Vercel Serverless Function
        // This keeps the API KEY hidden in the backend
        const response = await fetch("/api/mentor", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userPrompt,
                systemPrompt
            })
        });

        if (!response.ok) {
            console.error("Mentor Backend Error Status:", response.status);
            throw new Error(`Erro no servidor do Mentor (${response.status})`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Mentor Service Client Error:", error);

        // Client-side fallback if network totally fails
        return {
            alinhamentoSonho: 0,
            analiseComportamental: "Erro de conexão com o Mentor (Network Error).",
            fraseMentor: "Verifique sua internet e tente novamente.",
            ajusteImediato: "Foco no básico.",
            acaoMinimaAmanha: "Tentar novamente mais tarde."
        };
    }
};
