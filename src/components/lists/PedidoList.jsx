export default function PedidoList({ pedidos, onPagar, onExcluir }) {
  if (!pedidos.length) {
    return <p className="text-center">Nenhum pedido</p>;
  }

  const formatarData = (data) => {
    if (!data) return "-";
    return new Date(data).toLocaleDateString("pt-BR");
  };

  return (
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="text-center bg-gray-100">
          <th className="border px-2 py-1">Cliente</th>
          <th className="border px-2 py-1">Descrição</th>
          <th className="border px-2 py-1">Valor</th>
          <th className="border px-2 py-1">Data</th>
          <th className="border px-2 py-1">Ações</th>
        </tr>
      </thead>
      <tbody>
        {pedidos.map((p) => (
          <tr key={p.id} className="text-center">
            <td className="border px-2 py-1">{p.cliente}</td>
            <td className="border px-2 py-1">{p.descricao}</td>
            <td className="border px-2 py-1">
              R$ {Number(p.valor).toFixed(2)}
            </td>
            <td className="border px-2 py-1">
              {formatarData(p.data)}
            </td>
            <td className="border px-2 py-1 space-x-1">
              <button
                className="bg-green-500 text-white px-2 rounded"
                onClick={() => onPagar(p.id)}
              >
                Pagar
              </button>
              <button
                className="bg-red-500 text-white px-2 rounded"
                onClick={() => onExcluir(p.id)}
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
