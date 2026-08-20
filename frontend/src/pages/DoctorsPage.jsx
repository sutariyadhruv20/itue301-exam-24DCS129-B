import { useEffect, useState } from "react";

function DoctorsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError("");
        
        const response = await fetch("http://localhost:5000/api/v1/doctors");
        if (!response.ok) {
          throw new Error("Failed to fetch doctors from MongoDB server.");
        }
        
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          throw new Error(result.message || "Failed to load doctors.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = data.filter((doctor) => {
    const query = search.toLowerCase();
    return (
      doctor.name.toLowerCase().includes(query) ||
      doctor.specialisation.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="page">
        <div className="status-container">
          <div className="spinner"></div>
          <h2>Loading doctors...</h2>
          <p>Please make sure your backend server and MongoDB are running.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="status-container">
          <div className="error-message">⚠️ Error: {error}</div>
          <p style={{ marginTop: "1rem" }}>
            Check connection to <code>http://localhost:5000</code> or verify if backend is running.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Meet Our Specialists</h1>
        <p>Book a consultation with our experienced clinical professionals.</p>
      </div>

      <div className="doctors-search">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search doctor by name or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredDoctors.length === 0 ? (
        <div style={{ padding: "2rem", color: "var(--text-muted)" }}>
          No doctors match your search query.
        </div>
      ) : (
        <div className="doctors-grid">
          {filteredDoctors.map((doctor) => (
            <div className="doctor-card" key={doctor.id || doctor._id}>
              <div className="doctor-header">
                <div className="doctor-avatar">
                  {doctor.name
                    .split(" ")
                    .filter((n) => n.toLowerCase() !== "dr.")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="doctor-info">
                  <h3>{doctor.name}</h3>
                  <span className="badge badge-specialty">
                    {doctor.specialisation}
                  </span>
                </div>
              </div>

              <div className="doctor-details">
                <div className="detail-item">
                  <strong>Availability:</strong>
                  <span
                    className={`badge badge-status ${
                      doctor.available ? "available" : "unavailable"
                    }`}
                  >
                    {doctor.available ? "Available" : "Not Available"}
                  </span>
                </div>
                {doctor.email && (
                  <div className="detail-item">
                    <strong>Email:</strong>
                    <span>{doctor.email}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DoctorsPage;