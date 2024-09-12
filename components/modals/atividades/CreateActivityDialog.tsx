import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../../ui/button";
import { TAtividade } from "@/schemas/atividadesSchema";
import TextInput from "../../inputs/TextInput";
import TextareaInput from "../../inputs/TextareaInput";
import DateInput from "../../inputs/DateInput";
import { formatDateForInput, formatDateInputChange } from "@/utils/formatting";
import { VscChromeClose } from "react-icons/vsc";
import MenuResponsaveis from "./utils/menuResponsaveis";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createActivity } from "@/utils/methods/mutations/activities";
import { getErrorMessage } from "@/utils/errors";

type CreateActivityDialogProps = {
  closeModal: () => void;
};
function CreateActivityDialog({ closeModal }: CreateActivityDialogProps) {
  const queryClient = useQueryClient();
  const [infoHolder, setInfoHolder] = useState<TAtividade>({
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

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationKey: ["create-activity"],
    mutationFn: createActivity,
    onMutate: (variables) => {
      queryClient.cancelQueries({ queryKey: ["activities"] });
      const prevData = queryClient.getQueryData(["activities"]);
      queryClient.setQueryData(["activities"], (prev: any) => [
        ...prev,
        variables,
      ]);
      return { prevData };
    },
    onSuccess(data, variables, context) {
      // alert("Atividade criada com sucesso!!");
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

  return (
    <Dialog.Root open onOpenChange={closeModal}>
      <Dialog.Overlay className="fixed inset-0 z-[100] bg-primary/70 backdrop-blur-sm" />
      <Dialog.Content className="fixed left-[50%] top-[50%] z-[100] h-[80%] w-[70%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-background p-[10px] lg:h-[60%] lg:w-[40%]">
        <div className="flex h-full w-full flex-col">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
            <h3 className="text-sm font-bold lg:text-xl">NOVA ATIVIDADE</h3>
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
              Use esse espaço para adiconar as atividades a sua lista.
            </p>
            <TextInput
              handleChange={(value) =>
                setInfoHolder((prev) => ({ ...prev, titulo: value }))
              }
              label="Titulo"
              placeholder="Digite seu titulo aqui..."
              value={infoHolder.titulo}
              // width="100%"
            />
            <TextareaInput
              handleChange={(value) =>
                setInfoHolder((prev) => ({ ...prev, descricao: value }))
              }
              label="descrição"
              placeholder="Digite sua descrição aqui..."
              value={infoHolder.descricao}
            />

            <DateInput
              label="DATA DE VENCIMENTO"
              value={formatDateForInput(infoHolder.dataVencimento)}
              handleChange={(value) =>
                setInfoHolder((prev) => ({
                  ...prev,
                  dataConclusao: formatDateInputChange(value),
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
              onClick={() => mutate(infoHolder)}
              type="button"
            >
              ADICIONAR ATIVIDADE
            </Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default CreateActivityDialog;
