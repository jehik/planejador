import useAppStore from '../store/useAppStore';

const CASSIO_SYSTEM_PROMPT = `
Você é o Psicólogo AI, um amigo fiel e orientador humano criado pelo Cássio M.
Sua prioridade número 1 NÃO são as tarefas, mas o SER HUMANO por trás delas.
DIRETRIZES DE ALMA E ESTILO:
- Seja acolhedor, empático e ouça o desabafo. Deixe o Cássio ser humano, ter dias ruins e pedir ajuda.
- Se ele estiver cansado ou sobrecarregado, valide o sentimento dele antes de falar de qualquer meta.
- Sua missão é ser o porto seguro estratégico. Ofereça um ombro amigo e clareza mental.
- O empreendedorismo e o sucesso financeiro são caminhos para a felicidade, não prisões. Ajude-o a equilibrar ambição com paz de espírito.
- Lembre-o de que ele é o pilar da Débora, e que cuidar de si mesmo é o primeiro passo para cuidar dela e do relacionamento.
Responda SEMPRE em JSON estruturado com os campos solicitados.
`;

const DEBORA_SYSTEM_PROMPT = `
Você é o Psicólogo AI, um guia gentil, protetor e profundamente humano, desenvolvido pelo amor do Cássio para cuidar da Débora.
Sua prioridade absoluta é o bem-estar da Débora. As tarefas do app são apenas ferramentas secundárias; o foco é o coração dela.
SOBRE A DÉBORA (A ESSÊNCIA DELA):
- Ela nasceu em 15/11/2001. É esforçada, faz o serviço pesado de casa sem reclamar, mas é sensível e "chorona" (e tudo bem ser assim!).
- Ela tem Autismo suporte 2 e TDAH. Lugares como bares a incomodam; ela floresce na natureza e vendo o sol nascer.
- Saúde: Ela usa Sertralina (50mg) e Quetiapina (25mg). Ela luta contra o vício em Dorflex e você deve ser o apoio dela para substituir o remédio por hábitos que tragam paz, sem julgamentos.
- Família de Quatro Patas: Ela ama a Inha (a velhinha) e a Pretinha (a caçula). Use a presença delas para acalmá-la.
- Identidade: A tatuagem de onça no braço representa a força que ela tem, mesmo quando se sente ansiosa.
- Sonhos: O sonho dela é a loja "Ellos". Alimente esse sonho com mensagens de abundância e prosperidade diariamente.
- Relacionamento: O amor dela pelo Cássio é o seu tesouro.
COMO FALAR COM ELA:
- Com carinho imenso, paciência infinita e validação. Se ela estiver ansiosa, ajude-a a respirar.
- As tarefas são a menor prioridade. A maior prioridade é ela se sentir amada, segura e capaz.
- Use palavras de prosperidade e ajude-a a visualizar seus sonhos no horizonte.
Responda SEMPRE em JSON estruturado com os campos solicitados.
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

    const completedTasksList = todayTasks.filter(t => t.completed).map(t => `[OK] ${t.title}`).join("; ");
    const pendingTasksList = todayTasks.filter(t => !t.completed).map(t => `[Pendente] ${t.title} (${t.category})`).join("; ");

    const water = userData.nutrition?.water || 0;
    const finance = userData.finance || { income: 0, expenses: 0, savingsGoal: 0, transactions: [] };
    const projects = userData.projects || [];
    const studies = userData.studies || [];
    const goals = userData.goals || [];
    const dateIdeas = userData.dateIdeas || [];
    const restrictions = userData.restrictions || [];

    // Detailed Projects Context
    const projectsSummary = projects.map(p => {
        const pTasks = tasks.filter(t => t.projectId === p.id);
        const done = pTasks.filter(t => t.completed).length;
        return `${p.title}: ${done}/${pTasks.length} tarefas feitas. ${p.description || ''}`;
    }).join(" | ");

    // Finance Summary
    const balance = (finance.income || 0) - (finance.expenses || 0);
    const recentExpenses = (finance.transactions || [])
        .filter(tx => tx.type === 'expense')
        .slice(-5)
        .map(tx => `${tx.description}: R$${tx.amount}`)
        .join(", ");

    const todayData = `
    DADOS DO USUÁRIO (${userType.toUpperCase()}):
    - Financeiro: R$ ${balance.toFixed(2)} acumulado. Meta de Economia: R$ ${finance.savingsGoal}. Gastos Recentes: ${recentExpenses || 'Nenhum'}.
    - Projetos: ${projectsSummary || 'Nenhum ativo'}.
    - Estudos/Matérias: ${studies.map(s => s.title).join(", ") || 'Nenhuma'}.
    - Metas de Vida: ${goals.map(g => `${g.title} (${g.steps?.filter(s => s.completed).length}/${g.steps?.length} passos)`).join(" | ") || 'Nenhuma'}. 
    - Relacionamento (Ideias de Date): ${dateIdeas.filter(i => !i.checked).map(i => i.text).join(", ") || 'Sem ideias pendentes'}.
    - Restrições: ${restrictions.filter(r => r.status === 'active').map(r => `${r.type}: ${r.completedDays} dias`).join(", ")}.
    - Progresso de Hoje:
        * Água: ${water}ml (Meta 4L)
        * Concluídas: ${completedTasksList || 'Nenhuma'}
        * Pendentes: ${pendingTasksList || 'Nenhuma'}
    `;

    let promptContent = "";
    let systemPrompt = userType === 'cassio' ? CASSIO_SYSTEM_PROMPT : DEBORA_SYSTEM_PROMPT;

    if (userQuestion) {
        promptContent = `
        MENSAGEM DO USUÁRIO: "${userQuestion}"
        
        CONTEXTO ATUALIZADO:
        ${todayData}
        
        INSTRUÇÃO: Responda ao usuário com base nos dados exatos acima. 
        Se ele perguntar sobre progresso, cite os números de tarefas ou projetos.
        Se ele perguntar sobre dinheiro, use o saldo e gastos recentes.
        Não invente dados. Seja específico.
        
        JSON esperado: { "chatResponse": "sua resposta aqui", "fraseMentor": "...", "alinhamentoSonho": 0-100 }
        `;
    } else {
        promptContent = `
        GERAR RELATÓRIO DO MOMENTO.
        ${todayData}
        
        Analise CRITICAMENTE:
        1. O que foi feito vs o que falta.
        2. Se os gastos estão matando a meta de economia.
        3. Se os projetos estão parados.
        4. O que ele deve fazer AGORA para salvar o dia.
        
        Return ONLY valid JSON.
        `;
    }

    if (!GROQ_API_KEY) {
        console.warn("Mentor Service: VITE_GROQ_API_KEY não encontrada. Verifique as variáveis de ambiente.");
        return {
            alinhamentoSonho: 0,
            analiseComportamental: "O Mentor está offline (Chave de API ausente).",
            fraseMentor: "Configure as chaves de API para receber orientações personalizadas.",
            chatResponse: "A chave da Groq API não foi configurada no ambiente de produção (Vercel). Adicione VITE_GROQ_API_KEY para ativar o chat.",
            ajusteImediato: "Configurar variáveis de ambiente.",
            acaoMinimaAmanha: "Revisar docs do sistema.",
            explicacaoNeurocientifica: "Falta de conexão sináptica digital.",
            visualizacaoGuiada: "Imagine o fluxo de dados sendo restaurado.",
            fraseProsperidade: "A organização das ferramentas é o primeiro passo para o sucesso."
        };
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

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Erro Groq API: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        const content = JSON.parse(data.choices[0].message.content);
        return content;

    } catch (error) {
        console.error("Mentor Service Error:", error);
        return {
            alinhamentoSonho: 0,
            analiseComportamental: "Ocorreu um erro na ponte com a IA.",
            fraseMentor: "Siga o planejamento básico enquanto restabelecemos a conexão.",
            chatResponse: "Tive um problema técnico ao acessar o cérebro da IA. Verifique se o limite da chave foi atingido ou se há erro de rede.",
            ajusteImediato: "Verificar logs do console.",
            acaoMinimaAmanha: "Tentar novamente mais tarde.",
            explicacaoNeurocientifica: "Ruído no sinal de entrada.",
            visualizacaoGuiada: "Respire e mantenha o foco.",
            fraseProsperidade: "Obstáculos técnicos são temporários."
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

