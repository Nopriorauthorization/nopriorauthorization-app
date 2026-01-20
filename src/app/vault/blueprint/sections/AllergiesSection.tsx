import React, { useState } from "react";

export default function AllergiesSection() {
  const [collapsed, setCollapsed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState("");

  function addAllergy() {
    if (newAllergy) {
      setAllergies([...allergies, newAllergy]);
      setNewAllergy("");
    }
  }

  function removeAllergy(idx: number) {
    setAllergies(allergies.filter((_, i) => i !== idx));
  }

  return (
    <section className={`section allergies-section ${collapsed ? "collapsed" : "expanded"}`}>
      <header onClick={() => setCollapsed(!collapsed)}>
        <h2>Allergies & Sensitivities</h2>
        <button>{collapsed ? "Expand" : "Collapse"}</button>
      </header>
      {!collapsed && (
        <div>
          {editing ? (
            <div>
              <ul>
                {allergies.map((a, i) => (
                  <li key={i}>{a} <button onClick={() => removeAllergy(i)}>Remove</button></li>
                ))}
              </ul>
              <input value={newAllergy} onChange={e => setNewAllergy(e.target.value)} placeholder="Add allergy" />
              <button onClick={addAllergy}>Add</button>
              <button onClick={() => setEditing(false)}>Save</button>
            </div>
          ) : (
            <div>
              <ul>
                {allergies.length === 0 ? <li><em>Not provided</em></li> : allergies.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
              <button onClick={() => setEditing(true)}>Edit</button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
