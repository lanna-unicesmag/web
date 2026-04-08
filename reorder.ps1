$html = [System.IO.File]::ReadAllText("c:\OneDrive - unicesmag.edu.co\Ecodise\u00f1o\Lanna\WEB\presentacion.html", [System.Text.Encoding]::UTF8)

# extraemos todo desde el pres-wrapper hasta justo antes del slide-counter span
$wrapperMatch = [regex]::Match($html, '(<div class="pres-wrapper">)([\s\S]*?)(</div>\s*\n\s*<span class="slide-counter")')
if (!$wrapperMatch.Success) { Write-Host "NO MATCH wrapper"; exit 1 }

Write-Host "Wrapper found. Wrapper content length: $($wrapperMatch.Groups[2].Value.Length)"

# Definimos los marcadores de inicio de cada bloque
$blocks = @{
    'PORTADA'    = 'SLIDE 01.*?PORTADA'
    'CAP1'       = 'CAP 01.*?SEPARADOR'  
    'S02'        = 'SLIDE 02.*?NUESTRO TERRITORIO'
    'S03'        = 'SLIDE 03.*?CULTURA'
    'S04'        = 'SLIDE 04.*?HERENCIA VIVA'
    'S05'        = 'SLIDE 05.*?RECT'
    'CAP2'       = 'CAP 02.*?SEPARADOR'
    'S06'        = 'SLIDE 06.*?IDENTIDAD'
    'CAP3'       = 'CAP 03.*?SEPARADOR'
    'S07NUEVO'   = 'SLIDE 07 \(NUEVO\).*?CICLO COMPLETO'
    'S08NUEVO'   = 'SLIDE 08 \(NUEVO\).*?PARAMO'
    'S07'        = 'SLIDE 07 .*?ARQUITECTURA'
    'S08'        = 'SLIDE 08 .*?MOODBOARD'
    'CAP4'       = 'CAP 04.*?SEPARADOR'
    'S09'        = 'SLIDE 09.*?QUIET'
    'S12NUEVO'   = 'SLIDE 12 \(NUEVO\).*?DISE'
    'S10'        = 'SLIDE 10.*?ARMADURA'
    'S11'        = 'SLIDE 11.*?P.BLICO'
    'S12'        = 'SLIDE 12 .*?QUI.NES'
    'CAP5'       = 'CAP 05.*?SEPARADOR'
    'S13'        = 'SLIDE 13.*?MANIFIESTO'
}

Write-Host "Blocks defined: $($blocks.Count)"
Write-Host "Script OK"
