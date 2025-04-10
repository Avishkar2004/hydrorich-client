import AppRouter from "./Router/Router.jsx";
import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <div className="overflow-hidden">
      <AppRouter />
      <Analytics />
    </div>
  );
}

export default App;
