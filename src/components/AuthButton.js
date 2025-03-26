"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import {useTranslations} from 'next-intl';
import Image from "next/image";
import todoImage from "../../public/todo-illustartion.jpg";

export default function AuthButtons() {
  const { data: session } = useSession();
  const t = useTranslations('AuthPage');
  if (session) {
    return (
      <div className="header">
        <p>{t('welcome')}, {session.user.name}</p>
        <h1>TODO APP</h1>
        <button onClick={() => signOut()}>{t('signout')}</button>
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
            priority={true}
          />
        </div>
        <div>
          {" "}
          <h2>{t('signinInstruction')}</h2>
          <button onClick={() => signIn("google")}>{t('signin')}</button>
        </div>
      </div>
    </div>
  );
}
