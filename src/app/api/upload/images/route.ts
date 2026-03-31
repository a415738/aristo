import { NextRequest, NextResponse } from 'next/server';
import {
  uploadMultipleImages,
  isValidImageType,
  isValidFileSize,
} from '@/lib/upload';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: '请选择要上传的图片' },
        { status: 400 }
      );
    }

    // 验证文件数量 (6-12张)
    if (files.length < 6 || files.length > 12) {
      return NextResponse.json(
        { error: '请上传6-12张图片' },
        { status: 400 }
      );
    }

    // 验证每个文件
    for (const file of files) {
      if (!isValidImageType(file)) {
        return NextResponse.json(
          { error: `文件 ${file.name} 格式不支持，仅支持 JPG、PNG、WEBP` },
          { status: 400 }
        );
      }
      if (!isValidFileSize(file)) {
        return NextResponse.json(
          { error: `文件 ${file.name} 超过10MB限制` },
          { status: 400 }
        );
      }
    }

    // 上传图片
    const results = await uploadMultipleImages(files);

    // 检查是否全部成功
    const failedUploads = results.filter((r) => !r.success);
    if (failedUploads.length > 0) {
      return NextResponse.json(
        { error: '部分图片上传失败', details: failedUploads },
        { status: 500 }
      );
    }

    // 返回成功的URL列表
    return NextResponse.json({
      success: true,
      images: results.map((r) => ({
        url: r.url,
        filename: r.filename,
      })),
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: '上传失败，请稍后重试' },
      { status: 500 }
    );
  }
}
