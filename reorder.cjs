const fs = require("fs");
let html = fs.readFileSync("presentacion.html", "utf8");

// ── MARKERS ──────────────────────────────────────────────────────────────────
const MARKER_RE = /<!--\s*={5,}[^=\n]+={5,}\s*-->/g;
const markers = [];
let m;
while ((m = MARKER_RE.exec(html)) !== null) markers.push({ i: m.index, end: m.index + m[0].length });

// ── HEAD ─────────────────────────────────────────────────────────────────────
const presWrapperTag = '<div class="pres-wrapper">';
const presWrapperPos = html.indexOf(presWrapperTag) + presWrapperTag.length;
let head = html.substring(0, presWrapperPos);
head = head.replace('class="pres-dots"', 'class="pres-dots" style="display:none"');

// ── TAIL ─────────────────────────────────────────────────────────────────────
const slideCounterPos = html.indexOf('<span class="slide-counter"');
const tailStart = html.lastIndexOf('</div>', slideCounterPos - 1);
const tail = "\n    </div>\n\n" + html.substring(slideCounterPos);

// ── BLOCKS ───────────────────────────────────────────────────────────────────
function block(i) {
  const start = markers[i].i;
  const end = i < markers.length - 1 ? markers[i + 1].i : tailStart + 6;
  return html.substring(start, end);
}
const nm = { 0:"S01",1:"CAP1",2:"S02",3:"S03",4:"S04",5:"S05",6:"CAP2",7:"S06",8:"CAP3",9:"S07N",10:"S08N",11:"S07",12:"S08",13:"CAP4",14:"S09",15:"S12N",16:"S10",17:"S11",18:"S12",19:"CAP5",20:"S13" };
const B = {};
for (let i = 0; i < markers.length; i++) B[nm[i]] = block(i);

// ── NEW SLIDES ────────────────────────────────────────────────────────────────
function newSlide(id, cssClass, title, subtitle, bodyText) {
  return `<!-- ===================== ${id} ===================== -->
      <div class="slide ${cssClass}">
        <div class="circ3-right-col" style="padding: clamp(2rem,6vw,5rem); display:flex; flex-direction:column; justify-content:center; height:100%">
          <div class="fade-up">
            <p class="lanna-sub" style="margin-bottom:0.3rem">${subtitle}</p>
            <h2 style="margin:0">${title}</h2>
          </div>
          <p class="lanna-body fade-up fade-up-d1" style="margin-top:1.5rem; max-width:50ch; color:rgba(0,0,0,0.55)">${bodyText}</p>
        </div>
      </div>\n`;
}

const N = {};
N.NC  = newSlide("NUEVA — CONSTRUCCIÓN DEL ISOTIPO", "slide-new-nc",
  "CONSTRUCCIÓN<br>DEL ISOTIPO", "SISTEMA DE IDENTIFICACIÓN · GEOMETRÍA",
  "Las decisiones formales detrás del símbolo del frailejón: retículas, proporciones y lógica constructiva del isotipo.");
N.COL = newSlide("NUEVA — COLORES CORPORATIVOS", "slide-new-col",
  "PALETA<br>CROMÁTICA", "SISTEMA DE IDENTIFICACIÓN · COLOR",
  "Los tonos que definen a LANNA: tierra, lana cruda y dorado andino. Una cromática construida desde el territorio.");
N.CON = newSlide("NUEVA — CONCEPTO DE COLECCIÓN", "slide-new-con",
  "CONCEPTO E<br>INSPIRACIÓN", "COLECCIÓN PROPUESTA · GÉNESIS",
  "El punto de partida creativo de la colección: las referencias culturales, el universo estético y la propuesta narrativa de diseño.");
N.LLU = newSlide("NUEVA — LLUVIA DE IDEAS", "slide-new-llu",
  "LLUVIA DE<br>IDEAS", "COLECCIÓN PROPUESTA · EXPLORACIÓN",
  "El moodboard de la colección: imágenes, texturas, siluetas y atmósferas que orientan las decisiones de diseño.");
N.OUT = newSlide("NUEVA — OUTFITS PROPUESTOS", "slide-new-out",
  "PRENDAS<br>PROPUESTAS", "COLECCIÓN PROPUESTA · DISEÑO",
  "Los dos o tres looks principales de la colección: siluetas, materialidad, detalles constructivos y propuesta de estilismo.");
N.EMP = newSlide("NUEVA — EMPAQUES", "slide-new-emp",
  "EMPAQUES<br>DEL OUTFIT", "COLECCIÓN PROPUESTA · PACKAGING",
  "El sistema de empaque que acompaña cada prenda: materiales, forma, gráfica y experiencia de unboxing sostenible.");
N.SOU = newSlide("NUEVA — SOUVENIRS", "slide-new-sou",
  "SOUVENIRS<br>DE LA COLECCIÓN", "COLECCIÓN PROPUESTA · OBJETOS",
  "Los objetos de colección complementarios a la prenda: piezas artesanales, utilitarias o decorativas con identidad LANNA.");
N.STA = newSlide("NUEVA — STAND", "slide-new-sta",
  "STAND DE<br>EXHIBICIÓN", "COLECCIÓN PROPUESTA · ESPACIO",
  "La propuesta espacial donde converge todo: cómo se exhibe la colección, el empaque, los souvenirs y la experiencia de marca.");

// ── REASSEMBLE IN TARGET ORDER ────────────────────────────────────────────────
// ORDER:
// PORTADA: S01
// CAP1: CAP1, S02, S03, S04
// CAP2: CAP2, S06, S07 (arquitectura), S07N (isotipo), NC (construcción isotipo), COL (colores)
// CAP3: CAP3, S05 (4 módulos), S08N (ciclo vida), S12N (LIDS)
// CAP4: CAP4, S08 (moodboard), S09 (quiet luxury), S10 (armadura), S11 (público), S12 (quiénes)
// CAP5: CAP5, CON, LLU, OUT, EMP, SOU, STA
// CIERRE: S13

const newWrapper = [
  "\n      ", B.S01,
  B.CAP1, B.S02, B.S03, B.S04,
  B.CAP2, B.S06, B.S07, B.S07N, N.NC, N.COL,
  B.CAP3, B.S05, B.S08N, B.S12N,
  B.CAP4, B.S08, B.S09, B.S10, B.S11, B.S12,
  B.CAP5, N.CON, N.LLU, N.OUT, N.EMP, N.SOU, N.STA,
  B.S13
].join("\n      ");

const result = head + newWrapper + tail;
fs.writeFileSync("presentacion.html", result, "utf8");
console.log("SUCCESS! Wrote", result.length, "chars. Slide count:", (result.match(/class="slide/g)||[]).length);
