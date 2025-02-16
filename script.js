
// Inicializar Swiper
const swiper = new Swiper('.mySwiper', {
    loop: true,
    autoplay: { delay: 3000 },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: { el: '.swiper-pagination', clickable: true },
    breakpoints: {
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
    }
});


// Nuevo Countdown mejorado
const countdownDate = new Date('2025-03-15T18:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    if (distance <= 0) {
       // Modificar las líneas donde se actualizan los números:
document.getElementById('days').textContent = String(days).padStart(2, '0');
document.getElementById('hours').textContent = String(hours).padStart(2, '0');
document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        confetti(); // 🎉 Lanza confeti cuando llegue a 0
        clearInterval(countdownInterval);
        return;
    }

    document.getElementById('days').textContent = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
    document.getElementById('hours').textContent = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
    document.getElementById('minutes').textContent = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    document.getElementById('seconds').textContent = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
}

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();


// EmailJS y gestión de invitados
emailjs.init("inCqGzUeBngjrlH8L");

let listaInvitados = [];
let maxAcompañantes = 0;

fetch("invitados.json")
    .then(response => response.json())
    .then(data => listaInvitados = data)
    .catch(error => console.error("Error cargando invitados:", error));

function buscarInvitado() {
    const input = document.getElementById("guestName").value.toLowerCase();
    const sugerencias = document.getElementById("sugerencias");
    sugerencias.innerHTML = "";

    if (input.length < 2) return;

    const resultados = listaInvitados.filter(invitado => 
        invitado.nombre.toLowerCase().includes(input)
    );

    resultados.forEach(invitado => {
        const li = document.createElement("li");
        li.textContent = invitado.nombre;
        li.onclick = () => seleccionarInvitado(invitado);
        sugerencias.appendChild(li);
    });
}


function confirmarAsistencia() {
    const nombre = document.getElementById("guestName").value;
    const invitados = document.getElementById("guestCount").value;
    const messageDiv = document.getElementById("formMessage");

    if (!nombre || !invitados) {
        messageDiv.textContent = "Por favor co// Función de selección de invitado MODIFICADA
function seleccionarInvitado(invitado) {
    const guestCountInput = document.getElementById("guestCount");
    const errorMessage = document.getElementById("errorMessage");
    const maxGuestSpan = document.getElementById("maxGuest");
    
    // Actualizar valores
    document.getElementById("guestName").value = invitado.nombre;
    guestCountInput.value = "";
    guestCountInput.max = invitado.acompañantes;
    maxAcompañantes = invitado.acompañantes;
    
    // Actualizar UI
    errorMessage.textContent = "";
    maxGuestSpan.textContent = maxAcompañantes;
    document.getElementById("sugerencias").innerHTML = "";
    
    // Efecto visual de actualización
    maxGuestSpan.classList.add('max-animation');
    setTimeout(() => maxGuestSpan.classList.remove('max-animation'), 500);
    
    // Forzar validación
    validarAcompañantes();
}

// Función de validación MODIFICADA
function validarAcompañantes() {
    const input = document.getElementById("guestCount");
    const alert = document.getElementById("guestAlert");
    const errorMessage = document.getElementById("errorMessage");
    const currentMax = maxAcompañantes;
    
    let valor = parseInt(input.value) || 0;

    input.setCustomValidity(''); // Limpiar validación HTML5
    
    if (valor > currentMax) {
        input.value = currentMax;
        input.setCustomValidity(`Máximo permitido: ${currentMax}`);
        errorMessage.textContent = `¡Máximo ${currentMax} personas!`;
        alert.classList.add('visible');
    } else if (valor < 1) {
        input.value = "";
        input.setCustomValidity('Debes confirmar al menos 1 persona');
        errorMessage.textContent = "Al menos 1 persona";
        alert.classList.add('visible');
    } else {
        errorMessage.textContent = "";
        alert.classList.remove('visible');
    }
    
    // Actualizar mensaje en tiempo real
    document.getElementById("maxGuest").textContent = currentMax;
    input.reportValidity(); // Mostrar mensaje HTML5
}mpleta todos los campos";
        messageDiv.style.color = "#d63384";
        return;
    }

    emailjs.send("service_wwoqk4u", "template_dienhrd", {
        nombre: nombre,
        invitados: invitados
    }).then(() => {
        messageDiv.textContent = `¡Confirmado! ${nombre} con ${invitados} Personas`;
        messageDiv.style.color = "var(--verde-oliva)";
        
        setTimeout(() => {
            closeRSVP();
            document.getElementById("rsvpForm").reset();
            messageDiv.textContent = "";
        }, 3000);
    }).catch(error => {
        messageDiv.textContent = "Error al enviar, intenta nuevamente";
        messageDiv.style.color = "#d63384";
        console.error("EmailJS Error:", error);
    });
}

function openRSVP() {
    document.getElementById("rsvpModal").style.display = "block";
}

function closeRSVP() {
    document.getElementById("rsvpModal").style.display = "none";
}
function declinarAsistencia() {
    const nombre = document.getElementById("guestName").value;
    const messageDiv = document.getElementById("formMessage");

    // Validar que haya seleccionado un nombre válido
    const invitadoValido = listaInvitados.find(invitado => invitado.nombre.toLowerCase() === nombre.toLowerCase());

    if (!invitadoValido) {
        messageDiv.textContent = "⚠️ Debes seleccionar tu nombre antes de rechazar la invitación.";
        messageDiv.style.color = "#d63384";
        return;
    }

    emailjs.send("service_wwoqk4u", "template_dienhrd", {
        nombre: nombre,
        invitados: "No asistirá"
    }).then(() => {
        messageDiv.textContent = `Lamentamos que no puedas asistir, ${nombre}.`;
        messageDiv.style.color = "#d63384";

        setTimeout(() => {
            closeRSVP();
            document.getElementById("rsvpForm").reset();
            messageDiv.textContent = "";
        }, 3000);
    }).catch(error => {
        messageDiv.textContent = "Error al enviar, intenta nuevamente.";
        messageDiv.style.color = "#d63384";
        console.error("EmailJS Error:", error);
    });
}


// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    if (event.target == document.getElementById("rsvpModal")) {
        closeRSVP();
    }
}

// Efecto Parallax
window.addEventListener('scroll', () => {
    if(window.innerWidth > 768) { // Solo en desktop
        const scrolled = window.pageYOffset;
        document.querySelector('.hero').style.backgroundPositionY = `${scrolled * 0.5}px`;
    }
});
// Animaciones al hacer scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.detail-card').forEach((card) => {
    observer.observe(card);
});


//lluvia de sobres

document.addEventListener("DOMContentLoaded", () => {
    const envelopeContainer = document.querySelector(".envelope-rain");

    function createEnvelope() {
        const envelope = document.createElement("div");
        envelope.classList.add("envelope");
        envelope.style.left = Math.random() * 100 + "vw";
        envelope.style.animationDuration = Math.random() * 3 + 2 + "s"; // 2-5 segundos

        envelopeContainer.appendChild(envelope);

        setTimeout(() => {
            envelope.remove();
        }, 5000);
    }

    setInterval(createEnvelope, 500);
});



//musica

const music = document.getElementById('backgroundMusic');
const button = document.getElementById('musicButton');
let isPlaying = false;

function toggleMusic() {
    if (isPlaying) {
        music.pause();
        button.innerHTML = '▶️ Reproducir';
    } else {
        music.play();
        button.innerHTML = '⏸️ Pausar';
    }
    isPlaying = !isPlaying;
}

// Intentar reproducción automática
window.addEventListener('load', () => {
    music.play().then(() => {
        isPlaying = true;
        button.innerHTML = '⏸️ Pausar';
    }).catch(() => {
        console.log("El navegador bloqueó la reproducción automática.");
    });
});

// Si la música no se reproduce automáticamente, iniciar al tocar cualquier parte de la pantalla
document.body.addEventListener('click', () => {
    if (!isPlaying) {
        music.play();
        isPlaying = true;
        button.innerHTML = '⏸️ Pausar';
    }
}, { once: true }); // Solo se ejecuta una vez




