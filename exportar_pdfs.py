import asyncio
import os
from playwright.async_api import async_playwright
from PIL import Image

archivos_a_exportar = [
    "presentacion_proyecto.html",
    "resultados.html"
]

async def export_to_pdf(playwright, filename):
    print(f"\n--- Iniciando exportacion de ALTA RESOLUCION de {filename} ---")
    
    browser = await playwright.chromium.launch(headless=True)
    # Aumentamos el device_scale_factor a 3 para obtener 3 veces más píxeles (3840x2160)
    # manteniendo el diseño lógico de 1280x720 intacto.
    context = await browser.new_context(
        viewport={'width': 1280, 'height': 720},
        device_scale_factor=3 
    )
    page = await context.new_page()
    
    filepath = f"file:///{os.path.abspath(filename).replace(chr(92), '/')}"
    print(f"Cargando {filepath}...")
    await page.goto(filepath, wait_until='networkidle')
    
    await page.add_style_tag(content="""
        #btn-fs, .nav-arrow, #bar { display: none !important; }
        *, .sl *, .fu, .fi, .sc, .sl-anim, .sr {
            animation: none !important;
            transition: none !important;
            transform: none !important;
        }
    """)
    
    slides_count = await page.locator('.sl').count()
    images = []
    
    for i in range(slides_count):
        print(f"Capturando diapositiva {i + 1}/{slides_count} en alta resolución...")
        
        await page.evaluate(f"""
            const slides = document.querySelectorAll('.sl');
            slides.forEach((slide, index) => {{
                if (index === {i}) {{
                    slide.classList.add('on');
                    slide.style.opacity = '1';
                    slide.style.visibility = 'visible';
                }} else {{
                    slide.classList.remove('on');
                    slide.style.opacity = '0';
                    slide.style.visibility = 'hidden';
                }}
            }});
        """)
        
        await page.wait_for_timeout(300)
        
        stage = page.locator('#stage')
        # Usamos PNG para evitar perdida de calidad por compresión de JPEG
        screenshot_bytes = await stage.screenshot(type="png")
        
        temp_img_path = f"temp_slide_hr_{i}.png"
        with open(temp_img_path, 'wb') as f:
            f.write(screenshot_bytes)
        images.append(temp_img_path)

    await browser.close()
    
    if images:
        pdf_name = filename.replace('.html', '.pdf')
        print(f"Ensamblando PDF: {pdf_name}...")
        
        pil_images = [Image.open(img).convert('RGB') for img in images]
        
        pil_images[0].save(
            pdf_name, 
            save_all=True, 
            append_images=pil_images[1:], 
            resolution=300.0 # Guardamos el PDF con metadatos de alta resolución (300 DPI)
        )
        
        for img in pil_images:
            img.close()
        for temp_img in images:
            os.remove(temp_img)
            
        print(f"¡Éxito! PDF de ALTA CALIDAD guardado como {pdf_name}")

async def main():
    async with async_playwright() as playwright:
        for archivo in archivos_a_exportar:
            if os.path.exists(archivo):
                await export_to_pdf(playwright, archivo)

if __name__ == "__main__":
    asyncio.run(main())
