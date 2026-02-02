export default function TransacaoList({ transacoes }) {
  if (!transacoes.length)
    return <p className="text-center">Nenhuma transação</p>;

  const formatarData = (data) =>
    data ? new Date(data).toLocaleDateString("pt-BR") : "-";

  return (
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="text-center bg-gray-100">
          <th className="border px-2 py-1">Cliente</th>
          <th className="border px-2 py-1">CPF</th>
          <th className="border px-2 py-1">Descrição</th>
          <th className="border px-2 py-1">Valor</th>
          <th className="border px-2 py-1">Tipo</th>
          <th className="border px-2 py-1">Forma Pgto</th>
          <th className="border px-2 py-1">Data</th>
        </tr>
      </thead>
      <tbody>
        {transacoes.map((t) => (
          <tr key={t.id} className="text-center">
            <td className="border px-2 py-1">{t.cliente || "-"}</td>
            <td className="border px-2 py-1">{t.cpf || "-"}</td>
            <td className="border px-2 py-1">{t.descricao}</td>
            <td className="border px-2 py-1">
              R$ {Number(t.valor).toFixed(2)}
            </td>
            <td className="border px-2 py-1 capitalize">{t.tipo}</td>
            <td className="border px-2 py-1">
              {t.formaPagamento || "-"}
            </td>
            <td className="border px-2 py-1">
              {formatarData(t.data)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
