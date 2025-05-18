"use client";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8f00ff",
    },
    secondary: {
      main: "#00ffd0",
    },
    background: {
      default: "#181c23",
      paper: "#232733",
    },
    text: {
      primary: "#fff",
      secondary: "#c9b3e5",
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: ["Inter", "Nunito", "Roboto", "Arial", "sans-serif"].join(","),
    h4: {
      fontWeight: 700,
      letterSpacing: "0.01em",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: "0 4px 32px rgba(143, 0, 255, 0.15)",
          background: "#292e3c",
        },
      },
    },
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <ApolloProvider client={client}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Navbar />
            <Toaster
              position="bottom-right"
              reverseOrder={false}
              toastOptions={{
                style: {
                  background: "#232733", // adapte pour le dark
                  color: "#fff",
                  borderRadius: "12px",
                  fontSize: "1.05rem",
                },
              }}
            />
            {children}
          </ThemeProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
