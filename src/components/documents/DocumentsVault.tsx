"use client";

import {
  DragEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Button from "@/components/ui/button";
import {
  DOCUMENT_CATEGORIES,
  DocumentItem,
  fetchDocuments,
  uploadDocument,
  updateDocument,
} from "@/lib/documents/client";

const SEARCH_PLACEHOLDER = "Search by title, category, or keyword";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentsVault() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [docDate, setDocDate] = useState("");
  const [category, setCategory] = useState(DOCUMENT_CATEGORIES[0].value);
  const [includeDefault, setIncludeDefault] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchDocuments();
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load documents.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((document) => {
      const searchTerm = search.trim().toLowerCase();
      if (
        categoryFilter &&
        document.category.toLowerCase() !== categoryFilter.toLowerCase()
      ) {
        return false;
      }
      if (searchTerm.length === 0) return true;
      return (
        document.title.toLowerCase().includes(searchTerm) ||
        document.category.toLowerCase().includes(searchTerm)
      );
    });
  }, [documents, search, categoryFilter]);

  const handleFileFocus = () => fileInputRef.current?.click();

  const handleFiles = (files: FileList | File[]) => {
    const file = files[0];
    if (!file) return;
    setPendingFile(file);
    if (!title) {
      const baseName = file.name.replace(/\.[^.]+$/, "");
      setTitle(baseName);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setIsDragging(false);
    handleFiles([file]);
  };

  const handleUpload = async () => {
    if (!pendingFile) {
      setUploadError("Choose a document to upload first.");
      return;
    }
    setIsUploading(true);
    setUploadError("");
    try {
      await uploadDocument({
        file: pendingFile,
        title: title || pendingFile.name,
        category,
        docDate: docDate || undefined,
        includeInPacketDefault: includeDefault,
      });
      setPendingFile(null);
      setTitle("");
      setDocDate("");
      setIncludeDefault(false);
      loadDocuments();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const toggleInclude = async (document: DocumentItem) => {
    try {
      await updateDocument(document.id, {
        includeInPacketDefault: !document.includeInPacketDefault,
      });
      loadDocuments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-black/50 px-6 py-6 text-white">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-hot-pink">
            Reports Vault
          </p>
          <h2 className="text-2xl font-semibold">Documents & Attachments</h2>
          <p className="text-sm text-gray-300">
            Upload PDFs, labs, imaging, or visit notes to keep them near your
            Blueprint.
          </p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={SEARCH_PLACEHOLDER}
            className="rounded-full border border-hot-pink/40 bg-black px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:border-hot-pink focus:outline-none"
          />
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="rounded-full border border-hot-pink/40 bg-black px-4 py-2 text-sm text-white"
          >
            <option value="">Filter by category</option>
            {DOCUMENT_CATEGORIES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`mt-6 flex cursor-pointer items-center justify-between rounded-2xl border-2 px-4 py-5 transition ${
          isDragging
            ? "border-hot-pink bg-hot-pink/10"
            : "border-dashed border-hot-pink/40 bg-white/5"
        }`}
      >
        <div>
          <p className="text-sm font-semibold text-white">
            {pendingFile ? pendingFile.name : "Drop a PDF, JPG, or PNG here"}
          </p>
          <p className="text-xs text-gray-300">
            {pendingFile
              ? formatFileSize(pendingFile.size)
              : "Up to 30 seconds upload (we’re quick)."}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleFileFocus}>
          Choose a file
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,image/png,image/jpeg"
          className="hidden"
          onChange={(event) => handleFiles(event.target.files ?? [])}
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <label className="text-sm text-gray-300">
          Title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Document title"
            className="mt-1 w-full rounded-xl border border-gray-700 bg-transparent px-3 py-2 text-sm text-white focus:border-hot-pink focus:outline-none"
          />
        </label>
        <label className="text-sm text-gray-300">
          Category
          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as DocumentItem["category"])
            }
            className="mt-1 w-full rounded-xl border border-gray-700 bg-transparent px-3 py-2 text-sm text-white focus:border-hot-pink focus:outline-none"
          >
            {DOCUMENT_CATEGORIES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-gray-300">
          Document date
          <input
            type="date"
            value={docDate}
            onChange={(event) => setDocDate(event.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-700 bg-transparent px-3 py-2 text-sm text-white focus:border-hot-pink focus:outline-none"
          />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={includeDefault}
            onChange={(event) => setIncludeDefault(event.target.checked)}
            className="h-4 w-4 accent-hot-pink"
          />
          Include in packet by default
        </label>
        <Button
          variant="primary"
          size="sm"
          onClick={handleUpload}
          disabled={isUploading}
          isLoading={isUploading}
        >
          Upload document
        </Button>
        {uploadError && (
          <p className="text-xs text-red-400">{uploadError}</p>
        )}
      </div>

      <div className="mt-8 space-y-4">
        {loading ? (
          <p className="text-sm text-gray-400">Loading documents…</p>
        ) : filteredDocuments.length === 0 ? (
          <p className="text-sm text-gray-400">No documents uploaded yet.</p>
        ) : (
          filteredDocuments.map((document) => (
            <article
              key={document.id}
              className="flex flex-col gap-3 rounded-2xl border border-hot-pink/40 bg-white/5 p-4"
            >
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-lg font-semibold">{document.title}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-hot-pink">
                    {document.category}
                  </p>
                </div>
                <div className="flex gap-2 text-xs text-gray-300">
                  <span>{formatFileSize(document.sizeBytes)}</span>
                  <span>
                    Uploaded {formatDate(document.createdAt) ?? "just now"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-gray-300">
                  {document.docDate
                    ? `Document date: ${formatDate(document.docDate)}`
                    : "Document date: not specified"}
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-300">
                    <input
                      type="checkbox"
                      checked={document.includeInPacketDefault}
                      onChange={() => toggleInclude(document)}
                      className="h-4 w-4 accent-hot-pink"
                    />
                    Include in packet by default
                  </label>
                  <a
                    href={`/api/documents/${document.id}/download`}
                    className="text-xs font-semibold text-hot-pink underline-offset-4 hover:underline"
                  >
                    Download
                  </a>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
    </section>
  );
}
