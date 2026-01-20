import React, { useState } from "react";

export default function MedicationsSection() {
  const [collapsed, setCollapsed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [medications, setMedications] = useState<string[]>([]);
  const [newMedication, setNewMedication] = useState("");

  function addMedication() {
    if (newMedication) {
      setMedications([...medications, newMedication]);
      setNewMedication("");
    }
  }

  function removeMedication(idx: number) {
    setMedications(medications.filter((_, i) => i !== idx));
  }

  return (
    <section className={`section medications-section ${collapsed ? "collapsed" : "expanded"}`}>
      <header onClick={() => setCollapsed(!collapsed)}>
        <h2>Medications</h2>
        <button>{collapsed ? "Expand" : "Collapse"}</button>
      </header>
      {!collapsed && (
        <div>
          {editing ? (
            <div>
              <ul>
                {medications.map((m, i) => (
                  <li key={i}>{m} <button onClick={() => removeMedication(i)}>Remove</button></li>
                ))}
              </ul>
              <input value={newMedication} onChange={e => setNewMedication(e.target.value)} placeholder="Add medication" />
              <button onClick={addMedication}>Add</button>
              <button onClick={() => setEditing(false)}>Save</button>
            </div>
          ) : (
            <div>
              <ul>
                {medications.length === 0 ? <li><em>Not provided</em></li> : medications.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
              <button onClick={() => setEditing(true)}>Edit</button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
