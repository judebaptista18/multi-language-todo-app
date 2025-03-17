import AuthButton from "../components/AuthButton";
import Providers from "../Provider";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AuthButton />
          {children}
        </Providers>
      </body>
    </html>
  );
}
