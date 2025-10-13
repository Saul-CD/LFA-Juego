from JuegoInterfaz import JuegoInterfaz


MAPA = [
    "###############",
    "#.  #      ##.#",
    "# #f#.  ##   f#",
    "# ####  *#### #",
    "#           #.#",
    "### ##*# ## ###",
    "#p   #   #   .#",
    "####       ####",
    "###############",
]


# Version de busqueda en anchura que regresa el siguiente movimiento del camino mas optimo del fantasma hacia pacman
def moverFantasma(fantasma: tuple[int, int], objetivo: tuple[int, int]):
    if fantasma == objetivo:
        return fantasma
    visitados: set[tuple[int, int]] = {fantasma}
    cola: list[
        tuple[
            tuple[int, int],
            tuple[int, int] | None,
        ]
    ] = [(fantasma, None)]
    padres: dict[tuple[int, int], tuple[int, int] | None] = {}

    while len(cola) != 0:
        (x, y), padre = cola.pop(0)
        padres[(x, y)] = padre

        if (x, y) == objetivo:
            actual = (x, y)
            while padres[actual] != fantasma:
                actual = padres[actual]
            return actual

        for nx, ny in [(x + 1, y), (x, y - 1), (x, y + 1), (x - 1, y)]:
            if MAPA[ny][nx] != "#" and (nx, ny) not in visitados:
                visitados.add((nx, ny))
                cola.append(((nx, ny), (x, y)))

    return fantasma


class PacmanJuego(JuegoInterfaz):
    def __init__(self):
        pacman_inicial = None
        fantasmas_iniciales = []
        puntos_iniciales = []
        poderes_iniciales = []
        for y in range(len(MAPA)):
            for x in range(len(MAPA[0])):
                match MAPA[y][x]:
                    case "p":
                        pacman_inicial = (x, y)
                    case ".":
                        puntos_iniciales.append((x, y))
                    case "*":
                        poderes_iniciales.append((x, y))
                    case "f":
                        fantasmas_iniciales.append((x, y))

        self._q_inicial: tuple[
            tuple[int, int], tuple[tuple[int, int], tuple[int, int]], list[tuple[int, int]], list[tuple[int, int]], bool
        ] = (
            pacman_inicial,  # Posicion de pacman
            tuple(fantasmas_iniciales),  # Posicion de los fantasmas
            puntos_iniciales,  # Posicion de los puntos
            poderes_iniciales,  # Posicion de los poderes
            False,  # Tiene poder?
        )

    @property
    def nombre(self) -> str:
        return "Pacman"

    @property
    def alfabeto(self) -> set[str]:
        return {"w", "a", "s", "d"}

    @property
    def q_inicial(
        self,
    ) -> tuple[
        tuple[int, int],
        tuple[
            tuple[int, int],
            tuple[int, int],
        ],
        list[tuple[int, int]],
        list[tuple[int, int]],
        bool,
    ]:
        return self._q_inicial

    def estado_a_str(
        self,
        q: tuple[
            tuple[int, int],
            tuple[tuple[int, int], tuple[int, int]],
            list[tuple[int, int]],
            list[tuple[int, int]],
            bool,
        ],
    ) -> str:
        pacman, fantasmas, puntos, poderes, tienePoder = q

        puntos_str = ";".join(f"{x},{y}" for x, y in puntos)
        poderes_str = ";".join(f"{x},{y}" for x, y in poderes)
        fantasmas_str = ";".join(f"{x},{y}" for x, y in fantasmas)

        return f"{pacman[0]},{pacman[1]}|{fantasmas_str}|{puntos_str}|{poderes_str}|{tienePoder}"

    def es_final(
        self,
        q: tuple[
            tuple[int, int],
            tuple[tuple[int, int], tuple[int, int]],
            list[tuple[int, int]],
            list[tuple[int, int]],
            bool,
        ],
    ) -> bool:
        _, _, puntos, _, _ = q

        return len(puntos) == 0  # Solo se gana al comer todos los puntos

    def aplicar_entrada(
        self,
        q: tuple[
            tuple[int, int],
            tuple[tuple[int, int], tuple[int, int]],
            list[tuple[int, int]],
            list[tuple[int, int]],
            bool,
        ],
        entrada: str,
    ):
        if self.es_final(q):
            return q

        pacman, fantasmas, puntos, poderes, tiene_poder = q

        if pacman in fantasmas:
            return self.q_inicial

        px, py = pacman

        # Mover pacman
        if entrada == "w":
            py -= 1
        elif entrada == "s":
            py += 1
        elif entrada == "a":
            px -= 1
        elif entrada == "d":
            px += 1

        # Si choca con una pared, no se mueve
        if MAPA[py][px] == "#":
            px, py = pacman

        nuevo_pacman = (px, py)

        # Omitir si pacman se movio a esa casilla
        nuevos_puntos = [punto for punto in puntos if nuevo_pacman != punto]
        nuevos_poderes = [poder for poder in poderes if nuevo_pacman != poder]

        nuevos_fantasmas = []

        # Dar poder si se comio un punto de poder
        nuevo_tiene_poder = tiene_poder
        if len(poderes) != len(nuevos_poderes):
            nuevo_tiene_poder = True

        for fantasma in fantasmas:
            nuevos_fantasmas.append(moverFantasma(fantasma, nuevo_pacman))

        # Mover fantasmas a puntos iniciales distintos si son comidos
        if nuevo_tiene_poder:
            fantasma1, fantasma2 = nuevos_fantasmas
            if nuevo_pacman == fantasma1:
                nuevos_fantasmas.append((12, 2))
                nuevo_tiene_poder = False
                nuevos_fantasmas.remove(fantasma1)
            if nuevo_pacman == fantasma2:
                nuevos_fantasmas.append((2, 1))
                nuevo_tiene_poder = False
                nuevos_fantasmas.remove(fantasma2)

        return (
            nuevo_pacman,
            tuple(nuevos_fantasmas),
            nuevos_puntos,
            nuevos_poderes,
            nuevo_tiene_poder,
        )


if __name__ == "__main__":
    from compilador import compilar_juego

    compilar_juego(PacmanJuego())
