"use client"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { Button } from "@mui/material"
export default function LogoutButton() {
    const {logout, isAuthenticated} = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try{
            await logout();

            router.push('/login');
        }catch(err: any){
            console.error('Failed to logout', err)
        }
    }

    if(!isAuthenticated){
        return null;
    }

    return (
        <Button size="small" color="secondary" variant="contained" onClick={handleLogout}>
            Logout
        </Button>
    )
}