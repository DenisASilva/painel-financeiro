import { useEffect, useState } from "react";
import PedidoForm from "./components/forms/PedidoForm";
import TransacaoForm from "./components/forms/TransacaoForm";
import PedidoList from "./components/lists/PedidoList";
import TransacaoList from "./components/lists/TransacaoList";
import StatsCard from "./components/dashboard/StatsCard";
import Modal from "./components/ui/Modal";
import LucroChart from "./components/dashboard/LucroChart";
import {
  getPedidos,
  savePedidos,
  getTransacoes,
  saveTransacoes,
} from "./services/storage";

export default function App() {
  const [pedidos, setPedidos] = useState([]);
  const [transacoes, setTransacoes] = useState([]);
  const [filter, setFilter] = useState("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // pedido | despesa | pagamento
  const [pedidoParaPagar, setPedidoParaPagar] = useState(null);

  // ---------- LOAD ----------
  useEffect(() => {
    setPedidos(getPedidos());
    setTransacoes(getTransacoes());
  }, []);

  // ---------- STORAGE ----------
  useEffect(() => savePedidos(pedidos), [pedidos]);
  useEffect(() => saveTransacoes(transacoes), [transacoes]);

  // ---------- CÁLCULOS ----------
  const receita = transacoes
    .filter((t) => t.tipo === "receita")
    .reduce((acc, t) => acc + Number(t.valor), 0);

  const despesa = transacoes
    .filter((t) => t.tipo === "despesa")
    .reduce((acc, t) => acc + Number(t.valor), 0);

  const totalPedidos = pedidos.reduce(
    (acc, p) => acc + Number(p.valor),
    0
  );

  const lucro = receita - despesa;

  // ---------- HANDLERS ----------
  const handleAddPedido = (pedido) => {
    setPedidos((prev) => [...prev, pedido]);
    setIsModalOpen(false);
  };

  const handleAddDespesa = (transacao) => {
    setTransacoes((prev) => [...prev, transacao]);
    setIsModalOpen(false);
  };

  // 🔥 Abre modal Pix / Dinheiro
  const handlePagarPedido = (id) => {
    const pedido = pedidos.find((p) => p.id === id);
    if (!pedido) return;

    setPedidoParaPagar(pedido);
    setModalType("pagamento");
    setIsModalOpen(true);
  };

  // 🔥 Confirma pagamento
  const confirmarPagamento = (formaPagamento) => {
    if (!pedidoParaPagar) return;

    const novaReceita = {
      id: Date.now(),
      cliente: pedidoParaPagar.cliente,
      cpf: pedidoParaPagar.cpf,
      descricao: pedidoParaPagar.descricao,
      valor: Number(pedidoParaPagar.valor),
      tipo: "receita",
      formaPagamento,
      data: new Date().toISOString().split("T")[0],
    };

    setTransacoes((prev) => [...prev, novaReceita]);
    setPedidos((prev) =>
      prev.filter((p) => p.id !== pedidoParaPagar.id)
    );

    setPedidoParaPagar(null);
    setIsModalOpen(false);
  };

  const handleExcluirPedido = (id) => {
    setPedidos((prev) => prev.filter((p) => p.id !== id));
  };

  // ---------- FILTROS ----------
  const filteredTransacoes = transacoes.filter((t) => {
    if (filter === "todos") return true;
    return t.tipo === filter;
  });

  const filteredPedidos = pedidos.filter((p) => {
    if (filter === "todos") return true;
    if (filter === "pedidos") return true;
    return false;
  });

  // ---------- UI ----------
  return (
    <div className="min-h-screen p-6 bg-gray-100 space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Painel Financeiro</h1>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => {
              setModalType("pedido");
              setIsModalOpen(true);
            }}
          >
            Novo Pedido
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={() => {
              setModalType("despesa");
              setIsModalOpen(true);
            }}
          >
            Nova Despesa
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="Total Receitas" value={receita} />
        <StatsCard title="Total Despesas" value={despesa} />
        <StatsCard title="Total Pedidos" value={totalPedidos} />
        <StatsCard title="Lucro" value={lucro} />
      </div>

      {/* Gráfico */}
      <LucroChart transacoes={transacoes} pedidos={pedidos} />

      {/* Filtros */}
      <div className="flex justify-center gap-2 flex-wrap">
        {["todos", "pedidos", "receita", "despesa"].map((f) => (
          <button
            key={f}
            className="px-4 py-2 bg-gray-500 text-white rounded"
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Listas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PedidoList
          pedidos={filteredPedidos}
          onPagar={handlePagarPedido}
          onExcluir={handleExcluirPedido}
        />
        <TransacaoList transacoes={filteredTransacoes} />
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalType === "pedido" && (
          <PedidoForm onAdd={handleAddPedido} />
        )}

        {modalType === "despesa" && (
          <TransacaoForm onAdd={handleAddDespesa} />
        )}

        {modalType === "pagamento" && pedidoParaPagar && (
          <div className="space-y-4 text-center">
            <h2 className="text-lg font-bold">Forma de Pagamento</h2>
            <p>
              Pedido de <strong>{pedidoParaPagar.cliente}</strong>
            </p>

            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={() => confirmarPagamento("Pix")}
              >
                Pix
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => confirmarPagamento("Dinheiro")}
              >
                Dinheiro
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
