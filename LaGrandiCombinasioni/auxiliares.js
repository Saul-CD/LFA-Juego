klotski = {
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

        const tableroDiv = document.createElement("div");
        tableroDiv.style["display"] = "grid";
        tableroDiv.style["grid-template-columns"] = `repeat(${this.ANCHO_TABLERO}, ${this.TAM_CELDA}px)`;
        tableroDiv.style["grid-template-rows"] = `repeat(${this.ALTO_TABLERO}, ${this.TAM_CELDA}px)`;
        tableroDiv.style["gap"] = "5px";
        tableroDiv.style["position"] = "relative";

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

                tableroDiv.appendChild(pieceElement);

                for (let h = 0; h < height; h++) {
                    for (let w = 0; w < width; w++) {
                        piezasYaDibujadas.add(`${x + w},${y + h}`);
                    }
                }
            }
        }

        contenedor.appendChild(tableroDiv);

        const controles = document.createElement("div");
        controles.style["margin-top"] = "10px";
        controles.style["width"] = `${this.ANCHO_TABLERO * this.TAM_CELDA}px`;
        controles.style["color"] = "white";
        controles.style["text-align"] = "center";
        controles.textContent = "Usa WASD y las flechas para mover los cursores";
        contenedor.appendChild(controles);
    },
};
pacman = {
    MAPA: [
        "###############",
        "#   #      ## #",
        "# # #   ##    #",
        "# ####   #### #",
        "#           # #",
        "### ## # ## ###",
        "#    #   #    #",
        "####       ####",
        "###############",
    ],

    touchX: -1,
    touchY: -1,
    minDistanciaSwipe: 30,

    /**
     * Dibuja un estado especifico en el contenedor proporcionado.
     * @param {string} q - El string del estado actual.
     * @param {HTMLElement} contenedor - El elemento HTML vacio donde se dibujara el tablero.
     */

    dibujarEstado: function (q, contenedor) {
        const [pacmanStr, fantasmasStr, puntosStr, poderesStr, tienePoderStr] = q.split("|");
        const [px, py] = pacmanStr.split(",").map(Number);
        const fantasmas = fantasmasStr ? fantasmasStr.split(";").map((pos) => pos.split(",").map(Number)) : [];
        const puntos = puntosStr ? puntosStr.split(";").map((pos) => pos.split(",").map(Number)) : [];
        const poderes = poderesStr ? poderesStr.split(";").map((pos) => pos.split(",").map(Number)) : [];
        const tienePoder = tienePoderStr === "True";

        // --- Verificación de victoria y derrota ---
        const haGanado = puntos.length === 0;
        // La condición de derrota es si un fantasma está en la misma casilla que Pac-Man Y Pac-Man NO tiene poder.
        const haPerdido = fantasmas.some(([fx, fy]) => fx === px && fy === py && !tienePoder);
        let gif = null;
        let texto = null;
        if (haGanado) {
            // --- LÓGICA DE VICTORIA ---
            gif = "https://media.tenor.com/m6GXiMipKOgAAAAM/victory-yes.gif";
            texto = "Ganaste!";
        } else if (haPerdido) {
            // --- LÓGICA DE DERROTA ---
            gif = "https://media.tenor.com/KxHvjKDoTkEAAAAM/brain-taking-out.gif";
            texto = "Perdiste...\r\nMueve para volver a empezar";
        }

        if (gif) {
            const mensaje = document.createElement("div");
            mensaje.style["margin-top"] = "10px";
            mensaje.style["color"] = "white";
            mensaje.style["text-align"] = "center";
            mensaje.style["white-space"] = "pre-line";
            mensaje.textContent = texto;

            const defeatGif = document.createElement("img");
            defeatGif.src = gif;
            defeatGif.style.width = "100%"; // Para que se ajuste al contenedor
            defeatGif.style.height = "auto";
            contenedor.appendChild(defeatGif);
            contenedor.appendChild(mensaje);

            return; // Detenemos la función aquí
        }

        // --- Si el juego no ha terminado, se dibuja el tablero ---
        const darEstilo = (celda, estilo) => {
            const estilos = {
                muro: `background-color: #2980b9; border-radius: 2px`,
                punto: `position: relative; top: 45%; left: 45%; width: 4px; height: 4px; background-color: white; border-radius: 50%`,
                poder: `position: relative; top: 35%; left: 35%; width: 8px; height: 8px; background-color: #df8c18ff; border-radius: 50%`,
                pacman: `background-color: yellow; border-radius: 50%`,
                "pacman-poder": `background-color: #ff7700ff; border-radius: 50%; box-shadow: 0 0 10px #ff7700ff`,
                fantasma: `border-radius: 100px 100px 0 0; background-color: red`,
                "fantasma-huyendo": `border-radius: 100px 100px 0 0; background-color: #00bfff`, // Cambié a un azul más claro
            };
            celda.style.cssText = estilos[estilo];
        };

        const tableroDiv = document.createElement("div");
        tableroDiv.style.display = "grid";
        tableroDiv.style.gridTemplateColumns = `repeat(${this.MAPA[0].length}, 25px)`;
        tableroDiv.style.gridTemplateRows = `repeat(${this.MAPA.length}, 25px)`;

        for (let y = 0; y < this.MAPA.length; y++) {
            for (let x = 0; x < this.MAPA[y].length; x++) {
                const celda = document.createElement("div");
                if (this.MAPA[y][x] === "#") {
                    darEstilo(celda, "muro");
                } else {
                    if (puntos.some(([px, py]) => px === x && py === y)) darEstilo(celda, "punto");
                    else if (poderes.some(([px, py]) => px === x && py === y)) darEstilo(celda, "poder");

                    if (px === x && py === y) darEstilo(celda, tienePoder ? "pacman-poder" : "pacman");

                    fantasmas.forEach(([fx, fy]) => {
                        if (fx === x && fy === y) darEstilo(celda, tienePoder ? "fantasma-huyendo" : "fantasma");
                    });
                }
                tableroDiv.appendChild(celda);
            }
        }

        contenedor.appendChild(tableroDiv);

        const controles = document.createElement("div");
        controles.style["margin-top"] = "10px";
        controles.style["color"] = "white";
        controles.style["text-align"] = "center";
        controles.style["white-space"] = "pre-line";
        controles.textContent = "Usa las flechas o arrastra la pantalla para moverte.";
        contenedor.appendChild(controles);
    },
};

window.juegoAuxiliares = {
    touchX: -1,
    touchY: -1,
    minDistanciaSwipe: 30,
    botonRegresar: null,

    /**
     * Dibuja un estado especifico en el contenedor proporcionado.
     * @param {string} q - El string del estado actual.
     * @param {HTMLElement} contenedor - El elemento HTML vacio donde se dibujara el tablero.
     */
    dibujarEstado: function (q, contenedor) {
        if (q === "") return;

        const [juego, estado] = q.split("@");

        const botonRegresarDiv = document.createElement("div");

        if (!this.botonRegresar) {
            this.botonRegresar = document.createElement("button");
            this.botonRegresar.id = "botonRegresar";
            this.botonRegresar.style.cssText = `
            margin-bottom: 15px
            margin-right: 0;
            margin-left: auto;
            padding: 10px;
            cursor: pointer;
            background-color: red;
            color: white;
            border: none;
            border-radius: 5px;
            display: block;
            `;
        }
        this.botonRegresar.textContent = juego == "menu" ? "Salir" : "Volver al Menú";
        botonRegresarDiv.appendChild(this.botonRegresar);
        contenedor.appendChild(botonRegresarDiv);

        switch (juego) {
            case "Klotski":
                contenedor.setAttribute("juego", "klotski");
                return klotski.dibujarEstado(estado, contenedor);
            case "PacMan":
                contenedor.setAttribute("juego", "pacman");
                return pacman.dibujarEstado(estado, contenedor);
            case "menu":
                contenedor.setAttribute("juego", "menu");
                const texto = document.createElement("div");
                texto.innerHTML = `Presiona Enter para jugar: ${estado}. Usa las flechas para cambiar de juego.`;

                contenedor.appendChild(texto);
                return;
        }
    },

    /**
     * Configura los manejadores de entrada (teclado, mouse y touch)
     * @param {HTMLElement} contenedor - El elemento HTML donde se dibuja el tablero.
     * @param {function} leerEntradaUsuario - La funcion del interprete a la que se debe llamar con la accion del usuario.
     */
    capturarEntrada: function (contenedor, leerEntradaUsuario) {
        // Controles especificos del puzzle klotski
        const keydownKlotski = (event) => {
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
                leerEntradaUsuario(movimiento);
            }
        };
        const touchstartKlotski = (event) => {
            const touch = event.touches[0];
            this.touchX = touch.clientX;
            this.touchY = touch.clientY;

            this.piezaTocada = event.target.dataset.piece;
        };
        const touchendKlotski = (event) => {
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
                event.preventDefault();
                leerEntradaUsuario(movimiento);
            }
            this.piezaTocada = null;
        };

        // Controles especificos del pacman
        const keydownPacman = (event) => {
            const equivalencias = {
                w: "w",
                a: "a",
                s: "s",
                d: "d",
                W: "w",
                A: "a",
                S: "s",
                D: "d",
                ArrowUp: "w",
                ArrowLeft: "a",
                ArrowDown: "s",
                ArrowRight: "d",
            };
            const movimiento = equivalencias[event.key];
            if (movimiento) {
                event.preventDefault();
                leerEntradaUsuario(movimiento);
            }
        };
        const touchstartPacman = (event) => {
            const touch = event.touches[0];
            this.touchX = touch.clientX;
            this.touchY = touch.clientY;
        };
        const touchendPacman = (event) => {
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
                event.preventDefault();
                leerEntradaUsuario(direccion);
            }
        };

        // La grandi combinasioni
        const keydown = (event) => {
            const equivalencias = {
                a: "a",
                d: "d",

                A: "a",
                D: "d",

                ArrowLeft: "a",
                ArrowRight: "d",

                Enter: "w",
                " ": "w",

                Backspace: "regresar",
            };

            if (equivalencias[event.key] === "regresar") {
                event.preventDefault();
                return leerEntradaUsuario("regresar");
            }

            switch (contenedor.getAttribute("juego")) {
                case "klotski":
                    return keydownKlotski(event);

                case "pacman":
                    return keydownPacman(event);

                case "menu":
                    const movimiento = equivalencias[event.key];
                    if (movimiento) {
                        event.preventDefault();
                        leerEntradaUsuario(movimiento);
                    }
                    break;
            }
        };
        const touchmove = (event) => event.preventDefault();
        const touchstart = (event) => {
            switch (contenedor.getAttribute("juego")) {
                case "klotski":
                    return touchstartKlotski(event);

                case "pacman":
                    return touchstartPacman(event);

                case "menu":
                    const touch = event.touches[0];
                    this.touchX = touch.clientX;
                    this.touchY = touch.clientY;
                    break;
            }
        };
        const touchend = (event) => {
            switch (contenedor.getAttribute("juego")) {
                case "klotski":
                    return touchendKlotski(event);

                case "pacman":
                    return touchendPacman(event);

                case "menu":
                    const touch = event.changedTouches[0];
                    const dx = touch.clientX - this.touchX;

                    let direccion = null;
                    if (Math.abs(dx) > this.minDistanciaSwipe) {
                        direccion = dx > 0 ? "d" : "a";
                    }

                    if (direccion) {
                        event.preventDefault();
                        leerEntradaUsuario(direccion);
                    }
                    break;
            }
        };

        // Configurar listeners
        window.addEventListener("keydown", keydown);
        contenedor.addEventListener("touchstart", touchstart, { passive: false });
        contenedor.addEventListener("touchmove", touchmove, { passive: false });
        contenedor.addEventListener("touchend", touchend, { passive: false });

        this.botonRegresar.addEventListener("click", () => leerEntradaUsuario("regresar"));
    },
};
