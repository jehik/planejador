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

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export const fetchMentorAdvice = async (userType, userQuestion = null) => {
    const store = useAppStore.getState();
    const userData = store.userData || {};
    const tasks = store.tasks || [];

    // Filter tasks for today
    const now = new Date();
    const todayYMD = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const todayTasks = tasks.filter(t => {
        const d = t.scheduledAt instanceof Date ? t.scheduledAt : new Date(t.scheduledAt);
        const taskYMD = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        return taskYMD === todayYMD;
    });

    const completedTasks = todayTasks.filter(t => t.completed).map(t => t.title).join(", ");
    const pendingTasks = todayTasks.filter(t => !t.completed).map(t => t.title).join(", ");

    const water = userData.nutrition?.water || 0;
    const workouts = userData.workouts || [];
    const goals = userData.goals || [];

    const todayData = `
    Água: ${water}ml
    Treinos: ${workouts.length}
    Tarefas Feitas (Hoje): ${completedTasks || 'Nenhuma'}
    Tarefas Pendentes (Hoje): ${pendingTasks || 'Nenhuma'}
    `;

    const goalsList = goals.map(g => g.title).join(", ");

    let promptContent = "";
    let systemPrompt = userType === 'cassio' ? CASSIO_SYSTEM_PROMPT : DEBORA_SYSTEM_PROMPT;

    if (userQuestion) {
        promptContent = `
        O USUÁRIO ESTÁ FALANDO COM VOCÊ AGORA.
        PERGUNTA DO USUÁRIO: "${userQuestion}"
        
        Contexto do Usuário: ${userType === 'cassio' ? 'Cássio (TDAH, empreendedor)' : 'Débora (Autismo sup 2, TDAH, Ellos)'}
        Dados do dia: ${todayData}
        Metas atuais: ${goalsList}
        
        INSTRUÇÃO: Responda a pergunta do usuário considerando o contexto acima. 
        Seja direto, disciplinador e estratégico.
        
        IMPORTANTE: Responda no campo "chatResponse" do JSON. 
        Mantenha os outros campos do relatório vazios ou com resumos breves.
        `;
    } else {
        promptContent = `
        AVALIAÇÃO DIÁRIA PADRÃO.
        Contexto do Usuário: ${userType === 'cassio' ? 'Cássio (TDAH, falta organização, quer empreender)' : 'Débora (Autismo sup 2, TDAH, quer Ellos)'}
        Dados do dia: ${todayData}
        Metas atuais: ${goalsList}
        Avalie:
        1. Alinhamento com metas.
        2. Sabotagem/Regularidade.
        3. Avanço real.
        4. Micro-ajuste.
        Return ONLY valid JSON.
        `;
    }

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: promptContent }
                ],
                temperature: 0.7,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) throw new Error(`Erro Groq API: ${response.status}`);

        const data = await response.json();
        const content = JSON.parse(data.choices[0].message.content);
        return content;

    } catch (error) {
        console.error("Mentor Service Error:", error);
        return {
            alinhamentoSonho: 0,
            analiseComportamental: "O Mentor está processando novos dados.",
            fraseMentor: "Continue focado no seu propósito hoje.",
            chatResponse: "Desculpe, tive um problema na conexão, mas sigo acompanhando seus dados.",
            ajusteImediato: "Mantenha a rotina planejada.",
            acaoMinimaAmanha: "Revisar metas ao acordar.",
            explicacaoNeurocientifica: "Estabilidade necessária.",
            visualizacaoGuiada: "Respire e visualize o sucesso.",
            fraseProsperidade: "A abundância flui através da disciplina."
        };
    }
};

const getMockResponse = () => {
    return {
        alinhamentoSonho: 100,
        analiseComportamental: "MODO LOCAL (MOCK): A IA via Backend só funciona no ambiente Groq configurado.",
        padraoDetectado: "Teste Local Detectado",
        ajusteImediato: "Configure sua chave Groq.",
        acaoMinimaAmanha: "Finalizar integração.",
        alertaDisciplina: "Ambiente de Desenvolvimento",
        fraseMentor: "Sigo observando seu progresso.",
        explicacaoNeurocientifica: "Simulação local.",
        visualizacaoGuiada: "Imagine o sistema funcionando perfeitamente.",
        fraseProsperidade: "O sucesso é inevitável."
    };
};

