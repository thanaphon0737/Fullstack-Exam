"use client";
interface Order {
  id: string;
  details: string | null;
  status: "pending" | "assigned" | "completed" | "cancelled";
  userId: string;
  createdAt: string;
}

function OrderCard({
  order,
  onAssign,
  onCancelButton,
  onComplete
}: {
  order: Order;
  onAssign: (id: string) => void;
  onCancelButton: (id: string) => void;
  onComplete: (id: string) => void;
}) {
  const statusStyles: { [key in Order["status"]]: string } = {
    pending: "bg-yellow-100 text-yellow-800",
    assigned: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 transition hover:shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="mb-4 sm:mb-0">
          <p className="text-sm text-gray-500 font-mono">
            Order ID: {order.id}
          </p>
          
        </div>
        <div className="flex items-center space-x-4">
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full ${
              statusStyles[order.status]
            }`}
          >
            {order.status}
          </span>
          {order.status === "pending" && (
            <button
              onClick={() => onAssign(order.id)}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
            >
              Assign
            </button>
          )}
          {(order.status === 'pending' || order.status === 'assigned') && (
             <button
              onClick={() => onCancelButton(order.id)}
              className="px-4 py-2 bg-gray-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75"
            >
              Cancel
            </button>
          )}
          {(order.status === 'assigned') && (
             <button
              onClick={() => onComplete(order.id)}
              className="px-4 py-2 bg-gray-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              Complete
            </button>
          )}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-gray-700">
          {order.details || "No additional details."}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Created: {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
export default OrderCard;
