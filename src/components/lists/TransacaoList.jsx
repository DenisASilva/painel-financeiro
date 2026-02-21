import { excluirDoSheets } from "../../services/api";

export default function TransacaoList({ transacoes, onExcluir }) {
  if (!transacoes.length)
    return <p className="text-center">Nenhuma transação</p>;

  const handleExcluir = async (transacao) => {
    const aba =
      transacao.tipo === "receita" ? "Receitas" : "Despesas";

    await excluirDoSheets(transacao.id, aba); // 🔥 Exclui no Sheets
    onExcluir(transacao.id); // 🔥 Atualiza tela
  };

  return (
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="text-center bg-gray-100">
          <th className="border px-2 py-1">Cliente</th>
          <th className="border px-2 py-1">Descrição</th>
          <th className="border px-2 py-1">Valor</th>
          <th className="border px-2 py-1">Tipo</th>
          <th className="border px-2 py-1">Forma Pgto</th>
          <th className="border px-2 py-1">Data</th>
          <th className="border px-2 py-1">Ações</th>
        </tr>
      </thead>
      <tbody>
        {transacoes.map((t) => (
          <tr key={t.id} className="text-center">
            <td className="border px-2 py-1">{t.cliente || "-"}</td>
            <td className="border px-2 py-1">{t.descricao}</td>
            <td className="border px-2 py-1">
              R$ {Number(t.valor).toFixed(2)}
            </td>
            <td className="border px-2 py-1 capitalize">{t.tipo}</td>
            <td className="border px-2 py-1 capitalize">
              {t.formaPagamento || "-"}
            </td>
            <td className="border px-2 py-1">
              {new Date(t.data).toLocaleDateString("pt-BR")}
            </td>
            <td className="border px-2 py-1">
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => handleExcluir(t)}
              >
                Excluir
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}