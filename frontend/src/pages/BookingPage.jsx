import { useEffect, useState } from "react";
import AppointmentCard from "../components/AppointmentCard";

function BookingPage() {
  // Task 2 - State management: form state
  const [form, setForm] = useState({
    patientName: "",
    doctorName: "",
    date: "",
    timeSlot: "",
    reason: "",
  });

  // Task 2 - Meaningful second state value: selected doctor object
  const [selectedDoctorObject, setSelectedDoctorObject] = useState(null);

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  // Fetch doctors and appointments on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoadingDoctors(true);
        
        // Fetch Doctors
        const docRes = await fetch("http://localhost:5000/api/v1/doctors");
        if (docRes.ok) {
          const docData = await docRes.json();
          setDoctors(docData.data || []);
        }

        // Fetch Appointments
        const apptRes = await fetch("http://localhost:5000/api/v1/appointments");
        if (apptRes.ok) {
          const apptData = await apptRes.json();
          setAppointments(apptData.data || []);
        }
      } catch (err) {
        console.error("Error loading initial data:", err);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle doctor select change and update the second state value (selectedDoctorObject)
  const handleDoctorChange = (e) => {
    const docName = e.target.value;
    setForm((prev) => ({
      ...prev,
      doctorName: docName,
    }));

    const foundDoctor = doctors.find((d) => d.name === docName);
    setSelectedDoctorObject(foundDoctor || null);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    try {
      const response = await fetch("http://localhost:5000/api/v1/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to book appointment.");
      }

      showToast("🎉 Appointment booked successfully in MongoDB!");
      
      // Reset form & selected doctor preview
      setForm({
        patientName: "",
        doctorName: "",
        date: "",
        timeSlot: "",
        reason: "",
      });
      setSelectedDoctorObject(null);

      // Re-fetch appointments to update list
      const apptRes = await fetch("http://localhost:5000/api/v1/appointments");
      if (apptRes.ok) {
        const apptData = await apptRes.json();
        setAppointments(apptData.data || []);
      }
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/appointments/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update appointment status.");
      }

      showToast(`🎉 Appointment status updated to ${newStatus}!`);

      // Update the local state directly
      setAppointments((prev) =>
        prev.map((appt) =>
          (appt.id === id || appt._id === id) ? { ...appt, status: newStatus } : appt
        )
      );
    } catch (error) {
      showToast(`⚠️ Error: ${error.message}`);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Appointment Booking Dashboard</h1>
        <p>Fill out the form below to register a patient and confirm a doctor slot.</p>
      </div>

      <div className="booking-container">
        {/* Left Side: Booking Form */}
        <div className="card-panel">
          <h2>New Booking</h2>
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <label htmlFor="patientName">Patient Name</label>
              <input
                type="text"
                id="patientName"
                name="patientName"
                className="form-input"
                placeholder="Enter patient full name"
                value={form.patientName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="doctorName">Doctor Name</label>
              {loadingDoctors ? (
                <select className="form-input" disabled>
                  <option>Loading doctors list...</option>
                </select>
              ) : (
                <select
                  id="doctorName"
                  name="doctorName"
                  className="form-input"
                  value={form.doctorName}
                  onChange={handleDoctorChange}
                  required
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map((doc) => (
                    <option key={doc.id || doc._id} value={doc.name}>
                      {doc.name} ({doc.specialisation})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Displaying selected doctor state info */}
            {selectedDoctorObject && (
              <div className="info-banner">
                📌 <strong>{selectedDoctorObject.name}</strong> is a specialist in{" "}
                <strong>{selectedDoctorObject.specialisation}</strong>.
                Availability status: <em>{selectedDoctorObject.available ? "Available" : "Not Available"}</em>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="date">Appointment Date</label>
              <input
                type="date"
                id="date"
                name="date"
                className="form-input"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="timeSlot">Time Slot</label>
              <select
                id="timeSlot"
                name="timeSlot"
                className="form-input"
                value={form.timeSlot}
                onChange={handleChange}
                required
              >
                <option value="">Select Time Slot</option>
                <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="reason">Reason for Appointment (optional)</label>
              <textarea
                id="reason"
                name="reason"
                className="form-input"
                rows="3"
                placeholder="Brief reason for visit (max 300 characters)"
                maxLength="310"
                value={form.reason}
                onChange={handleChange}
              />
              <span className={`form-char-count ${form.reason.length > 300 ? "warning" : ""}`}>
                {form.reason.length}/300
              </span>
            </div>

            {submitError && <div className="error-message" style={{ fontSize: "0.9rem" }}>⚠️ {submitError}</div>}

            <button type="submit" className="btn btn-server" style={{ marginTop: "0.5rem" }}>
              Confirm Booking
            </button>
          </form>
        </div>

        {/* Right Side: Previews & Existing Bookings */}
        <div>
          {/* Live Preview Card */}
          <div className="preview-container">
            <span className="live-badge">Live Form Preview</span>
            <AppointmentCard
              patientName={form.patientName}
              doctorName={form.doctorName}
              date={form.date}
              timeSlot={form.timeSlot}
              status="pending"
              reason={form.reason}
            />
          </div>

          {/* Booked Appointments List */}
          <div className="card-panel">
            <h2>Booked Appointments ({appointments.length})</h2>
            {appointments.length === 0 ? (
              <div style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
                No appointments registered in MongoDB database yet.
              </div>
            ) : (
              <div className="appointments-list">
                {appointments.slice().reverse().map((appt) => (
                  <AppointmentCard
                    key={appt.id || appt._id}
                    id={appt.id || appt._id}
                    patientName={appt.patientName}
                    doctorName={appt.doctorName}
                    date={appt.date}
                    timeSlot={appt.timeSlot}
                    status={appt.status}
                    reason={appt.reason}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && <div className="toast-msg">{toastMessage}</div>}
    </div>
  );
}

export default BookingPage;