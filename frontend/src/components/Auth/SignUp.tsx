import { useState } from "react";
import { register } from "../../services/api";

export const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await register(
        formData.username,
        formData.email,
        formData.password
      );
      localStorage.setItem("token", response.token);
      // You might want to add user context here
      window.location.href = "/"; // or use React Router navigation
    } catch (error) {
      setError("Failed to register");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {error && <div className="error">{error}</div>}
        <div>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};
