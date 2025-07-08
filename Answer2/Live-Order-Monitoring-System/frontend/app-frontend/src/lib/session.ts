"use server";
import { cookies } from "next/headers";
import * as jwt from "jsonwebtoken";

interface UserPayload {
  sub: string;
  email: string;
  role: string;
}

export async function getCurrentUser(): Promise<UserPayload | null> {
//   if (typeof window === "undefined") {
//     return null;
//   }

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
    return { sub: decoded.sub, email: decoded.email, role: decoded.role };
  } catch (error) {
    console.error("Invalid token: ", error);
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
}
