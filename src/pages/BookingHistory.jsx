// src/pages/BookingHistory.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../componet/navbar";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useSubscription } from "../hooks/useSubscription";
import SubscriptionBanner from "../componet/SubscriptionBanner";

const BookingHistory = () => {
  const navigate = useNavigate();
  const { isPro, loading: subLoading } = useSubscription();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/");
      return;
    }

    const fetchBookings = async () => {
      const q = query(
        collection(db, "appointments"),
        where("patientId", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const snapshot = await getDocs(q);
      const bookingList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(bookingList);
      setLoading(false);
    };
    fetchBookings();
  }, [navigate]);

  if (subLoading) return <div className="loading-screen">Loading...</div>;

  if (!isPro()) {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f7ea" }}>
        <Navbar />
        <SubscriptionBanner />
      </div>
    );
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return "Pending";
    return new Date(timestamp.toDate()).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7ea" }}>
      <Navbar />

      <div style={{ maxWidth: "1000px", margin: "60px auto", padding: "0 20px" }}>
        <h1 style={{ fontSize: "40px", fontWeight: "bold", color: "#2e7d32", textAlign: "center", marginBottom: "60px" }}>
          📅 Your Appointment History
        </h1>

        {loading ? (
          <p style={{ textAlign: "center", fontSize: "20px", color: "#4caf50" }}>Loading...</p>
        ) : bookings.length === 0 ? (
          <div style={{
            background: "white",
            borderRadius: "32px",
            padding: "80px",
            textAlign: "center",
            boxShadow: "0 15px 45px rgba(0,0,0,0.1)",
          }}>
            <div style={{ fontSize: "100px", marginBottom: "30px" }}>📅</div>
            <p style={{ fontSize: "22px", color: "#666" }}>
              No appointments yet. Book your first consultation today!
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            {bookings.map((booking) => (
              <div
                key={booking.id}
                style={{
                  background: "white",
                  borderRadius: "32px",
                  padding: "40px",
                  boxShadow: "0 15px 45px rgba(0,0,0,0.1)",
                  borderLeft: "8px solid #81c784",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ fontSize: "26px", color: "#2e7d32", margin: "0 0 10px 0" }}>
                      {booking.doctorName}
                    </h3>
                    <p style={{ fontSize: "18px", color: "#4caf50", margin: "0 0 10px 0" }}>
                      {booking.date} at {booking.time}
                    </p>
                    <p style={{ fontSize: "16px", color: "#33691e", lineHeight: "1.6" }}>
                      Reason: {booking.reason}
                    </p>
                  </div>
                  <div style={{
                    padding: "12px 24px",
                    background: booking.status === "pending" ? "#fff59d" : "#c8e6c9",
                    color: booking.status === "pending" ? "#f57f17" : "#2e7d32",
                    borderRadius: "30px",
                    fontSize: "16px",
                    fontWeight: "600",
                  }}>
                    {booking.status.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;