import "./globals.css";

export const metadata = {
  title: "Podcast",
  description: "Podcast web",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-black" suppressHydrationWarning>
        <main>{children}</main>
      </body>
    </html>
  );
}
