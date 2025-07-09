import { Container } from "@mui/material";
import Navbar from "../ui/dashboard/navbar";
import { getCurrentUser } from "@/lib/session";
export default async function Layout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();
    if(!user){
    return <p>Please signIn</p>
  }
  return (
    <div className="h-screen">
      <Navbar user={user}/>
      <Container >
        <div className="flex justify-center py-10">{children}</div>
      </Container>
    </div>
  );
}
