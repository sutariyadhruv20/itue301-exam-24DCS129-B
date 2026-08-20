function AppointmentCard({
  id,
  patientName,
  doctorName,
  date,
  timeSlot,
  status,
  reason,
  onStatusChange,
}) {
  return (
    <div className="appointment-card">
      <div className="appointment-card-header">
        <h4>Appointment Details</h4>
        <span className={`status-badge ${status}`}>
          {status}
        </span>
      </div>

      <div className="appointment-grid">
        <div className="appointment-item">
          <label>Patient</label>
          <span>{patientName || "Not Entered"}</span>
        </div>
        <div className="appointment-item">
          <label>Doctor</label>
          <span>{doctorName || "Not Selected"}</span>
        </div>
        <div className="appointment-item">
          <label>Date</label>
          <span>{date || "Not Selected"}</span>
        </div>
        <div className="appointment-item">
          <label>Time Slot</label>
          <span>{timeSlot || "Not Selected"}</span>
        </div>

        {reason && (
          <div className="appointment-reason">
            <label>Reason for Visit</label>
            <p>{reason}</p>
          </div>
        )}

        {status === "pending" && onStatusChange && id && (
          <div className="appointment-actions" style={{ gridColumn: "1 / -1" }}>
            <button
              onClick={() => onStatusChange(id, "confirmed")}
              className="btn-action btn-action-confirm"
            >
              Confirm
            </button>
            <button
              onClick={() => onStatusChange(id, "cancelled")}
              className="btn-action btn-action-cancel"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AppointmentCard;