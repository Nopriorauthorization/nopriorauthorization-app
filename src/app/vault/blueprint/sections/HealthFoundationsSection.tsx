'use client';

import React, { useState, useEffect } from "react";
import BlueprintSection from "./BlueprintSection";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Button from "@/components/ui/button";

export default function HealthFoundationsSection() {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    diagnoses: "",
    medications: "",
    allergies: "",
    hormone: "",
    family: "",
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
        if (blueprint.healthFoundations) {
          setData(blueprint.healthFoundations);
        }
      }
    } catch (error) {
      console.error("Error loading health foundations data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/blueprint/sections/healthFoundations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });

      if (response.ok) {
        setEditing(false);
      } else {
        console.error("Failed to save health foundations data");
      }
    } catch (error) {
      console.error("Error saving health foundations data:", error);
    } finally {
      setSaving(false);
    }
  };

  const empty = !data.diagnoses && !data.medications && !data.allergies && !data.hormone && !data.family;

  if (loading) {
    return (
      <BlueprintSection
        title="Health Foundations"
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
      title="Health Foundations"
      summary={empty ? "Add diagnoses, medications, allergies, hormone status, family history." : `${data.diagnoses ? "Diagnoses" : ""} ${data.medications ? "Medications" : ""} ${data.allergies ? "Allergies" : ""}`}
      complete={!empty}
      lastUpdated="—"
      dataSource="user"
      empty={empty}
    >
      {editing ? (
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <Textarea
            rows={4}
            placeholder="Diagnoses (confirmed/suspected)"
            value={data.diagnoses}
            onChange={e => setData(prev => ({ ...prev, diagnoses: e.target.value }))}
          />
          <Textarea
            rows={4}
            placeholder="Medications (current/past)"
            value={data.medications}
            onChange={e => setData(prev => ({ ...prev, medications: e.target.value }))}
          />
          <Textarea
            rows={4}
            placeholder="Allergies / Sensitivities"
            value={data.allergies}
            onChange={e => setData(prev => ({ ...prev, allergies: e.target.value }))}
          />
          <Input
            placeholder="Hormone Status"
            value={data.hormone}
            onChange={e => setData(prev => ({ ...prev, hormone: e.target.value }))}
          />
          <Textarea
            rows={4}
            placeholder="Genetic / Family History"
            value={data.family}
            onChange={e => setData(prev => ({ ...prev, family: e.target.value }))}
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
          <div><span className="font-semibold text-pink-400">Diagnoses:</span> {data.diagnoses || <span className="text-pink-300">Not set</span>}</div>
          <div><span className="font-semibold text-pink-400">Medications:</span> {data.medications || <span className="text-pink-300">Not set</span>}</div>
          <div><span className="font-semibold text-pink-400">Allergies:</span> {data.allergies || <span className="text-pink-300">Not set</span>}</div>
          <div><span className="font-semibold text-pink-400">Hormone Status:</span> {data.hormone || <span className="text-pink-300">Not set</span>}</div>
          <div><span className="font-semibold text-pink-400">Family History:</span> {data.family || <span className="text-pink-300">Not set</span>}</div>
          <Button onClick={() => setEditing(true)}>Edit</Button>
        </div>
      )}
    </BlueprintSection>
  );
}
