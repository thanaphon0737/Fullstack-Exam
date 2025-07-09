import { Container } from "@mui/material";
import Navbar from "../ui/dashboard/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen">
      <Navbar />
      <Container maxWidth="md">
        <div className="flex justify-center py-10">{children}</div>
      </Container>
    </div>
  );
}
