from json import dumps
import os
from JuegoInterfaz import JuegoInterfaz
from os import listdir, mkdir
import gzip


def generar_automata(
    juego: JuegoInterfaz,
) -> tuple[list[str], set[str], int, set[int], list[dict[str, int]]]:
    Q: list[str] = []
    alfabeto: set[str] = juego.alfabeto
    q_inicial: tuple[str, str, str, str, str] = juego.q_inicial
    F: set[int] = set()
    delta: list[dict[str, int]] = []

    pila = [q_inicial]
    visitados = set()

    str_inicial = juego.estado_a_str(q_inicial)
    str_a_id: dict[str, int] = {str_inicial: 0}
    Q.append(str_inicial)
    delta.append({})

    while len(pila) != 0:
        if len(Q) > 500000:
            raise ValueError("Automata demaciado grande!")

        q_actual = pila.pop()
        str_actual = juego.estado_a_str(q_actual)
        id_actual = str_a_id[str_actual]

        for entrada in alfabeto:
            q_nuevo = juego.aplicar_entrada(q_actual, entrada)

            str_nuevo = juego.estado_a_str(q_nuevo)
            if str_nuevo not in str_a_id:
                str_a_id[str_nuevo] = len(Q)
                Q.append(str_nuevo)
                delta.append({})
            id_nuevo = str_a_id[str_nuevo]

            delta[id_actual][entrada] = id_nuevo
            if id_nuevo not in visitados:
                pila.append(q_nuevo)
                visitados.add(id_nuevo)

        if juego.es_final(q_actual):
            F.add(id_actual)

    return (Q, alfabeto, 0, F, delta)


def compilar_juego(juego: JuegoInterfaz):
    automata = generar_automata(juego)
    print(f"Estados encontrados = {len(automata[0])}")

    if juego.nombre not in listdir():
        mkdir(juego.nombre)

    with gzip.open(f"{juego.nombre}/automata.json.gz", "wb") as outf:
        json_obj = {
            "Q": automata[0],
            "sigma": list(automata[1]),
            "q_inicial": automata[2],
            "F": list(automata[3]),
            "delta": automata[4],
        }
        outf.write(dumps(json_obj).encode())
    if "auxiliares.js" not in listdir(juego.nombre):
        with open(f"auxiliaresPlantilla.js", "rb") as inf:
            with open(f"{juego.nombre}/auxiliares.js", "wb") as outf:
                outf.writelines(inf.readlines())
