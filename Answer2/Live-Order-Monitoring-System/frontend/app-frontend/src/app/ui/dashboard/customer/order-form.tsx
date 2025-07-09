"use client";
import { useState,useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { Grid } from "@mui/material";
import Link from "next/link";
import Alert from "@mui/material/Alert";
import { apiCreateOrder } from "@/services/api";
import CheckIcon from "@mui/icons-material/Check";
interface UserPayload {
  sub: string;
  email: string;
  role: string;
}
function OrderForm({ user }: { user: UserPayload }) {
  const [order, setOrder] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState({ severity: '', message: '' });
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAlertMessage({ severity: '', message: '' });
    try {
      const response = await apiCreateOrder({
        details: order,
        status: "pending",
        userId: user.sub,
      });
      setAlertMessage({ severity: 'success', message: 'Create order success.' })
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "An unexpected error occurred.");
      setAlertMessage({ severity: 'error', message: err.response?.data?.message || "An unexpected error occurred." })
    } finally {
      
      
      console.log("create order success");
      setLoading(false);
      setOrder("");
    }
  };
  useEffect(() => {
  // ถ้ามี message ใน state ของ alert
  if (alertMessage.message) {
    // ตั้งเวลา 3 วินาที
    const timer = setTimeout(() => {
      // เมื่อครบ 3 วินาที ให้เคลียร์ message ทิ้ง
      setAlertMessage({ severity: '', message: '' });
    }, 2000); // 3000 milliseconds = 3 seconds

    // สำคัญ: คืนค่า cleanup function เพื่อยกเลิก timer
    // หาก component ถูกปิดก่อนเวลาจะครบ (ป้องกัน memory leak)
    return () => clearTimeout(timer);
  }
}, [alertMessage]);
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
        {alertMessage && (<Alert severity={alertMessage.severity as any}>
        {alertMessage.message}
      </Alert>)}
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
            {loading ? <CircularProgress size={24} /> : "create"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
export default OrderForm;
