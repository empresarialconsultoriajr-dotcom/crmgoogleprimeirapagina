# Helpers de gráficos SVG (estático, para PDF). Paleta: azul sequencial + grafite.
BLUE="#1D4ED8"; BLUE_D="#1E3A8A"; BLUE_L="#93C5FD"; BLUE_M="#3B82F6"; GRAPH="#374151"; GRAY="#6B7280"; LINE="#E5E7EB"; TXT="#111827"
FONT="font-family:Inter,Arial,sans-serif;"

def fmt_brl(v, short=True):
    if short:
        if abs(v)>=1_000_000: return f"R$ {v/1_000_000:.1f} mi".replace(".",",")
        if abs(v)>=1000: return f"R$ {v/1000:.0f} mil"
        return f"R$ {v:.0f}"
    return "R$ " + f"{v:,.0f}".replace(",",".")

def bar_chart(cats, vals, w=520, h=230, color=BLUE, labels=None, ylab="", colors=None, pad_l=46, highlight=None):
    pad_t=18; pad_b=34; pad_r=10
    iw=w-pad_l-pad_r; ih=h-pad_t-pad_b
    mx=max(vals)*1.15
    n=len(vals); slot=iw/n; bw=min(slot*0.58, 64)
    s=[f'<svg viewBox="0 0 {w} {h}" width="100%" style="{FONT}max-height:{h}px">']
    # gridlines (4)
    for i in range(5):
        y=pad_t+ih-ih*i/4
        s.append(f'<line x1="{pad_l}" y1="{y:.1f}" x2="{w-pad_r}" y2="{y:.1f}" stroke="{LINE}" stroke-width="1"/>')
        s.append(f'<text x="{pad_l-6}" y="{y+3:.1f}" font-size="9" fill="{GRAY}" text-anchor="end">{ylab_fmt(mx*i/4, ylab)}</text>')
    for i,(c,v) in enumerate(zip(cats,vals)):
        x=pad_l+slot*i+(slot-bw)/2; bh=ih*v/mx; y=pad_t+ih-bh
        col = (colors[i] if colors else color)
        if highlight is not None and i==highlight: col=BLUE_D
        s.append(f'<path d="M{x:.1f},{pad_t+ih} V{y+4:.1f} a4,4 0 0 1 4,-4 H{x+bw-4:.1f} a4,4 0 0 1 4,4 V{pad_t+ih} Z" fill="{col}"/>')
        lab = labels[i] if labels else str(v)
        s.append(f'<text x="{x+bw/2:.1f}" y="{y-5:.1f}" font-size="10" font-weight="600" fill="{TXT}" text-anchor="middle">{lab}</text>')
        s.append(f'<text x="{x+bw/2:.1f}" y="{pad_t+ih+15}" font-size="9.5" fill="{GRAPH}" text-anchor="middle">{c}</text>')
    s.append(f'<line x1="{pad_l}" y1="{pad_t+ih}" x2="{w-pad_r}" y2="{pad_t+ih}" stroke="{GRAY}" stroke-width="1"/>')
    s.append('</svg>'); return "".join(s)

def ylab_fmt(v, kind):
    if kind=="brl": return fmt_brl(v)
    if kind=="pct": return f"{v:.0f}%"
    if v>=1000: return f"{v/1000:.0f} mil"
    return f"{v:.0f}"

def grouped_bar(cats, series, w=540, h=240, colors=(BLUE_L,BLUE_M,BLUE_D), ylab="", legend=None, pad_l=46):
    pad_t=26; pad_b=34; pad_r=10
    iw=w-pad_l-pad_r; ih=h-pad_t-pad_b
    mx=max(max(sv) for sv in series)*1.18
    n=len(cats); k=len(series); slot=iw/n; gw=slot*0.72; bw=(gw-2*(k-1))/k
    s=[f'<svg viewBox="0 0 {w} {h}" width="100%" style="{FONT}max-height:{h}px">']
    for i in range(5):
        y=pad_t+ih-ih*i/4
        s.append(f'<line x1="{pad_l}" y1="{y:.1f}" x2="{w-pad_r}" y2="{y:.1f}" stroke="{LINE}"/>')
        s.append(f'<text x="{pad_l-6}" y="{y+3:.1f}" font-size="9" fill="{GRAY}" text-anchor="end">{ylab_fmt(mx*i/4, ylab)}</text>')
    for i,c in enumerate(cats):
        x0=pad_l+slot*i+(slot-gw)/2
        for j,sv in enumerate(series):
            v=sv[i]; x=x0+j*(bw+2); bh=ih*v/mx; y=pad_t+ih-bh
            s.append(f'<path d="M{x:.1f},{pad_t+ih} V{y+3:.1f} a3,3 0 0 1 3,-3 H{x+bw-3:.1f} a3,3 0 0 1 3,3 V{pad_t+ih} Z" fill="{colors[j]}"/>')
            s.append(f'<text x="{x+bw/2:.1f}" y="{y-4:.1f}" font-size="8.5" font-weight="600" fill="{TXT}" text-anchor="middle">{ylab_fmt(v,ylab) if ylab=="brl" else v}</text>')
        s.append(f'<text x="{x0+gw/2:.1f}" y="{pad_t+ih+15}" font-size="9.5" fill="{GRAPH}" text-anchor="middle">{c}</text>')
    s.append(f'<line x1="{pad_l}" y1="{pad_t+ih}" x2="{w-pad_r}" y2="{pad_t+ih}" stroke="{GRAY}"/>')
    if legend:
        lx=pad_l
        for j,l in enumerate(legend):
            s.append(f'<rect x="{lx}" y="4" width="10" height="10" rx="2" fill="{colors[j]}"/><text x="{lx+14}" y="13" font-size="9" fill="{GRAPH}">{l}</text>')
            lx+=14+len(l)*5.6+16
    s.append('</svg>'); return "".join(s)

def line_chart(xs, series, w=540, h=250, colors=(BLUE_L,BLUE_M,BLUE_D), legend=None, ylab="", zero_line=False, pad_l=52, xlab="Mês", end_labels=True, ymin=None):
    pad_t=26; pad_b=34; pad_r=56
    iw=w-pad_l-pad_r; ih=h-pad_t-pad_b
    allv=[v for sv in series for v in sv]
    mx=max(allv); mn=min(allv) if ymin is None else ymin
    if mn>0 and not zero_line: mn=0
    if mn>0: mn=0
    rng=(mx-mn) or 1
    mx=mx+rng*0.08; mn = mn - rng*0.08 if mn<0 else mn; rng=mx-mn
    def X(i): return pad_l+iw*i/(len(xs)-1)
    def Y(v): return pad_t+ih-(v-mn)/rng*ih
    s=[f'<svg viewBox="0 0 {w} {h}" width="100%" style="{FONT}max-height:{h}px">']
    for i in range(5):
        v=mn+rng*i/4; y=Y(v)
        s.append(f'<line x1="{pad_l}" y1="{y:.1f}" x2="{w-pad_r}" y2="{y:.1f}" stroke="{LINE}"/>')
        s.append(f'<text x="{pad_l-6}" y="{y+3:.1f}" font-size="9" fill="{GRAY}" text-anchor="end">{ylab_fmt(v,ylab) if v>=0 else "-"+ylab_fmt(-v,ylab)}</text>')
    if mn<0:
        s.append(f'<line x1="{pad_l}" y1="{Y(0):.1f}" x2="{w-pad_r}" y2="{Y(0):.1f}" stroke="{GRAY}" stroke-width="1.2"/>')
    for i,x in enumerate(xs):
        s.append(f'<text x="{X(i):.1f}" y="{pad_t+ih+15}" font-size="9" fill="{GRAPH}" text-anchor="middle">{x}</text>')
    s.append(f'<text x="{(pad_l+w-pad_r)/2:.1f}" y="{h-4}" font-size="9" fill="{GRAY}" text-anchor="middle">{xlab}</text>')
    for j,sv in enumerate(series):
        pts=" ".join(f"{X(i):.1f},{Y(v):.1f}" for i,v in enumerate(sv))
        s.append(f'<polyline points="{pts}" fill="none" stroke="{colors[j]}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>')
        s.append(f'<circle cx="{X(len(sv)-1):.1f}" cy="{Y(sv[-1]):.1f}" r="3.5" fill="{colors[j]}" stroke="#fff" stroke-width="1.5"/>')
        if end_labels:
            lab = ylab_fmt(sv[-1],ylab) if sv[-1]>=0 else "-"+ylab_fmt(-sv[-1],ylab)
            s.append(f'<text x="{X(len(sv)-1)+7:.1f}" y="{Y(sv[-1])+3.5:.1f}" font-size="9" font-weight="600" fill="{TXT}">{lab}</text>')
    if legend:
        lx=pad_l
        for j,l in enumerate(legend):
            s.append(f'<line x1="{lx}" y1="9" x2="{lx+16}" y2="9" stroke="{colors[j]}" stroke-width="2.5"/><text x="{lx+20}" y="12.5" font-size="9" fill="{GRAPH}">{l}</text>')
            lx+=20+len(l)*5.6+16
    s.append('</svg>'); return "".join(s)

def hbar(items, w=520, color=BLUE, total=None, unit="brl"):
    # items: list of (label, value)
    rowh=22; pad_l=190; pad_r=70; h=rowh*len(items)+6
    mx=max(v for _,v in items)
    s=[f'<svg viewBox="0 0 {w} {h}" width="100%" style="{FONT}max-height:{h}px">']
    for i,(l,v) in enumerate(items):
        y=i*rowh+3; bw=(w-pad_l-pad_r)*v/mx
        s.append(f'<text x="{pad_l-8}" y="{y+13}" font-size="9.5" fill="{GRAPH}" text-anchor="end">{l}</text>')
        s.append(f'<path d="M{pad_l},{y} H{pad_l+bw-4:.1f} a4,4 0 0 1 4,4 V{y+12} a4,4 0 0 1 -4,4 H{pad_l} Z" fill="{color}"/>')
        s.append(f'<text x="{pad_l+bw+6:.1f}" y="{y+13}" font-size="9.5" font-weight="600" fill="{TXT}">{fmt_brl(v,False) if unit=="brl" else v}</text>')
    s.append('</svg>'); return "".join(s)

def stacked_h(segs, w=520, h=70, colors=None):
    colors = colors or [BLUE_D, BLUE, BLUE_M, BLUE_L, GRAPH]
    tot=sum(v for _,v in segs)
    # legend with wrapping
    items=[]; x=0; row=0
    for i,(l,v) in enumerate(segs):
        iw=14+len(l)*5.3+34
        if x+iw>w: x=0; row+=1
        items.append((i,l,v,x,row)); x+=iw
    H=46+(row+1)*16
    s=[f'<svg viewBox="0 0 {w} {H}" width="100%" style="{FONT}max-height:{H}px">']
    x=0
    for i,(l,v) in enumerate(segs):
        bw=w*v/tot-2
        s.append(f'<rect x="{x:.1f}" y="4" width="{bw:.1f}" height="28" rx="4" fill="{colors[i]}"/>')
        s.append(f'<text x="{x+bw/2:.1f}" y="23" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">{v}</text>')
        x+=bw+2
    for (i,l,v,lx,r) in items:
        y=44+r*16
        s.append(f'<rect x="{lx}" y="{y}" width="10" height="10" rx="2" fill="{colors[i]}"/><text x="{lx+14}" y="{y+9}" font-size="8.8" fill="{GRAPH}">{l} <tspan font-weight="600" fill="{TXT}">{v}</tspan></text>')
    s.append('</svg>'); return "".join(s)

def gantt(tasks, days=90, w=560, phases=None):
    # tasks: list of (label, start, end, phase_idx)
    rowh=19; pad_l=200; pad_t=30; h=pad_t+rowh*len(tasks)+10
    iw=w-pad_l-10
    cols=[BLUE_L,BLUE_M,BLUE,BLUE_D]
    s=[f'<svg viewBox="0 0 {w} {h}" width="100%" style="{FONT}max-height:{h}px">']
    for d in (0,15,30,60,90):
        x=pad_l+iw*d/days
        s.append(f'<line x1="{x:.1f}" y1="{pad_t-6}" x2="{x:.1f}" y2="{h-6}" stroke="{LINE}" stroke-dasharray="2,3"/>')
        s.append(f'<text x="{x:.1f}" y="{pad_t-10}" font-size="8.5" fill="{GRAY}" text-anchor="middle">Dia {d}</text>')
    if phases:
        for (pl,ps,pe,pi) in phases:
            x=pad_l+iw*ps/days; bw=iw*(pe-ps)/days
            s.append(f'<rect x="{x:.1f}" y="{pad_t-28}" width="{bw-2:.1f}" height="12" rx="2" fill="{cols[pi]}" opacity="0.25"/>')
    for i,(l,a,b,p) in enumerate(tasks):
        y=pad_t+i*rowh; x=pad_l+iw*a/days; bw=max(iw*(b-a)/days,4)
        s.append(f'<text x="{pad_l-8}" y="{y+12}" font-size="8.8" fill="{GRAPH}" text-anchor="end">{l}</text>')
        s.append(f'<rect x="{x:.1f}" y="{y+2}" width="{bw:.1f}" height="12" rx="3" fill="{cols[p]}"/>')
    s.append('</svg>'); return "".join(s)
