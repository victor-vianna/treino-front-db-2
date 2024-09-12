import { TAtividade, TAtividadeWithId } from "@/schemas/atividadesSchema";
import axios from "axios";

export async function createActivity(info: TAtividade) {
  try {
    const response = await axios.post("/api/atividade", info);
    console.log(response.data.message);

    return response.data.message as string;
  } catch (error) {
    throw error;
  }
}
export async function updateActivity({
  id,
  changes,
}: {
  id: string;
  changes: Partial<TAtividadeWithId>;
}) {
  try {
    const response = await axios.put(`/api/atividade?id=${id}`, changes);
    return response.data.message as string;
  } catch (error) {
    throw error;
  }
}
