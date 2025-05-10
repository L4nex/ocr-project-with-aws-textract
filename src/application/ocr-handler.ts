import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import Busboy from "busboy";
import { Readable } from "stream";
import { ocrService } from "../domain/ocr-service";
import { authMiddleware } from "../infra";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!authMiddleware(event)) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Token inválido ou não fornecido" }),
      };
    }

    const contentType =
      event.headers["content-type"] || event.headers["Content-Type"] || "";

    const body = event.body;
    if (
      body === null ||
      typeof body !== "string" ||
      !contentType.includes("multipart/form-data")
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Requisição inválida. Envie um arquivo via multipart/form-data",
        }),
      };
    }

    // Processamento do arquivo
    const fileBuffer = await new Promise<Buffer>((resolve, reject) => {
      const busboy = Busboy({ headers: { "content-type": contentType } });
      let fileFound = false;

      busboy.on("file", (fieldname, file, _info) => {
        if (fieldname === "file") {
          fileFound = true;
          const chunks: Buffer[] = [];
          file.on("data", (chunk: Buffer) => chunks.push(chunk));
          file.on("end", () => resolve(Buffer.concat(chunks)));
        }
      });

      busboy.on("error", reject);
      busboy.on("close", () => {
        if (!fileFound)
          reject(new Error("Nenhum arquivo encontrado no formulário"));
      });

      const bodyStream = new Readable();
      bodyStream.push(
        Buffer.from(body, event.isBase64Encoded ? "base64" : "utf8")
      );
      bodyStream.push(null);
      bodyStream.pipe(busboy);
    });

    const ocrResult = await ocrService.processImage(fileBuffer);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "OCR realizado com sucesso",
        result: ocrResult,
      }),
    };
  } catch (error: any) {
    return {
      statusCode: error.statusCode,
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }
};
