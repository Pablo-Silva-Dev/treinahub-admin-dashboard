import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import Routes from "./routes";
import { useThemeStore } from "./store/theme";
import "./styles/globals.css";

const queryClient = new QueryClient();

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    if (theme) {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full overflow-hidden mr-5">
        <Routes />
      </div>
    </QueryClientProvider>
  );
}

export default App;
