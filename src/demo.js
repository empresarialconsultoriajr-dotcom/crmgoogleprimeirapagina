// Dados de demonstração: 12 empresas, 2 grupos, ~75 dias de registros com perfis distintos de execução.
import { today, addDays, isWeekend, monthKey, addMonths } from './dates.js'
import { metaIndividual, DEFAULT_SETTINGS } from './engine.js'

function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 } }

export function gerarDemo(ref = today()) {
  const rnd = rng(20261102)
  const grupos = [
    { id: 'g1', nome: 'G1 · Saúde', segmento: 'Saúde', responsavel: 'Gestor operacional', reuniao: 'Quinzenal · terça 12h30' },
    { id: 'g4', nome: 'G4 · Odontologia', segmento: 'Odontologia', responsavel: 'Gestor operacional', reuniao: 'Quinzenal · quinta 12h30' },
  ]
  const base = [
    ['Clínica Vida Plena', 'Saúde', 'g1', 22, 'Ana Souza', 'Recepcionista', 'ativa', 'alta'],
    ['Dr. Marcos Lima · Cardiologia', 'Saúde', 'g1', 12, 'Carla Dias', 'Secretária', 'ativa', 'media'],
    ['Instituto Bem Viver', 'Saúde', 'g1', 30, 'Juliana Reis', 'Coord. de atendimento', 'ativa', 'alta'],
    ['Fisio Movimento', 'Saúde', 'g1', 16, 'Pedro Alves', 'Recepcionista', 'ativa', 'baixa'],
    ['Dra. Renata Castro · Dermato', 'Saúde', 'g1', 10, 'Beatriz Nunes', 'Assistente', 'ativa', 'media'],
    ['Lab Diagnóstico Central', 'Saúde', 'g1', 40, 'Rafael Costa', 'Supervisor', 'ativa', 'queda'],
    ['OdontoPrime', 'Odontologia', 'g4', 18, 'Mariana Lopes', 'Recepcionista', 'ativa', 'alta'],
    ['Sorriso Vivo Odontologia', 'Odontologia', 'g4', 14, 'Thiago Melo', 'Auxiliar', 'ativa', 'media'],
    ['Dr. Felipe Araújo · Implantes', 'Odontologia', 'g4', 8, 'Luana Prado', 'Secretária', 'ativa', 'inativa'],
    ['Clínica Dental Família', 'Odontologia', 'g4', 20, 'Gabriel Rocha', 'Recepcionista', 'ativa', 'media'],
    ['Ortho Kids', 'Odontologia', 'g4', 12, 'Paula Martins', 'Recepcionista', 'onboarding', 'nova'],
    ['Estética Dental Luz', 'Odontologia', 'g4', 9, 'Vitor Santos', 'Assistente', 'cancelada', 'cancelada'],
  ]
  const s = DEFAULT_SETTINGS
  const perfil = { alta: { exec: 0.95, conv: 0.42 }, media: { exec: 0.8, conv: 0.32 }, baixa: { exec: 0.55, conv: 0.22 }, queda: { exec: 0.85, conv: 0.3 }, inativa: { exec: 0.7, conv: 0.3 }, nova: { exec: 0, conv: 0 }, cancelada: { exec: 0.5, conv: 0.2 } }
  const empresas = []; const registros = []; const pagamentos = []; const pendencias = []; const treinamentos = []
  const inicio = addDays(ref, -75)
  base.forEach((b, i) => {
    const [nome, segmento, grupoId, clientesDia, colab, funcao, status, tipo] = b
    const id = 'e' + (i + 1)
    const avaliacoesBase = 30 + Math.floor(rnd() * 120); const notaBase = 4.3 + Math.round(rnd() * 5) / 10
    const dataEntrada = tipo === 'nova' ? addDays(ref, -11) : addDays(inicio, -5 - Math.floor(rnd() * 20))
    const emp = {
      id, codigo: 'GPP-' + String(100 + i + 1), nome, cnpj: `${10 + i}.${String(100 + i)}.${String(200 + i)}/0001-${String(10 + i)}`, segmento, cidade: 'Belo Horizonte / Savassi', grupoId,
      perfilUrl: 'https://g.page/r/exemplo' + (i + 1), avaliacoesBase, notaBase, clientesDia, metaMensal: metaIndividual(clientesDia, s),
      empresario: { nome: 'Empresário ' + (i + 1), whatsapp: '(31) 9 9' + String(1000000 + i * 1111).slice(0, 3) + '-' + String(1000 + i * 7), email: `contato${i + 1}@exemplo.com.br` },
      colaborador: { nome: colab, funcao, whatsapp: '(31) 9 8' + String(100 + i) + '-' + String(2000 + i * 13) }, substituto: { nome: 'Substituto ' + (i + 1) },
      horarioRotina: ['17:30', '18:00', '12:00'][i % 3], canal: ['WhatsApp da empresa', 'WhatsApp da empresa', 'SMS'][i % 3], sistemaRegistro: ['Agenda online', 'Prontuário eletrônico', 'Planilha'][i % 3],
      plano: i === 2 ? 'anual' : 'mensal', status, dataEntrada, dataCancelamento: tipo === 'cancelada' ? addDays(ref, -12) : null,
      assinatura: { diaCobranca: 5, valor: 1000, valorAnual: 10000 },
      checklist: {}, observacoes: tipo === 'queda' ? 'Troca de recepcionista em outubro.' : '',
    }
    // checklist completo para ativas, parcial para onboarding
    const itens = CHECKLIST_ENTRADA.map(c => c.id)
    itens.forEach((k, j) => { emp.checklist[k] = status === 'onboarding' ? j < 9 : true })
    empresas.push(emp)
    treinamentos.push({ id: 't' + id, empresaId: id, tipo: 'inicial', competencia: monthKey(dataEntrada), concluido: status !== 'onboarding', nota: 9 })
    if (tipo === 'baixa') pendencias.push({ id: 'p' + id, empresaId: id, tipo: 'treinamento', descricao: 'Reciclagem do mês não concluída', prazo: addDays(ref, 5), status: 'aberta', criadoEm: addDays(ref, -6) })
    // pagamentos: 3 competências
    for (let k = 2; k >= 0; k--) {
      const comp = addMonths(monthKey(ref), -k)
      if (comp < monthKey(dataEntrada)) continue
      if (tipo === 'cancelada' && k === 0) continue
      const atrasado = (tipo === 'baixa' && k === 0) || (tipo === 'inativa' && k === 0)
      pagamentos.push({ id: 'pg' + id + k, empresaId: id, competencia: comp, valor: emp.plano === 'anual' ? (k === 2 ? 10000 : 0) : 1000, status: atrasado ? 'pendente' : 'pago', dataPagamento: atrasado ? null : (k === 0 ? ref : comp + '-0' + (3 + Math.floor(rnd() * 4))) })
    }
    // registros diários
    if (tipo === 'nova') return
    const p = perfil[tipo]; let total = avaliacoesBase; let nota = notaBase
    const fimReg = tipo === 'cancelada' ? addDays(ref, -12) : ref
    let d = Math.max(inicio, dataEntrada) > inicio ? addDays(dataEntrada, 3) : inicio
    let negPend = 0
    while (d <= fimReg) {
      if (!isWeekend(d)) {
        let exec = p.exec
        if (tipo === 'inativa' && d > addDays(ref, -9)) exec = 0
        if (tipo === 'queda' && d > addDays(ref, -20)) exec = 0.9
        if (rnd() < exec) {
          const atendidos = Math.max(1, Math.round(clientesDia * (0.75 + rnd() * 0.5)))
          const eleg = Math.round(atendidos * (0.7 + rnd() * 0.2))
          let conv = p.conv; if (tipo === 'queda' && d > addDays(ref, -20)) conv = 0.12
          const novas = Math.min(eleg, Math.round(eleg * conv * (0.6 + rnd() * 0.8)))
          total += novas
          const neg = rnd() < 0.08 ? 1 : 0; negPend += neg
          const negResp = negPend > 0 && (rnd() < 0.8 || tipo === 'alta') ? negPend : 0; negPend -= negResp
          if (neg) nota = Math.max(3.8, Math.round((nota - 0.02) * 100) / 100); else if (novas > 3 && nota < 4.9 && rnd() < 0.15) nota = Math.round((nota + 0.01) * 100) / 100
          if (tipo === 'queda' && d > addDays(ref, -20)) nota = Math.max(4.0, Math.round((nota - 0.01) * 100) / 100)
          const retro = rnd() < 0.06
          registros.push({ id: 'r' + id + d.replace(/-/g, ''), empresaId: id, data: d, criadoEm: (retro ? addDays(d, 1) : d) + 'T' + ['17:40', '18:05', '12:20'][i % 3] + ':00', retroativo: retro,
            atendidos, solicitacoes: eleg, canal: emp.canal, avaliacoesTotal: total, nota: Math.round(nota * 10) / 10, respondidas: Math.round(novas * (0.85 + rnd() * 0.15)), negativasNovas: neg, negativasRespondidas: negResp,
            reclamacao: rnd() < 0.1 ? ['Espera acima de 20 min', 'Dificuldade para estacionar', 'Retorno de ligação demorado'][Math.floor(rnd() * 3)] : '', dificuldade: rnd() < 0.05 ? 'Link de avaliação não abriu em um celular' : '' })
        }
      }
      d = addDays(d, 1)
    }
  })
  const reunioes = [
    { id: 'm1', grupoId: 'g1', data: addDays(ref, -9), presentes: ['e1', 'e2', 'e3', 'e5', 'e6'], pontos: ['Conversão média do grupo em 31%', 'Caso do mês: Clínica Vida Plena e o pedido presencial na saída', 'Reciclagem de novembro: resposta a críticas'], ata: '' },
    { id: 'm2', grupoId: 'g4', data: addDays(ref, -7), presentes: ['e7', 'e8', 'e10'], pontos: ['Dr. Felipe sem registros há uma semana', 'OdontoPrime compartilhou QR code do balcão', 'Próxima: scripts para pacientes infantis'], ata: '' },
  ]
  const cancelamentos = [{ id: 'c1', empresaId: 'e12', data: addDays(ref, -12), causa: 'd', oferta: 'Pausa de 1 mês', resultado: 'cancelada', observacao: 'Caixa apertado no fim do ano; porta aberta por 6 meses.' }]
  return { grupos, empresas, registros, pagamentos, pendencias, treinamentos, reunioes, cancelamentos, auditorias: [], alertas: [] }
}

export const CHECKLIST_ENTRADA = [
  { id: 'contrato', t: 'Contrato de adesão assinado e política de privacidade aceita' },
  { id: 'pagamento', t: 'Primeira cobrança confirmada; assinatura recorrente ativa' },
  { id: 'perfil', t: 'Perfil da Empresa no Google verificado e sem suspensão' },
  { id: 'link', t: 'Link direto de avaliação gerado e testado' },
  { id: 'qr', t: 'QR code do link impresso para o balcão (quando aplicável)' },
  { id: 'colaborador', t: 'Colaborador responsável e substituto designados' },
  { id: 'horario', t: 'Horário fixo da rotina definido e registrado' },
  { id: 'canal', t: 'Canal autorizado definido (WhatsApp da empresa / SMS / e-mail)' },
  { id: 'meta', t: 'Fluxo de clientes informado; meta individual calculada e aceita' },
  { id: 'campo', t: 'Campo "convite enviado em" criado no sistema da empresa' },
  { id: 'acessos', t: 'Acesso ao formulário diário e ao painel individual testado' },
  { id: 'treinamento', t: 'Trilha de treinamento concluída; teste ≥ 8/10' },
  { id: 'mensagens', t: 'Mensagens-modelo adaptadas ao tom da empresa e aprovadas' },
  { id: 'grupo', t: 'Empresa alocada a um grupo; convite à próxima reunião enviado' },
  { id: 'primeira', t: 'Primeira solicitação realizada com acompanhamento e registrada' },
  { id: 'baseline', t: 'Diagnóstico inicial (avaliações, nota, respostas) salvo como linha de base' },
]

export const CHECKLIST_AUDITORIA = [
  { id: 'coleta', t: 'Coleta do perfil realizada (contagem, nota, respostas) e datada' },
  { id: 'registros', t: 'Registros diários conferidos; retroativos identificados' },
  { id: 'conversao', t: 'Conversão implícita entre 10% e 60% (ou causa investigada e anotada)' },
  { id: 'pico', t: 'Picos > 3× a média verificados em 48 h (se houver)' },
  { id: 'negativas', t: 'Avaliações ≤ 3 estrelas respondidas em 48 h' },
  { id: 'nota', t: 'Nota média e variação de 30 dias anotadas' },
  { id: 'pendencias', t: 'Pendências de treinamento ou resposta listadas' },
  { id: 'informado', t: 'Indicadores informados marcados como tal no painel' },
  { id: 'alertas', t: 'Alertas gerados encaminhados com responsável e prazo' },
  { id: 'resumo', t: 'Observação para o resumo semanal redigida (1 elogio ou 1 orientação)' },
]
