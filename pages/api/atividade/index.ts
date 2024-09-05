import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import {
  GeneralAtividadesSchema,
  TAtividade,
} from "../../../schemas/atividadesSchema";
import connectToDatabase from "../../../lib/mongodb/connections";
import { apiHandler } from "../../../utils/api";
import { ObjectId } from "mongodb";
import createHttpError from "http-errors";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const client = await clientPromise;
//   const db = client.db("nome-do-banco-de-dados");
//   const collection = db.collection<TAtividade>("activities");

//   if (req.method === "POST") {
//     try {
//       const parsedData = GeneralAtividadesSchema.parse(req.body);

//       await collection.insertOne({
//         ...parsedData,
//         insertionDate: new Date().toISOString(),
//       });

//       res.status(201).json({ message: "Atividade criada com sucesso!" });
//     } catch (error) {
//       res
//         .status(400)
//         .json({ message: "Erro na validação dos dados", error: error.errors });
//     }
//   } else if (req.method === "GET") {
//     try {
//       const activities = await collection.find().toArray();
//       res.status(200).json(activities);
//     } catch (error) {
//       res.status(500).json({ message: "Erro ao obter atividades", error });
//     }
//   } else {
//     res.setHeader("Allow", ["GET", "POST"]);
//     res.status(405).end(`Método ${req.method} não permitido`);
//   }
// }

const getAtividades: NextApiHandler<any> = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection<TAtividade>("atividades");
  const activities = await collection.find().toArray();
  res.status(200).json(activities);
};

const createAtividade: NextApiHandler<any> = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection<TAtividade>("atividades");
  const parsedData = GeneralAtividadesSchema.parse(req.body);

  await collection.insertOne({
    ...parsedData,
    dataInsercao: new Date().toISOString(),
  });

  res.status(201).json({ message: "Atividade criada com sucesso!" });
};
const updateAtividades: NextApiHandler<any> = async (req, res) => {
  const id = req.query.id;

  if (!id || typeof id !== "string" || !ObjectId.isValid(id))
    throw new createHttpError.BadRequest("ID inválido.");

  const parsedData = GeneralAtividadesSchema.partial().parse(req.body);

  const db = await connectToDatabase();
  const collection = db.collection<TAtividade>("atividades");

  const updateResponse = await collection.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: parsedData,
    }
  );
  if (!updateResponse.acknowledged)
    throw new createHttpError.InternalServerError(
      "Oops, um erro desconhecido aconteceu ao atualizar atividade."
    );
  if (updateResponse.matchedCount == 0)
    throw new createHttpError.NotFound("Atividade não encontrada.");

  return { message: "Atividade atualizada com sucesso !" };
};
export default apiHandler({
  GET: getAtividades,
  POST: createAtividade,
  PUT: updateAtividades,
});
