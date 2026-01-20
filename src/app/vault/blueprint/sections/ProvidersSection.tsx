'use client';

import React, { useState, useEffect } from "react";
import BlueprintSection from "./BlueprintSection";
import Textarea from "@/components/ui/textarea";
import Button from "@/components/ui/button";

export default function ProvidersSection() {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    providers: "",
    careCircle: "",
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
        if (blueprint.providers) {
          setData(blueprint.providers);
        }
      }
    } catch (error) {
      console.error("Error loading providers data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/blueprint/sections/providers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });

      if (response.ok) {
        setEditing(false);
      } else {
        console.error("Failed to save providers data");
      }
    } catch (error) {
      console.error("Error saving providers data:", error);
    } finally {
      setSaving(false);
    }
  };

  const empty = !data.providers && !data.careCircle;

  if (loading) {
    return (
      <BlueprintSection
        title="Providers & Care Circle"
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
      title="Providers & Care Circle"
      summary={empty ? "Add doctors, clinics, pharmacies, trusted individuals." : `Providers: ${data.providers}`}
      complete={!empty}
      lastUpdated="—"
      dataSource="user"
      empty={empty}
    >
      {editing ? (
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <Textarea
            rows={4}
            placeholder="Doctors, clinics, pharmacies"
            value={data.providers}
            onChange={e => setData(prev => ({ ...prev, providers: e.target.value }))}
          />
          <Textarea
            rows={4}
            placeholder="Trusted individuals in your care circle"
            value={data.careCircle}
            onChange={e => setData(prev => ({ ...prev, careCircle: e.target.value }))}
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
          <div><span className="font-semibold text-pink-400">Providers:</span> {data.providers || <span className="text-pink-300">None yet</span>}</div>
          <div><span className="font-semibold text-pink-400">Care Circle:</span> {data.careCircle || <span className="text-pink-300">Not set</span>}</div>
          <Button onClick={() => setEditing(true)}>Edit</Button>
        </div>
      )}
    </BlueprintSection>
  );
}
