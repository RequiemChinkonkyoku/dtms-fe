import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./assets/styles/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Your app components go here */}
    </ThemeProvider>
  );
}

export default App;
