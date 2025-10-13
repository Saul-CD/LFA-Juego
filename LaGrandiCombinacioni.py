from JuegoInterfaz import JuegoInterfaz
from PacManJuego import PacmanJuego
from KlotskiJuego import Klotski

from typing import Any


class LaGrandiCombinasioni(JuegoInterfaz):
    def __init__(self) -> None:
        self._juegos: dict[str, JuegoInterfaz] = {
            "PacMan": PacmanJuego(),
            "Klotski": Klotski(),
        }

    @property
    def nombre(self) -> str:
        return "LaGrandiCombinasioni"

    @property
    def alfabeto(self) -> set[str]:
        # {izquierda, derecha, seleccionar, salir del juego}
        ret = {"a", "d", "w", "regresar"}

        for juego in self._juegos.values():
            ret = ret.union(juego.alfabeto)

        return ret

    @property
    def q_inicial(self) -> Any:
        return ("menu", 0)

    def estado_a_str(
        self,
        q: tuple[str, Any],
    ) -> str:
        juegoNombre, estado = q
        if juegoNombre == "menu":
            if estado == "salir":
                return ""

            juegosNombres = sorted(self._juegos.keys())
            return f"{juegoNombre}@{juegosNombres[estado]}"

        juegoInstancia = self._juegos[juegoNombre]
        return f"{juegoNombre}@{juegoInstancia.estado_a_str(estado)}"

    def aplicar_entrada(self, q: tuple[str, int | Any], entrada: str) -> tuple[str, int | Any]:
        juegoNombre, estado = q
        if juegoNombre == "menu":
            if estado == "salir":
                return q

            match entrada:
                case "a":
                    if estado == 0:
                        return (juegoNombre, len(self._juegos) - 1)
                    else:
                        return (juegoNombre, estado - 1)

                case "d":
                    if estado == len(self._juegos) - 1:
                        return (juegoNombre, 0)
                    else:
                        return (juegoNombre, estado + 1)

                case "w":
                    juegosNombres = sorted(self._juegos.keys())
                    return (juegosNombres[estado], self._juegos[juegosNombres[estado]].q_inicial)

                case "regresar":
                    return ("menu", "salir")

                case _:
                    return q

        juegoInstancia = self._juegos[juegoNombre]
        if entrada == "regresar":
            return ("menu", sorted(self._juegos.keys()).index(juegoNombre))

        if entrada not in juegoInstancia.alfabeto:
            return q

        return (juegoNombre, juegoInstancia.aplicar_entrada(estado, entrada))

    def es_final(self, q: tuple[str, int | Any]) -> bool:
        juegoNombre, estado = q

        if juegoNombre == "menu":
            return q == ("menu", "salir")

        juegoInstancia = self._juegos[juegoNombre]

        return juegoInstancia.es_final(estado)


if __name__ == "__main__":
    from compilador import compilar_juego

    compilar_juego(LaGrandiCombinasioni())
