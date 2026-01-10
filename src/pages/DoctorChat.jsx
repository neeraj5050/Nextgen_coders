// src/pages/BookDoctor.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../componet/navbar";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useSubscription } from "../hooks/useSubscription";
import SubscriptionBanner from "../componet/SubscriptionBanner";
import { toast } from "react-toastify";

// Default Doctors
const defaultDoctors = [
  {
    id: "doc1",
    name: "Dr. Sarah Mitchell",
    specialty: "Clinical Psychologist",
    experience: "12 years",
    bio: "Specializes in anxiety, depression, and mindfulness therapy. Warm and empathetic.",
    rating: 4.9,
    avatar: "👩‍⚕️",
  },
  {
    id: "doc2",
    name: "Dr. Rajesh Kumar",
    specialty: "Psychiatrist",
    experience: "15 years",
    bio: "Expert in mood disorders and holistic care.",
    rating: 4.8,
    avatar: "👨‍⚕️",
  },
  {
    id: "doc3",
    name: "Dr. Priya Sharma",
    specialty: "Counseling Psychologist",
    experience: "10 years",
    bio: "Helps with stress, relationships, and self-esteem.",
    rating: 5.0,
    avatar: "👩‍⚕️",
  },
];

const BookDoctor = () => {
  const navigate = useNavigate();
  const { isPro, loading } = useSubscription();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [booking, setBooking] = useState(false);

  if (!auth.currentUser) {
    navigate("/");
    return null;
  }

  if (loading) return <div className="loading-screen">Loading...</div>;

  if (!isPro()) {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f7ea" }}>
        <Navbar />
        <SubscriptionBanner />
      </div>
    );
  }

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!date || !time || !reason.trim()) {
      toast.warning("Please fill all fields.");
      return;
    }

    setBooking(true);
    try {
      await addDoc(collection(db, "appointments"), {
        patientId: auth.currentUser.uid,
        patientName: auth.currentUser.displayName || "Patient",
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        date,
        time,
        reason: reason.trim(),
        status: "pending",
        timestamp: serverTimestamp(),
      });
      toast.success(`Appointment booked with ${selectedDoctor.name}! 🌿`);
      setSelectedDoctor(null);
      setDate("");
      setTime("");
      setReason("");
    } catch (error) {
      toast.error("Failed to book. Try again.");
    } finally {
      setBooking(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7ea" }}>
      <Navbar />

      <div style={{ maxWidth: "1200px", margin: "60px auto", padding: "0 20px" }}>
        {/* Header with History Button */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "60px",
        }}>
          <div>
            <h1 style={{ fontSize: "42px", fontWeight: "bold", color: "#2e7d32" }}>
              👩‍⚕️ Book a Consultation
            </h1>
            <p style={{ fontSize: "20px", color: "#4caf50", marginTop: "10px" }}>
              Choose a specialist who understands you
            </p>
          </div>

          {/* Appointment History Button */}
          <Link to="/bookinghistory">
            <button style={{
              padding: "16px 40px",
              background: "#81c784",
              color: "white",
              border: "none",
              borderRadius: "30px",
              fontSize: "18px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 8px 25px rgba(129,199,132,0.3)",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => e.target.style.background = "#66bb6a"}
            onMouseLeave={(e) => e.target.style.background = "#81c784"}
            >
              📅 View Appointment History
            </button>
          </Link>
        </div>

        {/* Doctor Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "40px",
        }}>
          {defaultDoctors.map((doctor) => (
            <div
              key={doctor.id}
              style={{
                background: "white",
                borderRadius: "32px",
                padding: "50px 40px",
                textAlign: "center",
                boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
                borderLeft: "8px solid #81c784",
                transition: "transform 0.4s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-15px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ fontSize: "100px", marginBottom: "30px" }}>
                {doctor.avatar}
              </div>
              <h3 style={{ fontSize: "28px", color: "#2e7d32", margin: "0 0 16px 0" }}>
                {doctor.name}
              </h3>
              <p style={{ fontSize: "19px", color: "#4caf50", fontWeight: "600" }}>
                {doctor.specialty}
              </p>
              <p style={{ fontSize: "16px", color: "#666", margin: "10px 0" }}>
                {doctor.experience} • ⭐ {doctor.rating}
              </p>
              <p style={{ fontSize: "17px", color: "#33691e", lineHeight: "1.7", margin: "20px 0 40px" }}>
                {doctor.bio}
              </p>

              <button
                onClick={() => setSelectedDoctor(doctor)}
                style={{
                  padding: "18px 60px",
                  background: "#4caf50",
                  color: "white",
                  border: "none",
                  borderRadius: "30px",
                  fontSize: "20px",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 10px 30px rgba(76,175,80,0.3)",
                }}
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedDoctor && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.75)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: "white",
            borderRadius: "32px",
            padding: "50px",
            maxWidth: "600px",
            width: "90%",
            boxShadow: "0 30px 80px rgba(0,0,0,0.3)",
            textAlign: "center",
            position: "relative",
          }}>
            <button
              onClick={() => setSelectedDoctor(null)}
              style={{
                position: "absolute",
                top: "20px",
                right: "30px",
                background: "none",
                border: "none",
                fontSize: "36px",
                color: "#999",
                cursor: "pointer",
              }}
            >
              ×
            </button>

            <h3 style={{ fontSize: "30px", color: "#2e7d32", marginBottom: "40px" }}>
              Book with {selectedDoctor.name}
            </h3>

            <form onSubmit={handleBooking}>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
                style={{
                  width: "100%",
                  padding: "16px",
                  marginBottom: "20px",
                  borderRadius: "20px",
                  border: "2px solid #a5d6a7",
                  fontSize: "17px",
                }}
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "16px",
                  marginBottom: "20px",
                  borderRadius: "20px",
                  border: "2px solid #a5d6a7",
                  fontSize: "17px",
                }}
              />
              <textarea
                placeholder="Reason for consultation..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows="4"
                required
                style={{
                  width: "100%",
                  padding: "16px",
                  marginBottom: "30px",
                  borderRadius: "20px",
                  border: "2px solid #a5d6a7",
                  fontSize: "17px",
                  resize: "none",
                }}
              />
              <button
                type="submit"
                disabled={booking}
                style={{
                  padding: "18px 70px",
                  background: "#4caf50",
                  color: "white",
                  border: "none",
                  borderRadius: "30px",
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                {booking ? "Booking..." : "Confirm Booking"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDoctor; 