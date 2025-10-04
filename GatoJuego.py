from compilador import compilar_juego
from JuegoInterfaz import JuegoInterfaz


class Gato(JuegoInterfaz):
    @property
    def nombre(self) -> str:
        return "gato"

    @property
    def alfabeto(self) -> set[str]:
        return {str(i) for i in range(1, 10)}

    @property
    def q_inicial(self):
        return ((" ",) * 9, "X", None)

    def estado_a_str(self, q) -> str:
        tablero, turno, ganador = q
        return f"{''.join(tablero)}|{turno}|{ganador or ''}"

    def aplicar_entrada(self, q, entrada: str):
        tablero, turno, ganador = q

        if ganador or not self._es_movimiento_valido(tablero, entrada):
            return q

        posicion = int(entrada) - 1
        nuevo_tablero_lista = list(tablero)
        nuevo_tablero_lista[posicion] = turno
        nuevo_tablero = tuple(nuevo_tablero_lista)

        nuevo_ganador = self._verificar_ganador(nuevo_tablero)
        siguiente_turno = "O" if turno == "X" else "X"

        return (nuevo_tablero, siguiente_turno, nuevo_ganador)

    def es_final(self, q) -> bool:
        _, _, ganador = q
        return ganador is not None

    def _es_movimiento_valido(self, tablero: tuple, entrada: str) -> bool:
        if entrada not in self.alfabeto:
            return False
        posicion = int(entrada) - 1
        return tablero[posicion] == " "

    def _verificar_ganador(self, tablero: tuple) -> str | None:
        lineas_ganadoras = [
            (0, 1, 2),
            (3, 4, 5),
            (6, 7, 8),
            (0, 3, 6),
            (1, 4, 7),
            (2, 5, 8),
            (0, 4, 8),
            (2, 4, 6),
        ]
        for linea in lineas_ganadoras:
            a, b, c = linea
            if tablero[a] == tablero[b] == tablero[c] and tablero[a] != " ":
                return tablero[a]

        if " " not in tablero:
            return "Empate"
        return None


compilar_juego(Gato())
