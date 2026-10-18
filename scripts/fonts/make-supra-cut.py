"""Supra Cut : police des mots clés du site, dérivée de Montserrat Medium (SIL OFL 1.1).
Certaines lettres sont fendues (fût coupé dans sa longueur, ou coupe horizontale) avec un léger décalage.
Source : @fontsource/montserrat (files/montserrat-latin-500-normal.woff2). Dépendances : pip install fonttools skia-pathops brotli
Usage : python3 scripts/fonts/make-supra-cut.py montserrat-latin-500-normal.woff2 -o public/fonts/supra-cut-500 --gap 44 --dx 34 --sgap 24 --sdy 66"""
import argparse, pathops
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.transformPen import TransformPen

ap = argparse.ArgumentParser()
ap.add_argument('src'); ap.add_argument('-o', required=True)
ap.add_argument('--gap', type=float, default=28); ap.add_argument('--dx', type=float, default=26)
ap.add_argument('--sgap', type=float, default=16); ap.add_argument('--sdy', type=float, default=60)
a = ap.parse_args()

f = TTFont(a.src)
gs = f.getGlyphSet(); glyf = f['glyf']; hmtx = f['hmtx']
os2 = f['OS/2']
XH = os2.sxHeight or 517; CH = os2.sCapHeight or 700
rev = {}
for u, g in f.getBestCmap().items(): rev.setdefault(g, u)
BIG = 4000

def rect(y0, y1):
    p = pathops.Path(); p.moveTo(-BIG, y0); p.lineTo(BIG, y0); p.lineTo(BIG, y1); p.lineTo(-BIG, y1); p.close(); return p

import unicodedata
# Une coupe par lettre, à un endroit choisi : H = coupe horizontale (y en fraction de la hauteur, haut décalé à droite),
# V = coupe verticale (x en fraction de la largeur d'encre, partie droite décalée vers le haut),
# S = fût fendu dans sa longueur (n° du fût lu sur une ligne à cette fraction de hauteur, partie droite remontée). Absent = lettre intacte.
RULES = {
    'a': ('S', -1, .3), 'b': ('S', 0, .3), 'd': ('S', -1, .3), 'g': ('S', -1, .3), 'h': ('S', 0, .3),
    'k': ('S', 0, .3), 'm': ('S', 1, .3), 'n': ('S', 0, .3), 'p': ('S', 0, .3), 'q': ('S', -1, .3),
    'r': ('S', 0, .3), 'u': ('S', -1, .3), 'f': ('H', .97), 't': ('H', .84),
    'B': ('S', 0, .25), 'D': ('S', 0, .25), 'E': ('S', 0, .25), 'F': ('S', 0, .25), 'H': ('V', .50),
    'I': ('H', .45), 'K': ('S', 0, .25), 'L': ('H', .16), 'M': ('V', .50), 'N': ('S', 0, .25), 'P': ('S', 0, .25),
    'R': ('S', 0, .25), 'T': ('H', .78), }

def base_of(ch):
    d = unicodedata.decomposition(ch)
    if d and not d.startswith('<'):
        return chr(int(d.split()[0], 16))
    return ch

def draw_shifted(path, pen, dx, dy):
    path.draw(TransformPen(pen, (1, 0, 0, 1, dx, dy)))

n = 0
for g in f.getGlyphOrder():
    u = rev.get(g)
    if u is None: continue
    # Les lettres accentuées composites gardent leur accent intact : elles reprennent la lettre de base déjà tranchée.
    if glyf[g].isComposite(): continue
    rule = RULES.get(base_of(chr(u)))
    if not rule: continue
    kind, k = rule[0], rule[1]
    rec = DecomposingRecordingPen(gs); gs[g].draw(rec)
    src = pathops.Path(); rec.replay(src.getPen())
    xmin, ymin, xmax, ymax = src.bounds
    base = chr(u)
    h = CH if (base_of(base).isupper() or base_of(base).isdigit()) else XH
    tp = TTGlyphPen(None); qp = Cu2QuPen(tp, max_err=1.0, reverse_direction=False)
    if kind == 'H':
        cut = h * k
        a1 = pathops.op(src, rect(cut + a.gap / 2, BIG), pathops.PathOp.INTERSECTION)
        b1 = pathops.op(src, rect(-BIG, cut - a.gap / 2), pathops.PathOp.INTERSECTION)
        draw_shifted(a1, qp, a.dx / 2, 0); draw_shifted(b1, qp, -a.dx / 2, 0)
    else:
        gap, dy = a.gap, a.dx
        if kind == 'S':
            yl = h * rule[2]
            runs = sorted(c.bounds for c in pathops.op(src, rect(yl - .5, yl + .5), pathops.PathOp.INTERSECTION).contours)
            x0, _, x1, _ = runs[k]; x = (x0 + x1) / 2; gap, dy = a.sgap, a.sdy
        else:
            x = xmin + (xmax - xmin) * k
        def vrect(x0, x1):
            pth = pathops.Path(); pth.moveTo(x0, -BIG); pth.lineTo(x1, -BIG); pth.lineTo(x1, BIG); pth.lineTo(x0, BIG); pth.close(); return pth
        left = pathops.op(src, vrect(-BIG, x - gap / 2), pathops.PathOp.INTERSECTION)
        right = pathops.op(src, vrect(x + gap / 2, BIG), pathops.PathOp.INTERSECTION)
        draw_shifted(left, qp, 0, 0); draw_shifted(right, qp, 0, dy)
    new = tp.glyph(); new.recalcBounds(glyf); glyf[g] = new
    adv, _ = hmtx[g]; hmtx[g] = (adv, getattr(new, 'xMin', 0) if new.numberOfContours else 0)
    n += 1

for t in ('hdmx', 'LTSH', 'VDMX', 'fpgm', 'prep', 'cvt ', 'gasp'):
    if t in f: del f[t]
from fontTools.ttLib.tables import ttProgram
for g in glyf.keys():
    gl = glyf[g]
    if hasattr(gl, 'program'):
        empty = ttProgram.Program(); empty.fromBytecode(b''); gl.program = empty

name = f['name']
fam, full, ps = 'Supra Cut', 'Supra Cut Medium', 'SupraCut-Medium'
for rec in list(name.names):
    if rec.nameID in (1, 16): rec.string = fam
    elif rec.nameID in (2, 17): rec.string = 'Medium' if rec.nameID == 17 else 'Regular'
    elif rec.nameID == 4: rec.string = full
    elif rec.nameID == 6: rec.string = ps
    elif rec.nameID == 3: rec.string = f'1.000;SUPRA;{ps}'
    elif rec.nameID == 0: rec.string = str(rec.toUnicode()) + ' Supra Cut: modified version by Supra v3 (2026).'
name.setName('This Font Software is licensed under the SIL Open Font License, Version 1.1.', 13, 3, 1, 0x409)
name.setName('https://openfontlicense.org', 14, 3, 1, 0x409)

f.flavor = None; f.save(a.o + '.ttf')
f.flavor = 'woff2'; f.save(a.o + '.woff2')
print('glyphes tranchés :', n, '| x-height', XH, '| cap', CH)
