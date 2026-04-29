document.addEventListener("DOMContentLoaded", () => {
  const sections = Array.from(document.querySelectorAll(".sections article"));
  const toc = document.getElementById("toc");
  const topNav = document.getElementById("top-nav");

  // Build TOC and top navigation
  sections.forEach((sec) => {
    const title = sec.querySelector("h2")?.innerText || "Sección";
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    sec.id = id;
    const a = document.createElement("a");
    a.href = "#" + id;
    a.innerText = title;
    a.className = "toc-link";
    a.addEventListener("click", () => {
      toc.classList.add("hidden");
    });
    toc.appendChild(a);

    const navBtn = document.createElement("a");
    navBtn.href = "#" + id;
    navBtn.innerText = title;
    navBtn.style.margin = "0 8px";
    topNav.appendChild(navBtn);
  });

  // Create global controls (expand/collapse all)
  const headerInner = document.querySelector(".header-inner");
  if (headerInner) {
    const ctrl = document.createElement("div");
    ctrl.style.marginLeft = "12px";
    const expandAll = document.createElement("button");
    expandAll.className = "btn";
    expandAll.innerText = "Abrir todo";
    const collapseAll = document.createElement("button");
    collapseAll.className = "btn";
    collapseAll.innerText = "Cerrar todo";
    expandAll.style.marginLeft = "8px";
    collapseAll.style.marginLeft = "8px";
    ctrl.appendChild(expandAll);
    ctrl.appendChild(collapseAll);
    headerInner.appendChild(ctrl);

    expandAll.addEventListener("click", () => {
      accordions.forEach((a) => openAccordion(a));
    });
    collapseAll.addEventListener("click", () => {
      accordions.forEach((a) => closeAccordion(a));
    });
  }

  // Toggle toc
  document.getElementById("toggle-toc").addEventListener("click", () => {
    toc.classList.toggle("hidden");
  });

  // Copy color hex
  document.querySelectorAll(".swatch .copy").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const hex = e.target.closest(".swatch").dataset.hex;
      try {
        await navigator.clipboard.writeText(hex);
        btn.innerText = "Copiado";
        setTimeout(() => (btn.innerText = hex), 1200);
      } catch (e) {
        alert(hex);
      }
    });
  });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      if (a.getAttribute("href").startsWith("#")) {
        e.preventDefault();
        const id = a.getAttribute("href").slice(1);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // --- Build accordions from articles ---
  const accordions = [];
  sections.forEach((sec, i) => {
    const h2 = sec.querySelector("h2");
    const children = Array.from(sec.childNodes).filter((n) => n !== h2);
    // create header wrapper
    const header = document.createElement("div");
    header.className = "accordion-header";
    const title = document.createElement("div");
    title.className = "accordion-title";
    title.innerText = h2 ? h2.innerText : "Sección";
    const toggle = document.createElement("button");
    toggle.className = "accordion-toggle";
    toggle.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    header.appendChild(title);
    header.appendChild(toggle);
    // panel
    const panel = document.createElement("div");
    panel.className = "panel";
    children.forEach((n) => panel.appendChild(n));
    // clear article and append header + panel
    sec.innerHTML = "";
    sec.appendChild(header);
    sec.appendChild(panel);

    // All closed by default
    panel.style.maxHeight = "0px";

    const accordion = { sec, header, panel, toggle };
    accordions.push(accordion);

    const toggleFn = (ev) => {
      const isOpen = sec.classList.contains("open");
      if (isOpen) closeAccordion(accordion);
      else openAccordion(accordion);
    };
    header.addEventListener("click", toggleFn);
    toggle.addEventListener("click", toggleFn);
  });

  function openAccordion(a) {
    a.sec.classList.add("open");
    a.panel.classList.add("open");
    a.panel.style.maxHeight = a.panel.scrollHeight + "px";
  }
  function closeAccordion(a) {
    a.sec.classList.remove("open");
    a.panel.classList.remove("open");
    a.panel.style.maxHeight = "0px";
  }

  // Recalculate heights on window resize
  window.addEventListener("resize", () => {
    accordions.forEach((a) => {
      if (a.sec.classList.contains("open"))
        a.panel.style.maxHeight = a.panel.scrollHeight + "px";
    });
  });
});
