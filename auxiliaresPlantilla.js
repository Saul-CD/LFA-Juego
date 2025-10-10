// Archivo auto-generado con implementaciones de ejemplo
window.juegoAuxiliares = {
    /**
     * Dibuja un estado especifico en el contenedor proporcionado.
     * @param {string} q - El string del estado actual.
     * @param {HTMLElement} contenedor - El elemento HTML vacio donde se dibujara el tablero.
     */
    dibujarEstado: function (q, contenedor) {
        // REEMPLAZAR IMPLEMENTACION EJEMPLO
        contenedor.innerHTML = q;
    },

    /**
     * Configura los manejadores de entrada (teclado, mouse y touch)
     * @param {HTMLElement} contenedor - El elemento HTML donde se dibuja el tablero.
     * @param {function} leerEntradaUsuario - La funcion del interprete a la que se debe llamar con la accion del usuario.
     */
    capturarEntrada: function (contenedor, leerEntradaUsuario) {
        // REEMPLAZAR IMPLEMENTACION EJEMPLO
        const keydown = (event) => {
            const equivalencias = {
                w: "w",
                a: "a",
                s: "s",
                d: "d",
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
