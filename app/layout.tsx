import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "modern-normalize";
import "./globals.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import TanStackProvider from "../components/TanStackProvider/TanStackProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NoteHub",
  description: "Manage your personal notes efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TanStackProvider>
          <div className="layout-wrapper">
            <Header />
            <main className="main-content">{children}</main>
            <Footer />
          </div>
          <div id="modal-root"></div>
        </TanStackProvider>
      </body>
    </html>
  );
}
