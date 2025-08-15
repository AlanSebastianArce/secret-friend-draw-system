// Variables para el juego
let amigos = [];
let yaSeRealizoSorteo = false;

// Elementos del DOM
const inputAmigo = document.getElementById('amigo');
const pantalla = document.getElementById('screenContent');
const displayResultado = document.getElementById('resultDisplay');
const nombreGanador = document.getElementById('winnerName');
const botonSortear = document.getElementById('sortear');
const botonReiniciar = document.getElementById('reiniciar');

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    inputAmigo.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            agregarAmigo();
        }
    });
    inputAmigo.focus();
    actualizarEstadoBotones();
});

// Función para agregar amigos
function agregarAmigo() {
    const nombre = inputAmigo.value.trim();
    
    // Validar entrada vacía
    if (nombre === '') {
        mostrarAlerta('Por favor, ingrese un nombre válido.');
        return;
    }
    
    // Validar longitud del nombre
    if (nombre.length < 2 || nombre.length > 20) {
        mostrarAlerta('El nombre debe tener entre 2 y 20 caracteres.');
        return;
    }
    
    // Verificar nombres duplicados
    if (amigos.includes(nombre)) {
        mostrarAlerta('Este nombre ya está en la lista.');
        inputAmigo.value = '';
        return;
    }
    
    // Límite máximo de participantes
    if (amigos.length >= 15) {
        mostrarAlerta('Máximo 15 participantes permitidos.');
        return;
    }
    
    // No agregar después del sorteo
    if (yaSeRealizoSorteo) {
        mostrarAlerta('No se pueden agregar participantes después del sorteo.');
        return;
    }
    
    // Agregar el amigo
    amigos.push(nombre);
    inputAmigo.value = '';
    inputAmigo.focus();
    
    actualizarPantalla();
    actualizarEstadoBotones();
}

// Función para realizar el sorteo
function sortearAmigo() {
    // Verificar mínimo de participantes
    if (amigos.length < 2) {
        mostrarAlerta('Se necesitan al menos 2 participantes.');
        return;
    }
    
    // Evitar sorteos múltiples
    if (yaSeRealizoSorteo) {
        mostrarAlerta('El sorteo ya fue realizado.');
        return;
    }
    
    // Realizar sorteo aleatorio
    const indiceGanador = Math.floor(Math.random() * amigos.length);
    const ganador = amigos[indiceGanador];
    
    // Mostrar resultado
    nombreGanador.textContent = ganador;
    displayResultado.style.display = 'block';
    displayResultado.classList.add('show');
    
    yaSeRealizoSorteo = true;
    actualizarEstadoBotones();
    actualizarPantallaConResultado(ganador);
}

// Función para reiniciar el juego
function reinicio() {
    if (amigos.length > 0 || yaSeRealizoSorteo) {
        if (!confirm('¿Seguro que desea reiniciar? Se perderán todos los datos.')) {
            return;
        }
    }
    
    // Limpiar datos
    amigos = [];
    yaSeRealizoSorteo = false;
    inputAmigo.value = '';
    nombreGanador.textContent = '';
    
    // Ocultar resultado
    displayResultado.classList.remove('show');
    displayResultado.style.display = 'none';
    
    actualizarPantalla();
    actualizarEstadoBotones();
    inputAmigo.focus();
}

// Función para actualizar la pantalla de participantes
function actualizarPantalla() {
    if (amigos.length === 0) {
        pantalla.innerHTML = `
            <div style="color: #666; font-style: italic; text-align: center; margin-top: 50px;">
                Agregue nombres para comenzar...
            </div>
        `;
        return;
    }
    
    let contenido = '<div style="color: #00ff88; margin-bottom: 15px;">PARTICIPANTES:</div>';
    
    amigos.forEach((amigo, index) => {
        contenido += `
            <div class="participant">
                ${index + 1}. ${amigo}
            </div>
        `;
    });
    
    contenido += `
        <div style="color: #666; margin-top: 20px; text-align: center;">
            Total: ${amigos.length}
        </div>
    `;
    
    pantalla.innerHTML = contenido;
}

// Función para mostrar pantalla después del sorteo
function actualizarPantallaConResultado(ganador) {
    let contenido = '<div style="color: #ff6b6b; margin-bottom: 15px;">RESULTADO:</div>';
    
    amigos.forEach((amigo, index) => {
        const esGanador = amigo === ganador;
        contenido += `
            <div class="participant" style="${esGanador ? 'background: rgba(255, 107, 107, 0.2); border-left-color: #ff6b6b; color: #ff6b6b;' : ''}">
                ${index + 1}. ${amigo} ${esGanador ? '← GANADOR' : ''}
            </div>
        `;
    });
    
    pantalla.innerHTML = contenido;
}

// Función para actualizar estado de botones
function actualizarEstadoBotones() {
    // Botón sortear
    if (amigos.length < 2 || yaSeRealizoSorteo) {
        botonSortear.disabled = true;
        botonSortear.style.opacity = '0.5';
    } else {
        botonSortear.disabled = false;
        botonSortear.style.opacity = '1';
    }
    
    // Botón reiniciar
    if (amigos.length > 0 || yaSeRealizoSorteo) {
        botonReiniciar.disabled = false;
        botonReiniciar.style.opacity = '1';
    } else {
        botonReiniciar.disabled = true;
        botonReiniciar.style.opacity = '0.5';
    }
}

// Función para mostrar alertas
function mostrarAlerta(mensaje) {
    const alerta = document.createElement('div');
    alerta.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span>⚠️</span>
            <span>${mensaje}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="margin-left: auto; background: none; border: none; font-size: 1.2rem; cursor: pointer;">×</button>
        </div>
    `;
    
    // Estilos para la alerta
    alerta.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 255, 255, 0.95);
        border-radius: 10px;
        padding: 15px 20px;
        box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        border-left: 4px solid #ff6b6b;
        max-width: 400px;
        color: #333;
        font-weight: 500;
    `;
    
    document.body.appendChild(alerta);
    
    // Auto-eliminar después de 3 segundos
    setTimeout(() => {
        if (alerta.parentNode) {
            alerta.remove();
        }
    }, 3000);
}