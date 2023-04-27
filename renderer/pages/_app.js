import '../styles/globals.css'
import { ThemeProvider } from "@material-tailwind/react";

export default function App({ Component, pageProps }) {

    const theme = {
        typography: {
          styles: {
            variants: {
              small: {
                fontSize: "text-sm",
                fontWeight: "font-normal"
              },
            },
          },
        },
      };

    return (
        <ThemeProvider value={theme}>
            <Component {...pageProps} />
        </ThemeProvider>
    );
}