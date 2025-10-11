window.juegoAuxiliares = {
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

        const darEstilo = (celda, estilo) => {
            const estilos = {
                muro: {
                    "background-color": "#2980b9",
                    "border-radius": "2px",
                },

                punto: {
                    position: "relative",
                    top: "45%",
                    left: "45%",
                    width: "4px",
                    height: "4px",
                    "background-color": "white",
                    "border-radius": "50%",
                },

                poder: {
                    position: "relative",
                    top: "35%",
                    left: "35%",
                    width: "8px",
                    height: "8px",
                    "background-color": "#f1c40f",
                    "border-radius": "50%",
                },

                pacman: {
                    "background-color": "#f1c40f",
                    "border-radius": "50%",
                },
                "pacman-poder": {
                    "background-color": "#e67e22",
                    "border-radius": "50%",
                    "box-shadow": "0 0 10px #e67e22",
                },

                fantasma: {
                    "border-radius": "100px 100px 0 0",
                    "background-color": "#e74c3c",
                },

                "fantasma-huyendo": {
                    "border-radius": "100px 100px 0 0",
                    "background-color": "#9b59b6",
                },
            };
            celda.style.cssText = "";
            for (const k in estilos[estilo]) {
                const v = estilos[estilo][k];
                celda.style[k] = v;
            }
        };

        const tableroDiv = document.createElement("div");

        tableroDiv.style.display = "grid";
        tableroDiv.style.gridTemplateColumns = `repeat(${this.MAPA[0].length}, 30px)`;
        tableroDiv.style.gridTemplateRows = `repeat(${this.MAPA.length}, 30px)`;

        // Dibujar cada celda
        for (let y = 0; y < this.MAPA.length; y++) {
            for (let x = 0; x < this.MAPA[y].length; x++) {
                const celda = document.createElement("div");

                if (this.MAPA[y][x] === "#") {
                    darEstilo(celda, "muro");
                } else {
                    if (puntos.some(([px, py]) => px === x && py === y)) darEstilo(celda, "punto");
                    else if (poderes.some(([px, py]) => px === x && py === y)) darEstilo(celda, "poder");

                    if (px === x && py === y) darEstilo(celda, tienePoder ? "pacman-poder" : "pacman");

                    fantasmas.forEach(([fx, fy], index) => {
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
        controles.style["white-space"] =  "pre-line";
        controles.textContent = "Usa las flechas para moverte\r\nGanas al conseguir todos los puntos blancos";
        contenedor.appendChild(controles);
    },

    /**
     * Configura los manejadores de entrada (teclado, mouse y touch)
     * @param {HTMLElement} contenedor - El elemento HTML donde se dibuja el tablero.
     * @param {function} leerEntradaUsuario - La funcion del interprete a la que se debe llamar con la accion del usuario.
     */
    capturarEntrada: function (contenedor, leerEntradaUsuario) {
        const keydown = (event) => {
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

        window.addEventListener("keydown", keydown);
        window.currentGameKeyListener = keydown;
    },
};
