class Automata {
    constructor(automata) {
        this.Q = automata.Q;
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
        window.juegoAuxiliares.dibujarEstado(this.Q[this.q_actual], juegoElement);

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
        let response = await fetch("juego/automata.json.gz");
        if (!response.ok) throw new Error("No se encontró juego/automata.json.gz");
        // const automata_json = await response.json();
        const compressedData = await response.arrayBuffer();

        const decompressedData = pako.inflate(new Uint8Array(compressedData), { to: "string" });

        const automata_json = JSON.parse(decompressedData);

        const automata = new Automata(automata_json);
        estatusElement.textContent = "";

        window.juegoAuxiliares.dibujarEstado(automata.Q[automata.q_actual], juegoElement);

        window.juegoAuxiliares.capturarEntrada(juegoElement, (entrada) => {
            if (!automata.enEstadoFinal()) automata.leerEntrada(entrada);
        });
    } catch (error) {
        console.error(error);
    }
}

main();
