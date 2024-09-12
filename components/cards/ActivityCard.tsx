import React from "react";
import { TAtividadeWithId } from "@/schemas/atividadesSchema";

type ActivityCardProps = {
  activity: TAtividadeWithId;
  handleClick: (id: string) => void;
};
function ActivityCard({ activity, handleClick }: ActivityCardProps) {
  return (
    <div className="p-4 bg-blue-100 shadow rounded-md flex flex-col gap-2 mb-2">
      <h3 className="text-lg font-semibold">{activity.titulo}</h3>
      <p>
        descrição:
        {activity.descricao}
      </p>
      <p>
        <strong>Responsáveis:</strong>
        {activity.responsaveis.map((r) => r.nome).join(", ")}
      </p>
      <p>
        <strong>Autor:</strong> {activity.autor.nome}
      </p>
      <div className="w-full flex items-center justify-end">
        <button
          onClick={() => handleClick(activity._id)}
          className="px-2 py-1 bg-blue-600 hover:bg-blue-800 duration-300 ease-in-out text-white font-medium"
        >
          EDITAR
        </button>
      </div>
    </div>
  );
}

export default ActivityCard;
