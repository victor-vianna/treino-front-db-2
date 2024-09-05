import { TAtividade } from "@/schemas/atividadesSchema";
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
