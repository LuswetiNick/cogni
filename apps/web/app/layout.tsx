import { Work_Sans } from "next/font/google";

import { ConvexClientProvider } from "@/components/convex-client-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";
import "@workspace/ui/globals.css";
const fontSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} font-sans antialiased `}>
        <ClerkProvider
          appearance={{
            theme: shadcn,
            elements: {
              headerTitle: {
                fontWeight: "700",
              },
            },
          }}
        >
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
