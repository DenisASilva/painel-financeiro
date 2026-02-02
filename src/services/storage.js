const PEDIDOS_KEY = "pedidos";
const TRANSACOES_KEY = "transacoes";

// ---------------- PEDIDOS ----------------
export function getPedidos() {
  const data = localStorage.getItem(PEDIDOS_KEY);
  return data ? JSON.parse(data) : [];
}

export function savePedidos(pedidos) {
  localStorage.setItem(PEDIDOS_KEY, JSON.stringify(pedidos));
}

export function removePedido(id) {
  const pedidos = getPedidos();
  const atualizado = pedidos.filter(p => p.id !== id);
  savePedidos(atualizado);
}

// ---------------- TRANSACOES ----------------
export function getTransacoes() {
  const data = localStorage.getItem(TRANSACOES_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveTransacoes(transacoes) {
  localStorage.setItem(TRANSACOES_KEY, JSON.stringify(transacoes));
}

export function addTransacao(transacao) {
  const transacoes = getTransacoes();
  saveTransacoes([...transacoes, transacao]);
}
