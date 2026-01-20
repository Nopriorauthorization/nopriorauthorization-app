import React, { useState } from "react";

export default function LabsSection() {
  const [collapsed, setCollapsed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [labs, setLabs] = useState<string[]>([]);
  const [newLab, setNewLab] = useState("");

  function addLab() {
    if (newLab) {
      setLabs([...labs, newLab]);
      setNewLab("");
    }
  }

  function removeLab(idx: number) {
    setLabs(labs.filter((_, i) => i !== idx));
  }

  return (
    <section className={`section labs-section ${collapsed ? "collapsed" : "expanded"}`}>
      <header onClick={() => setCollapsed(!collapsed)}>
        <h2>Labs & Vitals</h2>
        <button>{collapsed ? "Expand" : "Collapse"}</button>
      </header>
      {!collapsed && (
        <div>
          {editing ? (
            <div>
              <ul>
                {labs.map((l, i) => (
                  <li key={i}>{l} <button onClick={() => removeLab(i)}>Remove</button></li>
                ))}
              </ul>
              <input value={newLab} onChange={e => setNewLab(e.target.value)} placeholder="Add lab or vital" />
              <button onClick={addLab}>Add</button>
              <button onClick={() => setEditing(false)}>Save</button>
            </div>
          ) : (
            <div>
              <ul>
                {labs.length === 0 ? <li><em>Not provided</em></li> : labs.map((l, i) => <li key={i}>{l}</li>)}
              </ul>
              <button onClick={() => setEditing(true)}>Edit</button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
