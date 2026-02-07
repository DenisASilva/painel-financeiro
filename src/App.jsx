import { useEffect, useState } from "react";
import PedidoForm from "./components/forms/PedidoForm";
import TransacaoForm from "./components/forms/TransacaoForm";
import PedidoList from "./components/lists/PedidoList";
import TransacaoList from "./components/lists/TransacaoList";
import StatsCard from "./components/dashboard/StatsCard";
import Modal from "./components/ui/Modal";
import { gerarRelatorioCompletoPDF } from "./services/reportService";
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
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [ano, setAno] = useState(new Date().getFullYear());
  const [clienteFiltro, setClienteFiltro] = useState("");
  const filtrarPorPeriodoECliente = (lista) => {
  return lista.filter((item) => {
    const data = new Date(item.data);
    const mesmoMes = data.getMonth() + 1 === mes;
    const mesmoAno = data.getFullYear() === ano;
    const mesmoCliente = clienteFiltro
      ? item.cliente?.toLowerCase().includes(clienteFiltro.toLowerCase())
      : true;

    return mesmoMes && mesmoAno && mesmoCliente;
  });
};
const pedidosFiltrados = filtrarPorPeriodoECliente(pedidos);
const transacoesFiltradas = filtrarPorPeriodoECliente(transacoes);


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
// ---------- HANDLERS ----------
const handleAddPedido = (pedido) => {
  const novoPedido = {
    ...pedido,
    id: Date.now(),
    tipo: "pedido",
    data: new Date().toISOString(),
  };

  setPedidos((prev) => [...prev, novoPedido]);
  setIsModalOpen(false);
};

const handleAddDespesa = (transacao) => {
  const novaDespesa = {
    ...transacao,
    id: Date.now(),
    tipo: "despesa",
    data: new Date().toISOString(),
  };

  setTransacoes((prev) => [...prev, novaDespesa]);
  setIsModalOpen(false);
};


  // 🔥 Abre modal Pix / Dinheiro / Cheque
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
      descricao: pedidoParaPagar.descricao,
      valor: Number(pedidoParaPagar.valor),
      tipo: "receita",
      formaPagamento,
      data: new Date().toISOString(),
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

      <div className="flex flex-wrap gap-2 justify-center mb-4">
  {/* Mês */}
  <select
    value={mes}
    onChange={(e) => setMes(Number(e.target.value))}
    className="border px-2 py-1 rounded"
  >
    {[...Array(12)].map((_, i) => (
      <option key={i + 1} value={i + 1}>
        {String(i + 1).padStart(2, "0")}
      </option>
    ))}
  </select>

  {/* Ano */}
  <input
    type="number"
    value={ano}
    onChange={(e) => setAno(Number(e.target.value))}
    className="border px-2 py-1 rounded w-24"
  />

  {/* Cliente */}
  <input
    type="text"
    placeholder="Cliente (opcional)"
    value={clienteFiltro}
    onChange={(e) => setClienteFiltro(e.target.value)}
    className="border px-2 py-1 rounded"
  />
</div>


      <div className="flex justify-center mb-4">
        <button
          onClick={() => gerarRelatorioCompletoPDF(pedidos, transacoes, mes, ano, clienteFiltro)}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Gerar Relatório PDF
        </button>
      </div>

      {/* Listas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PedidoList
          pedidos={filteredPedidos}
          onPagar={handlePagarPedido}
          onExcluir={handleExcluirPedido}
        />
        <TransacaoList   transacoes={filteredTransacoes}onExcluir={(id) =>
    setTransacoes(transacoes.filter((t) => t.id !== id))
  } />
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
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded"
                onClick={() => confirmarPagamento("Cheque")}
              >
                Cheque
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
