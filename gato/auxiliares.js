window.juegoAuxiliares = {
    /**
     * Dibuja el estado del juego Tic-Tac-Toe en el contenedor.
     * @param {string} q - El string del estado: "O X   X O|O|X" (tablero|turno|ganador).
     * @param {HTMLElement} contenedor - El elemento HTML donde se dibujará el tablero.
     */
    dibujarEstado: function (q, contenedor) {
        const [tableroStr, turno, ganador] = q.split("|");

        // Limpiamos el contenedor
        contenedor.innerHTML = "";

        // Creamos el tablero visual
        const tableroEl = document.createElement("div");
        tableroEl.style.display = "grid";
        tableroEl.style.gridTemplateColumns = "repeat(3, 100px)";
        tableroEl.style.gridTemplateRows = "repeat(3, 100px)";
        tableroEl.style.gap = "5px";
        tableroEl.style.fontFamily = "Arial, sans-serif";

        for (let i = 0; i < 9; i++) {
            const celda = document.createElement("div");
            celda.style.width = "100px";
            celda.style.height = "100px";
            celda.style.display = "flex";
            celda.style.justifyContent = "center";
            celda.style.alignItems = "center";
            celda.style.fontSize = "48px";
            celda.style.fontWeight = "bold";
            celda.style.border = "2px solid #555";
            celda.style.backgroundColor = "#444";
            celda.dataset.index = i + 1;

            const simbolo = tableroStr[i];
            celda.textContent = simbolo === " " ? "" : simbolo;

            if (simbolo === "X") celda.style.color = "#e74c3c"; // Rojo
            if (simbolo === "O") celda.style.color = "#3498db"; // Azul

            // Solo agregar cursor de puntero si la celda está vacía y el juego no ha terminado
            if (simbolo === " " && !ganador) {
                celda.style.cursor = "pointer";
            }

            tableroEl.appendChild(celda);
        }
        contenedor.appendChild(tableroEl);

        // Creamos y añadimos el mensaje de estado
        const estatusElement = document.createElement("div");

        estatusElement.style["margin-top"] = "20px";
        estatusElement.style["font-size"] = "1.2em";
        estatusElement.style["height"] = "30px";
        estatusElement.style["color"] = "#f1c40f";
        estatusElement.style["text-align"] = "center";

        if (ganador) {
            if (ganador === "Empate") {
                estatusElement.textContent = "¡Es un empate!";
            } else {
                estatusElement.textContent = `¡Ha ganado el jugador ${ganador}!`;
            }
        } else {
            estatusElement.textContent = `Turno de: ${turno}`;
        }
        contenedor.appendChild(estatusElement);
    },

    /**
     * Configura los manejadores de eventos para capturar clics en las casillas.
     * @param {string} q - El string del estado actual.
     * @param {function} leerEntradaUsuario - La función a llamar con la acción del usuario.
     */
    capturarEntrada: function (q, contenedor, leerEntradaUsuario) {
        const [tableroStr, turno, ganador] = q.split("|");

        // Si el juego ha terminado, no configurar listeners.
        if (ganador) {
            if (window.currentGameClickListener) {
                contenedor.removeEventListener("click", window.currentGameClickListener);
            }
            return;
        }

        const clickHandler = (event) => {
            const celda = event.target.closest("div[data-index]");
            if (celda) {
                const movimiento = celda.dataset.index;
                // La lógica del autómata se encargará de si el movimiento es válido o no.
                // Simplemente enviamos la entrada correspondiente a la celda clickeada.
                leerEntradaUsuario(movimiento);
            }
        };

        // Limpiamos el listener anterior para evitar duplicados en cada redibujado
        if (window.currentGameClickListener) {
            contenedor.removeEventListener("click", window.currentGameClickListener);
        }
        contenedor.addEventListener("click", clickHandler);
        window.currentGameClickListener = clickHandler; // Guardamos la referencia
    },
};
