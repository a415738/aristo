import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import sharp from 'sharp';

export interface UploadResult {
  success: boolean;
  url: string;
  filename: string;
  error?: string;
}

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'products');
const IMAGE_SIZE = 800;

// 确保上传目录存在
export async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// 生成唯一文件名
export function generateFilename(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = path.extname(originalName).toLowerCase() || '.jpg';
  return `product-${timestamp}-${random}${ext}`;
}

// 处理并保存图片
export async function processAndSaveImage(
  file: File,
  filename: string
): Promise<UploadResult> {
  try {
    await ensureUploadDir();

    // 转换File为Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 使用sharp处理图片
    const processedBuffer = await sharp(buffer)
      .resize(IMAGE_SIZE, IMAGE_SIZE, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 90 })
      .toBuffer();

    // 保存文件
    const filePath = path.join(UPLOAD_DIR, filename);
    await writeFile(filePath, processedBuffer);

    // 返回可访问的URL
    const url = `/uploads/products/${filename}`;

    return {
      success: true,
      url,
      filename,
    };
  } catch (error) {
    console.error('Image processing error:', error);
    return {
      success: false,
      url: '',
      filename: '',
      error: error instanceof Error ? error.message : '处理图片失败',
    };
  }
}

// 批量上传图片
export async function uploadMultipleImages(
  files: File[]
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (const file of files) {
    const filename = generateFilename(file.name);
    const result = await processAndSaveImage(file, filename);
    results.push(result);
  }

  return results;
}

// 验证文件类型
export function isValidImageType(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validTypes.includes(file.type);
}

// 验证文件大小 (最大 10MB)
export function isValidFileSize(file: File, maxSizeMB: number = 10): boolean {
  return file.size <= maxSizeMB * 1024 * 1024;
}
