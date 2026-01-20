import React, { useState } from "react";

export default function TopConcernsSection() {
  const [collapsed, setCollapsed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [newConcern, setNewConcern] = useState("");

  function addConcern() {
    if (newConcern) {
      setConcerns([...concerns, newConcern]);
      setNewConcern("");
    }
  }

  function removeConcern(idx: number) {
    setConcerns(concerns.filter((_, i) => i !== idx));
  }

  return (
    <section className={`section top-concerns-section ${collapsed ? "collapsed" : "expanded"}`}>
      <header onClick={() => setCollapsed(!collapsed)}>
        <h2>Top Concerns</h2>
        <button>{collapsed ? "Expand" : "Collapse"}</button>
      </header>
      {!collapsed && (
        <div>
          {editing ? (
            <div>
              <ul>
                {concerns.map((c, i) => (
                  <li key={i}>{c} <button onClick={() => removeConcern(i)}>Remove</button></li>
                ))}
              </ul>
              <input value={newConcern} onChange={e => setNewConcern(e.target.value)} placeholder="Add concern" />
              <button onClick={addConcern}>Add</button>
              <button onClick={() => setEditing(false)}>Save</button>
            </div>
          ) : (
            <div>
              <ul>
                {concerns.length === 0 ? <li><em>Not provided</em></li> : concerns.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
              <button onClick={() => setEditing(true)}>Edit</button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
