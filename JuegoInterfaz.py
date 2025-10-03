from typing import Any
from abc import ABC, abstractmethod


class JuegoInterfaz(ABC):
    @property
    @abstractmethod
    def nombre(self) -> str: ...

    @property
    @abstractmethod
    def alfabeto(self) -> set[str]: ...

    @property
    @abstractmethod
    def q_inicial(self) -> Any: ...

    @abstractmethod
    def estado_a_str(
        self,
        q: Any,
    ) -> str: ...

    @abstractmethod
    def aplicar_entrada(self, q: Any, entrada: str) -> Any: ...

    @abstractmethod
    def es_final(self, q: Any) -> bool: ...
