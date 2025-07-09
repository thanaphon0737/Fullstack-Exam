import LogoutButton from "../ui/logout-button";
import CustomerClientPage from "../ui/dashboard/customer/customer-client-page";
import { getCurrentUser } from "@/lib/session";
import StaffClientPage from "../ui/dashboard/staff/staff-client-page";
import AdminClientPage from "../ui/dashboard/admin/admin-client-page";
export default async function DashboardPage() {
  const user = await getCurrentUser();
  if(!user){
    return <p>Please signIn</p>
  }
  return (
    <div>
      <h1>Dashboard</h1>
      {user.role === 'customer' &&<CustomerClientPage user={user} /> }
      {user.role === 'staff' &&<StaffClientPage user={user} /> }
      {user.role === 'admin' &&<AdminClientPage user={user} /> }
      <LogoutButton />
    </div>
  );
}
