import {
  TextractClient,
  DetectDocumentTextCommand,
} from "@aws-sdk/client-textract";

const textract = new TextractClient({ region: "us-east-1" });

export const ocrService = {
  processImage: async (imageBuffer: Buffer): Promise<string> => {
    try {
      const { Blocks } = await textract.send(
        new DetectDocumentTextCommand({
          Document: { Bytes: imageBuffer },
        })
      );

      const extractedText =
        Blocks?.filter(
          (block) =>
            block.BlockType === "LINE" &&
            block.Confidence &&
            block.Confidence > 90 // Filtro de confiança
        )
          .map((line) => line.Text?.trim() ?? "")
          .filter((text) => text.length > 0)
          .join(" ") // Une linhas com espaço
          .replace(/\n+/g, " ") // Remove quebras múltiplas
          .replace(/([a-zA-Z0-9])\s+([a-zA-Z0-9])/g, "$1 $2") // Normaliza espaços
          .replace(/\s+([,.!?])/g, "$1") || // Remove espaços antes de pontuação
        "Nenhum texto legível detectado com confiança > 90%";

      return extractedText;
    } catch (error: any) {
      console.error("Erro no Textract:", error);
      throw new Error(`Erro ao processar a imagem: ${error.message}`);
    }
  },
};
