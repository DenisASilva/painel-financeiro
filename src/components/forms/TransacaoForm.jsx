import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TransacaoForm({ onAdd }) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!descricao || !valor) return;

    onAdd({
      id: Date.now(),
      descricao,
      valor: Number(valor),
      tipo: "despesa",
      data: new Date().toISOString().split("T")[0],
    });

    setDescricao("");
    setValor("");
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <h2 className="text-lg font-semibold">Nova Despesa</h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} />
          <Input type="number" placeholder="Valor" value={valor} onChange={e => setValor(e.target.value)} />
          <Button type="submit" className="w-full">Adicionar</Button>
        </form>
      </CardContent>
    </Card>
  );
}
