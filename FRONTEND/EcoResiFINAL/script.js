document.addEventListener('DOMContentLoaded', () => {
  
  /* =========================================
     1. NAVBAR SCROLL EFFECT
     ========================================= */
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 80) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  /* =========================================
     2. DROPDOWN MENUS (Nosotros / Servicios)
     ========================================= */
  const btnNosotros = document.getElementById('btnNosotros');
  const menuNosotros = document.getElementById('menuNosotros');
  const btnHerramientas = document.getElementById('btnHerramientas');
  const menuHerramientas = document.getElementById('menuHerramientas');

  function toggleMenu(btn, menu, otherMenu) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('show');
      if(otherMenu) otherMenu.classList.remove('show');
    });
  }

  if(btnNosotros && menuNosotros) toggleMenu(btnNosotros, menuNosotros, menuHerramientas);
  if(btnHerramientas && menuHerramientas) toggleMenu(btnHerramientas, menuHerramientas, menuNosotros);

  document.addEventListener('click', (e) => {
    if (menuNosotros && !menuNosotros.contains(e.target) && !btnNosotros.contains(e.target)) {
      menuNosotros.classList.remove('show');
    }
    if (menuHerramientas && !menuHerramientas.contains(e.target) && !btnHerramientas.contains(e.target)) {
      menuHerramientas.classList.remove('show');
    }
  });

  /* =========================================
     3. REPRODUCTOR DE VIDEOS (TIPS)
     ========================================= */
  document.querySelectorAll(".video-wrapper").forEach(wrapper => {
    const video = wrapper.querySelector("video");
    const btn = wrapper.querySelector(".play-btn");

    if (video && btn) {
      btn.addEventListener("click", () => {
        if (video.paused) {
          video.play();
          btn.style.display = "none";
        } else {
          video.pause();
          video.currentTime = 0;
          btn.style.display = "block";
        }
      });

      video.addEventListener("ended", () => {
        btn.style.display = "block";
        video.currentTime = 0;
      });
    }
  });

  /* =========================================
     4. GALERÍA 3D MODAL
     ========================================= */
  const modelos3d = [
    "assets/Basura 3.glb",
    "assets/Basura 2.glb",
    "assets/BASURA_COMBINADA.glb"
  ];

  const cards3d = document.querySelectorAll('.card3d');
  const modal3d = document.getElementById('modal3d');
  const modalModel3d = document.getElementById('modalModel3d');
  const closeModal3d = document.getElementById('closeModal3d');
  const prev3d = document.getElementById('prev3d');
  const next3d = document.getElementById('next3d');

  let currentIndex3d = 0;

  if (modal3d && modalModel3d) {
    // Abrir modal
    cards3d.forEach((card) => {
      card.addEventListener('click', () => {
        const index = card.getAttribute('data-index');
        currentIndex3d = parseInt(index);
        modalModel3d.src = modelos3d[currentIndex3d];
        modal3d.style.display = 'flex';
      });
    });

    // Cerrar modal
    if(closeModal3d) closeModal3d.addEventListener('click', () => modal3d.style.display = 'none');
    modal3d.addEventListener('click', (e) => {
      if(e.target === modal3d) modal3d.style.display = 'none';
    });

    // Navegación
    if(prev3d) prev3d.addEventListener('click', () => {
      currentIndex3d = (currentIndex3d - 1 + modelos3d.length) % modelos3d.length;
      modalModel3d.src = modelos3d[currentIndex3d];
    });

    if(next3d) next3d.addEventListener('click', () => {
      currentIndex3d = (currentIndex3d + 1) % modelos3d.length;
      modalModel3d.src = modelos3d[currentIndex3d];
    });
  }

  /* =========================================
     5. RELOJ IMPACTO AMBIENTAL
     ========================================= */
  const basuraAnual = 2100000000;
  const animalesAnuales = 100000000;
  const co2Anual = 1800000000;
  const segundosPorAnio = 365 * 24 * 60 * 60;

  // Calcular valores iniciales basados en la fecha actual
  const inicioAnio = new Date(new Date().getFullYear(), 0, 1);
  const ahora = new Date();
  const segundosDesdeInicio = (ahora - inicioAnio) / 1000;

  let basura = (basuraAnual * segundosDesdeInicio) / segundosPorAnio;
  let animales = (animalesAnuales * segundosDesdeInicio) / segundosPorAnio;
  let co2 = (co2Anual * segundosDesdeInicio) / segundosPorAnio;

  const basuraPorSegundo = basuraAnual / segundosPorAnio;
  const animalesPorSegundo = animalesAnuales / segundosPorAnio;
  const co2PorSegundo = co2Anual / segundosPorAnio;

  function actualizarContadores() {
    basura += basuraPorSegundo;
    animales += animalesPorSegundo;
    co2 += co2PorSegundo;

    const elBasura = document.getElementById("basura");
    const elAnimales = document.getElementById("animales");
    const elCo2 = document.getElementById("co2");

    if(elBasura) elBasura.textContent = Math.floor(basura).toLocaleString("es-ES");
    if(elAnimales) elAnimales.textContent = Math.floor(animales).toLocaleString("es-ES");
    if(elCo2) elCo2.textContent = Math.floor(co2).toLocaleString("es-ES");
  }

  setInterval(actualizarContadores, 1000);
  actualizarContadores();

  /* =========================================
     6. MODAL HORARIOS (Buscador)
     ========================================= */
  const modalHorarios = document.getElementById("modalHorarios");
  const btnOpenHorarios = document.getElementById("openHorariosCard");
  const btnOpenHorariosNav = document.getElementById("btnHorariosNav");
  const closeHorarios = modalHorarios ? modalHorarios.querySelector(".close") : null;
  
  // Datos ficticios para la demo
  const demoData = {
    barrio: {
      "Centro": [{name: "Camión A", schedule: "Lunes y Jueves 8:00 AM"}],
      "San Martín": [{name: "Camión B", schedule: "Martes y Viernes 10:00 AM"}]
    },
    calle: {
      "Av. 9 de Julio": [{name: "Ruta Principal", schedule: "Diario 7:00 AM"}]
    },
    zona: {
      "Norte": [{name: "Zona N1", schedule: "L-M-V 6:00 AM"}]
    }
  };

  // Abrir Modal
  const openModalFunc = (e) => {
    if(e) e.preventDefault();
    if(modalHorarios) {
      modalHorarios.style.display = "block";
      initSearchControls();
    }
  };

  if(btnOpenHorarios) btnOpenHorarios.addEventListener("click", openModalFunc);
  if(btnOpenHorariosNav) btnOpenHorariosNav.addEventListener("click", openModalFunc);

  // Cerrar Modal
  if(closeHorarios) closeHorarios.addEventListener("click", () => modalHorarios.style.display = "none");
  window.addEventListener("click", (e) => {
    if(e.target === modalHorarios) modalHorarios.style.display = "none";
  });

  // Lógica del Buscador
  function initSearchControls() {
    const typeSel = document.getElementById("searchType");
    const wrapper = document.getElementById("selectWrapper");
    const btnBuscar = document.getElementById("buscarBtn");
    const resultados = document.getElementById("resultados");

    if(!typeSel || !wrapper) return;

    // Llenar select/input inicial
    const populateInput = () => {
      wrapper.innerHTML = "";
      const tipo = typeSel.value;
      
      if(tipo === "calle") {
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Ej: Av. 9 de Julio";
        input.id = "searchInputVal";
        wrapper.appendChild(input);
      } else {
        const select = document.createElement("select");
        select.id = "searchInputVal";
        const keys = Object.keys(demoData[tipo] || {});
        if(keys.length === 0) {
           select.innerHTML = "<option>No hay datos</option>";
        } else {
           keys.forEach(k => {
             const opt = document.createElement("option");
             opt.value = k;
             opt.textContent = k;
             select.appendChild(opt);
           });
        }
        wrapper.appendChild(select);
      }
    };

    typeSel.onchange = populateInput;
    populateInput(); // init

    btnBuscar.onclick = () => {
      const valInput = document.getElementById("searchInputVal");
      if(!valInput) return;
      
      const tipo = typeSel.value;
      const valor = valInput.value;
      const data = demoData[tipo] ? demoData[tipo][valor] : [];

      resultados.innerHTML = "";
      
      if(!data || data.length === 0) {
        resultados.innerHTML = "<div class='no-results'>No se encontraron horarios (Demo).</div>";
      } else {
        data.forEach(item => {
          const div = document.createElement("div");
          div.className = "recolector-card";
          div.innerHTML = `<div class="rc-left"><b>${item.name}</b><span class="rc-schedule">${item.schedule}</span></div>`;
          resultados.appendChild(div);
        });
      }
    };
  }

});