
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Nav from '../components/nav';
import { Providers } from "../GlobalRedux/provider"
import React from 'react';
import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "@/auth";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Whoozh",
  description: "Debate App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 const session = await auth()
  return (
    <html lang="en" className=" md:overflow-y-scroll lg:overflow-y-hidden">
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 `}
      >
          <AuthProvider session={session}> 
          <Nav/>
         <main >
          
        
           <Providers>
           
         {children}
        
         </Providers>
        
        
    
         </main>
           </AuthProvider>
         <Toaster />
      </body>
    </html>
  );
}