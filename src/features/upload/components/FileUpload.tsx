"use client";

import { useState, useRef } from "react";
import { UploadCloud, AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FileUploadProps {
  type: "avatar" | "banner" | "resume" | "certificate";
  label?: string;
  acceptLabel?: string;
  onUploadSuccess: (cid: string, url: string) => void;
  onUploadError?: (error: string) => void;
}

export function FileUpload({
  type,
  label,
  acceptLabel = "PNG, JPG, PDF up to 10MB",
  onUploadSuccess,
  onUploadError,
}: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [file, setFile] = useState<globalThis.File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progressStatus, setProgressStatus] = useState<"idle" | "uploading" | "success" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const processFile = async (selectedFile: globalThis.File) => {
    setFile(selectedFile);
    setIsUploading(true);
    setProgressStatus("uploading");
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`/api/upload/${type}`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || "File upload failed");
      }

      setProgressStatus("success");
      onUploadSuccess(result.data.cid, result.data.url);
    } catch (err: unknown) {
      const error = err as Error;
      setProgressStatus("error");
      setErrorMsg(error.message);
      if (onUploadError) {
        onUploadError(error.message);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerInputClick = () => {
    fileInputRef.current?.click();
  };

  const resetUpload = () => {
    setFile(null);
    setProgressStatus("idle");
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <span className="text-muted-foreground mb-2 block text-xs font-semibold tracking-wider uppercase">
          {label}
        </span>
      )}

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={progressStatus === "idle" ? triggerInputClick : undefined}
        className={`relative flex flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition-all ${
          progressStatus === "idle" ? "cursor-pointer" : "cursor-default"
        } ${
          isDragActive
            ? "border-primary bg-primary/5 ring-primary ring-1"
            : "border-border bg-surface-elevated/20 hover:bg-surface-elevated/40"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          disabled={isUploading}
        />

        {progressStatus === "idle" && (
          <div className="space-y-2">
            <div className="bg-primary/10 text-primary mx-auto flex h-10 w-10 items-center justify-center rounded-full">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div className="text-foreground text-xs font-medium">
              <span>Drag & drop or </span>
              <span className="text-primary hover:underline">browse files</span>
            </div>
            <p className="text-muted-foreground text-[10px]">{acceptLabel}</p>
          </div>
        )}

        {progressStatus === "uploading" && (
          <div className="space-y-3">
            <Loader2 className="text-primary mx-auto h-6 w-6 animate-spin" />
            <div className="text-foreground text-xs font-medium">Uploading file to IPFS...</div>
            {file && (
              <Badge variant="secondary" className="max-w-[200px] truncate text-[10px]">
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </Badge>
            )}
          </div>
        )}

        {progressStatus === "success" && (
          <div className="space-y-3">
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-[#10B981]">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="text-foreground text-xs font-medium">File pinned to IPFS!</div>
            {file && (
              <div className="flex items-center justify-center gap-2">
                <Badge variant="secondary" className="max-w-[160px] truncate text-[10px]">
                  {file.name}
                </Badge>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetUpload();
                  }}
                  className="hover:bg-surface/80 rounded p-0.5"
                >
                  <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        )}

        {progressStatus === "error" && (
          <div className="space-y-3">
            <div className="bg-destructive/10 mx-auto flex h-8 w-8 items-center justify-center rounded-full text-[#EF4444]">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="text-foreground text-xs font-medium">Upload failed</div>
            <p className="max-w-[240px] text-[10px] leading-tight text-[#EF4444]">
              {errorMsg || "An unknown error occurred"}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetUpload();
              }}
              className="bg-surface text-foreground hover:bg-surface-elevated inline-flex h-7 items-center justify-center rounded-lg px-3.5 text-[10px] font-semibold"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
