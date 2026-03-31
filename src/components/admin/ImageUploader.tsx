'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { X, Upload, Plus, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  minImages?: number;
  maxImages?: number;
}

export function ImageUploader({ 
  images, 
  onChange, 
  minImages = 6, 
  maxImages = 12 
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    if (validFiles.length === 0) {
      alert('请选择有效的图片文件（JPG、PNG、WEBP，最大10MB）');
      return;
    }

    const totalImages = images.length + validFiles.length;
    if (totalImages > maxImages) {
      alert(`最多上传 ${maxImages} 张图片，当前已有 ${images.length} 张`);
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      validFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/upload/images', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const newUrls = result.images.map((img: { url: string }) => img.url);
        onChange([...images, ...newUrls]);
      } else {
        alert(result.error || '上传失败');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('上传失败，请重试');
    } finally {
      setUploading(false);
    }
  }, [images, maxImages, onChange]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const newImages = [...images];
    [newImages[fromIndex], newImages[toIndex]] = [newImages[toIndex], newImages[fromIndex]];
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* 图片网格 */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {images.map((url, index) => (
          <div 
            key={url + index} 
            className="relative aspect-square group rounded-lg overflow-hidden border border-neutral-200 bg-neutral-50"
          >
            <Image
              src={url}
              alt={`商品图片 ${index + 1}`}
              fill
              className="object-cover"
            />
            
            {/* 操作层 */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 序号 */}
            <div className="absolute top-1 left-1 w-5 h-5 bg-neutral-900 text-white text-xs rounded-full flex items-center justify-center">
              {index + 1}
            </div>

            {/* 主图标记 */}
            {index === 0 && (
              <div className="absolute bottom-1 left-1 right-1 bg-neutral-900 text-white text-xs py-0.5 text-center rounded">
                主图
              </div>
            )}
          </div>
        ))}

        {/* 上传按钮 */}
        {images.length < maxImages && (
          <label
            className={`aspect-square rounded-lg border-2 border-dashed cursor-pointer flex flex-col items-center justify-center transition-colors ${
              dragOver 
                ? 'border-neutral-900 bg-neutral-50' 
                : 'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {uploading ? (
              <Loader2 className="h-6 w-6 text-neutral-400 animate-spin" />
            ) : (
              <>
                <Plus className="h-6 w-6 text-neutral-400 mb-1" />
                <span className="text-xs text-neutral-500">添加图片</span>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              disabled={uploading}
            />
          </label>
        )}
      </div>

      {/* 提示 */}
      <div className="flex items-center justify-between text-xs text-neutral-500">
        <span>
          已上传 {images.length} / {maxImages} 张（最少 {minImages} 张）
        </span>
        <span>
          支持 JPG、PNG、WEBP，单张最大 10MB
        </span>
      </div>

      {/* 拖拽上传区域 */}
      {images.length < maxImages && (
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
            dragOver 
              ? 'border-neutral-900 bg-neutral-50' 
              : 'border-neutral-200 hover:border-neutral-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
          <p className="text-sm text-neutral-600 mb-1">拖拽图片到此处上传</p>
          <p className="text-xs text-neutral-400">或点击选择文件</p>
        </div>
      )}
    </div>
  );
}
