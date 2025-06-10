// pages/index.tsx
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", {
      username,
      password,
      callbackUrl: "/dashboard", // redirect after login
    });
  };

  if (session) {
    return (
      <div>
        <h1>Welcome, {session.user?.name}!</h1>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <br />
      <button type="submit">Sign in</button>
    </form>
  );
}

