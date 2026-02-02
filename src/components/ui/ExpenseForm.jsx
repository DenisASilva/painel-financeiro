import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ExpenseForm() {
  return (
    <div className="space-y-4">
      <div>
        <Label>Descrição</Label>
        <Input placeholder="Ex: Mercado" />
      </div>

      <div>
        <Label>Valor</Label>
        <Input type="number" placeholder="100.00" />
      </div>

      <Button className="w-full">
        Salvar despesa
      </Button>
    </div>
  );
}
