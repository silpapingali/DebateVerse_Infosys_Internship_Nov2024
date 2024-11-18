import localFont from "next/font/local";
import { dark } from "@clerk/themes"

import {
  ClerkProvider,
  SignedOut,
  SignInButton,
} from '@clerk/nextjs';
import ConditionalHeader from '@/actions/ConditionalHeader';
import './globals.css';
import RoleRedirect from "@/actions/RoleRedirect";

export const metadata = {
  title: "DebateVerse",
  description: "A platform for debating and discussing ideas.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { 
          fontSize: '16px',
          
        },
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
      }}
    >
      <html lang="en">
        <body>
          <ConditionalHeader />
          <RoleRedirect />
          <main>
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}