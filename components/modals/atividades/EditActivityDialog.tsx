import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../../ui/button";
import { TAtividade, TAtividadeWithId } from "@/schemas/atividadesSchema";
import TextInput from "../../inputs/TextInput";
import TextareaInput from "../../inputs/TextareaInput";
import DateInput from "../../inputs/DateInput";
import { formatDateForInput, formatDateInputChange } from "@/utils/formatting";
import { VscChromeClose } from "react-icons/vsc";
import MenuResponsaveis from "./utils/menuResponsaveis";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateActivity } from "@/utils/methods/mutations/activities";
import { getErrorMessage } from "@/utils/errors";
import { useActivityById } from "@/utils/methods/queries/activities";

type EditActivityDialogProps = {
  activityId: string;
  closeModal: () => void;
};

function EditActivityDialog({
  activityId,
  closeModal,
}: EditActivityDialogProps) {
  const queryClient = useQueryClient();
  const {
    data: activity,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useActivityById(activityId);
  const handleSave = () => {
    console.log("Atividade editada:", infoHolder);
    closeModal;
  };

  // Inicializa o estado com os dados da atividade existente
  const [infoHolder, setInfoHolder] = useState<TAtividadeWithId>({
    _id: "id-holder",
    titulo: "",
    descricao: "",
    responsaveis: [],
    dataVencimento: "",
    dataInsercao: new Date().toISOString(),
    autor: {
      id: "userVictor",
      nome: "Victor",
    },
  });

  // Funções para adicionar ou remover responsáveis
  function addResponsible(responsible: TAtividade["responsaveis"][number]) {
    setInfoHolder((prev) => ({
      ...prev,
      responsaveis: [...prev.responsaveis, responsible],
    }));
  }

  function removeResponsible(index: number) {
    setInfoHolder((prev) => ({
      ...prev,
      responsaveis: prev.responsaveis.filter((r, i) => i !== index),
    }));
  }

  // Mutação para atualizar a atividade existente
  const { mutate, isPending } = useMutation({
    mutationKey: ["update-activity", activityId],
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
    onSuccess(data, variables, context) {
      closeModal();
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
      alert(msg);
    },
  });
  useEffect(() => {
    if (activity) setInfoHolder(activity);
  }, [activity]);
  return (
    <Dialog.Root open onOpenChange={closeModal}>
      <Dialog.Overlay className="fixed inset-0 z-[100] bg-primary/70 backdrop-blur-sm" />
      <Dialog.Content className="fixed left-[50%] top-[50%] z-[100] h-[80%] w-[70%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-background p-[10px] lg:h-[60%] lg:w-[40%]">
        <div className="flex h-full w-full flex-col">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
            <h3 className="text-sm font-bold lg:text-xl">EDITAR ATIVIDADE</h3>
            <button
              onClick={() => closeModal()}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: "red" }} />
            </button>
          </div>
          <div className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 flex h-full flex-col gap-y-2 overflow-y-auto overscroll-y-auto p-2 py-1">
            <p className="text-sm text-gray-500 font-medium">
              Edite os detalhes da atividade abaixo.
            </p>
            <TextInput
              handleChange={(value) =>
                setInfoHolder((prev) => ({ ...prev, titulo: value }))
              }
              label="Titulo"
              placeholder="Digite o título..."
              value={infoHolder.titulo}
            />
            <TextareaInput
              handleChange={(value) =>
                setInfoHolder((prev) => ({ ...prev, descricao: value }))
              }
              label="Descrição"
              placeholder="Digite a descrição..."
              value={infoHolder.descricao}
            />
            <DateInput
              label="Data de Vencimento"
              value={formatDateForInput(infoHolder.dataVencimento)}
              handleChange={(value) =>
                setInfoHolder((prev) => ({
                  ...prev,
                  dataVencimento: formatDateInputChange(value),
                }))
              }
              width="100%"
            />
            <MenuResponsaveis
              addResponsible={addResponsible}
              removeResponsible={removeResponsible}
              responsibles={infoHolder.responsaveis}
            />
          </div>
          <div className="mt-2 flex w-full items-center justify-end">
            <Button
              disabled={isPending}
              onClick={() => mutate({ id: activityId, changes: infoHolder })}
              type="button"
            >
              SALVAR ALTERAÇÕES
            </Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default EditActivityDialog;
