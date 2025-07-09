"use client";
interface UserPayload {
  sub: string;
  email: string;
  role: string;
}
function StaffClientPage({ user }: { user: UserPayload }) {
  return (
    <div><h1>Welcome, {user.email}!</h1>
      <p>Your user ID is: {user.sub}</p>
      <p>Your role is: {user.role}</p>
      </div>
  )
}
export default StaffClientPage