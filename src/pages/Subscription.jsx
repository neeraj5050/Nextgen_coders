import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Subscription = () => {
  const [currentPlan, setCurrentPlan] = useState("free");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      features: [
        "Basic mood tracking",
        "Limited journal entries (2/week)",
        "Basic chatbot access (10 messages/day)",
        "Music therapy",
        "Relaxation exercises",
        "Help resources"
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: "₹29/month",
      popular: true,
      features: [
        "Everything in Free",
        "Unlimited journal entries",
        "Unlimited AI chatbot",
        "Doctor consultations",
        "Booking history",
        "Priority support",
        "Personalized therapy plans",
        "Ad-free experience"
      ],
    },
  ];

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (userDoc.exists()) {
        setCurrentPlan(userDoc.data().subscription || "free");
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan) => {
    if (plan.id === "free") {
      await updateSubscription(plan.id, null);
      return;
    }

    // Razorpay payment for Pro plan
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_dummy", // Replace with your key
      amount: 2900, // Amount in paise (2900 = ₹29)
      currency: "INR",
      name: "MindCare",
      description: `${plan.name} Subscription - Monthly`,
      image: "/logo192.png",
      handler: async function (response) {
        // Payment successful
        await updateSubscription(plan.id, response.razorpay_payment_id);
      },
      prefill: {
        name: auth.currentUser.displayName || "",
        email: auth.currentUser.email || "",
      },
      theme: {
        color: "#6c63ff",
      },
      modal: {
        ondismiss: function() {
          console.log("Payment cancelled by user");
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const updateSubscription = async (planId, paymentId) => {
    try {
      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        {
          subscription: planId,
          subscriptionDate: new Date(),
          paymentId: paymentId,
          lastPaymentDate: paymentId ? new Date() : null,
        },
        { merge: true }
      );
      setCurrentPlan(planId);
      toast.success(`Successfully subscribed to ${planId} plan! 🎉`);
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast.error("Failed to update subscription. Please contact support.");
    }
  };

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/home")} style={styles.backBtn}>
        ← Back to Home
      </button>
      <h1 style={styles.title}>Choose Your Plan</h1>
      <p style={styles.subtitle}>Upgrade to Pro for full access to all mental health features</p>
      <div style={styles.plansContainer}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              ...styles.planCard,
              ...(currentPlan === plan.id ? styles.activePlan : {}),
              ...(plan.popular ? styles.popularPlan : {}),
            }}
          >
            {plan.popular && <div style={styles.popularBadge}>Most Popular</div>}
            {currentPlan === plan.id && <div style={styles.badge}>Current Plan</div>}
            <h2 style={styles.planName}>{plan.name}</h2>
            <p style={styles.price}>{plan.price}</p>
            <ul style={styles.featureList}>
              {plan.features.map((feature, idx) => (
                <li key={idx} style={styles.feature}>
                  ✓ {feature}
                </li>
              ))}
            </ul>
            {currentPlan === plan.id ? (
              <button style={styles.currentBtn}>Active Plan</button>
            ) : (
              <button
                onClick={() => handleSubscribe(plan.id)}
                style={styles.subscribeBtn}
              >
                {plan.id === "free" ? "Switch to Free" : "Upgrade to Pro"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1000px",
    margin: "0 auto",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  },
  backBtn: {
    padding: "10px 20px",
    backgroundColor: "#6c63ff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "20px",
    fontSize: "14px",
  },
  title: {
    textAlign: "center",
    color: "#333",
    fontSize: "32px",
    marginBottom: "10px",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "40px",
  },
  plansContainer: {
    display: "flex",
    gap: "30px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  planCard: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    width: "350px",
    textAlign: "center",
    position: "relative",
    transition: "transform 0.3s",
  },
  activePlan: {
    border: "3px solid #6c63ff",
    transform: "scale(1.05)",
  },
  popularPlan: {
    border: "2px solid #ffc107",
  },
  badge: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#6c63ff",
    color: "white",
    padding: "5px 10px",
    borderRadius: "5px",
    fontSize: "12px",
  },
  popularBadge: {
    position: "absolute",
    top: "-15px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#ffc107",
    color: "#333",
    padding: "5px 15px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  planName: {
    color: "#6c63ff",
    marginBottom: "10px",
    fontSize: "24px",
    marginTop: "10px",
  },
  price: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  },
  featureList: {
    listStyle: "none",
    padding: 0,
    marginBottom: "20px",
    textAlign: "left",
  },
  feature: {
    padding: "8px 0",
    color: "#666",
    fontSize: "14px",
  },
  subscribeBtn: {
    padding: "12px 30px",
    backgroundColor: "#6c63ff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    width: "100%",
  },
  currentBtn: {
    padding: "12px 30px",
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "not-allowed",
    fontSize: "16px",
    width: "100%",
  },
};

export default Subscription;
