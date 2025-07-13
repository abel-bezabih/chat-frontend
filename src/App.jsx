import { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ChatRoom from "./components/ChatRoom";

function App() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [socket, setSocket] = useState(null);

  const handleLogin = async (username, password) => {
    try {
      const res = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Bad credentials");
      const data = await res.json();
      localStorage.setItem("token", data.token);

      setUsername(username);
      setLoggedIn(true);
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  const handleRegister = async (username, password) => {
    try {
      const res = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Registration failed");
      alert("✅ Registered! You can now log in.");
      setIsRegistering(false);
    } catch (err) {
      alert("Registration failed: " + err.message);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername("");
    localStorage.removeItem("token");
    if (socket) socket.close();
    setSocket(null);
  };

  useEffect(() => {
    if (loggedIn) {
      const token = localStorage.getItem("token");
      const ws = new WebSocket(`ws://localhost:8080/chat?token=${token}`);
      setSocket(ws);
    }
  }, [loggedIn]);

  if (loggedIn && socket) {
    return <ChatRoom username={username} socket={socket} onLogout={handleLogout} />;
  }

  return isRegistering ? (
    <>
      <RegisterForm onRegister={handleRegister} />
      <p className="text-center text-sm mt-2">
        Already have an account?{" "}
        <button
          onClick={() => setIsRegistering(false)}
          className="text-blue-600 underline"
        >
          Log in
        </button>
      </p>
    </>
  ) : (
    <>
      <LoginForm onLogin={handleLogin} />
      <p className="text-center text-sm mt-2">
        Don’t have an account?{" "}
        <button
          onClick={() => setIsRegistering(true)}
          className="text-green-600 underline"
        >
          Register
        </button>
      </p>
    </>
  );
}

export default App;
