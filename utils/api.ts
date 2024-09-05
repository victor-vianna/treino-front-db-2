import createHttpError from "http-errors";

import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

import { Method } from "axios";
import { ZodError } from "zod";

import { NextRequest, NextResponse } from "next/server";

export interface ErrorResponse {
  error: {
    message: string;
    err?: any;
  };
  status?: number;
}
type ApiMethodHandlers = {
  [key in Uppercase<Method>]?: NextApiHandler;
};

// Criando o handler de erros
export function errorHandler(
  err: unknown,
  res: NextApiResponse<ErrorResponse>
) {
  console.log("ERROR", err);
  if (createHttpError.isHttpError(err) && err.expose) {
    // Lidar com os erros lançados pelo módulo http-errors
    return res.status(err.statusCode).json({ error: { message: err.message } });
  } else if (err instanceof ZodError) {
    // Lidar com erros vindo de uma validação Zod
    return res.status(400).json({ error: { message: err.errors[0].message } });
  } else {
    // Erro de servidor padrão 500
    return res.status(500).json({
      error: { message: "Oops, algo deu errado!", err: err },
      status: createHttpError.isHttpError(err) ? err.statusCode : 500,
    });
  }
}

export function apiHandler(handler: ApiMethodHandlers) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const method = req.method
        ? (req.method.toUpperCase() as keyof ApiMethodHandlers)
        : undefined;

      // validando se o handler suporta o metodo HTTP requisitado
      if (!method)
        throw new createHttpError.MethodNotAllowed(
          `Método não especificado no caminho: ${req.url}`
        );

      const methodHandler = handler[method];
      if (!methodHandler)
        throw new createHttpError.MethodNotAllowed(
          `O método ${req.method} não permitido para o caminho ${req.url}`
        );

      // Se passou pelas validações, chamar o handler
      await methodHandler(req, res);
    } catch (error) {
      errorHandler(error, res);
    }
  };
}
