# 🖼️ OCR API com AWS Textract

API Serverless para extração de texto de imagens utilizando Amazon Textract

## ✨ Funcionalidades Principais
- **Upload de imagens** via `multipart/form-data`
- **Extração de texto** com alta precisão
- **Processamento assíncrono** de documentos
- **Filtro por confiança** (90%+ de acurácia)
- **Formatação inteligente** do texto extraído

## 🛠️ Tecnologias Utilizadas
- **AWS Lambda** (Node.js 20.x)
- **Amazon Textract**
- **API Gateway**
- **Serverless Framework**

📡 Utilização da API
Endpoint:
POST https://[api-id].execute-api.[region].amazonaws.com/dev/ocr

Resposta de sucess:

{
  "message": "OCR realizado com sucesso",
  "result": "Texto extraído da imagem..."
}

🔒 Segurança
Validação estrita do campo file

Política IAM de mínimo privilégio

Logs detalhados no CloudWatch

📊 Monitoramento
Acesse no Console AWS:

CloudWatch > Logs > /aws/lambda/ocr-project-dev-ocr

Textract > Métricas de execução