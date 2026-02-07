import { useState } from "react";

export default function PedidoForm({ onAdd }) {
  const [cliente, setCliente] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!cliente || !descricao || !valor) return;

    onAdd({
      id: Date.now(),
      cliente,
      descricao,
      valor: Number(valor),
      status: "Pendente",
    });

    setCliente("");
    setDescricao("");
    setValor("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        className="w-full border p-2"
        placeholder="Cliente"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
      />

      <input
        className="w-full border p-2"
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />

      <input
        type="number"
        className="w-full border p-2"
        placeholder="Valor"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
      />

      <button className="w-full bg-blue-500 text-white py-2 rounded">
        Salvar Pedido
      </button>
    </form>
  );
}

