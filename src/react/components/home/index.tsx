import React from "react";

const App = () => {
  // Dati per l'elenco di attività
  const activities = [
    { id: 1, task: "Inviare report mensile" },
    { id: 2, task: "Chiamare il cliente X" },
    { id: 3, task: "Aggiornare il database" },
  ];

  return (
    <div style={styles.dashboardContainer}>
      <h1 style={styles.header}>Dashboard</h1>
      <div style={styles.content}>
        {/* Statistiche */}
        <div style={styles.statsContainer}>
          <div style={styles.statBox}>
            <h3 style={styles.statTitle}>Vendite totali</h3>
            <p style={styles.statValue}>$50,000</p>
          </div>
          <div style={styles.statBox}>
            <h3 style={styles.statTitle}>Clienti attivi</h3>
            <p style={styles.statValue}>120</p>
          </div>
          <div style={styles.statBox}>
            <h3 style={styles.statTitle}>Compiti completati</h3>
            <p style={styles.statValue}>8/10</p>
          </div>
        </div>

        {/* Elenco attività */}
        <div style={styles.activitiesContainer}>
          <h3 style={styles.sectionTitle}>Attività recenti</h3>
          <ul style={styles.activityList}>
            {activities.map((activity) => (
              <li key={activity.id} style={styles.activityItem}>
                {activity.task}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;

// Stili definiti come oggetti JavaScript
const styles = {
  dashboardContainer: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    backgroundColor: "#f4f4f9",
    minHeight: "100vh",
  },
  header: {
    textAlign: "center",
    color: "#333",
  },
  content: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  statsContainer: {
    display: "flex",
    gap: "20px",
    justifyContent: "space-between",
  },
  statBox: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  statTitle: {
    margin: "0 0 10px",
    fontSize: "16px",
    color: "#555",
  },
  statValue: {
    margin: "0",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
  },
  activitiesContainer: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  sectionTitle: {
    marginBottom: "10px",
    fontSize: "18px",
    color: "#333",
  },
  activityList: {
    listStyleType: "none",
    padding: "0",
  },
  activityItem: {
    backgroundColor: "#f9f9f9",
    marginBottom: "5px",
    padding: "10px",
    borderRadius: "4px",
  },
};