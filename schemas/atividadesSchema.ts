import { z } from "zod";

export const GeneralAtividadesSchema = z.object({
  titulo: z.string(),
  descricao: z.string(),
  responsaveis: z.array(
    z.object({
      id: z.string(),
      nome: z.string(),
      avatar_url: z.string().optional().nullable(),
    })
  ),
  dataVencimento: z.string().optional().nullable(),
  dataConclusao: z.string().optional().nullable(),
  dataInsercao: z.string(),
  autor: z.object({
    id: z.string(),
    nome: z.string(),
    avatar_url: z.string().optional().nullable(),
  }),
});

export type TAtividade = z.infer<typeof GeneralAtividadesSchema>;
export type TAtividadeWithId = TAtividade & { _id: string };
