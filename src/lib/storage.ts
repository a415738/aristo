import { S3Storage } from "coze-coding-dev-sdk";

// 初始化对象存储
export const storage = new S3Storage({
  endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
  accessKey: "",
  secretKey: "",
  bucketName: process.env.COZE_BUCKET_NAME,
  region: "cn-beijing",
});

// 上传文件并返回签名 URL
export async function uploadFile(
  file: Buffer | ArrayBuffer,
  fileName: string,
  contentType: string
): Promise<{ key: string; url: string }> {
  const buffer = file instanceof ArrayBuffer ? Buffer.from(file) : file;
  
  const key = await storage.uploadFile({
    fileContent: buffer,
    fileName,
    contentType,
  });

  const url = await storage.generatePresignedUrl({
    key,
    expireTime: 86400, // 1天
  });

  return { key, url };
}

// 生成文件访问 URL
export async function getFileUrl(key: string, expireTime = 86400): Promise<string> {
  return await storage.generatePresignedUrl({ key, expireTime });
}
