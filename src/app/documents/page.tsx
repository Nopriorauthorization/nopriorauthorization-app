"use client";
export const dynamic = 'force-dynamic';
import DocumentsVault from "@/components/documents/DocumentsVault";

export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-hot-pink">Documents Vault</p>
          <h1 className="text-3xl font-semibold md:text-4xl">Upload & Manage Your Medical Documents</h1>
          <p className="mt-2 text-gray-300">
            Keep all your labs, imaging, visit notes, and medical records in one secure place.
          </p>
        </div>

        <DocumentsVault />

        <div className="mt-8 rounded-xl border border-blue-500/40 bg-blue-500/10 px-4 py-3 text-sm text-blue-300">
          <p className="font-semibold">📋 Upload Instructions:</p>
          <ul className="mt-2 ml-4 list-disc space-y-1">
            <li>Drag and drop files into the upload area or click &quot;Choose a file&quot;</li>
            <li>Supported formats: PDF, JPG, PNG</li>
            <li>Add a title and category for easy searching</li>
            <li>Check &quot;Include in packet by default&quot; to automatically add to provider packets</li>
            <li>Click &quot;Upload document&quot; to save to your vault</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
