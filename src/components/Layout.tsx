import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { FlaskConical, LayoutGrid, Upload, Settings, Home } from "lucide-react";
import { useState, useEffect } from "react";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { to: "/", label: "首页", icon: Home },
    { to: "/gallery", label: "作品库", icon: LayoutGrid },
    { to: "/submit", label: "提交作品", icon: Upload },
    { to: "/admin", label: "主办方后台", icon: Settings },
  ];

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-bg/90 backdrop-blur-lg border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <FlaskConical
                className="w-7 h-7 text-primary transition-transform group-hover:rotate-12"
                strokeWidth={2}
              />
              <div className="absolute inset-0 bg-primary/20 blur-lg -z-10" />
            </div>
            <span className="font-brand text-xl font-bold tracking-wider">
              HackShow
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <button
                  key={item.to}
                  onClick={() => navigate(item.to)}
                  className={`relative px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-1.5 ${
                    active
                      ? "text-primary bg-primary/10"
                      : "text-neutral-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      <footer className="border-t border-white/5 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-neutral-400 text-sm">
            <FlaskConical className="w-4 h-4 text-primary" />
            <span>HackShow — 黑客松作品统一收集与宣发平台</span>
          </div>
          <div className="text-neutral-500 text-xs">
            让每一个创意都被看见
          </div>
        </div>
      </footer>
    </div>
  );
}
