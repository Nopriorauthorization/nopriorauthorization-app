'use client';

import React, { useState, useEffect } from "react";
import BlueprintSection from "./BlueprintSection";
import Textarea from "@/components/ui/textarea";
import Button from "@/components/ui/button";

export default function DocumentsSection() {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    uploads: "",
    notes: "",
  });

  // Load data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/blueprint");
      if (response.ok) {
        const blueprint = await response.json();
        if (blueprint.documents) {
          setData(blueprint.documents);
        }
      }
    } catch (error) {
      console.error("Error loading documents data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/blueprint/sections/documents", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });

      if (response.ok) {
        setEditing(false);
      } else {
        console.error("Failed to save documents data");
      }
    } catch (error) {
      console.error("Error saving documents data:", error);
    } finally {
      setSaving(false);
    }
  };

  const empty = !data.uploads && !data.notes;

  if (loading) {
    return (
      <BlueprintSection
        title="Documents & Media"
        summary="Loading..."
        complete={false}
        lastUpdated="—"
        dataSource="user"
        empty={true}
      >
        <div className="text-pink-300">Loading...</div>
      </BlueprintSection>
    );
  }

  return (
    <BlueprintSection
      title="Documents & Media"
      summary={empty ? "Upload labs, PDFs, photos, voice notes." : `Uploads: ${data.uploads}`}
      complete={!empty}
      lastUpdated="—"
      dataSource="user"
      empty={empty}
    >
      {editing ? (
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <Textarea
            rows={4}
            placeholder="Describe uploads (labs, PDFs, photos, etc.)"
            value={data.uploads}
            onChange={e => setData(prev => ({ ...prev, uploads: e.target.value }))}
          />
          <Textarea
            rows={4}
            placeholder="Additional notes about documents"
            value={data.notes}
            onChange={e => setData(prev => ({ ...prev, notes: e.target.value }))}
          />
          <div className="flex gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditing(false)}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <div><span className="font-semibold text-pink-400">Uploads:</span> {data.uploads || <span className="text-pink-300">None yet</span>}</div>
          <div><span className="font-semibold text-pink-400">Notes:</span> {data.notes || <span className="text-pink-300">Not set</span>}</div>
          <Button onClick={() => setEditing(true)}>Edit</Button>
        </div>
      )}
    </BlueprintSection>
  );
}
