import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="page">
      <div className="hero">
        <h1>MedCare Plus Hospital</h1>
        <p>
          Experience next-generation healthcare administration. Seamlessly search specialists, view schedules, and book appointments online.
        </p>
        <div className="hero-actions">
          <Link to="/booking" className="btn btn-primary">
            Book Appointment
          </Link>
          <Link to="/doctors" className="btn btn-outline">
            Meet Our Doctors
          </Link>
        </div>
      </div>

      <div className="page-header">
        <h2>Why Choose MedCare Plus?</h2>
        <p>We combine advanced medical technology with human-centric caring services.</p>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🧑‍⚕️</div>
          <h3>Specialized Doctors</h3>
          <p>
            Connect with board-certified specialists across Cardiology, Dermatology, Neurology, and more.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📅</div>
          <h3>Easy Booking</h3>
          <p>
            Schedule your appointments instantly. Select your preferred date, time slot, and check doctor availability.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Real-Time Sync</h3>
          <p>
            Powered by a fast MongoDB cloud database, ensuring your slots are secured and updated instantly.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;