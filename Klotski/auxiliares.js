window.juegoAuxiliares = {
    ANCHO_TABLERO: 4,
    ALTO_TABLERO: 5,
    TAM_CELDA: 60,
    GAP: 5,
    COLORES: {
        R: "#d95d39",
        v: "#7b9e89",
        h: "#e6c565",
        ".": "#939f5c",
    },

    touchX: 0,
    touchY: 0,
    piezaTocada: null,
    minDistanciaSwipe: 30,

    /**
     * Dibuja un estado especifico en el contenedor proporcionado.
     * @param {string} q - El string del estado actual
     * @param {HTMLElement} contenedor - El elemento HTML donde se dibujara el tablero.
     */
    dibujarEstado: function (q, contenedor) {
        const estadoLimpio = q.replace(/\n/g, "");

        contenedor.style["display"] = "grid";
        contenedor.style["grid-template-columns"] = "repeat(4, 60px)";
        contenedor.style["grid-template-rows"] = "repeat(5, 60px)";
        contenedor.style["gap"] = "5px";
        contenedor.style["position"] = "relative";

        const tablero = [];
        for (let i = 0; i < this.ALTO_TABLERO; i++) {
            tablero.push(estadoLimpio.substring(i * this.ANCHO_TABLERO, (i + 1) * this.ANCHO_TABLERO).split(""));
        }

        const piezasYaDibujadas = new Set();

        for (let y = 0; y < this.ALTO_TABLERO; y++) {
            for (let x = 0; x < this.ANCHO_TABLERO; x++) {
                const piezaChar = tablero[y][x];
                const idPieza = `${x},${y}`;

                if (piezasYaDibujadas.has(idPieza)) continue;

                let width = 1;
                let height = 1;
                switch (piezaChar) {
                    case "v":
                        width = 1;
                        height = 2;
                        break;
                    case "h":
                        width = 2;
                        height = 1;
                        break;
                    case "R":
                        width = 2;
                        height = 2;
                        break;
                    default:
                        break;
                }

                const pieceElement = document.createElement("div");

                pieceElement.style["box-sizing"] = "border-box";
                pieceElement.style["border-radius"] = "5px";
                pieceElement.style["position"] = "absolute";
                pieceElement.style["left"] = `${x * (this.TAM_CELDA + this.GAP)}px`;
                pieceElement.style["top"] = `${y * (this.TAM_CELDA + this.GAP)}px`;
                pieceElement.style["width"] = `${width * this.TAM_CELDA + (width - 1) * this.GAP}px`;
                pieceElement.style["height"] = `${height * this.TAM_CELDA + (height - 1) * this.GAP}px`;

                pieceElement.dataset.piece = piezaChar;

                if (piezaChar in this.COLORES) pieceElement.style["background-color"] = this.COLORES[piezaChar];
                else pieceElement.style["border"] = "3px dotted white";

                contenedor.appendChild(pieceElement);

                for (let h = 0; h < height; h++) {
                    for (let w = 0; w < width; w++) {
                        piezasYaDibujadas.add(`${x + w},${y + h}`);
                    }
                }
            }
        }

        const estatusElement = document.getElementById("cargando");
        if (estatusElement) {
            estatusElement.textContent = "Usa WASD y Flechas para mover los cursores.";
        }
    },

    /**
     * Configura los manejadores de entrada (teclado, mouse y touch)
     * @param {string} q - El string del estado actual.
     * @param {HTMLElement} contenedor - El elemento HTML donde se dibuja el tablero.
     * @param {function} aplicarEntrada - La funcion del interprete a la que se debe llamar con la accion del usuario.
     */
    capturarEntrada: function (q, contenedor, aplicarEntrada) {
        const keydown = (event) => {
            const equivalencias = {
                // cursor 1
                w: "w",
                a: "a",
                s: "s",
                d: "d",
                // cursor 2
                ArrowUp: "W",
                ArrowLeft: "A",
                ArrowDown: "S",
                ArrowRight: "D",
            };
            const movimiento = equivalencias[event.key];
            if (movimiento) {
                event.preventDefault();
                aplicarEntrada(movimiento);
            }
        };

        const touchstart = (event) => {
            const touch = event.touches[0];
            this.touchX = touch.clientX;
            this.touchY = touch.clientY;

            this.piezaTocada = event.target.dataset.piece;
        };

        const touchmove = (event) => event.preventDefault();

        const touchend = (event) => {
            if (this.piezaTocada !== "1" && this.piezaTocada !== "2") return;
            const touch = event.changedTouches[0];
            const dx = touch.clientX - this.touchX;
            const dy = touch.clientY - this.touchY;

            let direccion = null;
            if (Math.abs(dx) > this.minDistanciaSwipe || Math.abs(dy) > this.minDistanciaSwipe) {
                if (Math.abs(dx) > Math.abs(dy)) {
                    direccion = dx > 0 ? "d" : "a";
                } else {
                    direccion = dy > 0 ? "s" : "w";
                }
            }

            if (direccion) {
                const movimiento = this.piezaTocada === "1" ? direccion : direccion.toUpperCase();
                aplicarEntrada(movimiento);
            }
            this.piezaTocada = null;
        };

        window.addEventListener("keydown", keydown);
        contenedor.addEventListener("touchstart", touchstart, { passive: false });
        contenedor.addEventListener("touchmove", touchmove, { passive: false });
        contenedor.addEventListener("touchend", touchend, { passive: false });

        window.currentGameKeyListener = keydown;
        window.currentGameTouchStart = touchstart;
        window.currentGameTouchMove = touchmove;
        window.currentGameTouchEnd = touchend;
    },
};
