// import { Link } from "react-router-dom";

// export default function Navbar() {
//   return (
//     <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
//       <h1 className="text-xl font-bold">Exoplanet Classifier</h1>
//       <div className="space-x-6">
//         <Link to="/" className="hover:text-blue-400">Single Prediction</Link>
//         <Link to="/bulk" className="hover:text-blue-400">Bulk Prediction</Link>
//       </div>
//     </nav>
//   );
// }
import { Link, useLocation } from "react-router-dom";
import { Globe } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const linkClass = (path) =>
    `font-body font-medium transition-all duration-300 ${
      location.pathname === path
        ? "text-primary drop-shadow-[0_0_8px_rgba(0,255,249,0.8)]"
        : "text-foreground/70 hover:text-primary"
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/30 backdrop-blur-xl border-b border-primary/20">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Globe className="w-8 h-8 text-primary animate-spin-slow" />
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse-glow" />
          </div>
          <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Exoplanet Classifier
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="flex gap-6">
          <Link to="/" className={linkClass("/")}>
            Single Prediction
          </Link>
          <Link to="/bulk" className={linkClass("/bulk")}>
            Bulk Prediction
          </Link>
        </div>
      </div>
    </nav>
  );
}
