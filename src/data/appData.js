export const AppData = {
    analistas: [
        { id: 1, nome: "Mahori Silva", turno: "Madrugada", pausa: "01:00 - 02:00", folgaInicial: 7 },
        { id: 2, nome: "Gean Nogueira", turno: "Madrugada", pausa: "02:00 - 03:00", folgaInicial: 3 },
        { id: 3, nome: "José Matheus", turno: "Matinal", pausa: "09:30 - 10:30", folgaInicial: 2 },
        { id: 4, nome: "João Carlos", turno: "Matinal", pausa: "09:00 - 10:00", folgaInicial: 6 },
        { id: 5, nome: "Leanderson Mascena", turno: "Manhã", pausa: "13:00 - 14:00", folgaInicial: 7 },
        { id: 6, nome: "Rafael Macêdo", turno: "Manhã", pausa: "11:30 - 12:30", folgaInicial: 6 },
        { id: 7, nome: "Rodolfo Matias", turno: "Manhã", pausa: "10:00 - 11:00", folgaInicial: 7 },
        { id: 8, nome: "Micael Moura", turno: "Manhã", pausa: "12:00 - 13:00", folgaInicial: 9 },
        { id: 9, nome: "Thiago Lins", turno: "Manhã", pausa: "10:30 - 11:30", folgaInicial: 3 },
        { id: 10, nome: "Faumar Câmara", turno: "Manhã", pausa: "10:30 - 11:30", folgaInicial: 2 },
        { id: 11, nome: "Alesandro Silva", turno: "Tarde", pausa: "19:30 - 20:30", folgaInicial: 6 },
        { id: 12, nome: "Paulo Vinícius", turno: "Tarde", pausa: "16:30 - 17:30", folgaInicial: 7 },
        { id: 13, nome: "Jailso Maxwell", turno: "Tarde", pausa: "15:30 - 16:30", folgaInicial: 4 },
        { id: 14, nome: "Rafael Sousa", turno: "Tarde", pausa: "15:00 - 16:00", folgaInicial: 3 },
        { id: 15, nome: "Gustavo Hudson", turno: "Tarde", pausa: "17:30 - 18:30", folgaInicial: 2 },
        { id: 16, nome: "Anderson Menezes", turno: "Tarde", pausa: "13:15 - 14:15", folgaInicial: 3 },
        { id: 17, nome: "Samuel Lima", turno: "Tarde", pausa: "11:00 - 12:00", folgaInicial: 8 }
    ],
    turnos: {
        "Madrugada": { horario: "22:00 - 06:00", cor: "#6a1b4d", ordem: 1 },
        "Matinal": { horario: "05:40 - 14:00", cor: "#8b4513", ordem: 2 },
        "Manhã": { horario: "07:00 - 15:20", cor: "#c49a30", ordem: 3 },
        "Tarde": { horario: "13:40 - 22:00", cor: "#1f4e79", ordem: 4 }
    },
    eventos: [],
    folgasManuais: {},
    users: [
        { id: 1, username: "Jeferson Brito", password: "@Lionnees14", role: "admin" },
        { id: 2, username: "user", password: "password456", role: "common" }
    ],
};

export const KNOWLEDGE_BASE = {
    tutorials: [
        { id: 'tut1', title: 'Como Gerar a Escala de Folgas', content: 'Este tutorial explica o processo passo a passo para gerar a escala de folgas da equipe, desde a seleção do mês até a exportação da tabela. Siga as instruções para garantir que todas as folgas sejam calculadas corretamente e a tabela esteja pronta para ser compartilhada. Você aprenderá a usar o seletor de mês, o botão "Gerar Escala" e os controles de exportação.', tags: ['escala', 'folga', 'tutorial', 'guia'], views: 120 },
        { id: 'tut2', title: 'Adicionar e Editar Analistas no Sistema', content: 'Guia completo para adicionar novos analistas, editar as informações de um analista existente (nome, turno, pausa) e remover um analista da equipe. Mantenha os dados da sua equipe sempre atualizados para um melhor gerenciamento da escala e do calendário.', tags: ['analista', 'equipe', 'editar', 'adicionar'], views: 95 },
        { id: 'tut3', title: 'Personalizar Turnos e Cores da Escala', content: 'Aprenda a gerenciar os turnos de trabalho, alterando o nome, horário e, principalmente, a cor. Esta personalização ajuda a diferenciar visualmente os turnos na tabela da escala, facilitando a leitura e a organização da equipe. Você também pode arrastar e soltar os turnos para reordená-los.', tags: ['turno', 'cor', 'personalizar', 'gerenciar'], views: 150 },
        { id: 'tut4', title: 'Como Usar o Calendário para Eventos', content: 'Este tutorial detalha como criar, editar e visualizar eventos no calendário da equipe. Adicione reuniões, treinamentos, ausências ou qualquer outro compromisso importante. O calendário é uma ferramenta visual para manter a equipe informada sobre os eventos planejados e os analistas envolvidos.', tags: ['calendário', 'evento', 'reunião', 'planejamento'], views: 110 },
    ],
    solutions: [
        { id: 'sol1', title: 'Solução para o Erro 404', content: 'O erro **404 - Not Found** ocorre quando a página que você está tentando acessar não existe. Verifique se o URL está correto ou use a barra de navegação para ir para a página desejada. Se o problema persistir, entre em contato com o suporte técnico.', tags: ['erro', 'solução', 'suporte', '404'], views: 200 },
        { id: 'sol2', title: 'O que fazer quando o sistema está lento?', content: 'Se o sistema estiver com performance reduzida, tente as seguintes etapas: 1. Limpe o cache do seu navegador. 2. Reinicie a aplicação. 3. Verifique sua conexão com a internet. 4. Se o problema persistir, comunique o problema no canal de suporte da equipe.', tags: ['solução', 'problema', 'performance', 'lento'], views: 180 },
    ],
    faq: [
        { id: 'faq1', title: 'Como funciona o cálculo de folgas?', content: 'O cálculo de folgas do sistema é baseado em um ciclo de 8 dias, onde cada analista tem 2 dias de folga. A folga inicial é definida no momento da criação ou edição do analista, e o sistema calcula automaticamente as folgas subsequentes. **Exemplo:** se a folga inicial é no dia 7, o próximo dia de folga será no dia 8, e os próximos serão nos dias 15 e 16, e assim por diante.', tags: ['faq', 'folga', 'cálculo', 'sistema'], views: 175 },
        { id: 'faq2', title: 'Posso adicionar um feriado local no calendário?', content: 'Sim! Os feriados nacionais já estão pré-configurados, mas você pode adicionar feriados locais ou qualquer outro evento importante usando a funcionalidade de **"Novo Evento"** na página de calendário. Use o campo "Analista" como "Outros" para eventos que não são específicos para um analista.', tags: ['faq', 'feriado', 'evento', 'calendário'], views: 130 },
    ],
    tools: [
        { id: 'ai1', title: 'ChatGPT', url: 'https://chat.openai.com/', logo: 'https://cdn.openai.com/chat/favicon-32x32.png', description: 'Um modelo de linguagem da OpenAI, ideal para gerar textos, responder perguntas complexas e ajudar na redação de e-mails, relatórios e outros documentos.', category: 'ia' },
        { id: 'ai2', title: 'Google Gemini', url: 'https://gemini.google.com/', logo: 'https://www.gstatic.com/lamda/images/gemini-sparkle-favicon.svg', description: 'IA multimodal do Google. Perfeito para analisar textos, imagens e dados, auxiliando na criação de estratégias e apresentações.', category: 'ia' },
        { id: 'ai3', title: 'Microsoft Copilot', url: 'https://copilot.microsoft.com/', logo: 'https://www.microsoft.com/favicon.ico', description: 'Integrado ao ecossistema Microsoft, atua como um assistente de IA para criar e-mails, resumir reuniões e organizar tarefas no Office 365.', category: 'ia' },
        { id: 'ai4', title: 'Perplexity AI', url: 'https://www.perplexity.ai/', logo: 'https://www.perplexity.ai/favicon.ico', description: 'Motor de busca conversacional que fornece respostas diretas e citadas, ideal para pesquisa rápida e verificação de fatos.', category: 'ia' },
        { id: 'ai5', title: 'Notion AI', url: 'https://www.notion.so/product/ai', logo: 'https://www.notion.so/product/ai', description: 'O Notion AI é uma ferramenta de escrita e organização integrada ao Notion que ajuda a gerar ideias, resumir documentos e criar conteúdo de forma automática.', category: 'ia' },
        { id: 'ai6', title: 'DALL-E 3', url: 'https://openai.com/dall-e-3', logo: 'https://openai.com/favicon.ico', description: 'Gerador de imagens da OpenAI. Use para criar ilustrações, gráficos ou artes visuais a partir de descrições textuais.', category: 'ia' },
        { id: 'ai7', title: 'Midjourney', url: 'https://www.midjourney.com/', logo: 'https://www.midjourney.com/favicon.ico', description: 'Uma poderosa IA para a criação de imagens artísticas e conceituais, ideal para brainstorming visual e projetos criativos.', category: 'ia' },
        { id: 'ai8', title: 'Canva', url: 'https://www.canva.com/', logo: 'https://www.canva.com/favicon.ico', description: 'O Canva é uma plataforma de design gráfico online que oferece ferramentas de IA para criar designs, posts para redes sociais, apresentações, e muito mais, de forma simples e intuitiva.', category: 'ia' },
        { id: 'ai9', title: 'Grammarly', url: 'https://www.grammarly.com/', logo: 'https://www.grammarly.com/favicon.ico', description: 'Assistente de escrita com IA que corrige erros de gramática, ortografia, pontuação e estilo de escrita em diversos aplicativos e navegadores.', category: 'ia' },
        { id: 'ai10', title: 'GitHub Copilot', url: 'https://github.com/features/copilot', logo: 'https://github.githubassets.com/favicons/favicon-github.svg', description: 'Assistente de programação com IA. Ajuda a escrever código mais rápido, sugerindo linhas ou funções inteiras diretamente no editor.', category: 'ia' },
        { id: 'ai11', title: 'Descript', url: 'https://www.descript.com/', logo: 'https://www.descript.com/favicon.ico', description: 'Editor de áudio e vídeo com IA que permite editar arquivos de mídia como se fossem um documento de texto. Ótimo para transcrições e produção de conteúdo.', category: 'ia' },
        { id: 'ai12', title: 'ElevenLabs', url: 'https://beta.elevenlabs.io/', logo: 'https://beta.elevenlabs.io/favicon.ico', description: 'Plataforma de síntese de voz com IA que gera narrações e falas realistas a partir de texto, com diversas opções de vozes e estilos.', category: 'ia' },
        { id: 'prod1', title: 'Trello', url: 'https://trello.com/', logo: 'https://trello.com/favicon.ico', description: 'Ferramenta visual de gerenciamento de projetos em quadros, listas e cartões. Ideal para organizar tarefas da equipe e acompanhar o progresso de projetos.', category: 'productivity' },
        { id: 'prod2', title: 'Asana', url: 'https://asana.com/', logo: 'https://asana.com/favicon.ico', description: 'Plataforma para gerenciar o fluxo de trabalho da equipe. Ajuda a planejar, organizar e acompanhar projetos, tarefas e prazos de forma centralizada.', category: 'productivity' },
        { id: 'prod3', title: 'Slack', url: 'https://slack.com/', logo: 'https://slack.com/favicon.ico', description: 'Ferramenta de comunicação e colaboração que organiza conversas por canais. Substitui e-mails internos e facilita a comunicação em tempo real.', category: 'productivity' },
        { id: 'prod4', title: 'Miro', url: 'https://miro.com/', logo: 'https://miro.com/favicon.ico', description: 'Quadro branco digital para brainstorming, mapeamento mental, diagramas e colaboração visual em tempo real com a equipe.', category: 'productivity' },
        { id: 'prod5', title: 'Google Workspace', url: 'https://workspace.google.com/', logo: 'https://www.google.com/favicon.ico', description: 'Pacote de ferramentas do Google para produtividade, incluindo Gmail, Drive, Docs, Sheets e Calendar, para colaboração em documentos e organização diária.', category: 'productivity' },
        { id: 'prod6', title: 'Microsoft Teams', url: 'https://www.microsoft.com/pt-br/microsoft-teams/log-in', logo: 'https://www.microsoft.com/favicon.ico', description: 'Plataforma de comunicação e colaboração para reuniões, bate-papo, chamadas e trabalho em equipe, com acesso a arquivos e aplicativos.', category: 'productivity' },
    ],
    feriados: [
        { mes: 0, dia: 1, nome: "Ano Novo" },
        { mes: 1, dia: 13, nome: "Carnaval" },
        { mes: 2, dia: 21, nome: "Sexta-feira Santa" },
        { mes: 3, dia: 21, nome: "Tiradentes" },
        { mes: 4, dia: 1, nome: "Dia do Trabalho" },
        { mes: 5, dia: 19, nome: "Corpus Christi" },
        { mes: 8, dia: 7, nome: "Independência do Brasil" },
        { mes: 9, dia: 12, nome: "Nossa Senhora Aparecida" },
        { mes: 10, dia: 2, nome: "Finados" },
        { mes: 10, dia: 15, nome: "Proclamação da República" },
        { mes: 11, dia: 25, nome: "Natal" }
    ],
};