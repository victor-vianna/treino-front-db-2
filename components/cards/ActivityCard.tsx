import React from "react";
import { TAtividadeWithId } from "@/schemas/atividadesSchema";

function ActivityCard({ activity }: { activity: TAtividadeWithId }) {
  return (
    <div className="p-4 bg-blue-100 shadow rounded-md flex flex-col gap-2 mb-2">
      <h3 className="text-lg font-semibold">{activity.titulo}</h3>
      <p>
        descrição:
        {activity.descricao}
      </p>
      <p>
        <strong>Responsáveis:</strong>{" "}
        {activity.responsaveis.map((r) => r.nome).join(", ")}{" "}
      </p>
      <p>
        <strong>Autor:</strong> {activity.autor.nome}{" "}
      </p>
    </div>
  );
}

export default ActivityCard;
