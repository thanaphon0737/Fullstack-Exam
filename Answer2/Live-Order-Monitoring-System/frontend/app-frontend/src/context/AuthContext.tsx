"use client";
import { deleteSession } from "@/lib/session";
import { apiLogin,apiGetProfile,apiLogout,apiRegister } from "@/services/api";
import React, { createContext, useContext, useState, ReactNode } from "react";
interface UserPayload {
    sub: string;
    email: string;
    role: string;
}
interface AuthContextType {
  user: UserPayload | null;
  isAuthenticated: boolean;
  login: (credential: {email:string,password:string}) => Promise<void>;
  register: (credential: {email:string,password:string}) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: UserPayload | null;
}) => {
  const [user, setUser] = useState<UserPayload | null>(initialUser);
  const register = async (credentials: { email: string; password: string }) => {
    // 1. Call the register API.
    const response = await apiRegister(credentials);

    // 2. The response now contains the user data directly.
    // const newUserProfile = response?.data as {sub:string; email:string; role:string};

    // // 3. Update the client-side state immediately.
    // setUser(newUserProfile);
  };
  const login = async (credentials: {email: string, password: string}) => {
    try{

        const responseLogin = await apiLogin(credentials);

        // Assert the type of responseLogin.data
        const data = responseLogin.data as { access_token: string };
        const token = data.access_token;
        const response = await apiGetProfile(token);
        const userProfile = response.data as { id: string; email: string; role: string };
        const userDTO: UserPayload = {
          sub: userProfile.id,
          email: userProfile.email,
          role: userProfile.role
        }
        setUser(userDTO)
    }catch(err: any){
        console.error(err)
    }
  };

  const logout = async () => {
    deleteSession()
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout,register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context == undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
