"use client";
import { useState, useEffect, useMemo } from 'react';
import io, { Socket } from 'socket.io-client';
// import api from '@/lib/api'; 
import { apiGetOrders,apiUpdateOrderStatus } from '@/services/api';
import OrderCard from './order-card';
interface Order {
  id: string;
  details: string | null;
  status: 'pending' | 'assigned' | 'completed' | 'cancelled';
  userId: string;
  createdAt: string;
}

// Defines the structure of the real-time event from the WebSocket.
interface OrderEvent {
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  data: Order | { id: string };
}
interface UserPayload {
  sub: string;
  email: string;
  role: string;
}
// --- Constants ---
const GATEWAY_URL = 'http://localhost:3000'; // Your API Gateway URL
type StatusFilter = 'all' | Order['status'];


function AdminClientPage({ user }: { user: UserPayload }) {

  // --- State Management ---
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Real-time Data and WebSocket Logic ---
  useEffect(() => {
    // 1. Fetch initial list of orders on component mount.
    const fetchInitialOrders = async () => {
      try {
        const response = await apiGetOrders();
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch initial orders:", err);
        setError("Could not load orders. Please check your connection or log in again.");
      }
    };
    fetchInitialOrders();

    // 2. Establish WebSocket connection.
    const socket = io(GATEWAY_URL);

    socket.on('connect', () => {
      console.log('✅ WebSocket Connected');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('❌ WebSocket Disconnected');
      setIsConnected(false);
    });

    // 3. Listen for real-time 'order_update' events.
    socket.on('order_update', (event: OrderEvent) => {
      console.log('Received order_update event:', event);
      
      setOrders((prevOrders) => {
        switch (event.type) {
          case 'CREATE':
            // Add the new order to the top of the list.
            return [event.data as Order, ...prevOrders];
          
          case 'UPDATE':
            // Find and update the existing order in the list.
            return prevOrders.map((order) =>
              order.id === (event.data as Order).id ? (event.data as Order) : order
            );

          case 'DELETE':
            // Filter out the deleted order from the list.
            return prevOrders.filter((order) => order.id !== (event.data as { id: string }).id);

          default:
            return prevOrders;
        }
      });
    });

    // 4. Cleanup: Disconnect the socket when the component unmounts.
    return () => {
      socket.disconnect();
    };
  }, []); // The empty dependency array ensures this effect runs only once.

  // --- Filtering Logic ---
  // useMemo ensures this logic only runs when orders or the filter changes.
  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') {
      return orders;
    }
    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

  // --- Helper Functions ---
  const handleAssignOrder = async (orderId: string) => {
    try {
      // This would call your API to update the order status.
      // Example: await api.patch(`/orders/${orderId}`, { status: 'assigned' });
      // call api for update order status
      await apiUpdateOrderStatus(orderId,{status:'assigned'})
      // alert(`Order ${orderId} would be assigned.`);
    } catch (err) {
      console.error(`Failed to assign order ${orderId}:`, err);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try{
      await apiUpdateOrderStatus(orderId, {status:'cancelled'})

    }catch(err){
      console.error(`Failed to assign order ${orderId}:`, err)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Live Order Dashboard</h1>
          <div className="flex items-center space-x-2">
            <span className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm font-medium text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-700">Filter by status:</span>
            {(['all', 'pending', 'assigned', 'completed', 'cancelled'] as StatusFilter[]).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert"><p>{error}</p></div>}

        {/* Order List */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} onAssign={handleAssignOrder} onCancelButton={handleCancelOrder} />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">No orders to display for this filter.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
  
}
export default AdminClientPage