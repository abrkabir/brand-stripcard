import Image from "next/image";
import { useId, useState } from "react";
import { CheckIcon, FileIcon, TrashIcon, UploadIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/** The files an ID can be sent as, and the largest we take, in bytes. */
export const ID_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/pdf",
];
export const MAX_FILE = 10 * 1024 * 1024;

export const sizeLabel = (bytes) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

/** A tip for a good photo, with a tick. */
export function Tip({ children }) {
  return (
    <li className="flex items-start gap-2 text-[13px] text-content">
      <span
        aria-hidden="true"
        className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-success/12 text-success"
      >
        <CheckIcon className="size-2.5" strokeWidth={3} />
      </span>
      {children}
    </li>
  );
}

/**
 * Where a photo of a document goes: a drop zone (drop a file on it, or click
 * to choose one) that becomes the photo once there is one, with ways to
 * replace or remove it.
 *
 *   file      { name, size, type, url, note? }: `url` previews it (a PDF, or
 *             a file kept from before with no `url`, shows as a document);
 *             `note` replaces the name and size under it
 *   label     what it is ("Front"), on the zone and its tag
 *   ariaLabel the file input's name, when `label` alone is not enough
 *   onRemove  leave it out and there is no way to remove the file, only to
 *             replace it
 */
export function UploadZone({
  name,
  label,
  ariaLabel,
  file,
  error,
  onFile,
  onRemove,
  accept = ID_TYPES,
  hint = "PNG, JPG, WebP or PDF, up to 10 MB",
}) {
  const id = useId();
  const [over, setOver] = useState(false);
  const ring =
    "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand";
  const preview = file?.url && file.type.startsWith("image/");

  return (
    <div>
      <input
        id={id}
        name={name}
        type="file"
        accept={accept.join(",")}
        aria-label={ariaLabel ?? label}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${id}-note`}
        className="peer sr-only"
        onChange={(event) => {
          onFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      {file ? (
        <div
          className={cn(
            "relative aspect-[1.6] overflow-hidden rounded-2xl bg-canvas ring-1 ring-line",
            ring,
          )}
        >
          {preview ? (
            <Image
              src={file.url}
              alt={`${ariaLabel ?? label}, as sent`}
              fill
              sizes="(min-width: 64rem) 20rem, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-2.5 px-6 pb-8 text-center">
              <span className="grid size-12 place-items-center rounded-xl bg-card text-muted shadow-soft">
                <FileIcon className="size-6" />
              </span>
              <span className="max-w-full truncate text-sm font-medium text-headline">
                {file.name}
              </span>
            </div>
          )}
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-success px-2.5 py-1 text-xs font-semibold text-white shadow-soft">
            <CheckIcon aria-hidden="true" className="size-3" strokeWidth={3} />
            {label}
          </span>
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 flex items-center justify-end gap-2 p-3",
              preview && "bg-linear-to-t from-black/65 to-transparent pt-10",
            )}
          >
            <label
              htmlFor={id}
              className={cn(
                "inline-flex h-8 cursor-pointer items-center rounded-full px-3.5 text-xs font-semibold transition-colors",
                preview
                  ? "bg-white/90 text-hero-ink hover:bg-white"
                  : "bg-card text-headline ring-1 ring-line hover:ring-headline/30",
              )}
            >
              Replace
            </label>
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                aria-label={`Remove the ${label.toLowerCase()}`}
                className="grid size-8 cursor-pointer place-items-center rounded-full bg-white/90 text-danger transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <TrashIcon className="size-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <label
          htmlFor={id}
          onDragOver={(event) => {
            event.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(event) => {
            event.preventDefault();
            setOver(false);
            onFile(event.dataTransfer.files?.[0]);
          }}
          className={cn(
            "flex aspect-[1.6] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 text-center transition-colors",
            ring,
            over
              ? "border-brand bg-brand-50 dark:bg-brand/10"
              : error
                ? "border-danger/50 bg-danger/5"
                : "border-line bg-canvas/40 hover:border-brand/50 hover:bg-canvas/70",
          )}
        >
          <span
            aria-hidden="true"
            className="grid size-11 place-items-center rounded-full bg-card text-brand shadow-soft"
          >
            <UploadIcon className="size-5" />
          </span>
          <span className="mt-3 text-sm font-semibold text-headline">
            {label}
          </span>
          <span className="mt-1 text-xs text-muted">
            Drop a photo here or{" "}
            <span className="font-semibold text-brand">browse</span>
          </span>
        </label>
      )}
      <p
        id={`${id}-note`}
        className={cn(
          "mt-1.5 truncate text-xs",
          error ? "font-medium text-danger" : "text-muted",
        )}
      >
        {error ||
          (file
            ? (file.note ?? `${file.name}, ${sizeLabel(file.size)}`)
            : hint)}
      </p>
    </div>
  );
}
