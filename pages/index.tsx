import { useEffect, useState } from "react";
import { z } from "zod";
import {
  GeneralAtividadesSchema,
  TAtividade,
} from "../schemas/atividadesSchema";
// import { EditActivityDialog } from '../components/EditActivityDialog';
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EditActivityDialog from "@/components/modals/atividades/EditActivityDialog";
import {
  getActivities,
  useActivities,
} from "@/utils/methods/queries/activities";
import { getErrorMessage } from "@/utils/errors";

export default function Home() {
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    descricao: "", // Descrição da atividade
    responsabilidades: [], // Lista de responsáveis
    dataVencimento: "", // Data de vencimento
    autor: { id: "", name: "", avatar: "" }, // Dados do autor
  });
  const {
    data: activities,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useActivities();
  const [errors, setErrors] = useState<string | null>(null); // Estado para armazenar erros de validação
  const [isOpen, setIsOpen] = useState(false);
  console.log(error);
  return (
    <div className="w-full h-full flex-col p-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        ATIVIDADES
      </h1>
      <div className="mb-4">
        <Button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white hover:bg-blue-600 duration-300 ease-in-out"
        >
          Adicionar Atividade
        </Button>
      </div>

      {/* Botão para abrir o diálogo de edição */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-green-500 text-white p-2 rounded mt-4"
      >
        Editar Atividade
      </button>

      {/* Lista de atividades */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Atividades Criadas:</h2>
        <div className="w-full flex flex-col gap-2">
          {isLoading ? <p>Carregando...</p> : null}
          {isError ? <p>{getErrorMessage(error)}</p> : null}
          {isSuccess
            ? activities.map((activity) => (
                <div key={activity._id}>{activity.titulo}</div>
              ))
            : null}
        </div>
        {/* {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div key={index} className="bg-gray-100 p-4 mb-2 rounded">
              <p><strong>Descrição:</strong> {activity.descricao}</p>
            </div>
          ))
        ) : (
          <p>Nenhuma atividade criada ainda.</p>
        )} */}
      </div>
      {isOpen ? (
        <EditActivityDialog closeModal={() => setIsOpen(false)} />
      ) : null}
    </div>
  );
}
