from JuegoInterfaz import JuegoInterfaz
from compilador import compilar_juego


class Klotski(JuegoInterfaz):
    @property
    def nombre(self) -> str:
        return "Klotski"

    @property
    def alfabeto(self) -> set[str]:
        return {"w", "a", "s", "d", "W", "A", "S", "D"}

    @property
    def q_inicial(self) -> tuple[str, str, str, str, str]:
        return ("ARRB", "ARRB", "ChhD", "CabD", "c12d")

    def estado_a_str(
        self,
        q: tuple[str, str, str, str, str],
    ) -> str:
        ret = ""
        for row in q:
            for char in row:
                if char in "ABCD":
                    ret += "v"
                elif char in "abcd":
                    ret += "."
                else:
                    ret += char

            ret += "\n"

        return ret

    def aplicar_entrada(
        self, q: tuple[str, str, str, str, str], entrada: str
    ) -> tuple[str, str, str, str, str]:
        # Buscar ambos cursores
        cursor1_x, cursor1_y = -1, -1
        for idx, row in enumerate(q):
            if "1" in row:
                cursor1_x = row.index("1")
                cursor1_y = idx
                break
        assert cursor1_x != -1

        cursor2_x, cursor2_y = -1, -1
        for idx, row in enumerate(q):
            if "2" in row:
                cursor2_x = row.index("2")
                cursor2_y = idx
                break
        assert cursor2_x != -1

        cursor_x, cursor_y = -1, -1
        dx, dy = 0, 0
        if entrada in "wasd":
            if entrada == "w":
                dy = -1
            if entrada == "s":
                dy = 1
            if entrada == "a":
                dx = -1
            if entrada == "d":
                dx = 1
            cursor_x, cursor_y = cursor1_x, cursor1_y
        else:
            if entrada == "W":
                dy = -1
            if entrada == "S":
                dy = 1
            if entrada == "A":
                dx = -1
            if entrada == "D":
                dx = 1
            cursor_x, cursor_y = cursor2_x, cursor2_y

        nueva_x, nueva_y = cursor_x + dx, cursor_y + dy

        # Validar que la nueva posicion esta dentro del tablero
        if not (0 <= nueva_x < 4 and 0 <= nueva_y < 5):
            return q

        # Pieza que el cursor intenta empujar
        pieza_char = q[nueva_y][nueva_x]

        # Omitir si intenta empujar el otro cursor
        if pieza_char in "12":
            return q

        coords_pieza = []
        for row in range(5):
            for col in range(4):
                if q[row][col] == pieza_char:
                    coords_pieza.append((row, col))

        nuevas_coords_pieza = []
        for row, col in coords_pieza:
            # La pieza se mueve en direccion opuesta al cursor
            nueva_r, nueva_c = row - dy, col - dx

            # Comprobar si la nueva posicion esta fuera del tablero
            if not (0 <= nueva_c < 4 and 0 <= nueva_r < 5):
                return q

            nuevas_coords_pieza.append((nueva_r, nueva_c))

        q_nuevo: list[list[str | None]] = [list(row) for row in q]

        # Vaciar posiciones viejas de la pieza y cursores
        for row, col in coords_pieza:
            q_nuevo[row][col] = None
        q_nuevo[cursor1_y][cursor1_x] = None
        q_nuevo[cursor2_y][cursor2_x] = None

        # Mover y validar pieza
        for row, col in nuevas_coords_pieza:
            dest = q_nuevo[row][col]
            if dest is not None:
                return q
            q_nuevo[row][col] = pieza_char

        # Buscar el espacio de los cursores de izquierda a derecha
        cursor = 1
        for col in range(4):
            for row in range(5):
                char = q_nuevo[row][col]
                if char is None:
                    q_nuevo[row][col] = f"{cursor}"
                    cursor += 1

        assert cursor == 3

        # 10. Convertir la matriz 2D de vuelta a una cadena y retornarla
        return tuple("".join(row) for row in q_nuevo)

    def es_final(self, q: tuple[str, str, str, str, str]) -> bool:
        return q[3][1] == "R" and q[3][2] == "R" and q[4][1] == "R" and q[4][2] == "R"


compilar_juego(Klotski())
