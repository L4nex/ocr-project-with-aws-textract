import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "ocr-project",
  frameworkVersion: ">=4.14.3",
  plugins: ["serverless-offline"],

  provider: {
    name: "aws",
    runtime: "nodejs20.x",
    region: "us-east-1",
    stage: "dev",
    memorySize: 512,
    timeout: 30,
    apiGateway: {
      minimumCompressionSize: 1024,
      binaryMediaTypes: ["multipart/form-data"],
    },
    environment: {
      NODE_OPTIONS: "--enable-source-maps",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["textract:DetectDocumentText"],
            Resource: "*",
          },
        ],
      },
    },
  },

  functions: {
    ocr: {
      handler: "src/application/index.ocrHandler",
      events: [
        {
          http: {
            method: "post",
            path: "ocr",
            cors: true,
          },
        },
      ],
      environment: {
        JWT_SECRET: "${env:JWT_SECRET}",
      },
    },
  },

  package: {
    individually: true,
    patterns: ["!node_modules/**", "!tests/**"],
  },

  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node20",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

export default serverlessConfiguration;
