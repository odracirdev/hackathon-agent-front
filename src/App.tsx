// biome-ignore assist/source/organizeImports: <explanation>
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export default function App() {
  // Minimal router landing page: redirect root path to /agents.
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
	if (location.pathname === "/") {
	  navigate("/agents", { replace: true });
	}
  }, [location.pathname, navigate]);

  return null;
}

