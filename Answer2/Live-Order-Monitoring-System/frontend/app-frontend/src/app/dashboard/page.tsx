import LogoutButton from "../ui/logout-button";
import CustomerClientPage from "../ui/dashboard/customer/customer-client-page";
import { getCurrentUser } from "@/lib/session";
export default async function DashboardPage() {
  const user = await getCurrentUser();
  if(!user){
    return <p>Please signIn</p>
  }
  return (
    <div>
      <h1>Dashboard</h1>
      <CustomerClientPage user={user} />
      <LogoutButton />
    </div>
  );
}
