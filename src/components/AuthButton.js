"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import todoImage from "../../public/todo-illustartion.jpg";

export default function AuthButtons() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="header">
        <p>Welcome, {session.user.name}</p>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    );
  }

  return (
    <div className="login-container">
      <h1>TODO App</h1>
      <div className="login-section">
        <div>
          {" "}
          <Image
            src={todoImage}
            alt="Todo Illustration"
          />
        </div>
        <div>
          {" "}
          <h2>Sign in to view your todos</h2>
          <button onClick={() => signIn("google")}>Sign In with Google</button>
        </div>
      </div>
    </div>
  );
}
