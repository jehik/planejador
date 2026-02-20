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

    // Localhost Check: Vercel Functions don't run on standard `npm run dev`
    // Includes standard private IPs for mobile testing: 192.168.x.x, 10.x.x.x, 172.16.x.x
    const isLocalhost = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.startsWith('192.168.') ||
        window.location.hostname.startsWith('10.') ||
        window.location.hostname.startsWith('172.');

    if (isLocalhost) {
        console.warn("Mentor Service: Backend API not available on localhost/LAN (requires 'vercel dev' or deployment). Returning Mock.");
        return getMockResponse();
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
            // If 404, it might mean we are in a preview env where the API isn't set up, or local.
            if (response.status === 404) {
                return getMockResponse();
            }
            throw new Error(`Erro no servidor do Mentor (${response.status})`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Mentor Service Client Error:", error);

        // If explicitly localhost, we can fallback to mock safely on error
        if (isLocalhost) {
            console.warn("Falling back to Mock due to error in Local env.");
            return getMockResponse();
        }

        // In PRODUCTION, do not show "Local Mock". Show a graceful error message.
        return {
            alinhamentoSonho: 0,
            analiseComportamental: "O Mentor está indisponível no momento (Erro no Servidor).",
            fraseMentor: "Verifique a configuração da API na Vercel.",
            ajusteImediato: "Aguarde alguns instantes.",
            acaoMinimaAmanha: "Tente novamente mais tarde.",
            // Debora compatibility
            explicacaoNeurocientifica: "Sistema em manutenção.",
            visualizacaoGuiada: "Respire fundo.",
            fraseProsperidade: "Tudo se resolverá."
        };
    }
};

const getMockResponse = () => {
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
};

