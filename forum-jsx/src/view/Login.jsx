import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  return (
    <div>
      <h1>Login Page</h1>
    </div>
  );
}

export default Login;
