import json, sys
sys.path.insert(0, ".")
from charts import *

proj = json.load(open("proj.json"))
C, I, O = proj["Conservador"], proj["Intermediário"], proj["Otimista"]
def brl(v): return ("–" if v<0 else "") + "R$\u00a0" + f"{abs(v):,.0f}".replace(",", ".")

ch = {}
ch["CHART_RECEITA"] = bar_chart(["10","25","50","75","100","200"], [10,25,50,75,100,200], labels=["10","25","50","75","100","200"], ylab="", highlight=4, h=210)
ch["CHART_COMPOSICAO"] = stacked_h([("Inadimplência",5),("Taxas",3),("Impostos",15),("Margem de contribuição",77)], h=64, colors=[GRAPH, GRAY, BLUE_M, BLUE_D])
ch["CHART_SOLIC"] = bar_chart(["Conservador 20%","Intermediário 35%","Otimista 50%"], [25,15,10], colors=[BLUE_L,BLUE_M,BLUE_D], h=190)
ch["CHART_ORCAMENTO"] = hbar([("Diretor estratégico",8000),("Gestor operacional",6500),("Analista de relacionamento",4000),("Analista de auditoria",4000),("Reserva operacional",4000),("Suporte tecnológico",2500),("Administrativo",2500),("Ferramentas e licenças",1500),("Treinamento e materiais",1000)])
# break-even: contribution 0.77k per company vs stepped fixed+CAC
xs = list(range(0,101,10))
contrib = [x*0.77 for x in xs]
fixed = [ (17+3) if x<15 else ((25+5) if x<40 else (34+5)) for x in xs]
ch["CHART_BE"] = line_chart([str(x) for x in xs], [fixed, contrib], colors=(GRAPH, BLUE), legend=["Custo fixo + aquisição (R$ mil)","Contribuição (R$ mil)"], xlab="Empresas ativas", h=230)
months=[str(m) for m in range(1,13)]
ch["CHART_EMPRESAS"] = line_chart(months, [[r["n"] for r in C],[r["n"] for r in I],[r["n"] for r in O]], legend=["Conservador","Intermediário","Otimista"], h=250)
ch["CHART_MRR"] = line_chart(months, [[r["mrr"]/1000 for r in C],[r["mrr"]/1000 for r in I],[r["mrr"]/1000 for r in O]], legend=["Conservador","Intermediário","Otimista"], h=250)
ch["CHART_CAIXA"] = line_chart(months, [[r["cash"]/1000 for r in C],[r["cash"]/1000 for r in I],[r["cash"]/1000 for r in O]], legend=["Conservador","Intermediário","Otimista"], h=280)
ch["CHART_INDICE"] = stacked_h([("Participação operacional",25),("Solicitações vs. meta",20),("Avaliações vs. meta",25),("Resposta às avaliações",15),("Qualidade e conformidade",15)], h=64)
ch["CHART_GANTT"] = gantt([
 ("Oferta, preços e contrato",0,10,0),("Formulário, base e painel v1",3,15,0),("Trilha de treinamento e manual v1",5,15,0),("Cobrança recorrente e CRM",3,12,0),("Contratação do gestor operacional",0,15,0),("Lista qualificada e diagnósticos",3,15,0),
 ("Onboarding das 10 fundadoras",15,22,1),("Execução e auditoria semanal (piloto)",18,30,1),("Reuniões de grupo (piloto)",22,30,1),("Relatório do piloto e recalibração",28,32,1),
 ("Vendas e onboardings (15–20 novas)",30,60,2),("Analista de relacionamento",30,45,2),("Migração Airtable + automações",30,55,2),("Webhook pagamento e painel individual",45,60,2),("Primeiro relatório mensal a 100%",55,62,2),
 ("Vendas e onboardings (15–20 novas)",60,90,3),("Documentos operacionais finais",60,85,3),("Relatório semiautomático e diagnósticos",65,90,3),("Decisão: equipe de regime e escala",85,90,3),
], phases=[("F1",0,15,0),("F2",15,30,1),("F3",30,60,2),("F4",60,90,3)])

rows=""
for name,S in (("Conservador",C),("Intermediário",I),("Otimista",O)):
    rows += "<tr><td><b>"+name+"</b> · empresas</td>" + "".join(f'<td class="c">{r["n"]}</td>' for r in S) + "</tr>"
    rows += "<tr><td class='small'>MRR (R$ mil)</td>" + "".join(f'<td class="c">{r["mrr"]//1000}</td>' for r in S) + "</tr>"
ch["ROWS_EMPRESAS"]=rows
def summ(S):
    return dict(rec=sum(r["mrr"] for r in S), arr=S[-1]["mrr"]*12, res=sum(r["result"] for r in S)-15000, mn=min(r["cash"] for r in S), n=S[-1]["n"], first=next((r["m"] for r in S if r["result"]>0), None))
s=[summ(C),summ(I),summ(O)]
ch["ROWS_RESUMO"] = (
 "<tr><td>Empresas ativas no mês 12</td>"+"".join(f'<td class="r">{x["n"]}</td>' for x in s)+"</tr>"
 "<tr><td>Receita bruta faturada em 12 meses</td>"+"".join(f'<td class="r">{brl(x["rec"])}</td>' for x in s)+"</tr>"
 "<tr><td>ARR ao fim do mês 12</td>"+"".join(f'<td class="r">{brl(x["arr"])}</td>' for x in s)+"</tr>"
 "<tr><td>Primeiro mês com resultado positivo</td>"+"".join(f'<td class="r">{("mês "+str(x["first"])) if x["first"] else "não ocorre no ano 1"}</td>' for x in s)+"</tr>"
 "<tr><td>Resultado acumulado em 12 meses (após R$ 15 mil iniciais)</td>"+"".join(f'<td class="r">{brl(x["res"])}</td>' for x in s)+"</tr>"
 "<tr class='tot'><td>Caixa mínimo acumulado (capital necessário)</td>"+"".join(f'<td class="r">{brl(x["mn"])}</td>' for x in s)+"</tr>")
ch["ROWS_CAIXA"] = "".join(f'<tr><td>{r["m"]}</td><td class="r">{r["n"]}</td><td class="r">{r["received"]:,}</td><td class="r">–{r["fees"]+r["tax"]:,}</td><td class="r">–{r["fixed"]+r["cac"]:,}</td><td class="r">{brl(r["result"]).replace("R$ ","")}</td><td class="r">{brl(r["cash"]).replace("R$ ","")}</td></tr>'.replace(",",".") for r in I)

html = "".join(open(f"t{i}.html",encoding="utf-8").read() for i in range(1,9))
for k,v in ch.items(): html = html.replace("{{"+k+"}}", v)
import re
left = re.findall(r"\{\{[A-Z_]+\}\}", html)
assert not left, left
open("projeto.html","w",encoding="utf-8").write(html)
print("ok", len(html))
