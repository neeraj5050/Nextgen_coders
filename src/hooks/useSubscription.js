import { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export const useSubscription = () => {
  const [subscription, setSubscription] = useState("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
          if (userDoc.exists()) {
            setSubscription(userDoc.data().subscription || "free");
          }
        } catch (error) {
          console.error("Error fetching subscription:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSubscription();
  }, []);

  const isPro = () => subscription === "pro";
  const isFree = () => subscription === "free";

  return { subscription, loading, isPro, isFree };
};
