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
            texto = "Perdiste...";
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

    /**
     * Configura los manejadores de entrada (teclado, mouse y touch)
     * @param {HTMLElement} contenedor - El elemento HTML donde se dibuja el tablero.
     * @param {function} leerEntradaUsuario - La funcion del interprete a la que se debe llamar con la accion del usuario.
     */
    capturarEntrada: function (contenedor, leerEntradaUsuario) {
        // (Esta función está correcta, no necesita cambios)
        const keydown = (event) => {
            const equivalencias = {
                w: "w", a: "a", s: "s", d: "d",
                W: "w", A: "a", S: "s", D: "d",
                ArrowUp: "w", ArrowLeft: "a", ArrowDown: "s", ArrowRight: "d",
            };
            const movimiento = equivalencias[event.key];
            if (movimiento) {
                event.preventDefault();
                leerEntradaUsuario(movimiento);
            }
        };

        if (window.currentGameKeyListener) {
            window.removeEventListener("keydown", window.currentGameKeyListener);
        }
        window.addEventListener("keydown", keydown);
        window.currentGameKeyListener = keydown;

        // Controles moviles
        const touchstart = (event) => {
            const touch = event.touches[0];
            this.touchX = touch.clientX;
            this.touchY = touch.clientY;
        };

        const touchmove = (event) => event.preventDefault();

        const touchend = (event) => {
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
                leerEntradaUsuario(direccion);
            }
        };

        contenedor.addEventListener("touchstart", touchstart, { passive: false });
        contenedor.addEventListener("touchmove", touchmove, { passive: false });
        contenedor.addEventListener("touchend", touchend, { passive: false });
    },
};
