// Fetch the Logged-in User

import axios from "axios";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/auth/user", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);
  console.log(user);
  return user;
};
