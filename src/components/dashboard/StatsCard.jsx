import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function StatsCard({ title, value }) {
  return (
    <Card className="text-center">
      <CardContent>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-2xl font-bold">R$ {value.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
}
