export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #1e1b4b, #7c3aed, #1e1b4b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Testing Direct Component</h1>
        <p style={{ fontSize: '1.25rem' }}>If you see this, the page works without FamilyTreeLanding import!</p>
      </div>
    </div>
  );
}
