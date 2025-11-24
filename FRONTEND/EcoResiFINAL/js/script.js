console.log("Cargando Script Principal...");

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM listo. Iniciando...");

  /* =========================================
     1. NAVBAR & MENÚS
     ========================================= */
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (navbar) {
      window.scrollY > 50 ? navbar.classList.add("scrolled") : navbar.classList.remove("scrolled");
    }
  });

  // --- LÓGICA DROPDOWNS ANIMADOS ---
  const dropdowns = document.querySelectorAll('.dropdown');
  
  dropdowns.forEach(dropdown => {
    const btn = dropdown.querySelector('.dropbtn');
    const content = dropdown.querySelector('.dropdown-content');
    
    if(btn && content){
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // 1. Detectar si este menú ya estaba abierto
        const isAlreadyOpen = content.classList.contains('show');

        // 2. Cerrar TODOS los menús primero (para que no queden 2 abiertos)
        document.querySelectorAll('.dropdown-content').forEach(c => c.classList.remove('show'));
        document.querySelectorAll('.dropbtn').forEach(b => b.classList.remove('active'));

        // 3. Si NO estaba abierto, lo abrimos ahora
        if (!isAlreadyOpen) {
          content.classList.add('show'); // Activa la animación CSS
          btn.classList.add('active');   // Gira la flechita
        }
      });
    }
  });

  // Cerrar al hacer click fuera en cualquier lado
  window.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-content').forEach(c => c.classList.remove('show'));
    document.querySelectorAll('.dropbtn').forEach(b => b.classList.remove('active'));
  });

  window.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-content').forEach(c => c.classList.remove('show'));
  });

  /* =========================================
     2. REPRODUCTOR DE VIDEOS
     ========================================= */
  document.querySelectorAll(".video-wrapper").forEach(wrapper => {
    const video = wrapper.querySelector("video");
    const btn = wrapper.querySelector(".play-btn");
    if(video && btn) {
      btn.addEventListener("click", () => {
        if(video.paused){ video.play(); btn.style.opacity = "0"; }
        else { video.pause(); btn.style.opacity = "1"; }
      });
      video.addEventListener("ended", () => { btn.style.opacity = "1"; });
    }
  });

  /* =========================================
     3. RELOJ DE IMPACTO
     ========================================= */
  const elBasura = document.getElementById("basura");
  if(elBasura) {
      const inicio = new Date(new Date().getFullYear(), 0, 1);
      function actualizarReloj() {
        const ahora = new Date();
        const seg = (ahora - inicio) / 1000;
        document.getElementById("basura").textContent = Math.floor(seg * 66).toLocaleString('de-DE');
        document.getElementById("animales").textContent = Math.floor(seg * 3.2).toLocaleString('de-DE');
        document.getElementById("co2").textContent = Math.floor(seg * 57).toLocaleString('de-DE');
        requestAnimationFrame(actualizarReloj);
      }
      actualizarReloj();
  }

  /* =========================================
     4. MODAL HORARIOS
     ========================================= */
  console.log("🔍 Buscando elementos del modal...");
  
  const modal = document.getElementById("modalHorarios");
  const btnGeo = document.getElementById("btnGeoMain");
  const btnManual = document.getElementById("btnManualSearch");
  const inputManual = document.getElementById("inputManual");
  const ticketBox = document.getElementById("ticketResult");
  const closeBtn = document.querySelector(".close-modal-btn");
  const openBtns = document.querySelectorAll("#openHorariosCard, #btnHorariosNav");

  console.log("Modal encontrado:", !!modal);
  console.log("Botón GEO encontrado:", !!btnGeo);
  console.log("Botón MANUAL encontrado:", !!btnManual);
  console.log("Input encontrado:", !!inputManual);
  console.log("Ticket box encontrado:", !!ticketBox);

  // ABRIR Y CERRAR MODAL
  if (modal && openBtns.length > 0) {
    openBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("📂 Abriendo modal");
        modal.style.display = "flex";
      });
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("✖️ Cerrando modal");
      modal.style.display = "none";
    });
  }

  // Cerrar al hacer clic fuera del modal
  if (modal) {
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }

  // FUNCIÓN PARA GENERAR TICKET
  function mostrarTicket(zona) {
    if (!ticketBox) return;
    
    const horas = ["07:00 - 09:00 AM", "14:00 - 16:00 PM", "20:00 - 22:00 PM"];
    const dias = ["Lun, Mié, Vie", "Mar, Jue, Sáb", "Lunes a Sábado"];
    
    const horaRandom = horas[Math.floor(Math.random() * horas.length)];
    const diaRandom = dias[Math.floor(Math.random() * dias.length)];
    
    ticketBox.innerHTML = `
      <div style="background: #0f3d2e; border: 1px solid #55c56f; padding: 20px; border-radius: 10px; text-align: center;">
        <h4 style="color: #55c56f; margin: 0 0 10px 0;">📍 ${zona}</h4>
        <h3 style="color: white; margin: 0 0 10px 0;">${horaRandom}</h3>
        <p style="color: #aaa; margin: 0;">📅 ${diaRandom}</p>
      </div>
    `;
    ticketBox.style.display = "block";
  }

  // BOTÓN GEOLOCALIZACIÓN
  if (btnGeo) {
    btnGeo.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("🎯 Click en botón GEO");
      
      const original = btnGeo.innerHTML;
      btnGeo.innerHTML = "⏳ Obteniendo ubicación...";
      btnGeo.disabled = true;
      btnGeo.style.opacity = "0.7";
      
      // Simulación para BETA (sin API real todavía)
      setTimeout(() => {
        mostrarTicket("Zona Norte (Simulado)");
        btnGeo.innerHTML = "✅ ¡Ubicación detectada!";
        
        setTimeout(() => {
          btnGeo.innerHTML = original;
          btnGeo.disabled = false;
          btnGeo.style.opacity = "1";
        }, 2000);
      }, 1500);
    });
  } else {
    console.error("❌ Botón GEO NO ENCONTRADO");
  }

  // BOTÓN BÚSQUEDA MANUAL
  if (btnManual && inputManual) {
    btnManual.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("🔍 Click en botón MANUAL");
      
      const zona = inputManual.value.trim();
      if (zona.length > 0) {
        mostrarTicket(zona);
        console.log("✅ Mostrando ticket para:", zona);
      } else {
        console.log("⚠️ Input vacío");
        inputManual.style.borderColor = "#ff5555";
        setTimeout(() => {
          inputManual.style.borderColor = "";
        }, 800);
      }
    });
  } else {
    console.error("❌ Botón MANUAL o INPUT NO ENCONTRADOS");
  }

});
