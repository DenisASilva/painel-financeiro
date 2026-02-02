import StatsCard from "@/components/dashboard/StatsCard";
import LucroChart from "@/components/dashboard/LucroChart";

import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

export function Dashboard() {
  // Dados de exemplo (depois serão reais)
  const resumo = {
    receita: 15000,
    despesa: 8200,
    lucro: 6800,
  };

  const chartData = [
    { mes: "Jan", receita: 4000, despesa: 2500, lucro: 1500 },
    { mes: "Fev", receita: 3000, despesa: 1800, lucro: 1200 },
    { mes: "Mar", receita: 5000, despesa: 2700, lucro: 2300 },
    { mes: "Abr", receita: 3000, despesa: 1200, lucro: 1800 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Painel Financeiro
        </h1>
        <p className="text-slate-600">
          Bem-vindo ao controle financeiro da empresa
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Receita"
          value={`R$ ${resumo.receita.toLocaleString("pt-BR")}`}
          icon={TrendingUp}
          trend="+12% este mês"
          trendUp
          color="green"
        />

        <StatsCard
          title="Despesas"
          value={`R$ ${resumo.despesa.toLocaleString("pt-BR")}`}
          icon={TrendingDown}
          trend="-5% este mês"
          trendUp={false}
          color="red"
        />

        <StatsCard
          title="Lucro"
          value={`R$ ${resumo.lucro.toLocaleString("pt-BR")}`}
          icon={DollarSign}
          trend="+18% este mês"
          trendUp
          color="purple"
        />
      </div>

      {/* Gráfico */}
      <LucroChart data={chartData} />
    </div>
  );
}
