import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const BASE_URL = "http://localhost:5000"; // Adjust if needed

// --- API Fetchers ---

const loginUser = async ({ username, password }) => {
  const response = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Login failed");
  }

  return response.json();
};

const registerUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Registration failed");
  }

  return response.json();
};

const fetchUserContext = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/users/context`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user context");
  }

  return response.json();
};

const logoutUser = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/users/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
        // If logout fails server-side, we still want to clear client side usually, 
        // but for now let's throw to handle it in the UI if needed or just swallow it.
      throw new Error("Logout failed");
    }
  
    return response.json();
  };

// --- Custom Hooks ---

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Save token
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user)); // Optional: save basic user info
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    },
  });
};

export const useUserContext = () => {
  return useQuery({
    queryKey: ["userContext"],
    queryFn: fetchUserContext,
    // Only fetch if we have a token
    enabled: !!localStorage.getItem("token"),
    retry: false, 
    refetchOnWindowFocus: false,
  });
};

// ... existing code ...
const updateUserContext = async ({ bio }) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/users/context`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ bio }),
  });

  if (!response.ok) {
    throw new Error("Failed to update context");
  }

  return response.json();
};

// ... existing code ...

export const useLogout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: logoutUser,
        onSettled: () => {
            // Always clear local storage and cache on logout attempt (success or fail)
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            queryClient.clear();
        }
    })
}

export const useUpdateUserContext = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserContext,
    onSuccess: () => {
      // Refresh the context data after update
      queryClient.invalidateQueries(["userContext"]);
    },
  });
};