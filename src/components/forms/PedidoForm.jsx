import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PedidoForm({ onAdd }) {
  const [cliente, setCliente] = useState("");
  const [cpf, setCpf] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");

  function formatCPF(value) {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!cliente || !cpf || !descricao || !valor) return;

    onAdd({
      id: Date.now(),
      cliente,
      cpf: formatCPF(cpf),
      descricao,
      valor: Number(valor),
      status: "Pendente",
      data: new Date().toISOString().split("T")[0],
    });

    setCliente("");
    setCpf("");
    setDescricao("");
    setValor("");
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <h2 className="text-lg font-semibold">Novo Pedido</h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input placeholder="Cliente" value={cliente} onChange={e => setCliente(e.target.value)} />
          <Input placeholder="CPF" value={cpf} onChange={e => setCpf(e.target.value)} />
          <Input placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} />
          <Input type="number" placeholder="Valor" value={valor} onChange={e => setValor(e.target.value)} />
          <Button type="submit" className="w-full">Adicionar</Button>
        </form>
      </CardContent>
    </Card>
  );
}
