import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function LucroChart({ transacoes, pedidos }) {
  // Preparar dados por mês
  const meses = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const data = meses.map((m, index) => {
    const receitaMes = transacoes
      .filter(t => t.tipo === "receita" && new Date(t.data).getMonth() === index)
      .reduce((acc, t) => acc + Number(t.valor), 0);

    const despesaMes = transacoes
      .filter(t => t.tipo === "despesa" && new Date(t.data).getMonth() === index)
      .reduce((acc, t) => acc + Number(t.valor), 0);

    const pedidosMes = pedidos
      .filter(p => p.status === "Pendente" && new Date(p.data).getMonth() === index)
      .reduce((acc, p) => acc + Number(p.valor), 0);

    return {
      month: m,
      Receita: receitaMes,
      Despesa: despesaMes,
      Pedido: pedidosMes,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="Receita" fill="#22c55e" />
        <Bar dataKey="Despesa" fill="#ef4444" />
        <Bar dataKey="Pedido" fill="#facc15" />
      </BarChart>
    </ResponsiveContainer>
  );
}
