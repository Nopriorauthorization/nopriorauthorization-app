'use client';

import React, { useState, useEffect } from "react";
import BlueprintSection from "./BlueprintSection";
import Textarea from "@/components/ui/textarea";
import Button from "@/components/ui/button";

export default function PreparationSection() {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    appointments: "",
    questions: "",
    redFlags: "",
    insurance: "",
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
        if (blueprint.preparation) {
          setData(blueprint.preparation);
        }
      }
    } catch (error) {
      console.error("Error loading preparation data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/blueprint/sections/preparation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });

      if (response.ok) {
        setEditing(false);
      } else {
        console.error("Failed to save preparation data");
      }
    } catch (error) {
      console.error("Error saving preparation data:", error);
    } finally {
      setSaving(false);
    }
  };

  const empty = !data.appointments && !data.questions && !data.redFlags && !data.insurance;

  if (loading) {
    return (
      <BlueprintSection
        title="Preparation & Advocacy"
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
      title="Preparation & Advocacy"
      summary={empty ? "Add upcoming appointments, questions, red flags, insurance context." : `Prep: ${data.appointments || data.questions ? "Ready" : "In Progress"}`}
      complete={!empty}
      lastUpdated="—"
      dataSource="user"
      empty={empty}
    >
      {editing ? (
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <Textarea
            rows={4}
            placeholder="Upcoming appointments"
            value={data.appointments}
            onChange={e => setData(prev => ({ ...prev, appointments: e.target.value }))}
          />
          <Textarea
            rows={4}
            placeholder="Questions to ask providers"
            value={data.questions}
            onChange={e => setData(prev => ({ ...prev, questions: e.target.value }))}
          />
          <Textarea
            rows={4}
            placeholder="Red flags to watch for"
            value={data.redFlags}
            onChange={e => setData(prev => ({ ...prev, redFlags: e.target.value }))}
          />
          <Textarea
            rows={4}
            placeholder="Insurance context and coverage"
            value={data.insurance}
            onChange={e => setData(prev => ({ ...prev, insurance: e.target.value }))}
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
          <div><span className="font-semibold text-pink-400">Appointments:</span> {data.appointments || <span className="text-pink-300">None scheduled</span>}</div>
          <div><span className="font-semibold text-pink-400">Questions:</span> {data.questions || <span className="text-pink-300">Not set</span>}</div>
          <div><span className="font-semibold text-pink-400">Red Flags:</span> {data.redFlags || <span className="text-pink-300">Not set</span>}</div>
          <div><span className="font-semibold text-pink-400">Insurance:</span> {data.insurance || <span className="text-pink-300">Not set</span>}</div>
          <Button onClick={() => setEditing(true)}>Edit</Button>
        </div>
      )}
    </BlueprintSection>
  );
}
