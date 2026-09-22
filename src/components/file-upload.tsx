"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import * as React from "react";
import { AlertCircle } from "xiod-icons/icons/AlertCircle";
import { CheckmarkCircle as CheckCircle } from "xiod-icons/icons/CheckmarkCircle";
import { Delete as Trash2 } from "xiod-icons/icons/Delete";
import { File as FileText } from "xiod-icons/icons/File";
import { FileArchive } from "xiod-icons/icons/FileArchive";
import { FileAudio } from "xiod-icons/icons/FileAudio";
import { FileCode } from "xiod-icons/icons/FileCode";
import { FileEmpty as File } from "xiod-icons/icons/FileEmpty";
import { FileImage } from "xiod-icons/icons/FileImage";
import { FileVideo } from "xiod-icons/icons/FileVideo";

import { Button } from "./button";

// ============================================================================
// Types & Helpers
// ============================================================================

export type FileStatus = "idle" | "uploading" | "success" | "error";

export interface FileItem {
  id: string;
  file: File;
  progress: number;
  status: FileStatus;
  errorMessage?: string;
}

export interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  files?: FileItem[];
  onFilesChange?: (files: FileItem[]) => void;
  onFilesAdded?: (files: File[]) => void;
  onFileRemove?: (id: string) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

interface FileUploadContextValue {
  files: FileItem[];
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  maxFiles: number;
  maxSizeMB: number;
  accept?: string;
  disabled?: boolean;
  removeFile: (id: string) => void;
  addFiles: (files: File[]) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

const FileUploadContext = React.createContext<FileUploadContextValue | null>(
  null,
);

function useFileUploadContext() {
  const context = React.useContext(FileUploadContext);
  if (!context) {
    throw new Error(
      "FileUpload subcomponents must be rendered within a <FileUpload> provider component.",
    );
  }
  return context;
}

function isAccepted(file: File, acceptString?: string) {
  if (!acceptString) return true;
  const acceptTypes = acceptString
    .split(",")
    .map((t) => t.trim().toLowerCase());
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  return acceptTypes.some((type) => {
    if (type.startsWith(".")) {
      return fileName.endsWith(type);
    }
    if (type.endsWith("/*")) {
      const baseType = type.slice(0, -2);
      return fileType.startsWith(baseType);
    }
    return fileType === type;
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

// ============================================================================
// Main Provider Component
// ============================================================================

export function FileUpload({
  files: filesProp,
  onFilesChange,
  onFilesAdded,
  onFileRemove,
  maxFiles = 5,
  maxSizeMB = 10,
  accept,
  disabled = false,
  children,
  ...props
}: FileUploadProps): React.JSX.Element {
  const [internalFiles, setInternalFiles] = React.useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const files = filesProp ?? internalFiles;

  const setFiles = React.useCallback(
    (update: React.SetStateAction<FileItem[]>) => {
      if (filesProp === undefined) {
        setInternalFiles(update);
      }
      if (onFilesChange) {
        const nextFiles = typeof update === "function" ? update(files) : update;
        onFilesChange(nextFiles);
      }
    },
    [filesProp, onFilesChange, files],
  );

  const removeFile = React.useCallback(
    (id: string) => {
      if (disabled) return;
      const updatedFiles = files.filter((f) => f.id !== id);
      setFiles(updatedFiles);
      if (onFileRemove) {
        onFileRemove(id);
      }
    },
    [files, disabled, onFileRemove, setFiles],
  );

  const addFiles = React.useCallback(
    (newFiles: File[]) => {
      if (disabled) return;

      const validatedItems: FileItem[] = [];
      const currentFileCount = files.length;

      let addedCount = 0;
      for (const file of newFiles) {
        if (maxFiles && currentFileCount + addedCount >= maxFiles) {
          break;
        }

        let errorMessage: string | undefined;
        let status: FileStatus = "idle";

        if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
          errorMessage = `File exceeds max size of ${maxSizeMB}MB`;
          status = "error";
        } else if (accept && !isAccepted(file, accept)) {
          errorMessage = "Invalid file type";
          status = "error";
        }

        validatedItems.push({
          id: Math.random().toString(36).substring(2, 9),
          file,
          progress: 0,
          status,
          errorMessage,
        });

        addedCount++;
      }

      if (validatedItems.length > 0) {
        const updatedFiles = [...files, ...validatedItems];
        setFiles(updatedFiles);
        if (onFilesAdded) {
          onFilesAdded(validatedItems.map((item) => item.file));
        }
      }
    },
    [files, maxFiles, maxSizeMB, accept, disabled, onFilesAdded, setFiles],
  );

  const contextValue = React.useMemo(
    () => ({
      files,
      isDragging,
      setIsDragging,
      maxFiles,
      maxSizeMB,
      accept,
      disabled,
      removeFile,
      addFiles,
      fileInputRef,
    }),
    [
      files,
      isDragging,
      maxFiles,
      maxSizeMB,
      accept,
      disabled,
      removeFile,
      addFiles,
    ],
  );

  return (
    <FileUploadContext.Provider value={contextValue}>
      <div className="contents" data-slot="file-upload" {...props}>
        {children}
      </div>
    </FileUploadContext.Provider>
  );
}

// ============================================================================
// Compound Subcomponents (FileUpload Family)
// ============================================================================

export function FileUploadTrigger({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const { fileInputRef, isDragging, setIsDragging, disabled, addFiles } =
    useFileUploadContext();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const defaultProps = {
    role: "button",
    tabIndex: disabled ? -1 : 0,
    className: cn(
      "relative flex flex-col items-center justify-center rounded-2xl border border-dashed border-input bg-muted/20 hover:bg-muted/40 p-[calc(--spacing(8)-1px)] text-center transition-[color,background-color,border-color,transform,box-shadow,opacity] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 cursor-pointer select-none",
      "before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
      isDragging &&
        "scale-[1.01] border-primary bg-primary/4 dark:bg-primary/8 border-solid",
      disabled && "cursor-not-allowed opacity-64",
      className,
    ),
    "data-dragging": isDragging ? "true" : undefined,
    "data-disabled": disabled ? "true" : undefined,
    "data-slot": "file-upload-trigger",
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export function FileUploadInput({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"input">): React.JSX.Element {
  const { fileInputRef, maxFiles, accept, disabled, addFiles } =
    useFileUploadContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
    e.target.value = "";
  };

  return (
    <input
      type="file"
      ref={fileInputRef}
      className={cn("hidden", className)}
      multiple={maxFiles > 1}
      accept={accept}
      disabled={disabled}
      onChange={handleChange}
      data-slot="file-upload-input"
      {...props}
    />
  );
}

export function FileUploadList({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const defaultProps = {
    className: cn("grid gap-3 w-full mt-4", className),
    "data-slot": "file-upload-list",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

const FileItemContext = React.createContext<FileItem | null>(null);

function useFileItemContext() {
  const context = React.useContext(FileItemContext);
  if (!context) {
    throw new Error(
      "FileUploadItem subcomponents must be rendered within a <FileUploadItem> parent component.",
    );
  }
  return context;
}

interface FileUploadItemProps extends useRender.ComponentProps<"div"> {
  fileItem: FileItem;
}

export function FileUploadItem({
  className,
  render,
  fileItem,
  ...props
}: FileUploadItemProps): React.JSX.Element {
  const defaultProps = {
    className: cn(
      "group relative flex items-center gap-4 overflow-hidden rounded-xl border border-border/80 bg-background/50 p-[calc(--spacing(3)-1px)] shadow-xs/5 not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)] transition-[color,background-color,border-color,box-shadow,opacity]",
      fileItem.status === "uploading" && "pb-4.5",
      className,
    ),
    "data-status": fileItem.status,
    "data-slot": "file-upload-item",
  };

  return (
    <FileItemContext.Provider value={fileItem}>
      {useRender({
        defaultTagName: "div",
        props: mergeProps<"div">(defaultProps, props),
        render,
      })}
    </FileItemContext.Provider>
  );
}

export function FileUploadItemIcon({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const { file } = useFileItemContext();
  const defaultProps = {
    className: cn(
      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground",
      className,
    ),
    "data-slot": "file-upload-item-icon",
  };

  const getIcon = () => {
    const type = file.type.toLowerCase();
    const name = file.name.toLowerCase();
    if (type.startsWith("image/")) {
      return <FileImage className="size-5 text-primary" />;
    }
    if (type.startsWith("video/")) {
      return <FileVideo className="size-5 text-primary" />;
    }
    if (type.startsWith("audio/")) {
      return <FileAudio className="size-5 text-warning" />;
    }
    if (type.includes("pdf") || name.endsWith(".pdf")) {
      return <FileText className="size-5 text-destructive" />;
    }
    if (
      type.includes("zip") ||
      type.includes("tar") ||
      type.includes("gzip") ||
      type.includes("rar") ||
      name.endsWith(".zip") ||
      name.endsWith(".rar") ||
      name.endsWith(".gz")
    ) {
      return <FileArchive className="size-5 text-success" />;
    }
    if (
      type.includes("json") ||
      type.includes("javascript") ||
      type.includes("typescript") ||
      type.includes("html") ||
      type.includes("css") ||
      name.endsWith(".json") ||
      name.endsWith(".js") ||
      name.endsWith(".ts") ||
      name.endsWith(".tsx") ||
      name.endsWith(".html") ||
      name.endsWith(".css")
    ) {
      return <FileCode className="size-5 text-info" />;
    }
    return <File className="size-5 text-muted-foreground" />;
  };

  const defaultContent = getIcon();

  const mergedProps = mergeProps<"div">(defaultProps, props);
  if (mergedProps.children === undefined) {
    mergedProps.children = defaultContent;
  }

  return useRender({
    defaultTagName: "div",
    props: mergedProps,
    render,
  });
}

export function FileUploadItemName({
  className,
  render,
  ...props
}: useRender.ComponentProps<"p">): React.ReactElement {
  const { file } = useFileItemContext();
  const defaultProps = {
    className: cn(
      "truncate text-sm font-medium text-foreground pr-2",
      className,
    ),
    "data-slot": "file-upload-item-name",
  };

  const mergedProps = mergeProps<"p">(defaultProps, props);
  if (mergedProps.children === undefined) {
    mergedProps.children = file.name;
  }

  return useRender({
    defaultTagName: "p",
    props: mergedProps,
    render,
  });
}

export function FileUploadItemSize({
  className,
  render,
  ...props
}: useRender.ComponentProps<"span">): React.ReactElement {
  const { file } = useFileItemContext();
  const defaultProps = {
    className: cn("text-xs text-muted-foreground", className),
    "data-slot": "file-upload-item-size",
  };

  const mergedProps = mergeProps<"span">(defaultProps, props);
  if (mergedProps.children === undefined) {
    mergedProps.children = formatFileSize(file.size);
  }

  return useRender({
    defaultTagName: "span",
    props: mergedProps,
    render,
  });
}

export function FileUploadItemProgress({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement | null {
  const { progress, status } = useFileItemContext();

  const defaultProps = {
    className: cn("absolute bottom-0 left-0 h-1 w-full bg-muted/60", className),
    "data-slot": "file-upload-item-progress",
  };

  const mergedProps = mergeProps<"div">(defaultProps, props);
  if (mergedProps.children === undefined) {
    mergedProps.children = (
      <div
        className="h-full bg-primary transition-[width] duration-300 ease-in-out"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    );
  }

  const renderResult = useRender({
    defaultTagName: "div",
    props: mergedProps,
    render,
  });

  if (status !== "uploading") return null;

  return renderResult;
}

export function FileUploadItemStatus({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement | null {
  const { status, progress, errorMessage } = useFileItemContext();
  const defaultProps = {
    className: cn("flex items-center gap-1.5 shrink-0", className),
    "data-slot": "file-upload-item-status",
  };

  const getStatusContent = () => {
    if (status === "success") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success dark:bg-success/20">
          <CheckCircle className="size-3" /> Done
        </span>
      );
    }
    if (status === "error") {
      return (
        <span
          className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive dark:bg-destructive/20"
          title={errorMessage}
        >
          <AlertCircle className="size-3" /> Failed
        </span>
      );
    }
    if (status === "uploading") {
      return (
        <span className="text-xs font-medium text-muted-foreground">
          {Math.round(progress)}%
        </span>
      );
    }
    return null;
  };

  const defaultContent = getStatusContent();

  const mergedProps = mergeProps<"div">(defaultProps, props);
  if (mergedProps.children === undefined) {
    mergedProps.children = defaultContent;
  }

  const renderResult = useRender({
    defaultTagName: "div",
    props: mergedProps,
    render,
  });

  if (!defaultContent) return null;

  return renderResult;
}

export function FileUploadItemRemove({
  className,
  render,
  ...props
}: useRender.ComponentProps<"button">): React.ReactElement {
  const { id } = useFileItemContext();
  const { removeFile, disabled } = useFileUploadContext();

  const defaultProps = {
    type: "button" as const,
    disabled: disabled,
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      removeFile(id);
    },
    className: cn(
      "relative flex items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-64 size-8 pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11",
      className,
    ),
    "data-slot": "file-upload-item-remove",
  };

  const mergedProps = mergeProps<"button">(defaultProps, props);
  if (mergedProps.children === undefined) {
    mergedProps.children = (
      <>
        <Trash2 className="size-4" />
        <span className="sr-only">Remove file</span>
      </>
    );
  }

  return useRender({
    defaultTagName: "button",
    props: mergedProps,
    render,
  });
}

// ============================================================================
// Attachment Components Family (New Polish & Merged Visual Presentation Layer)
// ============================================================================

export type AttachmentState =
  | "idle"
  | "uploading"
  | "processing"
  | "error"
  | "done";

export const attachmentVariants = cva(
  "group/attachment relative flex w-fit max-w-full min-w-0 shrink-0 flex-wrap rounded-2xl border bg-card text-card-foreground focus-within:ring-1 focus-within:ring-ring/30 not-dark:bg-clip-padding transition-[color,background-color,border-color,box-shadow,opacity] duration-200 outline-none",
  {
    variants: {
      size: {
        default:
          "gap-2 text-sm has-data-[slot=attachment-content]:px-2.5 has-data-[slot=attachment-content]:py-2 has-data-[slot=attachment-media]:p-2",
        sm: "gap-2.5 text-xs has-data-[slot=attachment-content]:px-2 has-data-[slot=attachment-content]:py-1.5 has-data-[slot=attachment-media]:p-1.5",
        xs: "gap-1.5 rounded-xl text-xs has-data-[slot=attachment-content]:px-1.5 has-data-[slot=attachment-content]:py-1 has-data-[slot=attachment-media]:p-1",
      },
      orientation: {
        horizontal: "min-w-40 items-center",
        vertical: "w-24 flex-col has-data-[slot=attachment-content]:w-30",
      },
    },
    defaultVariants: {
      size: "default",
      orientation: "horizontal",
    },
  },
);

export interface AttachmentProps
  extends
    useRender.ComponentProps<"div">,
    VariantProps<typeof attachmentVariants> {
  state?: AttachmentState;
}

export function Attachment({
  className,
  state = "done",
  size = "default",
  orientation = "horizontal",
  render,
  ...props
}: AttachmentProps): React.ReactElement {
  const defaultProps = {
    "data-slot": "attachment",
    "data-state": state,
    "data-size": size,
    "data-orientation": orientation,
    className: cn(
      attachmentVariants({ size, orientation }),
      state === "error"
        ? "border-destructive/30 bg-destructive/4"
        : "border-border/80 bg-background/50",
      state === "idle" && "border-dashed",
      "before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] group-data-[size=xs]/attachment:before:rounded-[calc(var(--radius-xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
      className,
    ),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export const attachmentMediaVariants = cva(
  "relative flex aspect-square w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-foreground group-data-[orientation=vertical]/attachment:w-full group-data-[size=sm]/attachment:w-8 group-data-[size=xs]/attachment:w-7 group-data-[size=xs]/attachment:rounded-md group-data-[state=error]/attachment:bg-destructive/10 group-data-[state=error]/attachment:text-destructive group-data-[orientation=vertical]/attachment:*:data-[slot=spinner]:size-6! [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 group-data-[orientation=vertical]/attachment:[&_svg:not([class*='size-'])]:size-6 group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        icon: "",
        image:
          "opacity-60 group-data-[state=done]/attachment:opacity-100 group-data-[state=idle]/attachment:opacity-100 *:[img]:aspect-square *:[img]:w-full *:[img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "icon",
    },
  },
);

export interface AttachmentMediaProps
  extends
    useRender.ComponentProps<"div">,
    VariantProps<typeof attachmentMediaVariants> {}

export function AttachmentMedia({
  className,
  variant = "icon",
  render,
  ...props
}: AttachmentMediaProps): React.ReactElement {
  const defaultProps = {
    "data-slot": "attachment-media",
    "data-variant": variant,
    className: cn(attachmentMediaVariants({ variant }), className),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export function AttachmentContent({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const defaultProps = {
    "data-slot": "attachment-content",
    className: cn(
      "max-w-full min-w-0 flex-1 leading-tight group-data-[orientation=vertical]/attachment:px-1",
      className,
    ),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export function AttachmentTitle({
  className,
  render,
  ...props
}: useRender.ComponentProps<"span">): React.ReactElement {
  const defaultProps = {
    "data-slot": "attachment-title",
    className: cn(
      "block max-w-full min-w-0 truncate font-medium text-foreground group-data-[state=processing]/attachment:animate-pulse group-data-[state=uploading]/attachment:animate-pulse",
      className,
    ),
  };

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(defaultProps, props),
    render,
  });
}

export function AttachmentDescription({
  className,
  render,
  ...props
}: useRender.ComponentProps<"span">): React.ReactElement {
  const defaultProps = {
    "data-slot": "attachment-description",
    className: cn(
      "mt-0.5 block min-w-0 truncate text-xs text-muted-foreground group-data-[state=error]/attachment:text-destructive/80 max-w-full",
      className,
    ),
  };

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(defaultProps, props),
    render,
  });
}

export function AttachmentActions({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const defaultProps = {
    "data-slot": "attachment-actions",
    className: cn(
      "relative z-20 flex shrink-0 items-center group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:top-3 group-data-[orientation=vertical]/attachment:right-3 group-data-[orientation=vertical]/attachment:gap-1",
      className,
    ),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export function AttachmentAction({
  className,
  variant,
  size = "icon-xs",
  ...props
}: React.ComponentProps<typeof Button>): React.JSX.Element {
  return (
    <Button
      data-slot="attachment-action"
      variant={variant ?? "ghost"}
      size={size}
      className={cn(
        "pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11",
        className,
      )}
      {...props}
    />
  );
}

export function AttachmentTrigger({
  className,
  render,
  type,
  ...props
}: useRender.ComponentProps<"button">): React.ReactElement {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        type: render ? type : (type ?? "button"),
        className: cn(
          "absolute inset-0 z-10 outline-none cursor-pointer",
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "attachment-trigger",
    },
  });
}

export function AttachmentGroup({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const defaultProps = {
    "data-slot": "attachment-group",
    className: cn(
      "flex min-w-0 snap-x snap-mandatory scrollbar-none gap-3 overflow-x-auto overscroll-x-contain py-1 *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start",
      className,
    ),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}
