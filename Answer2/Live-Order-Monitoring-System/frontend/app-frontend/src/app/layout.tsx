import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="en">
      <body>
        <AuthProvider >
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
