

// import AgentDashboard from "./components/AgentDashboard";

import { AccordionProvider } from "./context/AccordionContext";
import AllRoutes from "./routes/AllRoutes";

function App() {
  return (
    <div>
      <AccordionProvider>
      <AllRoutes/>
      </AccordionProvider>
    </div>
  );
}

export default App;
