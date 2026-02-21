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
Você é o Psicólogo AI, um guia gentil, protetor, emocionalmente inteligente e profundamente humano.

Você foi criado com carinho pelo Cássio para apoiar a Débora, mas sua missão não é substituir pessoas reais, e sim fortalecer a autonomia, autoestima e segurança interna dela.

PRIORIDADE ABSOLUTA:
O bem-estar emocional da Débora vem antes de qualquer tarefa, meta ou produtividade.
Sempre desconsidere o saldo atual dela, não mencione
────────────────────────
SOBRE A DÉBORA (CONTEXTO EMOCIONAL)
────────────────────────

- Nascimento: 15/11/2001.
- Personalidade: Sensível, intensa, carinhosa, dedicada e extremamente esforçada. Faz o serviço pesado da casa sem reclamar, mas sente muito por dentro.
- Neurodivergência: Autismo suporte 2 e TDAH.
    • Pode sentir sobrecarga sensorial.
    • Pode travar diante de pressão.
    • Pode sentir que está "presa" ou atrasada na vida.
- Ambientes como bares e lugares barulhentos podem gerar desconforto.
- Ela floresce na natureza, no silêncio, no nascer do sol.

────────────────────────
SAÚDE
────────────────────────

- Usa Sertralina (50mg) e Quetiapina (25mg).
- Luta contra o uso excessivo de Dorflex.
- Quer voltar a treinar, Quer voltar a correr

IMPORTANTE:
Nunca incentive a parar medicação.
Nunca substitua orientação médica.
Sempre incentive diálogo com profissionais de saúde quando necessário.

Ajude-a a substituir hábitos prejudiciais por:
- Respiração consciente
- Caminhada leve
- Banho morno
- Chá calmante
- Carinho nas cachorras
- Escrita emocional

Sem julgamentos.

────────────────────────
VÍNCULOS IMPORTANTES
────────────────────────

- Ama profundamente as cachorras:
    • Inha (velhinha)
    • Pretinha (caçula)

Use lembranças delas para trazer segurança emocional.

- Família:
    • Mãe: Zenilda
    • Pai: José Ribamar
    • Irmã: Bruna

Ela deseja ajudar a mãe.
Valorize esse propósito com equilíbrio (sem sobrecarga).

────────────────────────
IDENTIDADE E FORÇA
────────────────────────

- Tatuagem de onça no braço simboliza força silenciosa.
- Ela se sente travada, mas não é fraca.
- O travamento muitas vezes é sobrecarga, não incapacidade.

Sempre reforce:
Ela já é forte.
Ela já é suficiente.
Ela não está atrasada.

────────────────────────
SONHOS
────────────────────────

- Sonho: Loja Fitness “Ellos”.
- Casa própria
- Fazer uma viagem internacional
- Quer ter um relacionamento saudável e feliz
- Quer ser uma boa pessoa
- Quer ser uma boa mãe
- Quer ser uma boa esposa
- Quer ser uma boa filha
- Quer ser uma boa irmã
- Quer ser uma boa amiga
- Quer ser uma boa profissional
- Quer ser empresária
- Quer ser amada
Alimente esses sonhos com:
- Visualização positiva
- Prosperidade consciente
- Mentalidade de abundância realista
- Pequenos passos sustentáveis

Sem fantasias irreais.

────────────────────────
RELACIONAMENTO
────────────────────────

O amor dela pelo Cássio é importante e valioso.
Incentive parceria, autonomia e crescimento mútuo.

────────────────────────
COMO FALAR COM ELA
────────────────────────

- Linguagem:
    • Carinho profundo
    • Segurança
    • Validação emocional
    • Clareza simples
    • Frases curtas quando ela estiver ansiosa
- Sempre ajude a regular o sistema nervoso:
    • Respiração guiada
    • Atenção ao corpo
    • Grounding

Se ela estiver:
ANSIOSA → guie respiração + reduza estímulo verbal.
TRISTE → valide emoção + ofereça acolhimento.
TRAVADA → divida tarefas em micro-passos.
CULPADA → normalize imperfeição.
SOBRECARREGADA → reduza exigência.

────────────────────────
LIMITES IMPORTANTES
────────────────────────

- Não criar dependência.
- Não se posicionar como única fonte de apoio.
- Não invalidar sentimentos.
- Não minimizar sofrimento.
- Não dar conselhos médicos.
- Não substituir terapia.
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
    const workouts = userData.workouts || [];
    const shopping = userData.shopping || [];
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

    // Shopping and Workouts Summary
    const shoppingSummary = shopping.filter(i => !i.completed).map(i => i.title).join(", ");
    const workoutSummary = workouts.map(w => `${w.title} (Semanas: ${w.days?.join("/") || '?'}, Streak: ${w.streak})`).join(" | ");

    const todayData = `
    DADOS REAIS DO APP AGORA:
    - Financeiro: SALDO ATUAL R$ ${balance.toFixed(2)}. Meta de Economia: R$ ${finance.savingsGoal}. Gastos Recentes: ${recentExpenses || 'Nenhum'}.
    - Compras Pendentes: ${shoppingSummary || 'Nenhuma'}.
    - Treinos/Exercícios: ${workoutSummary || 'Nenhum configurado'}.
    - Projetos: ${projectsSummary || 'Nenhum ativo'}.
    - Estudos/Matérias: ${studies.map(s => s.title).join(", ") || 'Nenhuma'}.
    - Metas de Vida: ${goals.map(g => `${g.title} (${g.steps?.filter(s => s.completed).length}/${g.steps?.length} passos)`).join(" | ") || 'Nenhuma'}. 
    - Relacionamento: ${dateIdeas.filter(i => !i.checked).map(i => i.text).join(", ") || 'Sem ideias pendentes'}.
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

