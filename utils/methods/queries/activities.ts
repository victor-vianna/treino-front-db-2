import { TAtividade, TAtividadeWithId } from "@/schemas/atividadesSchema";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export async function getActivities() {
  try {
    const response = await axios.get("/api/atividade");

    return response.data as TAtividadeWithId[];
  } catch (error) {
    throw error;
  }
}

export function useActivities() {
  return useQuery({
    queryKey: ["activities"],
    queryFn: getActivities,
  });
}

async function getActivityById(id: string) {
  try {
    const response = await axios.get(`/api/atividade?id=${id}`);

    return response.data as TAtividadeWithId;
  } catch (error) {
    throw error;
  }
}
export function useActivityById(id: string) {
  return useQuery({
    queryKey: ["activity-by-id", id],
    queryFn: async () => await getActivityById(id),
  });
}
