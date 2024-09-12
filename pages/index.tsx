import { useEffect, useState } from "react";
import { z } from "zod";
import {
  GeneralAtividadesSchema,
  TAtividade,
} from "../schemas/atividadesSchema";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EditActivityDialog from "@/components/modals/atividades/EditActivityDialog";
import {
  getActivities,
  useActivities,
} from "@/utils/methods/queries/activities";
import { getErrorMessage } from "@/utils/errors";
import ActivityCard from "@/components/cards/ActivityCard";
import CreateActivityDialog from "@/components/modals/atividades/CreateActivityDialog";

export default function Home() {
  // Estados para gerenciamento das modais
  const [createActivityModalIsOpen, setCreateActivityModalIsOpen] =
    useState<boolean>(false);
  const [editActivityModal, setEditActivityModal] = useState<{
    id: string | null;
    isOpen: boolean;
  }>({ id: null, isOpen: false });

  // const [isOpen, setIsOpen] = useState(false);
  // const [isEditing, setIsEditing] = useState(false);
  // const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
  // const [formData, setFormData] = useState({
  //   descricao: "", // Descrição da atividade
  //   responsabilidades: [], // Lista de responsáveis
  //   dataVencimento: "", // Data de vencimento
  //   autor: { id: "", name: "", avatar: "" }, // Dados do autor
  // });
  const {
    data: activities,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useActivities();

  return (
    <div className="w-full h-full flex-col p-4 bg-slate-400">
      <h1 className="text-3xl font-bold text-center text-blck mb-6">
        {" "}
        ATIVIDADES{" "}
      </h1>

      <div className="flex items-center justify-end mb-4">
        <Button
          type="button"
          onClick={() => setCreateActivityModalIsOpen(true)}
          className="bg-blue-500 text-white hover:bg-blue-600 duration-300 ease-in-out"
        >
          Adicionar Atividade
        </Button>
      </div>

      {/* Lista de atividades */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Atividades Criadas:</h2>
        <div className="w-full flex flex-col gap-2">
          {isLoading ? <p>Carregando...</p> : null}
          {isError ? <p>{getErrorMessage(error)}</p> : null}
          {isSuccess
            ? activities.map((activity) => (
                <ActivityCard
                  key={activity._id}
                  activity={activity}
                  handleClick={(id) =>
                    setEditActivityModal({ id: id, isOpen: true })
                  }
                />
              ))
            : null}
        </div>
      </div>
      {/* Modal de Adição de Atividade */}
      {createActivityModalIsOpen ? (
        <CreateActivityDialog
          closeModal={() => setCreateActivityModalIsOpen(false)}
        />
      ) : null}
      {/* Modal de Edição de Atividade */}
      {editActivityModal.id && editActivityModal.isOpen ? (
        <EditActivityDialog
          activityId={editActivityModal.id} // Passa a atividade selecionada para o modal
          closeModal={() => setEditActivityModal({ id: null, isOpen: false })} // Fecha o modal de edição
        />
      ) : null}
    </div>
  );
}
