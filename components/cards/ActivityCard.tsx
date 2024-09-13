import React, { useState } from "react";
import { TAtividadeWithId } from "@/schemas/atividadesSchema";
import { FaCheckCircle } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateActivity } from "@/utils/methods/mutations/activities";
import { getErrorMessage } from "@/utils/errors";
import { BsCheck } from "react-icons/bs";
import toast from "react-hot-toast";

type ActivityCardProps = {
  activity: TAtividadeWithId;
  handleClick: (id: string) => void;
};
function ActivityCard({ activity, handleClick }: ActivityCardProps) {
  const queryClient = useQueryClient();

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckBoxChange = () => {
    setIsChecked(!isChecked);
  };
  const { mutate, isPending } = useMutation({
    mutationKey: ["update-activity", activity._id],
    mutationFn: updateActivity,
    onMutate: (variables) => {
      queryClient.cancelQueries({ queryKey: ["activities"] });
      const prevData = queryClient.getQueryData(["activities"]);
      queryClient.setQueryData(["activities"], (prev: TAtividadeWithId[]) =>
        prev.map((act) =>
          act._id === variables.id ? { ...act, ...variables.changes } : act
        )
      );
      return { prevData };
    },
    onSuccess: (data) => {
      toast.success(data);
    },
    onSettled(data, error, variables, context) {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
    onError(error, variables, context) {
      queryClient.setQueryData(
        ["activities"],
        (prev: any) => context?.prevData
      );
      const msg = getErrorMessage(error);
      toast.error(msg);
    },
  });
  return (
    <div className="p-4 bg-blue-100 shadow rounded-md flex flex-col gap-2 mb-2">
      <div className="flex item-center gap-2">
        <button
          onClick={() =>
            mutate({
              id: activity._id,
              changes: {
                dataConclusao: activity.dataConclusao
                  ? null
                  : new Date().toISOString(),
              },
            })
          }
          className="rounded-full border border-black h-6 w-6 flex items-center justify-center"
        >
          {activity.dataConclusao ? <BsCheck /> : null}
        </button>
      </div>
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
