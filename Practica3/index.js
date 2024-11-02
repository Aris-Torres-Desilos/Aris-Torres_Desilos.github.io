document.addEventListener('DOMContentLoaded', () => {
    const dificultadSelect = document.getElementById('dificultad');
    const filasInput = document.getElementById('filas');
    const columnasInput = document.getElementById('columnas');
    const minasInput = document.getElementById('minas');
    const personalizado = document.getElementById('personalizado');
    const contenedorJuego = document.querySelector('.contenedor-juego');
    const juego = document.querySelector('.juego');
    const resultado = document.querySelector('.resultado-juego');
    const contadorBanderas = document.getElementById('num-banderas');
    const contadorBanderasRestantes = document.getElementById('banderas-restantes');
    const botonGenerar = document.querySelector('.btn-generar');

    botonGenerar.addEventListener('click', crearJuego);
    dificultadSelect.addEventListener('change', actualizarConfiguracion);

    let width = 10;
    let height = 10;
    let numBombas = 20;
    let numBanderas = 0;
    let casillas = [];
    let finPartida = false;

    const niveles = {
        facil: { width: 5, height: 5, bombas: 5 },
        medio: { width: 8, height: 8, bombas: 12 },
        dificil: { width: 10, height: 10, bombas: 20 },
        muyDificil: { width: 12, height: 12, bombas: 30 },
        hardcore: { width: 15, height: 15, bombas: 50 },
        leyenda: { width: 20, height: 20, bombas: 80 }
    };

    function actualizarConfiguracion() {
        const nivel = dificultadSelect.value;
        if (nivel === 'custom') {
            personalizado.style.display = 'block';
        } else {
            personalizado.style.display = 'none';
            width = niveles[nivel].width;
            height = niveles[nivel].height;
            numBombas = niveles[nivel].bombas;
        }
    }

    function crearJuego() {
        if (dificultadSelect.value === 'custom') {
            width = parseInt(filasInput.value);
            height = parseInt(columnasInput.value);
            numBombas = parseInt(minasInput.value);

            if (width < 5 || height < 5 || numBombas < 1 || numBombas >= width * height) {
                alert("Parámetros inválidos para el modo personalizado.");
                return;
            }
        }

        contenedorJuego.classList.remove('hidden');
        juego.innerHTML = '';
        resultado.textContent = '';
        casillas = [];
        finPartida = false;
        numBanderas = 0;
        actualizarContador();

        juego.style.gridTemplateColumns = `repeat(${width}, 2rem)`;
        juego.style.gridTemplateRows = `repeat(${height}, 2rem)`;

        const arrayBombas = Array(numBombas).fill('bomba');
        const arrayVacios = Array(width * height - numBombas).fill('vacio');
        const arrayCompleto = arrayVacios.concat(arrayBombas).sort(() => Math.random() - 0.5);

        arrayCompleto.forEach((tipo, i) => {
            const casilla = document.createElement('div');
            casilla.classList.add(tipo);
            juego.appendChild(casilla);
            casillas.push(casilla);

            casilla.addEventListener('click', () => click(casilla));
            casilla.oncontextmenu = (e) => { e.preventDefault(); añadirBandera(casilla); };
        });

        actualizarNumeros();
    }

    function click(casilla) {
        if (casilla.classList.contains('marcada') || casilla.classList.contains('bandera') || finPartida) return;
        if (casilla.classList.contains('bomba')) return finJuego(casilla);

        let total = casilla.getAttribute('data');
        casilla.classList.add('marcada');
        casilla.style.backgroundColor = '#ffffff'; // Fondo blanco para casillas seleccionadas

        if (total != 0) {
            casilla.textContent = total;
        } else {
            revelar(casilla);
        }

        comprobarVictoria();
    }

    function añadirBandera(casilla) {
        if (finPartida || casilla.classList.contains('marcada')) return;
        casilla.classList.toggle('bandera');
        casilla.textContent = casilla.classList.contains('bandera') ? '🚩' : '';
        numBanderas += casilla.classList.contains('bandera') ? 1 : -1;
        actualizarContador();
        comprobarVictoria();
    }

    function actualizarContador() {
        contadorBanderas.textContent = numBanderas;
        contadorBanderasRestantes.textContent = numBombas - numBanderas;
    }

    function finJuego(casilla) {
        finPartida = true;
        casilla.classList.add('back-red');
        casillas.forEach(c => {
            if (c.classList.contains('bomba')) {
                c.textContent = '💣';
                c.classList.add('marcada');
            }
        });
        resultado.textContent = 'Lo siento, ¡PERDISTE!';
        resultado.classList.add('back-red');
    }

    function comprobarVictoria() {
        if (casillas.every(c => (c.classList.contains('bomba') && c.classList.contains('bandera')) || (!c.classList.contains('bomba') && c.classList.contains('marcada')))) {
            finPartida = true;
            mostrarBannerVictoria(); // Mostrar el banner de victoria
        }
    }

    function actualizarNumeros() {
        casillas.forEach((casilla, i) => {
            let total = 0;
            const dirs = [-1, 1, -width, width, -width - 1, -width + 1, width - 1, width + 1];
            dirs.forEach(d => { if (casillas[i + d] && casillas[i + d].classList.contains('bomba')) total++; });
            casilla.setAttribute('data', total);
        });
    }

    function revelar(casilla) {
        casilla.classList.add('marcada');
        const id = Array.from(casillas).indexOf(casilla);
        [-1, 1, -width, width].forEach(d => { if (casillas[id + d]) click(casillas[id + d]); });
    }

    // Función para mostrar el banner de victoria
    function mostrarBannerVictoria() {
        const banner = document.createElement('div');
        banner.classList.add('victory-banner');
        banner.textContent = '¡Has ganado!';
        document.body.appendChild(banner);
    }
});
