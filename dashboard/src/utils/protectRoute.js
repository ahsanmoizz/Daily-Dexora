import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Reusable hook to protect routes from unauthenticated access
export default function useProtectRoute() {
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem("dev_id");
    if (!id) {
      navigate("/login");
    }
  }, [navigate]);
}
