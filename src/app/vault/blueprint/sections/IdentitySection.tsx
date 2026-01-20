'use client';

import React, { useState, useEffect } from "react";
import BlueprintSection from "./BlueprintSection";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Button from "@/components/ui/button";

export default function IdentitySection() {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    name: "",
    dob: "",
    gender: "",
    communication: "",
    values: "",
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
        if (blueprint.identityContext) {
          setData(blueprint.identityContext);
        }
      }
    } catch (error) {
      console.error("Error loading identity data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/blueprint/sections/identityContext", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });

      if (response.ok) {
        setEditing(false);
      } else {
        console.error("Failed to save identity data");
      }
    } catch (error) {
      console.error("Error saving identity data:", error);
    } finally {
      setSaving(false);
    }
  };

  const empty = !data.name && !data.dob && !data.gender && !data.communication && !data.values;

  if (loading) {
    return (
      <BlueprintSection
        title="Identity & Context"
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
      title="Identity & Context"
      summary={empty ? "Add your name, DOB, gender, and what matters to you." : `${data.name || "(No name)"}, ${data.dob || "(No DOB)"}, ${data.gender || "(No gender)"}`}
      complete={!empty}
      lastUpdated="—"
      dataSource="user"
      empty={empty}
    >
      {editing ? (
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <Input
            placeholder="Preferred Name"
            value={data.name}
            onChange={e => setData(prev => ({ ...prev, name: e.target.value }))}
          />
          <Input
            placeholder="Date of Birth"
            value={data.dob}
            onChange={e => setData(prev => ({ ...prev, dob: e.target.value }))}
          />
          <Input
            placeholder="Gender"
            value={data.gender}
            onChange={e => setData(prev => ({ ...prev, gender: e.target.value }))}
          />
          <Input
            placeholder="Communication Preferences"
            value={data.communication}
            onChange={e => setData(prev => ({ ...prev, communication: e.target.value }))}
          />
          <Textarea
            rows={4}
            placeholder="Values / Priorities"
            value={data.values}
            onChange={e => setData(prev => ({ ...prev, values: e.target.value }))}
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
          <div><span className="font-semibold text-pink-400">Name:</span> {data.name || <span className="text-pink-300">Not set</span>}</div>
          <div><span className="font-semibold text-pink-400">DOB:</span> {data.dob || <span className="text-pink-300">Not set</span>}</div>
          <div><span className="font-semibold text-pink-400">Gender:</span> {data.gender || <span className="text-pink-300">Not set</span>}</div>
          <div><span className="font-semibold text-pink-400">Communication:</span> {data.communication || <span className="text-pink-300">Not set</span>}</div>
          <div><span className="font-semibold text-pink-400">Values:</span> {data.values || <span className="text-pink-300">Not set</span>}</div>
          <Button onClick={() => setEditing(true)}>Edit</Button>
        </div>
      )}
    </BlueprintSection>
  );
}
