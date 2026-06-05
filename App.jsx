import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLABORADORES = ["Carlos Lima", "Fernanda Souza", "Rafael Moura", "Beatriz Nunes"];
const VENDEDORES = ["Lucas Andrade", "Patrícia Rocha", "Diego Ferreira"];
const today = new Date().toISOString().slice(0, 10);

function addDays(d, n) {
  const dt = new Date(d); dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
}
function formatMoeda(v) { return Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
function formatData(d) { if (!d) return "—"; const [y,m,day] = d.split("-"); return `${day}/${m}/${y}`; }
function diasAte(d) { if (!d) return null; return Math.ceil((new Date(d) - new Date(today)) / 86400000); }
function gerarWhats(c) {
  return encodeURIComponent(`Olá! 👋 O perfil *${c.nomeEmpresa}* no Google Meu Negócio foi atualizado! ✅\n• 10 novas postagens\n• Fotos e informações atualizadas\n• Links conferidos\nQualquer dúvida, estamos à disposição! 😊`);
}

const STATUS_COR = {
  "Ativo":           { bg:"#dde8e8", text:"#2B3A3D", dot:"#2B3A3D" },
  "Vencido":         { bg:"#fee2e2", text:"#991b1b", dot:"#ef4444" },
  "Prospect":        { bg:"#f2eeeb", text:"#7a5c4a", dot:"#A89181" },
  "Cancelado":       { bg:"#f3f4f6", text:"#374151", dot:"#9ca3af" },
  "Em Negociação":   { bg:"#ede8e4", text:"#5c4033", dot:"#A89181" },
  "Fechado":         { bg:"#dde8e8", text:"#2B3A3D", dot:"#2B3A3D" },
  "Proposta Enviada":{ bg:"#e8ecec", text:"#2B3A3D", dot:"#3d5458" },
  "Primeiro Contato":{ bg:"#f2eeeb", text:"#7a5c4a", dot:"#A89181" },
  "Perdido":         { bg:"#fee2e2", text:"#991b1b", dot:"#ef4444" },
};

const CLIENTES_DEMO = [
  { id:1, nomeEmpresa:"Restaurante Sabor & Arte", nomeContato:"João Ferreira", telefone:"(11) 99123-4567", cpfCnpj:"12.345.678/0001-90", email:"joao@saborarte.com.br", perfilGoogle:"Restaurante Sabor & Arte - SP", linkPerfil:"", valorContrato:350, condicaoPagamento:"Mensal", colaborador:"Carlos Lima", vendedor:"Lucas Andrade", dataInicio:"2025-01-10", ultimaAtualizacao:"2025-04-20", proximaAtualizacao:addDays("2025-04-20",30), statusContrato:"Ativo", statusNegociacao:"Fechado", instagram:"@saborarte_sp", whatsappGrupo:"5511991234567", observacoes:"Cliente VIP.", postsRealizados:48, fotosEnviadas:12, servicosListados:5 },
  { id:2, nomeEmpresa:"Clínica DentalMax", nomeContato:"Dra. Ana Souza", telefone:"(21) 98765-3210", cpfCnpj:"98.765.432/0001-11", email:"ana@dentalmax.com", perfilGoogle:"Clínica DentalMax - RJ", linkPerfil:"", valorContrato:550, condicaoPagamento:"Mensal", colaborador:"Fernanda Souza", vendedor:"Patrícia Rocha", dataInicio:"2024-11-05", ultimaAtualizacao:"2025-05-01", proximaAtualizacao:addDays("2025-05-01",30), statusContrato:"Ativo", statusNegociacao:"Fechado", instagram:"@dentalmax_rj", whatsappGrupo:"5521987653210", observacoes:"", postsRealizados:60, fotosEnviadas:20, servicosListados:8 },
  { id:3, nomeEmpresa:"Auto Peças Veloz", nomeContato:"Marcos Veloz", telefone:"(31) 97654-2109", cpfCnpj:"456.789.012-34", email:"marcos@pecasveloz.com", perfilGoogle:"Auto Peças Veloz - BH", linkPerfil:"", valorContrato:280, condicaoPagamento:"Trimestral", colaborador:"Rafael Moura", vendedor:"Diego Ferreira", dataInicio:"2025-03-15", ultimaAtualizacao:"2025-04-15", proximaAtualizacao:addDays("2025-04-15",30), statusContrato:"Ativo", statusNegociacao:"Fechado", instagram:"@velozpecas", whatsappGrupo:"5531976542109", observacoes:"", postsRealizados:20, fotosEnviadas:6, servicosListados:3 },
  { id:4, nomeEmpresa:"Estética Bella Pele", nomeContato:"Camila Torres", telefone:"(41) 96543-1098", cpfCnpj:"234.567.890-12", email:"camila@bellapele.com", perfilGoogle:"Estética Bella Pele - CWB", linkPerfil:"", valorContrato:420, condicaoPagamento:"Mensal", colaborador:"Beatriz Nunes", vendedor:"Lucas Andrade", dataInicio:"2024-08-20", ultimaAtualizacao:"2025-03-01", proximaAtualizacao:addDays("2025-03-01",30), statusContrato:"Vencido", statusNegociacao:"Fechado", instagram:"@bellapele_cwb", whatsappGrupo:"5541965431098", observacoes:"Contrato vencido, aguardando renovação.", postsRealizados:90, fotosEnviadas:30, servicosListados:10 },
  { id:5, nomeEmpresa:"Pizzaria Forno de Lenha", nomeContato:"Roberto Gomes", telefone:"(11) 95432-0987", cpfCnpj:"11.222.333/0001-44", email:"roberto@fornolenha.com.br", perfilGoogle:"", linkPerfil:"", valorContrato:300, condicaoPagamento:"Mensal", colaborador:"", vendedor:"Patrícia Rocha", dataInicio:"", ultimaAtualizacao:"", proximaAtualizacao:"", statusContrato:"Prospect", statusNegociacao:"Em Negociação", instagram:"@fornolenha_sp", whatsappGrupo:"5511954320987", observacoes:"Reunião agendada.", postsRealizados:0, fotosEnviadas:0, servicosListados:0 },
  { id:6, nomeEmpresa:"Academia FitLife", nomeContato:"Sandra Oliveira", telefone:"(51) 94321-9876", cpfCnpj:"55.666.777/0001-88", email:"sandra@fitlife.com.br", perfilGoogle:"Academia FitLife - POA", linkPerfil:"", valorContrato:480, condicaoPagamento:"Semestral", colaborador:"Carlos Lima", vendedor:"Diego Ferreira", dataInicio:"2025-02-01", ultimaAtualizacao:"2025-05-10", proximaAtualizacao:addDays("2025-05-10",30), statusContrato:"Ativo", statusNegociacao:"Fechado", instagram:"@fitlife_poa", whatsappGrupo:"5551943219876", observacoes:"", postsRealizados:30, fotosEnviadas:8, servicosListados:6 },
];

const NEGS_DEMO = [
  { id:1, nomeEmpresa:"Pizzaria Forno de Lenha", nomeContato:"Roberto Gomes", telefone:"(11) 95432-0987", valorProposto:300, etapa:"Proposta Enviada", dataContato:"2025-05-12", proximoContato:"2025-05-22", vendedor:"Patrícia Rocha", notas:"Cliente interessado." },
  { id:2, nomeEmpresa:"Farmácia Saúde Total", nomeContato:"Paulo Henrique", telefone:"(11) 93210-8765", valorProposto:390, etapa:"Primeiro Contato", dataContato:"2025-05-15", proximoContato:"2025-05-25", vendedor:"Lucas Andrade", notas:"Indicação de cliente." },
];

// ── COMPONENTES BASE ──────────────────────────────────────────────────────────
function Badge({ label }) {
  const c = STATUS_COR[label] || { bg:"#f3f4f6", text:"#374151", dot:"#9ca3af" };
  return (
    <span style={{ background:c.bg, color:c.text, borderRadius:20, padding:"3px 11px", fontSize:11, fontWeight:700, display:"inline-flex", alignItems:"center", gap:5, whiteSpace:"nowrap" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:c.dot, display:"inline-block" }}/>
      {label}
    </span>
  );
}

function Inp({ label, value, onChange, type="text", opts, ph }) {
  const s = { width:"100%", padding:"9px 12px", borderRadius:9, border:"1.5px solid #e5e7eb", fontSize:13, outline:"none", background:"#FFFFFF", boxSizing:"border-box", fontFamily:"'Outfit',sans-serif" };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
      <label style={{ fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:0.4 }}>{label}</label>
      {opts ? (
        <select value={value||""} onChange={e=>onChange(e.target.value)} style={s}>
          <option value="">Selecionar...</option>
          {opts.map(o=><option key={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={value||""} onChange={e=>onChange(e.target.value)} style={s} placeholder={ph}/>
      )}
    </div>
  );
}

// ── MODAL CLIENTE ─────────────────────────────────────────────────────────────
function ModalCliente({ cliente, onClose, onSave }) {
  const novo = !cliente?.id;
  const [f, setF] = useState(cliente || { nomeEmpresa:"", nomeContato:"", telefone:"", cpfCnpj:"", email:"", perfilGoogle:"", linkPerfil:"", valorContrato:"", condicaoPagamento:"Mensal", colaborador:"", vendedor:"", dataInicio:today, ultimaAtualizacao:"", proximaAtualizacao:"", statusContrato:"Ativo", statusNegociacao:"Fechado", instagram:"", whatsappGrupo:"", observacoes:"", postsRealizados:0, fotosEnviadas:0, servicosListados:0 });
  const s = (k,v) => setF(p=>({...p,[k]:v}));
  const g2 = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:13 };
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.55)", backdropFilter:"blur(4px)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:"#FFFFFF", borderRadius:20, width:660, maxHeight:"92vh", overflowY:"auto", boxShadow:"0 40px 100px rgba(0,0,0,.25)" }}>
        <div style={{ padding:"22px 28px", borderBottom:"1px solid #f3f4f6", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:"#FFFFFF", zIndex:1, borderRadius:"20px 20px 0 0" }}>
          <h2 style={{ margin:0, fontSize:17, fontFamily:"'Playfair Display',serif" }}>{novo?"➕ Novo Cliente":`✏️ ${f.nomeEmpresa}`}</h2>
          <button onClick={onClose} style={{ background:"#f3f4f6", border:"none", borderRadius:8, width:30, height:30, cursor:"pointer", fontSize:15, color:"#6b7280" }}>✕</button>
        </div>
        <div style={{ padding:"24px 28px", display:"flex", flexDirection:"column", gap:18 }}>
          {[["🏢 Empresa",[["Nome da Empresa","nomeEmpresa"],["Nome do Contato","nomeContato"],["Telefone","telefone"],["CPF / CNPJ","cpfCnpj"],["E-mail","email"],["Instagram","instagram"]]],
            ["📍 Google Meu Negócio",[["Nome do Perfil Google","perfilGoogle"],["Link do Perfil","linkPerfil"],["WhatsApp Grupo (só números)","whatsappGrupo"]]],
            ["💰 Contrato",[]],
            ["👤 Equipe",[]]
          ].map(([title]) => (
            <div key={title}>
              <p style={{ margin:"0 0 10px", fontSize:11, fontWeight:700, color:"#2B3A3D", textTransform:"uppercase", letterSpacing:0.5 }}>{title}</p>
              {title === "🏢 Empresa" && <div style={g2}>{[["Nome da Empresa","nomeEmpresa"],["Nome do Contato","nomeContato"],["Telefone","telefone"],["CPF / CNPJ","cpfCnpj"],["E-mail","email"],["Instagram","instagram"]].map(([l,k])=><Inp key={k} label={l} value={f[k]} onChange={v=>s(k,v)}/>)}</div>}
              {title === "📍 Google Meu Negócio" && <div style={g2}>{[["Perfil Google","perfilGoogle"],["Link Perfil","linkPerfil"],["WhatsApp Grupo","whatsappGrupo"]].map(([l,k])=><Inp key={k} label={l} value={f[k]} onChange={v=>s(k,v)}/>)}</div>}
              {title === "💰 Contrato" && <div style={g2}><Inp label="Valor (R$)" value={f.valorContrato} onChange={v=>s("valorContrato",v)} type="number"/><Inp label="Pagamento" value={f.condicaoPagamento} onChange={v=>s("condicaoPagamento",v)} opts={["Mensal","Bimestral","Trimestral","Semestral","Anual"]}/><Inp label="Status" value={f.statusContrato} onChange={v=>s("statusContrato",v)} opts={["Ativo","Vencido","Cancelado","Prospect"]}/><Inp label="Data Início" value={f.dataInicio} onChange={v=>s("dataInicio",v)} type="date"/><Inp label="Última Atualização" value={f.ultimaAtualizacao} onChange={v=>{ s("ultimaAtualizacao",v); if(v) s("proximaAtualizacao",addDays(v,30)); }} type="date"/><Inp label="Próx. Atualização" value={f.proximaAtualizacao} onChange={v=>s("proximaAtualizacao",v)} type="date"/></div>}
              {title === "👤 Equipe" && <div style={g2}><Inp label="Colaborador" value={f.colaborador} onChange={v=>s("colaborador",v)} opts={COLABORADORES}/><Inp label="Vendedor" value={f.vendedor} onChange={v=>s("vendedor",v)} opts={VENDEDORES}/></div>}
            </div>
          ))}
          <div>
            <p style={{ margin:"0 0 10px", fontSize:11, fontWeight:700, color:"#2B3A3D", textTransform:"uppercase", letterSpacing:0.5 }}>📝 Observações</p>
            <textarea value={f.observacoes||""} onChange={e=>s("observacoes",e.target.value)} rows={3} style={{ width:"100%", padding:"9px 12px", borderRadius:9, border:"1.5px solid #e5e7eb", fontSize:13, resize:"vertical", fontFamily:"'Outfit',sans-serif", boxSizing:"border-box" }}/>
          </div>
        </div>
        <div style={{ padding:"16px 28px", borderTop:"1px solid #f3f4f6", display:"flex", justifyContent:"flex-end", gap:10, position:"sticky", bottom:0, background:"#FFFFFF", borderRadius:"0 0 20px 20px" }}>
          <button onClick={onClose} style={{ padding:"10px 22px", borderRadius:9, border:"1.5px solid #e5e7eb", background:"#FFFFFF", cursor:"pointer", fontWeight:600, fontSize:13 }}>Cancelar</button>
          <button onClick={()=>onSave(f)} style={{ padding:"10px 26px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#2B3A3D,#3d5458)", color:"#fff", cursor:"pointer", fontWeight:700, fontSize:13 }}>
            {novo?"Criar Cliente":"Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PAINEL LATERAL ────────────────────────────────────────────────────────────
function PainelCliente({ c, onClose, onEdit, onDelete, onAtualizar }) {
  const dias = diasAte(c.proximaAtualizacao);
  const urgente = dias !== null && dias <= 1 && c.statusContrato === "Ativo";
  const whatsUrl = c.whatsappGrupo ? `https://wa.me/${c.whatsappGrupo}?text=${gerarWhats(c)}` : null;
  return (
    <div style={{ width:320, background:"#FFFFFF", borderLeft:"1px solid #e5e7eb", overflowY:"auto", flexShrink:0, display:"flex", flexDirection:"column" }}>
      <div style={{ padding:"18px 22px", borderBottom:"1px solid #f3f4f6", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontWeight:700, fontSize:13 }}>Detalhes</span>
        <button onClick={onClose} style={{ background:"none", border:"none", fontSize:18, cursor:"pointer", color:"#9ca3af" }}>✕</button>
      </div>
      <div style={{ padding:"18px 22px", flex:1 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
          <div style={{ width:48, height:48, borderRadius:13, background:"linear-gradient(135deg,#2B3A3D,#A89181)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:20, fontWeight:800, flexShrink:0 }}>{c.nomeEmpresa[0]}</div>
          <div><h3 style={{ margin:0, fontSize:15, fontFamily:"'Playfair Display',serif" }}>{c.nomeEmpresa}</h3><p style={{ margin:"2px 0 5px", fontSize:12, color:"#6b7280" }}>{c.nomeContato}</p><Badge label={c.statusContrato}/></div>
        </div>
        {urgente && <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:10, padding:"9px 13px", marginBottom:14, fontSize:12, color:"#dc2626", fontWeight:700 }}>🚨 {dias < 0 ? `${Math.abs(dias)}d atrasada!` : dias === 0 ? "Atualizar HOJE!" : "Atualizar AMANHÃ!"}</div>}
        {whatsUrl && <a href={whatsUrl} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:7, background:"#2B3A3D", color:"#fff", borderRadius:10, padding:"9px", textDecoration:"none", fontWeight:700, fontSize:13, marginBottom:10 }}>💬 Notificar no WhatsApp</a>}
        <button onClick={()=>onAtualizar(c)} style={{ width:"100%", padding:"9px", borderRadius:10, border:"none", background:"#2B3A3D", color:"#fff", cursor:"pointer", fontWeight:700, fontSize:13, marginBottom:16 }}>🔄 Registrar Atualização GMB</button>
        {[["✉️ E-mail",c.email],["📱 Telefone",c.telefone],["🪪 CPF/CNPJ",c.cpfCnpj],["📸 Instagram",c.instagram],["📍 Perfil Google",c.perfilGoogle||"—"],["💰 Valor",formatMoeda(c.valorContrato)],["💳 Pagamento",c.condicaoPagamento],["👤 Colaborador",c.colaborador||"—"],["🤝 Vendedor",c.vendedor||"—"],["📅 Última Atualiz.",formatData(c.ultimaAtualizacao)],["⏭️ Próxima",c.proximaAtualizacao?`${formatData(c.proximaAtualizacao)}${dias!==null?" ("+(dias>0?`em ${dias}d`:dias===0?"hoje":`${Math.abs(dias)}d atrás`)+")":""}`:"—"],["📝 Posts",c.postsRealizados]].map(([l,v])=>(
          <div key={l} style={{ marginBottom:9 }}>
            <p style={{ margin:0, fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:0.4 }}>{l}</p>
            <p style={{ margin:"2px 0 0", fontSize:13, color:"#111", wordBreak:"break-all" }}>{v||"—"}</p>
          </div>
        ))}
        {c.observacoes && <div style={{ background:"#f7f4f1", borderRadius:10, padding:"9px 13px", marginTop:6 }}><p style={{ margin:0, fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:0.4 }}>📝 Obs</p><p style={{ margin:"3px 0 0", fontSize:12, color:"#374151", lineHeight:1.5 }}>{c.observacoes}</p></div>}
      </div>
      <div style={{ padding:"14px 22px", borderTop:"1px solid #f3f4f6", display:"flex", gap:9 }}>
        <button onClick={()=>onEdit(c)} style={{ flex:1, padding:"9px", borderRadius:9, border:"1.5px solid #2B3A3D", color:"#2B3A3D", background:"#FFFFFF", cursor:"pointer", fontWeight:700, fontSize:12 }}>Editar</button>
        <button onClick={()=>{ onDelete(c.id); onClose(); }} style={{ flex:1, padding:"9px", borderRadius:9, border:"none", background:"#fef2f2", color:"#dc2626", cursor:"pointer", fontWeight:700, fontSize:12 }}>Excluir</button>
      </div>
    </div>
  );
}

// ── MODAL ATUALIZAÇÃO ─────────────────────────────────────────────────────────
function ModalAtualizar({ cliente, onClose, onSalvar }) {
  const [data, setData] = useState(today);
  const [notas, setNotas] = useState("");
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.55)", backdropFilter:"blur(4px)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"#FFFFFF", borderRadius:18, padding:"28px", width:440, boxShadow:"0 30px 80px rgba(0,0,0,.2)" }}>
        <h3 style={{ margin:"0 0 4px", fontFamily:"'Playfair Display',serif", fontSize:17 }}>🔄 Registrar Atualização GMB</h3>
        <p style={{ margin:"0 0 20px", color:"#6b7280", fontSize:13 }}>{cliente.nomeEmpresa}</p>
        <div style={{ display:"flex", flexDirection:"column", gap:13, marginBottom:20 }}>
          <Inp label="Data da Atualização" value={data} onChange={setData} type="date"/>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            <label style={{ fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:0.4 }}>Notas</label>
            <textarea value={notas} onChange={e=>setNotas(e.target.value)} rows={3} placeholder="O que foi feito neste ciclo..." style={{ padding:"9px 12px", borderRadius:9, border:"1.5px solid #e5e7eb", fontSize:13, fontFamily:"'Outfit',sans-serif", resize:"vertical" }}/>
          </div>
          <div style={{ background:"#f0fdf4", borderRadius:10, padding:"11px 15px", fontSize:13, color:"#166534" }}>
            <strong>Próxima atualização:</strong> {formatData(addDays(data,30))}
          </div>
          {cliente.whatsappGrupo && (
            <a href={`https://wa.me/${cliente.whatsappGrupo}?text=${gerarWhats(cliente)}`} target="_blank" rel="noreferrer"
              style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:7, background:"#2B3A3D", color:"#fff", borderRadius:10, padding:"11px", textDecoration:"none", fontWeight:700, fontSize:13 }}>
              💬 Abrir WhatsApp e Notificar
            </a>
          )}
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose} style={{ flex:1, padding:"10px", borderRadius:9, border:"1.5px solid #e5e7eb", background:"#FFFFFF", cursor:"pointer", fontWeight:600 }}>Cancelar</button>
          <button onClick={()=>onSalvar(cliente.id,data,notas)} style={{ flex:1, padding:"10px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#2B3A3D,#A89181)", color:"#fff", cursor:"pointer", fontWeight:700 }}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

// ── ABA ALERTAS ───────────────────────────────────────────────────────────────
function AbaAlertas({ clientes }) {
  const urgentes = clientes.filter(c=>{ const d=diasAte(c.proximaAtualizacao); return d!==null&&d<=1&&c.statusContrato==="Ativo"; }).sort((a,b)=>diasAte(a.proximaAtualizacao)-diasAte(b.proximaAtualizacao));
  const proximos = clientes.filter(c=>{ const d=diasAte(c.proximaAtualizacao); return d!==null&&d>1&&d<=7&&c.statusContrato==="Ativo"; });
  const vencidos = clientes.filter(c=>c.statusContrato==="Vencido");
  const Sec = ({title,items,bg,borda,cor,render})=>(
    <div style={{ marginBottom:28 }}>
      <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:12 }}>
        <h3 style={{ margin:0, fontSize:14, fontWeight:800, color:cor }}>{title}</h3>
        <span style={{ background:bg, color:cor, borderRadius:20, padding:"2px 10px", fontSize:12, fontWeight:700, border:`1px solid ${borda}` }}>{items.length}</span>
      </div>
      {items.length===0?<p style={{ color:"#9ca3af", fontSize:13 }}>Nenhum item. ✅</p>:<div style={{ display:"flex", flexDirection:"column", gap:8 }}>{items.map(render)}</div>}
    </div>
  );
  return (
    <div style={{ padding:"24px 32px" }}>
      <Sec title="🚨 Urgente (hoje / amanhã)" items={urgentes} bg="#fef2f2" borda="#fecaca" cor="#dc2626" render={c=>{
        const d=diasAte(c.proximaAtualizacao);
        return(<div key={c.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 17px", background:"#FFFFFF", borderRadius:10, border:"1px solid #fecaca" }}>
          <div><p style={{ margin:0, fontWeight:700, fontSize:14 }}>{c.nomeEmpresa}</p><p style={{ margin:"2px 0 0", fontSize:12, color:"#6b7280" }}>{c.colaborador||"—"} • {c.telefone}</p></div>
          <div style={{ textAlign:"right" }}><Badge label={d<=0?"Vencida":"Amanhã"}/>{c.whatsappGrupo&&<a href={`https://wa.me/${c.whatsappGrupo}?text=${gerarWhats(c)}`} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", gap:5, marginTop:6, fontSize:12, color:"#22c55e", textDecoration:"none", fontWeight:700, justifyContent:"flex-end" }}>💬 Notificar</a>}</div>
        </div>);
      }}/>
      <Sec title="⏰ Próximos 7 dias" items={proximos} bg="#fefce8" borda="#fde68a" cor="#92400e" render={c=>(
        <div key={c.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 17px", background:"#FFFFFF", borderRadius:10, border:"1px solid #fde68a" }}>
          <div><p style={{ margin:0, fontWeight:700, fontSize:14 }}>{c.nomeEmpresa}</p><p style={{ margin:"2px 0 0", fontSize:12, color:"#6b7280" }}>{c.colaborador||"—"} • {formatData(c.proximaAtualizacao)}</p></div>
          <Badge label={`em ${diasAte(c.proximaAtualizacao)}d`}/>
        </div>
      )}/>
      <Sec title="📋 Contratos Vencidos" items={vencidos} bg="#fef2f2" borda="#fecaca" cor="#991b1b" render={c=>(
        <div key={c.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 17px", background:"#FFFFFF", borderRadius:10, border:"1px solid #fecaca" }}>
          <div><p style={{ margin:0, fontWeight:700, fontSize:14 }}>{c.nomeEmpresa}</p><p style={{ margin:"2px 0 0", fontSize:12, color:"#6b7280" }}>{c.vendedor||"—"} • {formatMoeda(c.valorContrato)}</p></div>
          <Badge label="Vencido"/>
        </div>
      )}/>
    </div>
  );
}

// ── ABA NEGOCIAÇÕES ───────────────────────────────────────────────────────────
function AbaNegociacoes({ negs, setNegs }) {
  const [modal, setModal] = useState(false);
  const [f, setF] = useState({});
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const ETAPAS = ["Primeiro Contato","Proposta Enviada","Em Negociação","Fechado","Perdido"];
  const abrir = (n=null) => { setF(n||{ nomeEmpresa:"",nomeContato:"",telefone:"",valorProposto:"",etapa:"Primeiro Contato",dataContato:today,proximoContato:"",vendedor:"",notas:"" }); setModal(true); };
  const salvar = () => { setNegs(ns=>f.id?ns.map(n=>n.id===f.id?f:n):[...ns,{...f,id:Date.now()}]); setModal(false); };
  return (
    <div style={{ padding:"24px 32px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <h2 style={{ margin:0, fontSize:18, fontFamily:"'Playfair Display',serif" }}>Pipeline de Negociações</h2>
        <button onClick={()=>abrir()} style={{ padding:"9px 20px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#2B3A3D,#A89181)", color:"#fff", cursor:"pointer", fontWeight:700, fontSize:13 }}>+ Nova</button>
      </div>
      <div style={{ display:"flex", gap:10, marginBottom:22, overflowX:"auto" }}>
        {ETAPAS.map(e=>{ const c=STATUS_COR[e]||STATUS_COR["Primeiro Contato"]; const n=negs.filter(x=>x.etapa===e).length; return(
          <div key={e} style={{ flex:1, minWidth:120, background:c.bg, borderRadius:11, padding:"12px 15px" }}>
            <p style={{ margin:0, fontSize:10, fontWeight:700, color:c.text, textTransform:"uppercase" }}>{e}</p>
            <p style={{ margin:"5px 0 0", fontSize:24, fontWeight:800, color:c.dot, fontFamily:"'Playfair Display',serif" }}>{n}</p>
          </div>
        ); })}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {negs.map(n=>(
          <div key={n.id} style={{ background:"#FFFFFF", borderRadius:12, border:"1px solid #e5e7eb", padding:"15px 19px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:12 }}>
            <div style={{ flex:1 }}><div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:4 }}><span style={{ fontWeight:700, fontSize:14 }}>{n.nomeEmpresa}</span><Badge label={n.etapa}/></div><p style={{ margin:0, fontSize:12, color:"#6b7280" }}>{n.nomeContato} • {n.telefone} • {n.vendedor||"—"}</p>{n.notas&&<p style={{ margin:"3px 0 0", fontSize:12, color:"#374151", fontStyle:"italic" }}>{n.notas}</p>}</div>
            <div style={{ textAlign:"right", flexShrink:0 }}><p style={{ margin:0, fontWeight:800, fontSize:15, color:"#2B3A3D" }}>{formatMoeda(n.valorProposto)}</p><p style={{ margin:"2px 0 8px", fontSize:11, color:"#9ca3af" }}>Próx: {formatData(n.proximoContato)}</p><div style={{ display:"flex", gap:6 }}><button onClick={()=>abrir(n)} style={{ padding:"5px 12px", borderRadius:7, border:"1.5px solid #e5e7eb", background:"#FFFFFF", cursor:"pointer", fontSize:11, fontWeight:700, color:"#2B3A3D" }}>Editar</button><button onClick={()=>setNegs(ns=>ns.filter(x=>x.id!==n.id))} style={{ padding:"5px 12px", borderRadius:7, border:"none", background:"#fef2f2", color:"#dc2626", cursor:"pointer", fontSize:11, fontWeight:700 }}>✕</button></div></div>
          </div>
        ))}
        {negs.length===0&&<p style={{ color:"#9ca3af", textAlign:"center", padding:30 }}>Nenhuma negociação cadastrada.</p>}
      </div>
      {modal&&(
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.55)", backdropFilter:"blur(4px)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
          <div style={{ background:"#FFFFFF", borderRadius:18, padding:"28px", width:480, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 30px 80px rgba(0,0,0,.2)" }}>
            <h3 style={{ margin:"0 0 18px", fontFamily:"'Playfair Display',serif" }}>{f.id?"Editar":"Nova"} Negociação</h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:13 }}>
              <Inp label="Empresa" value={f.nomeEmpresa} onChange={v=>set("nomeEmpresa",v)}/>
              <Inp label="Contato" value={f.nomeContato} onChange={v=>set("nomeContato",v)}/>
              <Inp label="Telefone" value={f.telefone} onChange={v=>set("telefone",v)}/>
              <Inp label="Valor (R$)" value={f.valorProposto} onChange={v=>set("valorProposto",v)} type="number"/>
              <Inp label="Etapa" value={f.etapa} onChange={v=>set("etapa",v)} opts={ETAPAS}/>
              <Inp label="Vendedor" value={f.vendedor} onChange={v=>set("vendedor",v)} opts={VENDEDORES}/>
              <Inp label="Data contato" value={f.dataContato} onChange={v=>set("dataContato",v)} type="date"/>
              <Inp label="Próx. contato" value={f.proximoContato} onChange={v=>set("proximoContato",v)} type="date"/>
            </div>
            <div style={{ marginTop:13 }}>
              <label style={{ fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:0.4, display:"block", marginBottom:4 }}>Notas</label>
              <textarea value={f.notas||""} onChange={e=>set("notas",e.target.value)} rows={3} style={{ width:"100%", padding:"9px 12px", borderRadius:9, border:"1.5px solid #e5e7eb", fontSize:13, fontFamily:"'Outfit',sans-serif", boxSizing:"border-box" }}/>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:18 }}>
              <button onClick={()=>setModal(false)} style={{ flex:1, padding:"10px", borderRadius:9, border:"1.5px solid #e5e7eb", background:"#FFFFFF", cursor:"pointer", fontWeight:600 }}>Cancelar</button>
              <button onClick={salvar} style={{ flex:1, padding:"10px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#2B3A3D,#A89181)", color:"#fff", cursor:"pointer", fontWeight:700 }}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── ABA RELATÓRIOS ────────────────────────────────────────────────────────────
function AbaRelatorios({ clientes, negs }) {
  const ativos = clientes.filter(c=>c.statusContrato==="Ativo");
  const fat = ativos.reduce((s,c)=>s+(Number(c.valorContrato)||0),0);
  const [diag, setDiag] = useState(""); const [loading, setLoading] = useState(false);
  const gerar = async () => {
    setLoading(true); setDiag("");
    const urg = clientes.filter(c=>{ const d=diasAte(c.proximaAtualizacao); return d!==null&&d<=3&&c.statusContrato==="Ativo"; });
    const prompt = `Consultor de CRM para Google Meu Negócio. Analise e dê diagnóstico executivo em português com recomendações práticas.\nDados: ${clientes.length} clientes total, ${ativos.length} ativos, ${clientes.filter(c=>c.statusContrato==="Vencido").length} vencidos, faturamento R$${fat.toFixed(0)}/mês, ${negs.filter(n=>n.etapa!=="Fechado"&&n.etapa!=="Perdido").length} negociações abertas, ${urg.length} atualizações urgentes.\nForneça: 1) Resumo (3 frases) 2) 3 riscos 3) 3 oportunidades 4) 3 ações prioritárias. Use emojis.`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, messages:[{role:"user",content:prompt}] }) });
      const data = await res.json();
      setDiag(data.content?.filter(b=>b.type==="text").map(b=>b.text).join("")||"Erro ao gerar.");
    } catch { setDiag("Erro de conexão."); }
    setLoading(false);
  };
  const pie = [{ name:"Ativos",value:ativos.length,color:"#10b981" },{ name:"Vencidos",value:clientes.filter(c=>c.statusContrato==="Vencido").length,color:"#ef4444" },{ name:"Prospects",value:clientes.filter(c=>c.statusContrato==="Prospect").length,color:"#f59e0b" }].filter(d=>d.value>0);
  const porVend = VENDEDORES.map(v=>({ name:v.split(" ")[0], valor:clientes.filter(c=>c.vendedor===v&&c.statusContrato==="Ativo").reduce((s,c)=>s+(Number(c.valorContrato)||0),0) }));
  const porColab = COLABORADORES.map(col=>({ name:col.split(" ")[0], clientes:clientes.filter(c=>c.colaborador===col&&c.statusContrato==="Ativo").length }));
  const stats = [
    { label:"Clientes Ativos", value:ativos.length, icon:"✅", cor:"#10b981" },
    { label:"Faturamento Mensal", value:formatMoeda(fat), icon:"💰", cor:"#0ea5e9" },
    { label:"Negociações Abertas", value:negs.filter(n=>n.etapa!=="Fechado"&&n.etapa!=="Perdido").length, icon:"🎯", cor:"#f59e0b" },
    { label:"Total Clientes", value:clientes.length, icon:"👥", cor:"#7c3aed" },
    { label:"Ticket Médio", value:ativos.length?formatMoeda(fat/ativos.length):"—", icon:"📊", cor:"#ec4899" },
    { label:"Posts Realizados", value:clientes.reduce((s,c)=>s+(Number(c.postsRealizados)||0),0), icon:"📝", cor:"#14b8a6" },
  ];
  return (
    <div style={{ padding:"24px 32px", display:"flex", flexDirection:"column", gap:24 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:13 }}>
        {stats.map(s=>(
          <div key={s.label} style={{ background:"#FFFFFF", borderRadius:13, border:"1px solid #e5e7eb", padding:"17px 20px" }}>
            <p style={{ margin:"0 0 5px", fontSize:11, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:0.5 }}>{s.icon} {s.label}</p>
            <p style={{ margin:0, fontSize:22, fontWeight:800, color:s.cor, fontFamily:"'Playfair Display',serif" }}>{s.value}</p>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
        <div style={{ background:"#FFFFFF", borderRadius:13, border:"1px solid #e5e7eb", padding:"18px 20px" }}>
          <p style={{ margin:"0 0 14px", fontWeight:800, fontSize:13 }}>📊 Clientes por Status</p>
          <ResponsiveContainer width="100%" height={190}><PieChart><Pie data={pie} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({name,value})=>`${name}: ${value}`} fontSize={11}>{pie.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer>
        </div>
        <div style={{ background:"#FFFFFF", borderRadius:13, border:"1px solid #e5e7eb", padding:"18px 20px" }}>
          <p style={{ margin:"0 0 14px", fontWeight:800, fontSize:13 }}>🏆 Faturamento por Vendedor</p>
          <ResponsiveContainer width="100%" height={190}><BarChart data={porVend} barSize={26}><CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/><XAxis dataKey="name" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}} tickFormatter={v=>`R$${(v/1000).toFixed(0)}k`}/><Tooltip formatter={v=>formatMoeda(v)}/><Bar dataKey="valor" fill="#0ea5e9" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer>
        </div>
        <div style={{ background:"#FFFFFF", borderRadius:13, border:"1px solid #e5e7eb", padding:"18px 20px" }}>
          <p style={{ margin:"0 0 14px", fontWeight:800, fontSize:13 }}>👥 Clientes por Colaborador</p>
          <ResponsiveContainer width="100%" height={190}><BarChart data={porColab} barSize={26}><CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/><XAxis dataKey="name" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}} allowDecimals={false}/><Tooltip/><Bar dataKey="clientes" fill="#7c3aed" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer>
        </div>
        <div style={{ background:"linear-gradient(135deg,#ece9e6,#f2eeeb)", borderRadius:13, border:"1px solid #C0B6A9", padding:"18px 20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div><p style={{ margin:0, fontSize:13, fontWeight:800, color:"#2B3A3D" }}>🤖 Diagnóstico IA</p><p style={{ margin:"2px 0 0", fontSize:11, color:"#6b7280" }}>Análise automática da operação</p></div>
            <button onClick={gerar} disabled={loading} style={{ padding:"9px 18px", borderRadius:9, border:"none", background:loading?"#94a3b8":"linear-gradient(135deg,#1d4ed8,#7c3aed)", color:"#fff", cursor:loading?"not-allowed":"pointer", fontWeight:700, fontSize:12 }}>{loading?"Analisando...":"✨ Gerar"}</button>
          </div>
          {diag&&<div style={{ background:"#FFFFFF", borderRadius:10, padding:"14px 16px", fontSize:12, lineHeight:1.8, color:"#1f2937", whiteSpace:"pre-wrap", border:"1px solid #C0B6A9", maxHeight:200, overflowY:"auto" }}>{diag}</div>}
        </div>
      </div>
    </div>
  );
}

// ── ABA CONTRATO ──────────────────────────────────────────────────────────────
function AbaContrato({ onClienteCriado }) {
  const [etapa, setEtapa] = useState("entrada");
  const [texto, setTexto] = useState("");
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState("");
  const [salvos, setSalvos] = useState([]);

  const analisar = async () => {
    if (texto.trim().length < 20) { setErro("Cole o texto do contrato antes de continuar."); return; }
    setEtapa("analisando"); setErro("");

    const textoLimpo = texto.slice(0, 12000).replace(/\\/g, " ").replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ").trim();

    try {
      const payload = {
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [{
          role: "user",
          content: [
            { type: "text", text: "Você analisa contratos de prestação de serviços de Google Meu Negócio. Extraia os dados e responda SOMENTE com JSON, sem markdown, sem texto extra." },
            { type: "text", text: "Formato: {nomeEmpresa, nomeContato, telefone, cpfCnpj, email, instagram, perfilGoogle, valorContrato (número), condicaoPagamento (Mensal/Bimestral/Trimestral/Semestral/Anual), dataInicio (YYYY-MM-DD), servicosContratados, observacoes, vendedor, whatsappGrupo, confianca (0-100)}." },
            { type: "text", text: "CONTRATO:\n" + textoLimpo }
          ]
        }]
      };

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const raw = await res.text();
      if (!res.ok) {
        let m = "Erro HTTP " + res.status;
        try { m = JSON.parse(raw)?.error?.message || m; } catch {}
        throw new Error(m);
      }

      let api;
      try { api = JSON.parse(raw); }
      catch { throw new Error("Resposta inválida. Tente novamente."); }

      const txt = (api.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim();
      if (!txt) throw new Error("IA retornou resposta vazia.");

      const clean = txt.replace(/```json/gi, "").replace(/```/g, "").trim();
      const match = clean.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Resposta inesperada: " + clean.slice(0, 100));

      const p = JSON.parse(match[0]);
      setDados({
        ...p,
        statusContrato: "Ativo", statusNegociacao: "Fechado",
        postsRealizados: 0, fotosEnviadas: 0, servicosListados: 0,
        ultimaAtualizacao: p.dataInicio || today,
        proximaAtualizacao: addDays(p.dataInicio || today, 30),
        linkPerfil: "", colaborador: ""
      });
      setEtapa("revisao");
    } catch(e) {
      setErro("Erro: " + (e?.message || "Tente novamente."));
      setEtapa("entrada");
    }
  };
  const confirmar = () => {
    const novo = { ...dados, id:Date.now() };
    delete novo.confianca; delete novo.servicosContratados;
    onClienteCriado(novo);
    setSalvos(s=>[{ id:Date.now(), nomeEmpresa:dados.nomeEmpresa, data:today, valor:dados.valorContrato, confianca:dados.confianca }, ...s]);
    setEtapa("sucesso");
  };

  const reiniciar = () => { setEtapa("entrada"); setTexto(""); setDados(null); setErro(""); };
  const sf = (k,v) => setDados(d=>({...d,[k]:v}));

  return (
    <div style={{ padding:"28px 32px", maxWidth:800, margin:"0 auto" }}>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ margin:"0 0 4px", fontFamily:"'Playfair Display',serif", fontSize:21 }}>📋 Importar Contrato com IA</h2>
        <p style={{ margin:0, color:"#6b7280", fontSize:13 }}>Cole o texto do contrato. A IA lê tudo e cadastra o cliente automaticamente.</p>
      </div>

      {/* Etapas */}
      <div style={{ display:"flex", alignItems:"center", marginBottom:22 }}>
        {[["1","Contrato","entrada"],["2","Análise","analisando"],["3","Revisão","revisao"],["4","Concluído","sucesso"]].map(([n,l,id],i,arr)=>{
          const steps=["entrada","analisando","revisao","sucesso"];
          const ativo=steps.indexOf(etapa)===i, feito=steps.indexOf(etapa)>i;
          return (
            <div key={id} style={{ display:"flex", alignItems:"center", flex:i<arr.length-1?1:"none" }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <div style={{ width:30, height:30, borderRadius:"50%", background:feito?"#10b981":ativo?"#0ea5e9":"#e5e7eb", color:feito||ativo?"#fff":"#9ca3af", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:12 }}>{feito?"✓":n}</div>
                <span style={{ fontSize:10, fontWeight:700, color:ativo?"#0ea5e9":feito?"#10b981":"#9ca3af", whiteSpace:"nowrap" }}>{l}</span>
              </div>
              {i<arr.length-1&&<div style={{ flex:1, height:2, background:feito?"#10b981":"#e5e7eb", margin:"0 6px", marginBottom:16 }}/>}
            </div>
          );
        })}
      </div>

      {/* ENTRADA */}
      {etapa==="entrada"&&(
        <div>
          <div style={{ background:"#f0fdf4", border:"1px solid #86efac", borderRadius:11, padding:"13px 16px", marginBottom:16, fontSize:13, color:"#166534", lineHeight:1.7 }}>
            <strong>📌 Como fazer:</strong> Abra o contrato em qualquer formato (PDF, Word, WhatsApp, e-mail) → selecione todo o texto → copie → cole na caixa abaixo → clique em <strong>Analisar com IA</strong>.
          </div>
          <textarea
            value={texto}
            onChange={e=>{ setTexto(e.target.value); setErro(""); }}
            placeholder={"Cole aqui o texto completo do contrato...\n\nExemplo:\nCONTRATO DE PRESTAÇÃO DE SERVIÇOS\nContratante: Empresa XYZ Ltda\nCNPJ: 00.000.000/0001-00\nResponsável: João Silva\nTelefone: (11) 99999-9999\nE-mail: joao@empresa.com\nValor: R$ 350,00 mensais\nServiços: Google Meu Negócio - 10 posts mensais\n..."}
            style={{ width:"100%", minHeight:300, padding:"16px", borderRadius:12, border:"2px solid #e5e7eb", fontSize:13, fontFamily:"'Outfit',sans-serif", resize:"vertical", boxSizing:"border-box", outline:"none", lineHeight:1.7, color:"#1f2937", background:"#FFFFFF" }}
          />
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:7, marginBottom:14 }}>
            <span style={{ fontSize:11, color:texto.length>100?"#10b981":"#9ca3af", fontWeight:600 }}>
              {texto.length===0?"Aguardando texto...":`${texto.length} caracteres ${texto.length>=100?"✓":"— continue"}`}
            </span>
            {texto.length>0&&<button onClick={()=>{setTexto("");setErro("");}} style={{ fontSize:12, color:"#9ca3af", background:"none", border:"none", cursor:"pointer" }}>Limpar</button>}
          </div>
          {erro&&<div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:10, padding:"11px 15px", color:"#dc2626", fontSize:13, marginBottom:14 }}>⚠️ {erro}</div>}
          <button onClick={analisar} disabled={texto.trim().length<20}
            style={{ width:"100%", padding:"14px", borderRadius:11, border:"none", background:texto.trim().length>=20?"linear-gradient(135deg,#0ea5e9,#7c3aed)":"#e5e7eb", color:texto.trim().length>=20?"#fff":"#9ca3af", cursor:texto.trim().length>=20?"pointer":"not-allowed", fontWeight:700, fontSize:15, fontFamily:"'Outfit',sans-serif" }}>
            🤖 Analisar Contrato com IA
          </button>
          {salvos.length>0&&(
            <div style={{ marginTop:26 }}>
              <p style={{ margin:"0 0 10px", fontWeight:800, fontSize:13, color:"#374151" }}>📁 Importados recentemente</p>
              {salvos.map(c=>(
                <div key={c.id} style={{ background:"#FFFFFF", borderRadius:10, border:"1px solid #e5e7eb", padding:"10px 15px", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <div><p style={{ margin:0, fontWeight:700, fontSize:13 }}>{c.nomeEmpresa}</p><p style={{ margin:"2px 0 0", fontSize:11, color:"#9ca3af" }}>{formatData(c.data)}</p></div>
                  <div style={{ textAlign:"right" }}><p style={{ margin:0, fontWeight:700, color:"#2B3A3D", fontSize:13 }}>{formatMoeda(c.valor)}</p><p style={{ margin:0, fontSize:11, color:c.confianca>=80?"#10b981":"#f59e0b" }}>{c.confianca}%</p></div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ANALISANDO */}
      {etapa==="analisando"&&(
        <div style={{ textAlign:"center", padding:"60px 20px" }}>
          <div style={{ fontSize:58, marginBottom:14, display:"inline-block", animation:"spin 2s linear infinite" }}>🤖</div>
          <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
          <h3 style={{ margin:"0 0 8px", fontFamily:"'Playfair Display',serif", fontSize:19 }}>Lendo o contrato...</h3>
          <p style={{ color:"#6b7280", fontSize:13 }}>A IA está extraindo todos os dados</p>
        </div>
      )}

      {/* REVISÃO */}
      {etapa==="revisao"&&dados&&(
        <div>
          <div style={{ background:dados.confianca>=80?"#f0fdf4":"#fefce8", border:`1px solid ${dados.confianca>=80?"#86efac":"#fde68a"}`, borderRadius:11, padding:"12px 17px", marginBottom:18, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <p style={{ margin:0, fontWeight:800, fontSize:14, color:dados.confianca>=80?"#166534":"#92400e" }}>{dados.confianca>=80?"✅ Dados extraídos com sucesso":"⚠️ Verifique os campos"}</p>
              <p style={{ margin:"2px 0 0", fontSize:12, color:"#6b7280" }}>Confiança: {dados.confianca}% • Edite se necessário</p>
            </div>
            <span style={{ fontSize:22, fontWeight:800, color:dados.confianca>=80?"#10b981":"#f59e0b", fontFamily:"'Playfair Display',serif" }}>{dados.confianca}%</span>
          </div>
          {dados.servicosContratados&&<div style={{ background:"#ece9e6", border:"1px solid #C0B6A9", borderRadius:10, padding:"9px 15px", marginBottom:15, fontSize:13, color:"#2B3A3D" }}>📋 <strong>Serviços:</strong> {dados.servicosContratados}</div>}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:11, marginBottom:13 }}>
            {[["Nome da Empresa","nomeEmpresa"],["Nome do Contato","nomeContato"],["Telefone","telefone"],["CPF / CNPJ","cpfCnpj"],["E-mail","email"],["Instagram","instagram"],["Perfil Google","perfilGoogle"],["WhatsApp Grupo","whatsappGrupo"]].map(([l,k])=>(
              <div key={k} style={{ display:"flex", flexDirection:"column", gap:3 }}>
                <label style={{ fontSize:10, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:0.4 }}>{l}</label>
                <input value={dados[k]||""} onChange={e=>sf(k,e.target.value)} style={{ padding:"8px 11px", borderRadius:8, border:`1.5px solid ${dados[k]?"#86efac":"#fde68a"}`, fontSize:13, outline:"none", fontFamily:"'Outfit',sans-serif", background:dados[k]?"#fff":"#fffbeb" }}/>
              </div>
            ))}
            <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
              <label style={{ fontSize:10, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:0.4 }}>Valor (R$)</label>
              <input type="number" value={dados.valorContrato||""} onChange={e=>sf("valorContrato",e.target.value)} style={{ padding:"8px 11px", borderRadius:8, border:`1.5px solid ${dados.valorContrato?"#86efac":"#fde68a"}`, fontSize:13, outline:"none", fontFamily:"'Outfit',sans-serif" }}/>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
              <label style={{ fontSize:10, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:0.4 }}>Pagamento</label>
              <select value={dados.condicaoPagamento||""} onChange={e=>sf("condicaoPagamento",e.target.value)} style={{ padding:"8px 11px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:13, background:"#FFFFFF", fontFamily:"'Outfit',sans-serif" }}>
                {["Mensal","Bimestral","Trimestral","Semestral","Anual"].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
              <label style={{ fontSize:10, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:0.4 }}>Data Início</label>
              <input type="date" value={dados.dataInicio||today} onChange={e=>{sf("dataInicio",e.target.value);sf("ultimaAtualizacao",e.target.value);sf("proximaAtualizacao",addDays(e.target.value,30));}} style={{ padding:"8px 11px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:13, fontFamily:"'Outfit',sans-serif" }}/>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
              <label style={{ fontSize:10, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:0.4 }}>Vendedor</label>
              <select value={dados.vendedor||""} onChange={e=>sf("vendedor",e.target.value)} style={{ padding:"8px 11px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:13, background:"#FFFFFF", fontFamily:"'Outfit',sans-serif" }}>
                <option value="">Selecionar...</option>
                {VENDEDORES.map(v=><option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:3, marginBottom:13 }}>
            <label style={{ fontSize:10, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:0.4 }}>Observações</label>
            <textarea value={dados.observacoes||""} onChange={e=>sf("observacoes",e.target.value)} rows={2} style={{ padding:"9px 11px", borderRadius:8, border:"1.5px solid #e5e7eb", fontSize:13, fontFamily:"'Outfit',sans-serif", resize:"vertical" }}/>
          </div>
          <div style={{ background:"#f0fdf4", border:"1px solid #86efac", borderRadius:10, padding:"10px 14px", marginBottom:15, fontSize:13, color:"#166534" }}>
            📅 <strong>Próxima atualização GMB:</strong> {formatData(dados.proximaAtualizacao)}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={reiniciar} style={{ padding:"11px 20px", borderRadius:10, border:"1.5px solid #e5e7eb", background:"#FFFFFF", cursor:"pointer", fontWeight:600, fontSize:13, fontFamily:"'Outfit',sans-serif" }}>← Voltar</button>
            <button onClick={confirmar} style={{ flex:1, padding:"12px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#2B3A3D,#A89181)", color:"#fff", cursor:"pointer", fontWeight:700, fontSize:14, fontFamily:"'Outfit',sans-serif" }}>
              ✅ Confirmar e Criar Cliente no CRM
            </button>
          </div>
        </div>
      )}

      {/* SUCESSO */}
      {etapa==="sucesso"&&dados&&(
        <div style={{ textAlign:"center", padding:"40px 20px" }}>
          <div style={{ fontSize:66, marginBottom:12 }}>🎉</div>
          <h3 style={{ margin:"0 0 8px", fontFamily:"'Playfair Display',serif", fontSize:22, color:"#10b981" }}>Cliente criado com sucesso!</h3>
          <p style={{ color:"#6b7280", fontSize:13, marginBottom:22 }}><strong>{dados.nomeEmpresa}</strong> foi adicionado ao CRM.</p>
          <div style={{ background:"#f0fdf4", border:"1px solid #86efac", borderRadius:12, padding:"17px 22px", maxWidth:360, margin:"0 auto 22px", textAlign:"left" }}>
            {[["🏢","Empresa",dados.nomeEmpresa],["👤","Contato",dados.nomeContato],["📱","Telefone",dados.telefone],["💰","Valor",formatMoeda(dados.valorContrato)],["📅","Próx. atualização",formatData(dados.proximaAtualizacao)]].map(([ico,l,v])=>(
              <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:7, fontSize:13 }}>
                <span style={{ color:"#6b7280" }}>{ico} {l}</span>
                <span style={{ fontWeight:700 }}>{v||"—"}</span>
              </div>
            ))}
          </div>
          <button onClick={reiniciar} style={{ padding:"11px 26px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#2B3A3D,#A89181)", color:"#fff", cursor:"pointer", fontWeight:700, fontSize:14, fontFamily:"'Outfit',sans-serif" }}>
            📋 Importar Outro Contrato
          </button>
        </div>
      )}
    </div>
  );
}

// ── APP PRINCIPAL ─────────────────────────────────────────────────────────────
export default function App() {
  const [clientes, setClientes] = useState(CLIENTES_DEMO);
  const [negs, setNegs] = useState(NEGS_DEMO);
  const [aba, setAba] = useState("clientes");
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [filtroColab, setFiltroColab] = useState("Todos");
  const [selecionado, setSelecionado] = useState(null);
  const [modalCliente, setModalCliente] = useState(null);
  const [modalAtualizar, setModalAtualizar] = useState(null);
  const [ordenar, setOrdenar] = useState("nomeEmpresa");

  const alertasN = clientes.filter(c=>{ const d=diasAte(c.proximaAtualizacao); return (d!==null&&d<=1&&c.statusContrato==="Ativo")||c.statusContrato==="Vencido"; }).length;

  const filtrados = useMemo(()=>clientes
    .filter(c=>filtroStatus==="Todos"||c.statusContrato===filtroStatus)
    .filter(c=>filtroColab==="Todos"||c.colaborador===filtroColab)
    .filter(c=>!busca||[c.nomeEmpresa,c.nomeContato,c.email,c.cpfCnpj].some(f=>f?.toLowerCase().includes(busca.toLowerCase())))
    .sort((a,b)=>ordenar==="valorContrato"?(b.valorContrato||0)-(a.valorContrato||0):ordenar==="proximaAtualizacao"?(diasAte(a.proximaAtualizacao)||999)-(diasAte(b.proximaAtualizacao)||999):(a[ordenar]||"").localeCompare(b[ordenar]||""))
  ,[clientes,filtroStatus,filtroColab,busca,ordenar]);

  const salvar = f => { if(f.id){ setClientes(cs=>cs.map(c=>c.id===f.id?{...c,...f}:c)); if(selecionado?.id===f.id) setSelecionado({...selecionado,...f}); } else { setClientes(cs=>[{...f,id:Date.now()},...cs]); } setModalCliente(null); };
  const excluir = id => setClientes(cs=>cs.filter(c=>c.id!==id));
  const registrarAtualizacao = (id,data,notas) => { setClientes(cs=>cs.map(c=>c.id===id?{...c,ultimaAtualizacao:data,proximaAtualizacao:addDays(data,30),observacoes:notas?`[${data}] ${notas}\n${c.observacoes}`:c.observacoes,postsRealizados:(Number(c.postsRealizados)||0)+10}:c)); if(selecionado?.id===id) setSelecionado(p=>({...p,ultimaAtualizacao:data,proximaAtualizacao:addDays(data,30)})); setModalAtualizar(null); };
  const novoDeContrato = c => { setClientes(cs=>[c,...cs]); setAba("clientes"); };

  const ABAS = [
    { id:"clientes", label:"Clientes", icon:"👥" },
    { id:"alertas",  label:"Alertas",  icon:"🔔", badge:alertasN },
    { id:"negs",     label:"Negociações", icon:"🎯" },
    { id:"rel",      label:"Relatórios", icon:"📊" },
    { id:"contrato", label:"Importar Contrato", icon:"📋" },
  ];

  return (
    <div style={{ fontFamily:"'Outfit',sans-serif", background:"#F2EFEB", minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>

      <header style={{ background:"#2B3A3D", padding:"0 20px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0, borderBottom:"2px solid #A89181" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {/* Logo SVG baseada na paleta da marca */}
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="10" fill="#A89181"/>
            <text x="20" y="27" textAnchor="middle" fill="#2B3A3D" fontSize="20" fontWeight="900" fontFamily="serif">G</text>
          </svg>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:900, color:"#fff", letterSpacing:0.5, lineHeight:1.1 }}>CRM Google</div>
            <div style={{ fontSize:10, color:"#C0B6A9", fontWeight:600, letterSpacing:1.5, textTransform:"uppercase" }}>Google Meu Negócio</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:4, overflowX:"auto" }}>
          {ABAS.map(a=>(
            <button key={a.id} onClick={()=>setAba(a.id)}
              style={{ padding:"6px 13px", borderRadius:7, border:"none", background:aba===a.id?"#0ea5e9":"transparent", color:aba===a.id?"#fff":"#94a3b8", cursor:"pointer", fontWeight:700, fontSize:12, display:"flex", alignItems:"center", gap:5, fontFamily:"'Outfit',sans-serif", whiteSpace:"nowrap" }}>
              {a.icon} {a.label}
              {a.badge>0&&<span style={{ background:"#ef4444", color:"#fff", borderRadius:10, padding:"1px 5px", fontSize:10, fontWeight:800 }}>{a.badge}</span>}
            </button>
          ))}
        </div>
        <button onClick={()=>setModalCliente({})} style={{ padding:"7px 16px", borderRadius:8, border:"none", background:"linear-gradient(135deg,#2B3A3D,#A89181)", color:"#fff", cursor:"pointer", fontWeight:700, fontSize:12, fontFamily:"'Outfit',sans-serif", whiteSpace:"nowrap" }}>+ Novo</button>
      </header>

      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

        {aba==="clientes"&&(
          <>
            <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
              <div style={{ padding:"13px 24px", background:"#FFFFFF", borderBottom:"1px solid #e5e7eb", display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="🔍 Buscar..."
                  style={{ flex:1, minWidth:160, padding:"8px 13px", borderRadius:9, border:"1.5px solid #e5e7eb", fontSize:13, outline:"none", fontFamily:"'Outfit',sans-serif" }}/>
                {["Todos","Ativo","Vencido","Prospect","Cancelado"].map(s=>(
                  <button key={s} onClick={()=>setFiltroStatus(s)}
                    style={{ padding:"6px 13px", borderRadius:8, border:"1.5px solid", borderColor:filtroStatus===s?"#0ea5e9":"#e5e7eb", background:filtroStatus===s?"#e0f2fe":"#fff", color:filtroStatus===s?"#0284c7":"#6b7280", cursor:"pointer", fontWeight:600, fontSize:12, fontFamily:"'Outfit',sans-serif" }}>
                    {s}
                  </button>
                ))}
                <select value={filtroColab} onChange={e=>setFiltroColab(e.target.value)} style={{ padding:"7px 12px", borderRadius:9, border:"1.5px solid #e5e7eb", fontSize:12, fontFamily:"'Outfit',sans-serif" }}>
                  <option value="Todos">Todos colaboradores</option>
                  {COLABORADORES.map(c=><option key={c}>{c}</option>)}
                </select>
                <select value={ordenar} onChange={e=>setOrdenar(e.target.value)} style={{ padding:"7px 12px", borderRadius:9, border:"1.5px solid #e5e7eb", fontSize:12, fontFamily:"'Outfit',sans-serif" }}>
                  <option value="nomeEmpresa">Nome A-Z</option>
                  <option value="valorContrato">Maior valor</option>
                  <option value="proximaAtualizacao">Próx. atualização</option>
                </select>
              </div>
              <div style={{ flex:1, overflowY:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead style={{ position:"sticky", top:0, zIndex:1 }}>
                    <tr style={{ background:"#f7f4f1", borderBottom:"2px solid #e5e7eb" }}>
                      {["Empresa / Contato","Perfil Google","Próx. Atualização","Colaborador","Valor","Status",""].map(h=>(
                        <th key={h} style={{ padding:"10px 15px", textAlign:"left", fontSize:10, fontWeight:800, color:"#9ca3af", textTransform:"uppercase", letterSpacing:0.5, whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtrados.length===0&&<tr><td colSpan={7} style={{ padding:40, textAlign:"center", color:"#9ca3af" }}>Nenhum cliente encontrado.</td></tr>}
                    {filtrados.map(c=>{
                      const dias=diasAte(c.proximaAtualizacao);
                      const urg=dias!==null&&dias<=1&&c.statusContrato==="Ativo";
                      return (
                        <tr key={c.id} onClick={()=>setSelecionado(selecionado?.id===c.id?null:c)}
                          style={{ borderBottom:"1px solid #f1f5f9", cursor:"pointer", background:selecionado?.id===c.id?"#f0f9ff":urg?"#fff7f7":"transparent" }}>
                          <td style={{ padding:"12px 15px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                              <div style={{ width:34, height:34, borderRadius:10, background:"linear-gradient(135deg,#2B3A3D,#A89181)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:14, flexShrink:0 }}>{c.nomeEmpresa[0]}</div>
                              <div><p style={{ margin:0, fontWeight:700, fontSize:13 }}>{c.nomeEmpresa}</p><p style={{ margin:0, fontSize:11, color:"#9ca3af" }}>{c.nomeContato} • {c.telefone}</p></div>
                            </div>
                          </td>
                          <td style={{ padding:"12px 15px", fontSize:12, color:"#374151", maxWidth:160 }}><span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"block", maxWidth:150 }}>{c.perfilGoogle||"—"}</span></td>
                          <td style={{ padding:"12px 15px", fontSize:12 }}>
                            {c.proximaAtualizacao?(
                              <div>
                                <span style={{ color:urg?"#dc2626":dias<=7?"#f59e0b":"#374151", fontWeight:urg?700:400 }}>{formatData(c.proximaAtualizacao)}</span>
                                {dias!==null&&<span style={{ display:"block", fontSize:10, color:urg?"#dc2626":"#9ca3af", fontWeight:urg?700:400 }}>{dias<0?`${Math.abs(dias)}d atrasado`:dias===0?"hoje!":"em "+dias+"d"}</span>}
                              </div>
                            ):<span style={{ color:"#d1d5db" }}>—</span>}
                          </td>
                          <td style={{ padding:"12px 15px", fontSize:12 }}>{c.colaborador||<span style={{ color:"#d1d5db" }}>—</span>}</td>
                          <td style={{ padding:"12px 15px", fontSize:13, fontWeight:700, color:"#2B3A3D" }}>{formatMoeda(c.valorContrato)}</td>
                          <td style={{ padding:"12px 15px" }}><Badge label={c.statusContrato}/></td>
                          <td style={{ padding:"12px 15px" }}><button onClick={e=>{e.stopPropagation();setModalAtualizar(c);}} style={{ padding:"5px 10px", borderRadius:7, border:"none", background:"#e8ecec", color:"#2B3A3D", cursor:"pointer", fontSize:11, fontWeight:700 }}>🔄</button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div style={{ padding:"9px 15px", fontSize:11, color:"#9ca3af", background:"#f7f4f1", borderTop:"1px solid #f1f5f9" }}>
                  {filtrados.length} cliente(s) • {formatMoeda(filtrados.filter(c=>c.statusContrato==="Ativo").reduce((s,c)=>s+(Number(c.valorContrato)||0),0))} faturamento
                </div>
              </div>
            </div>
            {selecionado&&<PainelCliente c={selecionado} onClose={()=>setSelecionado(null)} onEdit={c=>setModalCliente(c)} onDelete={id=>{excluir(id);setSelecionado(null);}} onAtualizar={c=>setModalAtualizar(c)}/>}
          </>
        )}

        {aba==="alertas"&&<div style={{ flex:1, overflowY:"auto" }}><AbaAlertas clientes={clientes}/></div>}
        {aba==="negs"&&<div style={{ flex:1, overflowY:"auto" }}><AbaNegociacoes negs={negs} setNegs={setNegs}/></div>}
        {aba==="rel"&&<div style={{ flex:1, overflowY:"auto" }}><AbaRelatorios clientes={clientes} negs={negs}/></div>}
        {aba==="contrato"&&<div style={{ flex:1, overflowY:"auto" }}><AbaContrato onClienteCriado={novoDeContrato}/></div>}
      </div>

      {modalCliente!==null&&<ModalCliente cliente={modalCliente?.id?modalCliente:null} onClose={()=>setModalCliente(null)} onSave={salvar}/>}
      {modalAtualizar&&<ModalAtualizar cliente={modalAtualizar} onClose={()=>setModalAtualizar(null)} onSalvar={registrarAtualizacao}/>}
    </div>
  );
}
