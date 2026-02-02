export default function PedidoList({ pedidos, onPagar, onExcluir }) {
  if (!pedidos.length) return <p>Nenhum pedido</p>;

  return (
    <table className="w-full border">
      <thead>
        <tr>
          <th>Cliente</th>
          <th>CPF</th>
          <th>Descrição</th>
          <th>Valor</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {pedidos.map(p => (
          <tr key={p.id} className="text-center">
            <td>{p.cliente}</td>
            <td>{p.cpf}</td>
            <td>{p.descricao}</td>
            <td>R$ {p.valor.toFixed(2)}</td>
            <td>{p.status}</td>
            <td className="space-x-1">
              {p.status === "Pendente" && (
                <button className="bg-green-500 text-white px-2"
                  onClick={() => onPagar(p.id)}>
                  Pagar
                </button>
              )}
              <button className="bg-red-500 text-white px-2"
                onClick={() => onExcluir(p.id)}>
                Excluir
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
