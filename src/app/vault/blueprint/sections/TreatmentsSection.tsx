'use client';

import React, { useState, useEffect } from "react";
import BlueprintSection from "./BlueprintSection";
import Textarea from "@/components/ui/textarea";
import Button from "@/components/ui/button";

export default function TreatmentsSection() {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    surgeries: "",
    procedures: "",
    therapies: "",
    aesthetic: "",
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
        if (blueprint.treatments) {
          setData(blueprint.treatments);
        }
      }
    } catch (error) {
      console.error("Error loading treatments data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/blueprint/sections/treatments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });

      if (response.ok) {
        setEditing(false);
      } else {
        console.error("Failed to save treatments data");
      }
    } catch (error) {
      console.error("Error saving treatments data:", error);
    } finally {
      setSaving(false);
    }
  };

  const empty = !data.surgeries && !data.procedures && !data.therapies && !data.aesthetic;

  if (loading) {
    return (
      <BlueprintSection
        title="Treatments & Interventions"
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
      title="Treatments & Interventions"
      summary={empty ? "Add surgeries, procedures, therapies, wellness treatments." : `${data.surgeries ? "Surgeries" : ""} ${data.procedures ? "Procedures" : ""} ${data.therapies ? "Therapies" : ""}`}
      complete={!empty}
      lastUpdated="—"
      dataSource="user"
      empty={empty}
    >
      {editing ? (
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <Textarea
            rows={4}
            placeholder="Surgeries"
            value={data.surgeries}
            onChange={e => setData(prev => ({ ...prev, surgeries: e.target.value }))}
          />
          <Textarea
            rows={4}
            placeholder="Procedures"
            value={data.procedures}
            onChange={e => setData(prev => ({ ...prev, procedures: e.target.value }))}
          />
          <Textarea
            rows={4}
            placeholder="Therapies"
            value={data.therapies}
            onChange={e => setData(prev => ({ ...prev, therapies: e.target.value }))}
          />
          <Textarea
            rows={4}
            placeholder="Aesthetic / Wellness Treatments"
            value={data.aesthetic}
            onChange={e => setData(prev => ({ ...prev, aesthetic: e.target.value }))}
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
          <div><span className="font-semibold text-pink-400">Surgeries:</span> {data.surgeries || <span className="text-pink-300">Not set</span>}</div>
          <div><span className="font-semibold text-pink-400">Procedures:</span> {data.procedures || <span className="text-pink-300">Not set</span>}</div>
          <div><span className="font-semibold text-pink-400">Therapies:</span> {data.therapies || <span className="text-pink-300">Not set</span>}</div>
          <div><span className="font-semibold text-pink-400">Aesthetic/Wellness:</span> {data.aesthetic || <span className="text-pink-300">Not set</span>}</div>
          <Button onClick={() => setEditing(true)}>Edit</Button>
        </div>
      )}
    </BlueprintSection>
  );
}
