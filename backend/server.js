const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const requestLogger = require("./middleware/requestLogger");

const Patient = require("./models/Patient");
const Doctor = require("./models/Doctor");
const Appointment = require("./models/Appointment");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// ===============================
// TASK 3 - REST API (UPDATED TO USE MONGODB)
// ===============================

// GET all appointments
app.get("/api/v1/appointments", async (req, res, next) => {
  try {
    const appointmentsList = await Appointment.find()
      .populate("patientId")
      .populate("doctorId");

    const formattedAppointments = appointmentsList.map((appt) => ({
      id: appt._id,
      patientName: appt.patientId ? appt.patientId.name : "Unknown Patient",
      doctorName: appt.doctorId ? appt.doctorId.name : "Unknown Doctor",
      date: appt.date,
      timeSlot: appt.timeSlot,
      status: appt.status,
      reason: appt.reason,
    }));

    res.status(200).json({
      success: true,
      data: formattedAppointments,
    });
  } catch (error) {
    next(error);
  }
});

// POST appointment
app.post("/api/v1/appointments", async (req, res, next) => {
  try {
    const {
      patientName,
      doctorName,
      date,
      timeSlot,
      status = "pending",
      reason = "",
    } = req.body;

    if (!patientName || !doctorName || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: "patientName, doctorName, date and timeSlot are required",
      });
    }

    // Find doctor by name (case-insensitive)
    let doctor = await Doctor.findOne({
      name: { $regex: new RegExp("^" + doctorName.trim() + "$", "i") },
    });

    if (!doctor) {
      // Create a doctor if not exists
      doctor = await Doctor.create({
        name: doctorName.trim(),
        specialisation: "General Physician",
        email: `${doctorName.trim().toLowerCase().replace(/\s+/g, "")}@medcare.com`,
        available: true,
      });
    }

    // Find patient by name (case-insensitive) or create
    let patient = await Patient.findOne({
      name: { $regex: new RegExp("^" + patientName.trim() + "$", "i") },
    });

    if (!patient) {
      patient = await Patient.create({
        name: patientName.trim(),
        email: `${patientName.trim().toLowerCase().replace(/\s+/g, "")}_${Date.now()}@example.com`,
      });
    }

    const appointment = await Appointment.create({
      patientId: patient._id,
      doctorId: doctor._id,
      date,
      timeSlot,
      status,
      reason,
    });

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: {
        id: appointment._id,
        patientName: patient.name,
        doctorName: doctor.name,
        date: appointment.date,
        timeSlot: appointment.timeSlot,
        status: appointment.status,
        reason: appointment.reason,
      },
    });
  } catch (error) {
    next(error);
  }
});

// PATCH update appointment status
app.patch("/api/v1/appointments/:id/status", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be pending, confirmed, or cancelled",
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Appointment status updated to ${status} successfully`,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
});

// GET doctors
app.get("/api/v1/doctors", async (req, res, next) => {
  try {
    const doctorsList = await Doctor.find();
    res.status(200).json({
      success: true,
      data: doctorsList.map((doc) => ({
        id: doc._id,
        name: doc.name,
        email: doc.email,
        specialisation: doc.specialisation,
        available: doc.available,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// ===============================
// TASK 5 - MONGODB
// ===============================

app.post("/api/v1/mongodb/patient", async (req, res, next) => {
  try {
    const patient = await Patient.create(req.body);

    res.status(201).json({
      success: true,
      message: "Patient created successfully",
      data: patient,
    });
  } catch (error) {
    next(error);
  }
});

// MongoDB doctor
app.post("/api/v1/mongodb/doctor", async (req, res, next) => {
  try {
    const doctor = await Doctor.create(req.body);

    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
});

// MongoDB appointment
app.post("/api/v1/mongodb/appointment", async (req, res, next) => {
  try {
    const appointment = await Appointment.create(req.body);

    res.status(201).json({
      success: true,
      message: "MongoDB appointment created successfully",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
});

// Get MongoDB patients
app.get("/api/v1/mongodb/patients", async (req, res, next) => {
  try {
    const patients = await Patient.find();

    res.status(200).json({
      success: true,
      data: patients,
    });
  } catch (error) {
    next(error);
  }
});

// ===============================
// GLOBAL ERROR HANDLER
// MUST BE LAST
// ===============================

app.use((err, req, res, next) => {
  console.error(err.message);

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(
      (error) => error.message
    );

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: messages,
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate value. Email must be unique.",
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// ===============================
// MONGODB CONNECTION
// ===============================

const seedDoctors = async () => {
  try {
    const count = await Doctor.countDocuments();
    if (count === 0) {
      const defaultDoctors = [
        {
          name: "Dr. Rahul Shah",
          email: "rahul@medcare.com",
          specialisation: "Cardiologist",
          available: true,
        },
        {
          name: "Dr. Priya Patel",
          email: "priya@medcare.com",
          specialisation: "Dermatologist",
          available: true,
        },
        {
          name: "Dr. Amit Mehta",
          email: "amit@medcare.com",
          specialisation: "Neurologist",
          available: false,
        },
      ];
      await Doctor.insertMany(defaultDoctors);
      console.log("Database seeded with default doctors.");
    }
  } catch (error) {
    console.error("Error seeding doctors:", error.message);
  }
};

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await seedDoctors();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });