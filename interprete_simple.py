from Mazmorra_determinista import automata
from json import dumps, loads


def interpretar(
    Q: set[str],
    sigma: set[str],
    q_inicial: str,
    F: set[str],
    delta: dict[str, dict[str, str]],
):
    # Los estados finales son validos
    assert Q.issuperset(F)
    # El estado inicial es un estado valido
    assert q_inicial in Q
    # La funcion/relacion de transaccion tiene una entrada para cada estado
    assert set(delta.keys()) == Q
    # La funcion/relacion de transaccion tiene una entrada para cada elemento del alfabeto
    assert all(set(v.keys()) == sigma for v in delta.values())
    # La funcion/relacion de transaccion solo produce estados validos
    assert all(set(v.values()).issubset(Q) for v in delta.values())

    estado = q_inicial
    while estado not in F:
        interpretar_estado(estado)
        entrada = leer_entrada()
        estado = delta[estado][entrada]


def interpretar_estado(estado):
    jsonobj = loads(estado)
    print(dumps(jsonobj, indent=2))


def leer_entrada():
    print(automata[1])
    return input("entrada: ")


interpretar(*automata)
