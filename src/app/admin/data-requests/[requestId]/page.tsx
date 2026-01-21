"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface DataRequestDetail {
  id: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
  };
  requestType: string;
  status: string;
  requestedAt: string;
  fulfilledAt: string | null;
  fulfilledBy: { id: string; email: string; name: string | null } | null;
  cancelledAt: string | null;
  cancelledBy: { id: string; email: string; name: string | null } | null;
  cancellationReason: string | null;
  notes: string | null;
}

const statusLabels: Record<string, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const typeLabels: Record<string, string> = {
  export: "Data Export",
  deletion: "Account Deletion",
};

const demoDataRequest: DataRequestDetail = {
  id: "demo-request",
  user: {
    id: "demo-user",
    email: "guest@example.com",
    name: "Guest User",
    createdAt: new Date("2023-01-01T00:00:00Z").toISOString(),
  },
  requestType: "export",
  status: "pending",
  requestedAt: new Date("2024-01-15T12:00:00Z").toISOString(),
  fulfilledAt: null,
  fulfilledBy: null,
  cancelledAt: null,
  cancelledBy: null,
  cancellationReason: null,
  notes: "Demo showcase request for preview purposes.",
};

export default function DataRequestDetailPage() {
  const params = useParams();
  const requestId = params.requestId as string;

  const [request, setRequest] = useState<DataRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Action state
  const [showFulfillModal, setShowFulfillModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [fulfillNotes, setFulfillNotes] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequest = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsDemoMode(false);

    try {
      const response = await fetch(`/api/admin/data-requests/${requestId}`);
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setIsDemoMode(true);
          const demoRequest = { ...demoDataRequest, id: requestId };
          setRequest(demoRequest);
          setFulfillNotes(demoRequest.notes || "");
          return;
        }
        if (response.status === 404) {
          setError("Request not found");
          return;
        }
        throw new Error("Failed to fetch request");
      }

      const data = await response.json();
      setRequest(data.request);
      setFulfillNotes(data.request.notes || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  const handleFulfill = async () => {
    if (isDemoMode) {
      alert("Demo mode: actions are disabled.");
      return;
    }
    setActionLoading(true);

    try {
      const response = await fetch(`/api/admin/data-requests/${requestId}/fulfill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: fulfillNotes }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fulfill request");
      }

      setShowFulfillModal(false);
      await fetchRequest();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to fulfill request");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (isDemoMode) {
      alert("Demo mode: actions are disabled.");
      return;
    }
    if (!cancelReason || cancelReason.trim().length < 5) {
      alert("Cancellation reason required (min 5 characters)");
      return;
    }

    setActionLoading(true);

    try {
      const response = await fetch(`/api/admin/data-requests/${requestId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: cancelReason }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to cancel request");
      }

      setShowCancelModal(false);
      await fetchRequest();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to cancel request");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-center py-8">Loading request...</p>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || "Request not found"}
        </div>
        <Link
          href="/admin/data-requests"
          className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
        >
          ← Back to Data Requests
        </Link>
      </div>
    );
  }

  const canTakeAction = request.status === "pending" || request.status === "in_progress";
  const showActions = canTakeAction && !isDemoMode;
  const requestTypeLabel = typeLabels[request.requestType] || request.requestType;

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/admin/data-requests"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Back to Data Requests
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Data Request Details</h1>
            <p className="text-gray-600 mt-1">Request ID: {request.id}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(request.status)}`}>
            {statusLabels[request.status] || request.status}
          </span>
        </div>
      </div>

      {isDemoMode && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-6">
          You are viewing a demo data request. Administrative actions are disabled in this preview mode.
        </div>
      )}

      {/* Request Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Request Information</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">User</label>
            {isDemoMode ? (
              <span className="text-lg text-gray-700">{request.user.email}</span>
            ) : (
              <Link
                href={`/admin/users/${request.user.id}`}
                className="text-blue-600 hover:text-blue-800 text-lg"
              >
                {request.user.email}
              </Link>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Request Type</label>
            <p className="text-lg">{requestTypeLabel}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Requested Date</label>
            <p className="text-lg">{new Date(request.requestedAt).toLocaleString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">User Account Created</label>
            <p className="text-lg">{new Date(request.user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {request.notes && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">Admin Notes</label>
            <p className="text-gray-700 bg-gray-50 p-3 rounded">{request.notes}</p>
          </div>
        )}
      </div>

      {/* Fulfillment Information */}
      {(request.fulfilledAt || request.cancelledAt) && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {request.fulfilledAt ? "Fulfillment" : "Cancellation"} Information
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                {request.fulfilledAt ? "Fulfilled" : "Cancelled"} Date
              </label>
              <p className="text-lg">
                {new Date(request.fulfilledAt || request.cancelledAt!).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                {request.fulfilledAt ? "Fulfilled" : "Cancelled"} By
              </label>
              <p className="text-lg">
                {request.fulfilledBy?.email || request.cancelledBy?.email || "Unknown"}
              </p>
            </div>
          </div>

          {request.cancellationReason && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">Cancellation Reason</label>
              <p className="text-gray-700 bg-gray-50 p-3 rounded">{request.cancellationReason}</p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setShowFulfillModal(true)}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Mark as Fulfilled
            </button>
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Cancel Request
            </button>
          </div>
        </div>
      )}

      {/* Fulfill Modal */}
      {showFulfillModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Mark Request as Fulfilled</h3>
            <p className="text-gray-600 mb-4">
              Confirm that this {requestTypeLabel.toLowerCase()} request has been completed.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Admin Notes (Optional)</label>
              <textarea
                value={fulfillNotes}
                onChange={(e) => setFulfillNotes(e.target.value)}
                placeholder="Add notes about fulfillment..."
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowFulfillModal(false)}
                disabled={actionLoading}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleFulfill}
                disabled={actionLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {actionLoading ? "Processing..." : "Confirm Fulfillment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Cancel Request</h3>
            <p className="text-gray-600 mb-4">
              Provide a reason for cancelling this request.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Cancellation Reason <span className="text-red-600">*</span>
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Explain why this request is being cancelled..."
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 5 characters</p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={actionLoading}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={handleCancel}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading ? "Processing..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
