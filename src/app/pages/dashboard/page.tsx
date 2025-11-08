'use client'
import { redirect } from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react"
/**
 * Renders the dashboard page, which requires an authenticated session to view.
 * If no session is found, the user is redirected to the home page.
 */
export default  function DashboardPage() {
  // Use useSession to check for a valid session on the client.
  const { data: session }= useSession();
  console.log(session);

  // If there's no session, the user is not authenticated.
  // Redirect them to the home page.
  if (!session) {
    redirect("/");
  }
  // If a session exists, render the content for the authenticated user.
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-500">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to the Dashboard!
        </h1>
        <p className="text-xl text-gray-600">
          Hello, {session?.user?.name || "User"}! You are authenticated.
        </p>
      </div>
    </div>
  );
}
