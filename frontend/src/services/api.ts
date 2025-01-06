interface TestResult {
  userId: string;
  wpm: number;
  cpm: number;
  accuracy: number;
  wordCount: number;
}

interface AuthResponse {
  token: string;
  username: string;
}

export const register = async (
  username: string,
  email: string,
  password: string
) => {
  console.log("Attempting registration with:", { username, email });

  const response = await fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await response.json();
  console.log("Registration response:", data);

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data as AuthResponse;
};

export const login = async (username: string, password: string) => {
  const response = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) throw new Error("Login failed");
  return response.json() as Promise<AuthResponse>;
};

export const saveTestResult = async (result: TestResult) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch("http://localhost:3000/api/results", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(result),
  });

  if (!response.ok) throw new Error("Failed to save test result");
  return response.json();
};

export const getTestResults = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  console.log("Fetching results with token:", token);
  const response = await fetch("http://localhost:3000/api/results", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch results");
  const data = await response.json();
  console.log("API Response data:", data);
  return data;
};

export const getLeaderboard = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch("http://localhost:3000/api/leaderboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch leaderboard");
  return response.json();
};
