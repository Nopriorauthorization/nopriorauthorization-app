'use client';

import React, { useState, useEffect } from "react";
import BlueprintSection from "./BlueprintSection";
import Textarea from "@/components/ui/textarea";
import Button from "@/components/ui/button";

export default function TimelineSection() {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    keyEvents: "",
    milestones: "",
    progress: "",
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
        if (blueprint.timeline) {
          setData(blueprint.timeline);
        }
      }
    } catch (error) {
      console.error("Error loading timeline data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/blueprint/sections/timeline", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });

      if (response.ok) {
        setEditing(false);
      } else {
        console.error("Failed to save timeline data");
      }
    } catch (error) {
      console.error("Error saving timeline data:", error);
    } finally {
      setSaving(false);
    }
  };

  const empty = !data.keyEvents && !data.milestones && !data.progress;

  if (loading) {
    return (
      <BlueprintSection
        title="Timeline"
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
      title="Timeline"
      summary={empty ? "Add key health events, milestones, and progress notes." : `${data.keyEvents ? "Key Events" : ""} ${data.milestones ? "Milestones" : ""}`}
      complete={!empty}
      lastUpdated="—"
      dataSource="user"
      empty={empty}
    >
      {editing ? (
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <Textarea
            rows={4}
            placeholder="Key Health Events (chronological)"
            value={data.keyEvents}
            onChange={e => setData(prev => ({ ...prev, keyEvents: e.target.value }))}
          />
          <Textarea
            rows={4}
            placeholder="Milestones & Achievements"
            value={data.milestones}
            onChange={e => setData(prev => ({ ...prev, milestones: e.target.value }))}
          />
          <Textarea
            rows={4}
            placeholder="Progress Notes & Reflections"
            value={data.progress}
            onChange={e => setData(prev => ({ ...prev, progress: e.target.value }))}
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
          <div><span className="font-semibold text-pink-400">Key Events:</span> {data.keyEvents || <span className="text-pink-300">Not set</span>}</div>
          <div><span className="font-semibold text-pink-400">Milestones:</span> {data.milestones || <span className="text-pink-300">Not set</span>}</div>
          <div><span className="font-semibold text-pink-400">Progress:</span> {data.progress || <span className="text-pink-300">Not set</span>}</div>
          <Button onClick={() => setEditing(true)}>Edit</Button>
        </div>
      )}
    </BlueprintSection>
  );
}
