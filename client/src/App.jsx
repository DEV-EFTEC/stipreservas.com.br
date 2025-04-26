import { useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";

export default function App() {
  const navigate = useNavigate();

  return (
    <section>
      <Button onClick={() => navigate("/signin")}>Go to login</Button>
    </section>
  )
}