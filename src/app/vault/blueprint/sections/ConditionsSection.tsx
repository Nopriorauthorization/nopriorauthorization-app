import React, { useState } from "react";

export default function ConditionsSection() {
  const [collapsed, setCollapsed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [conditions, setConditions] = useState<string[]>([]);
  const [newCondition, setNewCondition] = useState("");

  function addCondition() {
    if (newCondition) {
      setConditions([...conditions, newCondition]);
      setNewCondition("");
    }
  }

  function removeCondition(idx: number) {
    setConditions(conditions.filter((_, i) => i !== idx));
  }

  return (
    <section className={`section conditions-section ${collapsed ? "collapsed" : "expanded"}`}>
      <header onClick={() => setCollapsed(!collapsed)}>
        <h2>Conditions & History</h2>
        <button>{collapsed ? "Expand" : "Collapse"}</button>
      </header>
      {!collapsed && (
        <div>
          {editing ? (
            <div>
              <ul>
                {conditions.map((c, i) => (
                  <li key={i}>{c} <button onClick={() => removeCondition(i)}>Remove</button></li>
                ))}
              </ul>
              <input value={newCondition} onChange={e => setNewCondition(e.target.value)} placeholder="Add condition" />
              <button onClick={addCondition}>Add</button>
              <button onClick={() => setEditing(false)}>Save</button>
            </div>
          ) : (
            <div>
              <ul>
                {conditions.length === 0 ? <li><em>Not provided</em></li> : conditions.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
              <button onClick={() => setEditing(true)}>Edit</button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
