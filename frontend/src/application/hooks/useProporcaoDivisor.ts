import { useCallback, useEffect, useState } from "react";

const MIN = 0.25;
const MAX = 0.75;

function lerProporcao(chave: string, padrao: number): number {
  try {
    const bruto = localStorage.getItem(chave);
    if (!bruto) return padrao;
    const valor = Number(bruto);
    if (!Number.isFinite(valor)) return padrao;
    return Math.min(MAX, Math.max(MIN, valor));
  } catch {
    return padrao;
  }
}

/** Proporção esquerda (0–1) de um split redimensionável, persistida em localStorage. */
export function useProporcaoDivisor(chave: string, padrao = 0.45) {
  const [proporcao, setProporcaoState] = useState(() => lerProporcao(chave, padrao));

  useEffect(() => {
    setProporcaoState(lerProporcao(chave, padrao));
  }, [chave, padrao]);

  const setProporcao = useCallback(
    (valor: number | ((prev: number) => number)) => {
      setProporcaoState((prev) => {
        const proximo = typeof valor === "function" ? valor(prev) : valor;
        const limitado = Math.min(MAX, Math.max(MIN, proximo));
        try {
          localStorage.setItem(chave, String(limitado));
        } catch {
          /* ignore quota / private mode */
        }
        return limitado;
      });
    },
    [chave],
  );

  return [proporcao, setProporcao] as const;
}

export function calcularProporcaoDoPonteiro(
  clientX: number,
  retangulo: DOMRect,
): number {
  if (retangulo.width <= 0) return 0.45;
  return (clientX - retangulo.left) / retangulo.width;
}
