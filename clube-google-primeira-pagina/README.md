# Clube Google Primeira Página — Projeto Executivo e Operacional

PDF: `Clube-Google-Primeira-Pagina-Projeto-Executivo.pdf` (41 páginas, A4).

## Como regenerar

```bash
python3 build.py      # monta projeto.html a partir de t1..t8.html + gráficos SVG (charts.py) + proj.json
node render.js Clube-Google-Primeira-Pagina-Projeto-Executivo.pdf   # renderiza via Chromium/Playwright
```

- `t1.html` … `t8.html`: conteúdo por bloco de páginas (t1 inclui o CSS).
- `charts.py`: geradores de gráficos SVG (barras, linhas, Gantt, composição).
- `proj.json`: projeções de 12 meses nos três cenários (gerado por um script de hipóteses; edite os valores e rode `build.py`).
