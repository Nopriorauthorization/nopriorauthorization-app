import { DocumentCategory } from "@prisma/client";

export type DocumentItem = {
  id: string;
  title: string;
  category: DocumentCategory;
  docDate: string | null;
  mimeType: string;
  sizeBytes: number;
  includeInPacketDefault: boolean;
  createdAt: string;
};

export const DOCUMENT_CATEGORIES: { value: DocumentCategory; label: string }[] = [
  { value: DocumentCategory.LAB, label: "Lab Result" },
  { value: DocumentCategory.IMAGING, label: "Imaging" },
  { value: DocumentCategory.VISIT_NOTE, label: "Visit Note" },
  { value: DocumentCategory.DISCHARGE, label: "Discharge Summary" },
  { value: DocumentCategory.OTHER, label: "Other" },
];

export async function fetchDocuments(): Promise<DocumentItem[]> {
  const response = await fetch("/api/documents");
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || "Unable to load documents.");
  }
  return data.documents ?? [];
}

export type UploadDocumentPayload = {
  file: File;
  title?: string;
  category?: DocumentCategory;
  docDate?: string;
  includeInPacketDefault?: boolean;
};

export async function uploadDocument({
  file,
  title,
  category,
  docDate,
  includeInPacketDefault,
}: UploadDocumentPayload): Promise<DocumentItem> {
  const formData = new FormData();
  formData.append("file", file);
  if (title) formData.append("title", title);
  if (category) formData.append("category", category);
  if (docDate) formData.append("docDate", docDate);
  if (typeof includeInPacketDefault === "boolean") {
    formData.append(
      "includeInPacketDefault",
      includeInPacketDefault ? "true" : "false"
    );
  }

  const response = await fetch("/api/documents", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || "Unable to upload document.");
  }
  return data.document;
}

export async function updateDocument(
  documentId: string,
  updates: {
    title?: string;
    category?: DocumentCategory;
    docDate?: string | null;
    includeInPacketDefault?: boolean;
  }
): Promise<DocumentItem> {
  const response = await fetch(`/api/documents/${documentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || "Unable to update document.");
  }
  return data.document;
}

export async function removeDocument(documentId: string) {
  const response = await fetch(`/api/documents/${documentId}`, {
    method: "DELETE",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || "Unable to delete document.");
  }
  return data.document;
}

export async function createDocumentShareLink(
  documentId: string,
  expiresInDays?: number
) {
  const response = await fetch(`/api/documents/${documentId}/share`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      expiresDays: expiresInDays,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || "Unable to create document share link.");
  }
  return data;
}
