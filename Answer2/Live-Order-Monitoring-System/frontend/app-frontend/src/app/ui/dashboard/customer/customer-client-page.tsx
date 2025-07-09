"use client";

import OrderForm from "./order-form";

interface UserPayload {
  sub: string;
  email: string;
  role: string;
}
function CustomerClientPage({ user }: { user: UserPayload }) {
  return (
    <div>
      <h1>Welcome, {user.email}!</h1>
      <p>Your user ID is: {user.sub}</p>
      <p>Your role is: {user.role}</p>
      <OrderForm user={user}/>
    </div>
  )
}
export default CustomerClientPage