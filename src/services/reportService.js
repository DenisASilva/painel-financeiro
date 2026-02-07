import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function gerarRelatorioCompletoPDF(
  pedidos,
  transacoes,
  mes,
  ano,
  cliente
) {
  const doc = new jsPDF();
  let y = 15;

  // =========================
  // TÍTULO
  // =========================
  doc.setFontSize(16);
  doc.text("Relatório Financeiro", 14, y);
  y += 6;

  doc.setFontSize(10);
  doc.text(
    `Período: ${String(mes).padStart(2, "0")}/${ano}${
      cliente ? ` | Cliente: ${cliente}` : ""
    }`,
    14,
    y
  );
  y += 10;

  // =========================
  // RESUMO (FILTRADO!)
  // =========================
  const receitas = transacoes.filter((t) => t.tipo === "receita");
  const despesas = transacoes.filter((t) => t.tipo === "despesa");
  
  const totalReceitas = receitas.reduce(
    (acc, t) => acc + Number(t.valor),
    0
  );
  const totalDespesas = despesas.reduce(
    (acc, t) => acc + Number(t.valor),
    0
  );
  const lucro = totalReceitas - totalDespesas;

  doc.setFontSize(11);
  doc.text(`Total Receitas: R$ ${totalReceitas.toFixed(2)}`, 14, y);
  y += 5;
  doc.text(`Total Despesas: R$ ${totalDespesas.toFixed(2)}`, 14, y);
  y += 5;
  doc.text(`Lucro: R$ ${lucro.toFixed(2)}`, 14, y);
  y += 10;

  // =========================
  // PEDIDOS
  // =========================
  doc.setFontSize(12);
  doc.text("Pedidos", 14, y);
  y += 5;

  autoTable(doc, {
    startY: y,
    head: [["Cliente", "Descrição", "Valor", "Status"]],
    body: pedidos.map((p) => [
      p.cliente,
      p.descricao,
      `R$ ${Number(p.valor).toFixed(2)}`,
      p.status,
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [52, 152, 219] }, // azul
  });

  y = doc.lastAutoTable.finalY + 10;

  // =========================
  // RECEITAS
  // =========================
  doc.text("Receitas", 14, y);
  y += 5;

  autoTable(doc, {
    startY: y,
    head: [["Cliente", "Descrição", "Valor", "Forma Pgto", "Data"]],
    body: receitas.map((r) => [
      r.cliente || "-",
      r.descricao,
      `R$ ${Number(r.valor).toFixed(2)}`,
      r.formaPagamento || "-",
      new Date(r.data).toLocaleDateString("pt-BR"),
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [46, 204, 113] }, // verde
  });

  y = doc.lastAutoTable.finalY + 10;

  // =========================
  // DESPESAS
  // =========================
  doc.text("Despesas", 14, y);
  y += 5;

  autoTable(doc, {
    startY: y,
    head: [["Descrição", "Valor", "Data"]],
    body: despesas.map((d) => [
      d.descricao,
      `R$ ${Number(d.valor).toFixed(2)}`,
      new Date(d.data).toLocaleDateString("pt-BR"),
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [231, 76, 60] }, // vermelho
  });

  // =========================
  // SALVAR
  // =========================
  doc.save("relatorio-financeiro.pdf");
}
