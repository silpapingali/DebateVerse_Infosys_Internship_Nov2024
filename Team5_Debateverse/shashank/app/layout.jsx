import localFont from "next/font/local";


import {
  ClerkProvider,
  SignedOut,
  SignInButton,
} from '@clerk/nextjs';
import ConditionalHeader from '@/actions/ConditionalHeader';
import './globals.css';
import RoleRedirect from "@/actions/RoleRedirect";

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

export const metadata = {
  title: "DebateVerse",
  description: "A platform for debating and discussing ideas.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: "system",
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
        variables: { 
          colorPrimary: "#3371FF" ,
          fontSize: '16px'
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