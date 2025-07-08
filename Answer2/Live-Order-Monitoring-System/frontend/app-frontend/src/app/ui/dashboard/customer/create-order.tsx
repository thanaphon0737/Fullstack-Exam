"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Grid } from "@mui/material";
import Link from "next/link";
import { apiCreateOrder } from "@/services/api";
interface UserPayload {
  sub: string;
  email: string;
  role: string;
}
function OrderForm({ user }: { user: UserPayload }) {
  const [order, setOrder] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try{
        const response = await apiCreateOrder({
            details: order,
            status: "pending",
            userId: user.sub
        })
        
        console.log(response.data)
    }catch(err:any){
        console.error(err)
        setError(err.response?.data?.message || "An unexpected error occurred.");
    }finally{
        setLoading(false);
        setOrder("");
    }
    
  };
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* <Description sx={{ m: 1, fontSize: 40, color: "primary.main" }} /> */}
        <Typography component="h1" variant="h5">
          Create Order
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="details"
            label="Order details"
            name="details"
            autoFocus
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          />
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Sign In"}
          </Button>
          
        </Box>
      </Box>
    </Container>
  );
}
export default OrderForm;
