class Automata {
    constructor(automata) {
        this.Q = new Set(automata.Q);
        this.sigma = new Set(automata.sigma);
        this.q_inicial = automata.q_inicial;
        this.F = new Set(automata.F);
        this.delta = automata.delta;

        this.q_actual = automata.q_inicial;
        this.termino = false;
    }
    leerEntrada(entrada) {
        if (this.termino) return;

        this.q_actual = this.delta[this.q_actual][entrada];
        juegoElement.innerHTML = "";
        window.juegoAuxiliares.dibujarEstado(this.q_actual, juegoElement);

        if (this.q_actual in this.F) this.termino = true;
    }
    enEstadoFinal() {
        return this.F.has(this.q_actual);
    }
}

const juegoElement = document.getElementById("juego");
const estatusElement = document.getElementById("estatus");

async function main() {
    try {
        let response = await fetch("juego/automata.json");
        if (!response.ok) throw new Error("No se encontró juego/automata.json");
        const automata_json = await response.json();

        const automata = new Automata(automata_json);
        estatusElement.textContent = "";

        window.juegoAuxiliares.capturarEntrada(automata.q_actual, juegoElement, (entrada) =>
            automata.leerEntrada(entrada)
        );

        window.juegoAuxiliares.dibujarEstado(automata.q_inicial, juegoElement);
    } catch (error) {
        console.error(error);
    }
}

main();
