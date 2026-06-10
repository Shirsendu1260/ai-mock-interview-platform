import useAuthInitialization from "./hooks/useAuthInitialization.js";
import AppRoutes from "./routes/AppRoutes"

const App = () => {
  useAuthInitialization();
  return <AppRoutes />;
}

export default App
