import "./globals.css";

export const metadata = {
  title: "PROMACON Buildtech | Premium Construction & Interior Design",
  description: "PROMACON Buildtech is a professionally managed construction and interior contracting company. We specialize in the construction, renovation, and premium interior design fit-out of apartments, villas, offices, and retail showrooms.",
  keywords: "Interior design, construction company, building contractors, office fit-out, premium retail interiors, renovation, Purple Interiors, PROMACON Interiors",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
