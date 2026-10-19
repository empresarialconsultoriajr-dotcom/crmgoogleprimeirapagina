// Textos dos módulos de apoio.
export const APP_NAME = 'SECRETO';
export const APP_SUB = '10 dias de consagração';
export const APP_TAGLINE = 'Fidelidade, domínio próprio, confiança e maturidade.';

export const MOODS = ['Em paz', 'Ansioso', 'Triste', 'Confuso', 'Esperançoso', 'Cansado'];

export const EMOTIONS = ['Paz', 'Ansiedade', 'Tristeza', 'Medo', 'Confusão', 'Esperança', 'Gratidão', 'Raiva', 'Solidão', 'Cansaço', 'Alegria'];

export const HELP_SITUATIONS = [
  { value: 'mensagem', label: 'Quero mandar mensagem para a Dani' },
  { value: 'stories', label: 'Estou com vontade de olhar os stories dela' },
  { value: 'medo', label: 'Estou com medo de perdê-la' },
  { value: 'interpretando', label: 'Estou interpretando algo que ela fez ou publicou' },
  { value: 'rejeicao', label: 'Estou triste ou me sentindo rejeitado' },
  { value: 'cobrar', label: 'Estou com vontade de cobrar uma resposta' },
  { value: 'ansioso', label: 'Estou ansioso e não sei exatamente por quê' },
  { value: 'outro', label: 'Outro motivo' },
];

export const HELP_STEPS = {
  pause: {
    title: 'Pausa',
    text: 'Pare por alguns instantes. Não responda, não envie, não abra nada agora. Respire devagar: inspire contando até quatro, segure dois, solte contando até seis. Repita algumas vezes. Nenhuma decisão precisa ser tomada neste minuto.',
  },
  identify: {
    title: 'Identificação',
    fields: [
      { key: 'happened', label: 'O que aconteceu de fato?', placeholder: 'Descreva apenas o observável, sem interpretar.' },
      { key: 'interpretation', label: 'Que interpretação estou fazendo?', placeholder: 'O que eu estou concluindo a partir disso?' },
      { key: 'emotion', label: 'Qual emoção surgiu?', placeholder: 'Medo, tristeza, raiva, carência, ansiedade...' },
    ],
  },
  reality: {
    title: 'Realidade',
    intro: 'Separe o que é fato observável, o que é hipótese e o que é medo. Uma hipótese não é verdade só porque dói.',
    example: [
      ['Fato', 'Ela ainda não respondeu à minha mensagem.'],
      ['Hipótese', 'Ela não quer mais falar comigo.'],
      ['Medo', 'Estou prestes a perdê-la.'],
    ],
    fields: [
      { key: 'facts', label: 'Fatos observáveis', placeholder: 'O que eu vi ou ouvi, sem acréscimos.' },
      { key: 'hypotheses', label: 'Hipóteses', placeholder: 'O que estou supondo (e que pode estar errado).' },
      { key: 'fears', label: 'Medos', placeholder: 'O que eu temo que aconteça.' },
    ],
  },
  responsibility: {
    title: 'Responsabilidade',
    question: 'Existe alguma ação prática que realmente precisa ser feita agora?',
    options: [
      { value: 'nao', label: 'Não. Posso esperar até estar mais tranquilo.' },
      { value: 'sim', label: 'Sim, há algo concreto e necessário.' },
      { value: 'naosei', label: 'Não sei ainda.' },
    ],
    hint: 'Se a única coisa que a ação resolve é a ansiedade deste momento, ela pode esperar.',
  },
  decision: {
    title: 'Decisão',
    intro: 'Escolha uma resposta coerente com seus valores, sua fé e seus limites.',
    options: [
      'Não vou fazer nada agora. Vou retomar uma tarefa.',
      'Vou orar brevemente e reavaliar em uma hora.',
      'Vou caminhar, beber água ou respirar por dez minutos.',
      'Vou escrever no diário o que estou sentindo.',
      'Há uma necessidade real: vou preparar uma mensagem clara e respeitosa (módulo Relacionamento).',
      'Vou conversar com um amigo ou alguém de confiança.',
    ],
    field: { key: 'decision', label: 'Minha decisão, nas minhas palavras', placeholder: 'O que vou fazer nos próximos minutos.' },
  },
  record: {
    title: 'Registro',
    text: 'O episódio será salvo no seu diário emocional. Ao longo dos dez dias, você poderá observar padrões: horários, gatilhos e situações que se repetem.',
  },
};

export const HELP_DISCLAIMER = 'Este painel não diagnostica transtornos psicológicos e não substitui terapia. Se a ansiedade ou a tristeza forem persistentes ou estiverem prejudicando seu dia a dia, procure um psicólogo ou médico. Se você estiver em risco, ligue 188 (CVV, gratuito, 24h).';

export const FAST_RULES = [
  'Não consumir redes sociais por entretenimento durante o período do propósito.',
  'Não abrir os stories da Dani para tentar interpretar sinais.',
  'Não acompanhar status, horários de atividade ou interações para descobrir o que ela está fazendo.',
  'Não publicar conteúdos com o objetivo de provocar ciúme, saudade, preocupação ou aproximação.',
  'Não consumir conteúdo que aumente ansiedade sobre relacionamentos.',
  'Manter o uso necessário do celular para trabalho, família, compromissos e comunicação legítima.',
];

export const FAST_PROTOCOL = [
  { key: 'feeling', label: '1. O que estou sentindo agora?', placeholder: 'Nomeie a emoção.' },
  { key: 'expect', label: '2. O que espero encontrar se abrir a rede social?', placeholder: 'Um sinal? Alívio? Confirmação de um medo?' },
  { key: 'resolves', label: '3. Essa ação resolverá algo concreto ou apenas aliviará a ansiedade por alguns minutos?', placeholder: 'Seja honesto.' },
  { key: 'action', label: '4. Qual atitude saudável posso tomar nos próximos dez minutos?', placeholder: 'Escolha abaixo ou escreva.' },
];

export const FAST_ALTERNATIVES = ['Oração breve', 'Caminhada', 'Beber água', 'Respiração tranquila', 'Escrever no diário', 'Retomar uma tarefa', 'Ligar para um amigo', 'Alongamento'];

export const FAST_BREAK = [
  { key: 'before', label: 'O que aconteceu antes?', placeholder: 'Situação, horário, o que eu estava fazendo.' },
  { key: 'trigger', label: 'Qual foi o gatilho?', placeholder: 'Uma notificação, um pensamento, uma emoção, tédio...' },
  { key: 'prepare', label: 'Como posso me preparar melhor para a próxima situação?', placeholder: 'Uma mudança concreta: horário, lugar do celular, pessoa para avisar...' },
];

export const RELATIONSHIP_QUESTIONS = [
  { key: 'need', text: 'Estou procurando a Dani por uma necessidade concreta ou por ansiedade?', options: ['Necessidade concreta', 'Ansiedade', 'Misturado'] },
  { key: 'space', text: 'Estou respeitando o tempo que ela pediu?', options: ['Sim', 'Em parte', 'Não'] },
  { key: 'initiating', text: 'Estou iniciando todas as conversas por medo do afastamento?', options: ['Sim', 'Às vezes', 'Não'] },
  { key: 'convincing', text: 'Estou tentando convencer, agradar ou provar que mereço continuar no relacionamento?', options: ['Sim', 'Um pouco', 'Não'] },
  { key: 'identity', text: 'Estou conseguindo manter minhas responsabilidades e minha identidade?', options: ['Sim', 'Em parte', 'Não'] },
  { key: 'limits', text: 'Estou respeitando meus próprios limites emocionais?', options: ['Sim', 'Em parte', 'Não'] },
  { key: 'reciprocity', text: 'Existe reciprocidade observável ou estou me baseando principalmente em expectativas?', options: ['Reciprocidade observável', 'Principalmente expectativas', 'Não sei'] },
];

export const RELATIONSHIP_PRINCIPLES = [
  'A decisão de continuar ou não o namoro pertence às duas pessoas.',
  'Comunicação natural e necessária não é proibida. Comunicação para aliviar ansiedade pode esperar.',
  'Nada aqui serve para desaparecer e provocar saudade, publicar indiretas, despertar ciúme ou usar o trabalho na DClin para conseguir proximidade.',
  'Respeitar o espaço dela e respeitar os seus próprios limites são duas partes da mesma maturidade.',
];

export const SITUATION_A = {
  title: 'Situação A. Quero mandar uma mensagem',
  intro: 'Antes de escrever, verifique a intenção, a necessidade real e o momento. Se a mensagem for necessária, escreva-a de forma clara e respeitosa, sem cobranças disfarçadas.',
  intent: { label: 'Qual é a intenção principal?', options: ['Necessidade concreta (trabalho, logística, família)', 'Carinho natural, sem expectativa de resposta', 'Aliviar minha ansiedade', 'Verificar se ela ainda se importa', 'Cobrar uma resposta', 'Outra'] },
  need: { label: 'Existe uma necessidade real que só essa mensagem resolve?', options: ['Sim', 'Não', 'Não tenho certeza'] },
  timing: { label: 'O momento é adequado?', options: ['Sim, horário e contexto razoáveis', 'Não, é tarde ou estou emocionalmente alterado', 'Posso esperar'] },
  checklist: ['Não contém cobrança disfarçada ("você sumiu", "nem respondeu").', 'Não contém ultimato nem prazo emocional.', 'Não mistura assunto da clínica com assunto do relacionamento.', 'Eu ficaria em paz se ela não respondesse hoje.', 'Diz o que preciso dizer sem exigir uma resposta específica.'],
  draft: { label: 'Rascunho da mensagem (fica salvo aqui; nada é enviado por este sistema)', placeholder: 'Escreva com clareza e respeito.' },
  verdictHint: 'Se a intenção é aliviar ansiedade, verificar ou cobrar, a orientação é esperar. Use o botão "Preciso de ajuda agora". Se há necessidade real e o momento é adequado, envie você mesmo, pelo seu aplicativo, quando estiver calmo.',
};

export const SITUATION_B = {
  title: 'Situação B. Ela me procura',
  points: [
    'Responda com naturalidade, no seu tempo normal. Nem instantâneo por ansiedade, nem atrasado de propósito.',
    'Não use frieza calculada, nem jogos emocionais, nem respostas curtas para "mostrar" algo.',
    'Não conclua nada sobre o futuro a partir de uma mensagem. Uma conversa não é uma decisão.',
    'Se ela trouxer um assunto da DClin, trate-o como assunto da DClin.',
    'Se ela quiser falar do relacionamento, ouça mais do que fale. Pergunte o que ela precisa. Você pode dizer o que sente sem pressionar.',
    'Depois do contato, registre no diário o que aconteceu de fato e o que você sentiu, separadamente.',
  ],
};

export const SITUATION_C = {
  title: 'Situação C. Precisamos conversar sobre o futuro',
  intro: 'Uma conversa honesta precisa de momento adequado e de espaço para que os dois expressem necessidades, expectativas e limites. Prepare-se aqui. Não use este roteiro para convencer; use para ser claro.',
  fields: [
    { key: 'when', label: 'Quando e onde seria um momento adequado?', placeholder: 'Com calma, sem pressa, fora do ambiente da clínica.' },
    { key: 'myNeeds', label: 'Minhas necessidades', placeholder: 'O que eu preciso para me sentir respeitado e seguro.' },
    { key: 'myExpectations', label: 'Minhas expectativas (reconhecidas como expectativas)', placeholder: 'O que eu desejo, sabendo que depende dos dois.' },
    { key: 'myLimits', label: 'Meus limites', placeholder: 'O que eu não consigo sustentar por tempo indeterminado.' },
    { key: 'toAsk', label: 'O que quero perguntar a ela', placeholder: 'Perguntas abertas, sem induzir resposta.' },
    { key: 'toHear', label: 'O que estou disposto a ouvir, mesmo que doa', placeholder: 'Inclua a possibilidade de ela não querer continuar.' },
    { key: 'notToDo', label: 'O que não vou fazer nessa conversa', placeholder: 'Pressionar, chorar para comover, dar ultimato, prometer mudanças que não sustento...' },
  ],
};

export const WORK_REMINDER = 'Seja profissional, confiável e organizado. Não use demandas da clínica para buscar respostas emocionais. Não abandone compromissos profissionais para provocar reações no relacionamento.';

export const JOURNAL_FIELDS = [
  { key: 'reading', label: 'Leitura bíblica', placeholder: 'Referência e o que me chamou atenção.', type: 'text' },
  { key: 'reflection', label: 'Reflexão pessoal', placeholder: 'O que Deus falou comigo hoje, no que entendo.', type: 'textarea' },
  { key: 'prayer', label: 'Oração escrita por mim', placeholder: 'Com minhas próprias palavras.', type: 'textarea' },
  { key: 'emotion', label: 'Emoção predominante', type: 'emotion' },
  { key: 'intensity', label: 'Intensidade da emoção (0 a 10)', type: 'range' },
  { key: 'trigger', label: 'Principal gatilho do dia', placeholder: 'O que mais mexeu comigo.', type: 'text' },
  { key: 'fidelity', label: 'Atitude de fidelidade praticada', placeholder: 'Algo concreto que fiz por coerência.', type: 'text' },
  { key: 'selfControl', label: 'Situação em que consegui exercer domínio próprio', placeholder: '', type: 'textarea' },
  { key: 'impulse', label: 'Situação em que agi por impulso', placeholder: 'Sem vergonha. É registro, não julgamento.', type: 'textarea' },
  { key: 'learning', label: 'Aprendizado', placeholder: '', type: 'textarea' },
  { key: 'gratitude', label: 'Gratidão', placeholder: 'Pelo que sou grato hoje.', type: 'textarea' },
  { key: 'nextCommitment', label: 'Compromisso para o dia seguinte', placeholder: 'Uma coisa concreta.', type: 'text' },
];

export const EVENING_QUESTIONS = [
  { key: 'q1', text: 'Cumpri minha principal responsabilidade espiritual hoje?', options: ['Sim', 'Em parte', 'Não'] },
  { key: 'q2', text: 'Em que situação fui fiel aos meus valores?', options: null },
  { key: 'q3', text: 'Houve alguma atitude movida por ansiedade?', options: ['Não', 'Sim, mas percebi e parei', 'Sim'] },
  { key: 'q4', text: 'Respeitei o espaço da Dani?', options: ['Sim', 'Em parte', 'Não', 'Não houve contato hoje'] },
  { key: 'q5', text: 'Mantive minhas responsabilidades profissionais?', options: ['Sim', 'Em parte', 'Não'] },
  { key: 'q6', text: 'O que preciso corrigir amanhã?', options: null },
  { key: 'q7', text: 'Pelo que sou grato hoje?', options: null },
];

export const CLOSING_REPORT = [
  { key: 'learned', label: 'O que aprendi' },
  { key: 'triggers', label: 'Quais gatilhos identifiquei' },
  { key: 'changed', label: 'Quais atitudes consegui mudar' },
  { key: 'keep', label: 'Quais hábitos desejo manter' },
  { key: 'pending', label: 'Quais questões ainda preciso trabalhar' },
  { key: 'devotional', label: 'Como pretendo continuar minha vida devocional' },
  { key: 'emotional', label: 'Como pretendo cuidar da minha saúde emocional' },
  { key: 'limits', label: 'Quais limites preciso respeitar no relacionamento' },
  { key: 'talks', label: 'Quais conversas importantes ainda podem ser necessárias' },
];

export const PLAN_AREAS = ['Devocional', 'Emocional', 'Física', 'Profissional', 'Relacional'];
export const PLAN_FREQ = ['Diário', '3x por semana', 'Semanal'];
export const PLAN_SUGGESTIONS = [
  { text: 'Leitura bíblica e oração pela manhã', area: 'Devocional', freq: 'Diário' },
  { text: 'Treino físico', area: 'Física', freq: '3x por semana' },
  { text: 'Revisão noturna de cinco minutos', area: 'Emocional', freq: 'Diário' },
  { text: 'Sem redes sociais por entretenimento até o meio-dia', area: 'Emocional', freq: 'Diário' },
  { text: 'Definir as três prioridades do dia antes de começar', area: 'Profissional', freq: 'Diário' },
  { text: 'Conversa com um amigo ou mentor', area: 'Relacional', freq: 'Semanal' },
];
