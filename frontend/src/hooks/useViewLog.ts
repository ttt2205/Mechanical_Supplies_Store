import { useCallback } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export const useViewLog = () => {
  const { user } = useAuthStore();

  const logView = useCallback(async (productId: number) => {
    // Simulate API call to save view log in database
    console.log(`[ViewLog] User ${user?.user_id || "Guest"} viewed product ${productId}`);
    
    // In a real application, this would be a fetch/axios POST request:
    /*
    await fetch('/api/view-logs', {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        user_id: user?.user_id || null,
        viewed_at: new Date().toISOString()
      })
    });
    */
    
    return true;
  }, [user]);

  return { logView };
};
