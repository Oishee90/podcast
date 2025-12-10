import "./globals.css";

export const metadata = {
  title: "Podcast",
  description: "Podcast web",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <main>{children}</main>
      </body>
    </html>
  );
}
