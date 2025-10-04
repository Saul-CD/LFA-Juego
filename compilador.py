from json import dump
from JuegoInterfaz import JuegoInterfaz
from os import listdir, mkdir


def generar_automata(
    juego: JuegoInterfaz,
) -> tuple[set[str], set[str], str, set[str], dict[str, dict[str, str]]]:
    # Q: set[str] = set()
    alfabeto: set[str] = juego.alfabeto
    q_inicial: tuple[str, str, str, str, str] = juego.q_inicial
    F: set[str] = set()
    delta: dict[str, dict[str, str]] = {}

    cola = [q_inicial]
    visitados = set()

    while len(cola) != 0:
        q_actual = cola.pop()
        str_actual = juego.estado_a_str(q_actual)

        visitados.add(str_actual)

        if str_actual not in delta:
            delta[str_actual] = {}

        for entrada in alfabeto:
            q_nuevo = juego.aplicar_entrada(q_actual, entrada)

            str_nuevo = juego.estado_a_str(q_nuevo)

            delta[str_actual][entrada] = str_nuevo
            if str_nuevo not in visitados:
                cola.append(q_nuevo)

        if juego.es_final(q_actual):
            F.add(str_actual)

    return (visitados, alfabeto, juego.estado_a_str(q_inicial), F, delta)


def compilar_juego(juego: JuegoInterfaz):
    automata = generar_automata(juego)
    print(f"Estados encontrados = {len(automata[0])}")

    # with open(f"{juego.nombre}.py", "w") as outf:
    #     outf.write(f"automata = {automata}")

    if juego.nombre not in listdir():
        mkdir(juego.nombre)

    with open(f"{juego.nombre}/automata.json", "w") as outf:
        json_obj = {
            "Q": list(automata[0]),
            "sigma": list(automata[1]),
            "q_inicial": automata[2],
            "F": list(automata[3]),
            "delta": automata[4],
        }
        dump(json_obj, outf, indent=2)
    if "auxiliares.js" not in listdir(juego.nombre):
        with open(f"{juego.nombre}/auxiliares.js", "w") as outf:
            outf.write(
                """// Archivo auto-generado con implementaciones de ejemplo
window.juegoAuxiliares = {
    /**
     * Dibuja un estado especifico en el contenedor proporcionado.
     * @param {string} q - El string del estado actual
     * @param {HTMLElement} contenedor - El elemento HTML donde se dibujara el tablero.
     */
    dibujarEstado: function (q, contenedor) {
        // REEMPLAZAR IMPLEMENTACION EJEMPLO
        contenedor.innerHTML = q;
    },

    /**
     * Configura los manejadores de entrada (teclado, mouse y touch)
     * @param {string} q - El string del estado actual.
     * @param {HTMLElement} contenedor - El elemento HTML donde se dibuja el tablero.
     * @param {function} leerEntradaUsuario - La funcion del interprete a la que se debe llamar con la accion del usuario.
     */
    capturarEntrada: function (q, contenedor, leerEntradaUsuario) {
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

        window.removeEventListener("keydown", window.currentGameKeyListener);
        window.addEventListener("keydown", keydown);
        window.currentGameKeyListener = keydown;
    },
};"""
            )
