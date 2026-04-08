$ErrorActionPreference = 'Stop'

$html = Get-Content "presentacion.html" -Raw -Encoding UTF8

$wrapperStartStr = '    <div class="pres-wrapper">'
$wrapperStartIdx = $html.IndexOf($wrapperStartStr)
$wrapperEndStr = "    </div>`n`n    <!-- Scripts -->"
$wrapperEndIdx = $html.IndexOf($wrapperEndStr)
if ($wrapperEndIdx -eq -1) {
    $wrapperEndStr = "    </div>`r`n`r`n    <!-- Scripts -->"
    $wrapperEndIdx = $html.IndexOf($wrapperEndStr)
}
if ($wrapperEndIdx -eq -1) {
    $wrapperEndIdx = $html.LastIndexOf('    </div>')
}

$beforeWrapper = $html.Substring(0, $wrapperStartIdx + $wrapperStartStr.Length)
$insideWrapper = $html.Substring($wrapperStartIdx + $wrapperStartStr.Length, $wrapperEndIdx - ($wrapperStartIdx + $wrapperStartStr.Length))
$afterWrapper = $html.Substring($wrapperEndIdx)

$rawBlocks = $insideWrapper -split '<div class="slide'
$slides = @()
foreach ($block in $rawBlocks) {
    if ($block.Trim().Length -gt 0) {
        $slides += ('<div class="slide' + $block)
    }
}

$slideMap = @{}

foreach ($s in $slides) {
    $title = "UNKNOWN"
    if ($s -match '<h[1-6][^>]*>([\s\S]*?)</h[1-6]>') {
        $title = $Matches[1] -replace '<[^>]+>', ''
        $title = $title -replace '\s+', ' '
    }
    
    if (($title -match "LANNA") -and -not ($s -match "TIPO")) { $slideMap["PORTADA"] = $s }
    if (($title -match "LATITUD") -or ($title -match "MONTAÑA")) { $slideMap["LATITUD"] = $s }
    if ($title -match "ALMA DE BOY") { $slideMap["ALMA"] = $s }
    if ($title -match "MANIFIESTO") { $slideMap["MANIFIESTO"] = $s }
    if ($s -match "ZERO WASTE") { $slideMap["MODULOS"] = $s }
    if (($title -match "LANNA") -and ($s -match "TIPO")) { $slideMap["LOGO_TEXT"] = $s }
    if ($title -match "SILUETA") { $slideMap["ISOTIPO"] = $s }
    if ($s -match "CICLO DE VIDA") { $slideMap["CICLO"] = $s }
    if ($title -match "QUIET") { $slideMap["QUIET"] = $s }
    if ($title -match "CONEXI") { $slideMap["CONEXION"] = $s }
    if (($title -match "QUIÉNES") -or ($title -match "QUIENES")) { $slideMap["QUIENES"] = $s }
    if (($title -match "CLIENTES") -or ($title -match "RESPALDAN")) { $slideMap["CLIENTES"] = $s }
    if (($title -match "EQUIPO") -or ($s -match "EQUIPO")) { $slideMap["EQUIPO"] = $s }
    if (($title -match "RECONOCIMIENTOS") -or ($s -match "RECONOCIMIENTOS")) { $slideMap["RECONOCIMIENTOS"] = $s }
    if (($s -match "DISEÑO CALCULADO") -or ($s -match "LIDS")) { $slideMap["LIDS"] = $s }
    if (-not ($title -match "LANNA") -and ($s -match "</svg>") -and ($s -match "LANNA") -and -not ($s -match "h2")) { $slideMap["CIERRE"] = $s }
}
$slideMap["PORTADA"] = $slides[0]
if (-not $slideMap["CIERRE"]) { $slideMap["CIERRE"] = $slides[$slides.Length - 1] }
$slideMap["CITA"] = $slides[3]

function Make-Separator {
    param($t1, $t2)
    return @"
      <!-- ===================== SEPARADOR ===================== -->
      <div class="slide slide-circ1" data-index="X">
        <div class="sl1-hero-container" style="background: var(--pres-dark); display: flex; align-items: center; justify-content: center; height: 100vh; flex-direction: column; width: 100vw;">
          <h2 style="color: var(--pres-light); font-size: 3rem; margin-bottom: 1rem; text-align: center;" class="fade-up">$t1</h2>
          <p class="lanna-sub fade-up fade-up-d1" style="color: var(--pres-accent); text-align: center;">$t2</p>
        </div>
      </div>
"@
}

function Make-Maqueta {
    param($t1, $t2)
    return @"
      <!-- ===================== NUEVA MAQUETA ===================== -->
      <div class="slide slide-circ3" data-index="X">
        <div class="circ3-left-col">
          <img src="./images/placeholder.jpg" data-editable="true" alt="Placeholder" class="scale-up" style="object-fit: cover; width:100%; height:100vh;" />
        </div>
        <div class="circ3-right-col" style="display:flex; flex-direction:column; justify-content:center;">
          <div class="fade-up">
            <h2>$t1</h2>
            <p class="lanna-sub" style="margin-bottom: 2rem;">$t2</p>
          </div>
          <p class="lanna-body fade-up fade-up-d1" style="max-width: 600px;">
            Este es un espacio reservado. Haz clic en el botón de edición ("Lápiz") para reemplazar la imagen de este bloque con tus archivos gráficos correspondientes a la colección o colores corporativos.
          </p>
        </div>
      </div>
"@
}

$finalAssembly = @()
$finalAssembly += $slideMap["PORTADA"]

$finalAssembly += Make-Separator "CAPÍTULO 1" "Fundamentos de Marca"
if ($slideMap["LATITUD"]) { $finalAssembly += $slideMap["LATITUD"] }
if ($slideMap["ALMA"]) { $finalAssembly += $slideMap["ALMA"] }
if ($slideMap["CITA"]) { $finalAssembly += $slideMap["CITA"] }
if ($slideMap["MANIFIESTO"]) { $finalAssembly += $slideMap["MANIFIESTO"] }

$finalAssembly += Make-Separator "CAPÍTULO 2" "Sistema de Identificación"
if ($slideMap["LOGO_TEXT"]) { $finalAssembly += $slideMap["LOGO_TEXT"] }
$finalAssembly += Make-Maqueta "CONSTRUCCIÓN DEL LOGO" "PROPORCIÓN Y GRILLA"
if ($slideMap["ISOTIPO"]) { $finalAssembly += $slideMap["ISOTIPO"] }
$finalAssembly += Make-Maqueta "CONSTRUCCIÓN DEL ISOTIPO" "ABSTRACCIÓN GEOMÉTRICA"
$finalAssembly += Make-Maqueta "COLORES CORPORATIVOS" "PALETA CROMÁTICA"

$finalAssembly += Make-Separator "CAPÍTULO 3" "Ecodiseño y Procesos"
if ($slideMap["MODULOS"]) { $finalAssembly += $slideMap["MODULOS"] }
if ($slideMap["CICLO"]) { $finalAssembly += $slideMap["CICLO"] }
if ($slideMap["LIDS"]) { $finalAssembly += $slideMap["LIDS"] }

$finalAssembly += Make-Separator "CAPÍTULO 4" "Mercado y Equipo"
if ($slideMap["QUIET"]) { $finalAssembly += $slideMap["QUIET"] }
if ($slideMap["CONEXION"]) { $finalAssembly += $slideMap["CONEXION"] }
if ($slideMap["QUIENES"]) { $finalAssembly += $slideMap["QUIENES"] }
if ($slideMap["CLIENTES"]) { $finalAssembly += $slideMap["CLIENTES"] }
if ($slideMap["EQUIPO"]) { $finalAssembly += $slideMap["EQUIPO"] }
if ($slideMap["RECONOCIMIENTOS"]) { $finalAssembly += $slideMap["RECONOCIMIENTOS"] }

$finalAssembly += Make-Separator "CAPÍTULO 5" "Colección Riptide"
$finalAssembly += Make-Maqueta "CONCEPTO E INSPIRACIÓN" "EL ORIGEN DE RIPTIDE"
$finalAssembly += Make-Maqueta "LLUVIA DE IDEAS" "MOODBOARD VISUAL"
$finalAssembly += Make-Maqueta "OUTFITS PROPUESTOS" "PRENDAS PRINCIPALES"
$finalAssembly += Make-Maqueta "EMPAQUES DEL OUTFIT" "PACKAGING SOSTENIBLE"
$finalAssembly += Make-Maqueta "SOUVENIRS" "MEMORABILIA DE COLECCIÓN"
$finalAssembly += Make-Maqueta "STAND DE EXHIBICIÓN" "PROPUESTA ESPACIAL"

if ($slideMap["CIERRE"]) { $finalAssembly += $slideMap["CIERRE"] }

$reindexedHTML = ""
$counter = 0
foreach ($el in $finalAssembly) {
    if (-not $el) { continue }
    $fixed = $el -replace 'data-index="\d+"', "data-index=`"$counter`""
    $fixed = $fixed -replace 'active', '' # remove active from all first
    $reindexedHTML += "`n`n" + $fixed
    $counter++
}

# The very first index should be active
$reindexedHTML = $reindexedHTML -replace 'class="slide slide-01"', 'class="slide slide-01 active"'

$newHTML = $beforeWrapper + "`n" + $reindexedHTML + "`n" + $afterWrapper
Set-Content "presentacion.html" $newHTML -Encoding UTF8
Write-Host "Done assembly! Total slides: $counter"
