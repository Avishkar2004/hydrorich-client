// Fetch the Logged-in User

import axios from "axios";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/auth/user", { 
        withCredentials: true 
      });
      console.log("Auth User Data:", res.data); //Debug log
      setUser(res.data);
    } catch (error) {
      console.error("Auth Error:", error); // Debug log
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, refetchUser: fetchUser };
};
