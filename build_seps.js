const fs = require('fs');

function getSeparator(num, title) {
  return 
      <!-- ===================== CAÍPTULO  + num +  ===================== -->
      <div class="slide slide-chapter" style="background: var(--pres-dark); display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
        <span class="lanna-gold-line" style="margin-bottom: 2rem;"></span>
        <h2 style="color: var(--pres-light); letter-spacing: 0.2em; font-size: 1.5rem; margin-bottom: 0.5rem;" class="fade-up">CAP&Iacute;TULO 0 + num + </h2>
        <div class="lanna-sub" style="color: rgba(234, 233, 227, 0.7);" class="fade-up fade-up-d1"> + title + </div>
      </div>
;
}

try {
  let html = fs.readFileSync('presentacion.html', 'utf8');

  const replacements = [
    { target: '<!-- ===================== SLIDE 02 — NUESTRO TERRITORIO ===================== -->', sep: getSeparator(1, 'FUNDAMENTOS DE MARCA') },
    { target: '<!-- ===================== SLIDE 06 — IDENTIDAD DE MARCA ===================== -->', sep: getSeparator(2, 'SISTEMA DE IDENTIFICACI&Oacute;N') },
    { target: '<!-- ===================== SLIDE 05 — EL RECTÁNGULO PERFECTO ===================== -->', sep: getSeparator(3, 'ECODISE&Ntilde;O Y SOSTENIBILIDAD') },
    { target: '<!-- ===================== SLIDE 09 — QUIET LUXURY ===================== -->', sep: getSeparator(4, 'FILOSOF&Iacute;A, MERCADO Y EQUIPO') },
    { target: '<!-- ===================== SLIDE 13 — MANIFIESTO FINAL ===================== -->', sep: getSeparator(5, 'COLECCI&Oacute;N "RIPTIDE"') }
  ];

  for(let r of replacements) {
    if(html.includes(r.target)) {
      html = html.replace(r.target, r.sep + '\n' + r.target);
    } else {
      console.log('Fallo encontrando: ', r.target);
    }
  }

  fs.writeFileSync('presentacion.html', html, 'utf8');
  console.log('Inyecciones completadas con éxito.');
} catch (e) {
  console.error(e);
}
