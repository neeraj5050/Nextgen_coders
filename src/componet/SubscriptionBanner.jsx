import React from "react";
import { useNavigate } from "react-router-dom";

const SubscriptionBanner = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.banner}>
      <h2 style={styles.title}>🔒 Pro Feature</h2>
      <p style={styles.text}>This feature is only available for Pro members</p>
      <button onClick={() => navigate("/subscription")} style={styles.button}>
        Upgrade to Pro
      </button>
    </div>
  );
};

const styles = {
  banner: {
    backgroundColor: "#fff3cd",
    border: "2px solid #ffc107",
    borderRadius: "10px",
    padding: "40px",
    textAlign: "center",
    margin: "40px auto",
    maxWidth: "500px",
  },
  title: {
    color: "#856404",
    marginBottom: "10px",
    fontSize: "24px",
  },
  text: {
    color: "#856404",
    marginBottom: "20px",
    fontSize: "16px",
  },
  button: {
    padding: "12px 30px",
    backgroundColor: "#6c63ff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
};

export default SubscriptionBanner;
