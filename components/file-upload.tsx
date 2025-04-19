'use client';

import {
  AlertCircleIcon,
  ImageIcon,
  Send,
  UploadIcon,
  XIcon
} from 'lucide-react';

import {
  FileUploadActions,
  FileUploadState,
  useFileUpload
} from '@/hooks/use-file-upload';
import { Button } from '@/components/ui/button';

// Create some dummy initial files

interface Props {
  upload: [FileUploadState, FileUploadActions];
  onSend: () => void;
}

export default function Component({ upload, onSend }: Props) {
  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024; // 5MB default
  const maxFiles = 6;

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps
    }
  ] = upload;
  return (
    <div className="flex w-full flex-col gap-2">
      {/* Drop area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className="not-data-[files]:justify-center relative flex !w-full flex-col items-center overflow-hidden rounded-xl transition-colors has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50"
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload image file"
        />
        {files.length > 0 ? (
          <div className="flex w-full flex-col gap-3 p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate text-sm font-medium">
                Uploaded Files ({files.length})
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openFileDialog}
                  disabled={files.length >= maxFiles}
                >
                  <UploadIcon
                    className="-ms-0.5 mr-2 size-4 opacity-60"
                    aria-hidden="true"
                  />
                  Add more
                </Button>
                <Button onClick={onSend} variant="default" size="sm">
                  <Send className="mr-2 size-4" />
                  Send
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="relative aspect-square size-52 rounded-md border bg-accent"
                >
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="size-full rounded-[inherit] object-cover"
                  />
                  <Button
                    onClick={() => removeFile(file.id)}
                    size="icon"
                    className="absolute -right-2 -top-2 size-6 rounded-full border-2 border-background shadow-none focus-visible:border-background"
                    aria-label="Remove image"
                  >
                    <XIcon className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div
              className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
              aria-hidden="true"
            >
              <ImageIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 text-sm font-medium">Drop your images here</p>
            <p className="text-xs text-muted-foreground">SVG, PNG or JPG</p>
            <Button variant="outline" className="mt-4" onClick={openFileDialog}>
              <UploadIcon
                className="-ms-1 mr-2 size-4 opacity-60"
                aria-hidden="true"
              />
              Select images
            </Button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div
          className="flex items-center gap-1 text-xs text-destructive"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
}
