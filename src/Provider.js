"use client";
import { SessionProvider } from "next-auth/react";
import { ApolloProvider } from "@apollo/client";
import client from "./lib/apollo-client";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </SessionProvider>
  );
}
