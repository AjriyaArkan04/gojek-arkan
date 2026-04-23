"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Service {
  id: string;
  name: string;
  icon: string;
  desc: string;
  category: "transport" | "food";
  color: string;
}

interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const SERVICES: Service[] = [
  { id: "goride", name: "GoRide", icon: "/assets/Goride.svg", desc: "Naik ojek online, pesan dalam hitungan detik. Sampai lebih cepat dari jalan kaki.", category: "transport", color: "#00AA13" },
  { id: "gocar", name: "GoCar", icon: "/assets/Gocar.svg", desc: "Pergi ke mana aja pakai mobil. Nyaman, ber-AC, dan harganya bisa kamu tahu dari awal.", category: "transport", color: "#00AA13" },
  { id: "gosend", name: "GoSend", icon: "/assets/Gosend.svg", desc: "Kirim barang hari ini, terima hari ini. Buat yang nggak mau nunggu lama.", category: "transport", color: "#00AA13" },
  { id: "gofood", name: "GoFood", icon: "/assets/Gofood.svg", desc: "Lapar tapi males keluar? Pesan dari ribuan restoran dan warung terdekat di kotamu.", category: "food", color: "#E53935" },
];

const STATS: Stat[] = [
  { value: "3.1", label: "Juta Mitra Driver", suffix: "jt+" },
  { value: "20.1", label: "Juta Mitra Usaha", suffix: "jt+" },
  { value: "2", label: "Negara Operasional", suffix: " negara" },
  { value: "190", label: "Kota di Indonesia", suffix: "+ kota" },
];

const PARTNERS = [
  { name: "McDonald's", src: "/assets/McDonalds.svg" },
  { name: "Tokopedia", src: "/assets/Tokopedia.svg" },
  { name: "KFC", src: "/assets/KFC.svg" },
  { name: "Starbucks", src: "/assets/Starbucks.svg" },
  { name: "Alfamart", src: "/assets/Alfamart.svg" },
  { name: "Indomaret", src: "/assets/Indomaret.svg" },
  { name: "J&T Express", src: "/assets/J&T.svg" },
  { name: "JNE", src: "/assets/JNE.png" },
  { name: "BCA", src: "/assets/BCA.svg" },
  { name: "BNI", src: "/assets/BNI.svg" },
  { name: "Bank Mandiri", src: "/assets/Mandiri.svg" },
];

const NAV_LINKS = ["Layanan", "Mitra", "Karir", "Blog"];

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useCounter(target: number, active: boolean, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(parseFloat((eased * target).toFixed(1)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return count;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function AnimatedStat({ stat, active }: { stat: Stat; active: boolean }) {
  const num = useCounter(parseFloat(stat.value), active);
  return (
    <div className="stat-card">
      <span className="stat-number">
        {num % 1 === 0 ? num.toFixed(0) : num.toFixed(1)}
        {stat.suffix}
      </span>
      <span className="stat-label">{stat.label}</span>
    </div>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`service-card ${hovered ? "hovered" : ""}`}
      style={{ animationDelay: `${index * 80}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="service-icon">
        <Image src={service.icon} alt={service.name} width={140} height={140} style={{ width: "140px", height: "140px", objectFit: "contain" }} />
      </div>
      <p className="service-desc">{service.desc}</p>
      <div className="service-arrow" style={{ color: service.color }}>→</div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function GojekLanding() {
  const [activeCategory, setActiveCategory] = useState<"all" | "transport" | "food">("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);

  const statsSection = useInView();
  const heroSection = useInView(0.01);

  const filtered = activeCategory === "all" ? SERVICES : SERVICES.filter((s) => s.category === activeCategory);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      setCursorVisible(true);
    };
    const onLeave = () => setCursorVisible(false);
    window.addEventListener("mousemove", onMove);
    document.body.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.body.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --green: #00AA13;
          --green-dark: #008A0E;
          --black: #0D0D0D;
          --white: #FAFAFA;
          --grey-100: #F5F5F5;
          --grey-200: #E8E8E8;
          --grey-400: #9A9A9A;
          --grey-700: #3A3A3A;
          --font-body: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
          --font-display: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
          --radius: 16px;
          --shadow: 0 2px 24px rgba(0,0,0,0.07);
          --shadow-lg: 0 8px 48px rgba(0,0,0,0.12);
          --transition: 0.3s cubic-bezier(0.4,0,0.2,1);
        }

        html { scroll-behavior: smooth; }

        body {
          font-family: var(--font-body);
          background: var(--white);
          color: var(--black);
          overflow-x: hidden;
          cursor: none;
        }

        /* Custom cursor */
        .custom-cursor {
          position: fixed;
          width: 14px; height: 14px;
          background: var(--green);
          border: 2px solid white;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          transition: transform 0.1s, opacity 0.2s;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.3), 0 0 8px rgba(0,170,19,0.6);
        }
        .custom-cursor.hidden { opacity: 0; }

        /* Navbar */
        .navbar {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 100;
          padding: 0 5vw;
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          transition: background var(--transition), box-shadow var(--transition);
        }
        .navbar.scrolled {
          background: rgba(250,250,250,0.92);
          backdrop-filter: blur(16px);
          box-shadow: 0 1px 0 var(--grey-200);
        }
        .navbar.top { background: transparent; }

        .logo {
          display: flex; align-items: center;
          text-decoration: none;
          line-height: 0;
        }

        .nav-links {
          display: flex; align-items: center; gap: 32px;
          list-style: none;
        }
        .nav-links a {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--grey-700);
          text-decoration: none;
          transition: color var(--transition);
          position: relative;
        }
        .nav-links a::after {
          content: '';
          position: absolute; bottom: -2px; left: 0; right: 100%;
          height: 2px; background: var(--green);
          transition: right var(--transition);
        }
        .nav-links a:hover { color: var(--black); }
        .nav-links a:hover::after { right: 0; }

        .nav-cta {
          background: var(--green);
          color: white !important;
          padding: 9px 20px;
          border-radius: 100px;
          font-weight: 700 !important;
          font-size: 0.85rem !important;
          transition: background var(--transition), transform var(--transition) !important;
        }
        .nav-cta:hover { background: var(--green-dark) !important; transform: scale(1.04); }
        .nav-cta::after { display: none !important; }

        .hamburger {
          display: none;
          flex-direction: column; gap: 5px;
          background: none; border: none;
          cursor: pointer; padding: 8px;
        }
        .hamburger span {
          display: block; width: 22px; height: 2px;
          background: var(--black);
          border-radius: 2px;
          transition: var(--transition);
        }

        /* Mobile Menu */
        .mobile-menu {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: var(--white);
          z-index: 90;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 32px;
          transform: translateY(-100%);
          transition: transform var(--transition);
        }
        .mobile-menu.open { transform: translateY(0); }
        .mobile-menu a {
          font-family: var(--font-display);
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--black);
          text-decoration: none;
          transition: color var(--transition);
        }
        .mobile-menu a:hover { color: var(--green); }

        /* Hero */
        .hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          padding: 100px 5vw 60px;
          gap: 48px;
          background: var(--white);
          position: relative;
          overflow: hidden;
        }

        .hero-bg-shape {
          position: absolute;
          width: 600px; height: 600px;
          background: #E8F5E9;
          border-radius: 50%;
          top: -150px; right: -200px;
          z-index: 0;
        }

        .hero-content { position: relative; z-index: 1; }

        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: #E8F5E9;
          color: var(--green-dark);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 100px;
          margin-bottom: 24px;
          opacity: 0;
          animation: fadeUp 0.6s 0.2s forwards;
        }
        .hero-badge-dot {
          width: 6px; height: 6px;
          background: var(--green);
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(2.4rem, 4.5vw, 3.8rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -1px;
          color: var(--black);
          margin-bottom: 20px;
          opacity: 0;
          animation: fadeUp 0.7s 0.35s forwards;
        }
        .hero-title .accent { color: var(--green); }

        .hero-sub {
          font-size: 1.05rem;
          color: var(--grey-400);
          line-height: 1.65;
          max-width: 420px;
          margin-bottom: 36px;
          opacity: 0;
          animation: fadeUp 0.7s 0.5s forwards;
        }

        .hero-actions {
          display: flex; gap: 14px; flex-wrap: wrap;
          opacity: 0;
          animation: fadeUp 0.7s 0.65s forwards;
        }

        .btn-primary {
          background: var(--green);
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 100px;
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: background var(--transition), transform var(--transition), box-shadow var(--transition);
          text-decoration: none; display: inline-block;
        }
        .btn-primary:hover {
          background: var(--green-dark);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,170,19,0.3);
        }

        .btn-secondary {
          background: transparent;
          color: var(--black);
          border: 2px solid var(--grey-200);
          padding: 14px 28px;
          border-radius: 100px;
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: border-color var(--transition), transform var(--transition);
          text-decoration: none; display: inline-block;
        }
        .btn-secondary:hover {
          border-color: var(--green);
          transform: translateY(-2px);
        }

        .hero-visual {
          position: relative; z-index: 1;
          display: flex; align-items: center; justify-content: center;
          opacity: 0;
          animation: fadeIn 1s 0.8s forwards;
        }

        .phone-mockup {
          width: 280px;
          background: var(--black);
          border-radius: 36px;
          padding: 16px;
          box-shadow: var(--shadow-lg), 0 0 0 1px rgba(255,255,255,0.1);
          position: relative;
          animation: float 4s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }

        .phone-notch {
          width: 80px; height: 22px;
          background: #1a1a1a;
          border-radius: 20px;
          margin: 0 auto 16px;
        }

        .phone-screen {
          background: #0D0D0D;
          border-radius: 24px;
          padding: 20px 16px;
          min-height: 460px;
        }

        .phone-app-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 10px; margin-top: 8px;
        }

        .phone-app-icon {
          aspect-ratio: 1;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem;
          transition: transform 0.2s;
        }
        .phone-app-icon:hover { transform: scale(1.1); }

        .phone-greeting {
          font-size: 0.6rem;
          color: rgba(255,255,255,0.5);
          margin-bottom: 4px;
          font-family: var(--font-body);
        }
        .phone-name {
          font-family: var(--font-display);
          font-size: 1rem;
          color: white;
          margin-bottom: 16px;
        }

        .phone-balance-card {
          background: var(--green);
          border-radius: 16px;
          padding: 14px;
          margin-bottom: 16px;
        }
        .phone-balance-label {
          font-size: 0.55rem;
          color: rgba(255,255,255,0.8);
          font-family: var(--font-body);
        }
        .phone-balance-amount {
          font-family: var(--font-display);
          font-size: 1.2rem;
          color: white;
          margin-top: 2px;
        }

        .phone-quick-order {
          background: #1a1a1a;
          border-radius: 14px;
          padding: 12px;
          margin-top: 14px;
          display: flex; align-items: center; gap: 10px;
        }
        .phone-quick-icon {
          width: 36px; height: 36px;
          background: var(--green);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
        }
        .phone-quick-text {
          font-size: 0.6rem;
          color: rgba(255,255,255,0.6);
          font-family: var(--font-body);
        }
        .phone-quick-title {
          font-size: 0.75rem;
          color: white;
          font-weight: 600;
          margin-bottom: 2px;
          font-family: var(--font-body);
        }

        .floating-badge {
          position: absolute;
          background: white;
          border-radius: 100px;
          padding: 8px 14px;
          box-shadow: var(--shadow-lg);
          display: flex; align-items: center; gap: 8px;
          font-size: 0.78rem;
          font-weight: 600;
          white-space: nowrap;
        }
        .fb-1 { top: 20%; right: -40px; animation: float 3.5s 0.5s ease-in-out infinite; }
        .fb-2 { bottom: 25%; left: -50px; animation: float 4s 1s ease-in-out infinite; }
        .fb-dot { width: 8px; height: 8px; border-radius: 50%; }

        /* Stats */
        .stats-section {
          background: var(--black);
          padding: 80px 5vw;
        }
        .stats-label {
          font-size: 0.8rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          text-align: center;
          margin-bottom: 48px;
          font-weight: 600;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px;
        }
        .stat-card {
          display: flex; flex-direction: column;
          align-items: center;
          padding: 40px 24px;
          background: #1a1a1a;
          transition: background var(--transition);
        }
        .stat-card:first-child { border-radius: var(--radius) 0 0 var(--radius); }
        .stat-card:last-child { border-radius: 0 var(--radius) var(--radius) 0; }
        .stat-card:hover { background: #222; }
        .stat-number {
          font-family: var(--font-display);
          font-size: clamp(2rem, 3.5vw, 3rem);
          font-weight: 800;
          color: var(--green);
          letter-spacing: -0.5px;
        }
        .stat-label {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.5);
          margin-top: 6px;
          text-align: center;
          font-weight: 500;
        }

        /* Services */
        .services-section {
          padding: 96px 5vw;
          background: var(--white);
        }
        .section-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 48px;
          gap: 24px;
          flex-wrap: wrap;
        }
        .section-eyebrow {
          font-size: 0.75rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--green);
          font-weight: 700;
          margin-bottom: 10px;
        }
        .section-title {
          font-family: var(--font-display);
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          font-weight: 800;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }
        .category-tabs {
          display: flex; gap: 8px; flex-wrap: wrap;
        }
        .tab {
          padding: 8px 18px;
          border-radius: 100px;
          border: 2px solid var(--grey-200);
          background: transparent;
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition);
          color: var(--grey-700);
        }
        .tab:hover { border-color: var(--green); color: var(--green); }
        .tab.active { background: var(--green); border-color: var(--green); color: white; }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .service-card {
          background: var(--grey-100);
          border-radius: var(--radius);
          padding: 32px 24px;
          cursor: pointer;
          transition: all var(--transition);
          position: relative;
          overflow: hidden;
          border: 2px solid transparent;
          opacity: 0;
          animation: fadeUp 0.5s forwards;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .service-card::before {
          content: '';
          position: absolute; inset: 0;
          background: var(--green);
          opacity: 0;
          transition: opacity var(--transition);
        }
        .service-card.hovered {
          border-color: var(--green);
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
        .service-card.hovered::before { opacity: 0.04; }

        .service-icon {
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
          line-height: 0;
          width: 140px;
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .service-desc {
          font-size: 0.85rem;
          color: var(--grey-400);
          line-height: 1.55;
          position: relative; z-index: 1;
        }
        .service-arrow {
          font-size: 1.2rem;
          margin-top: 16px;
          font-weight: 800;
          position: relative; z-index: 1;
          transition: transform var(--transition);
        }
        .service-card.hovered .service-arrow { transform: translateX(4px); }

        /* Partners */
        .partners-section {
          background: var(--grey-100);
          padding: 72px 0;
        }
        .partners-eyebrow {
          text-align: center;
          margin-bottom: 40px;
          padding: 0 5vw;
        }
        .partners-strip {
          overflow: hidden;
          position: relative;
          width: 100%;
        }
        .partners-strip::before,
        .partners-strip::after {
          content: '';
          position: absolute;
          top: 0; bottom: 0;
          width: 100px;
          z-index: 2;
          pointer-events: none;
        }
        .partners-strip::before {
          left: 0;
          background: linear-gradient(to right, var(--grey-100), transparent);
        }
        .partners-strip::after {
          right: 0;
          background: linear-gradient(to left, var(--grey-100), transparent);
        }
        .partners-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: marquee 36s linear infinite;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .partner-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 160px;
          height: 72px;
          flex-shrink: 0;
          padding: 16px 24px;
        }
        .partner-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        /* CTA */
        .cta-section {
          padding: 96px 5vw;
          background: var(--white);
          text-align: center;
        }
        .cta-inner {
          background: var(--black);
          border-radius: 24px;
          padding: 80px 5vw;
          position: relative;
          overflow: hidden;
        }
        .cta-pattern {
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(0,170,19,0.12) 1px, transparent 1px);
          background-size: 32px 32px;
        }
        .cta-title {
          font-family: var(--font-display);
          font-size: clamp(1.8rem, 3.5vw, 2.8rem);
          font-weight: 800;
          color: white;
          letter-spacing: -0.5px;
          margin-bottom: 16px;
          position: relative;
        }
        .cta-sub {
          color: rgba(255,255,255,0.5);
          font-size: 1rem;
          margin-bottom: 36px;
          position: relative;
        }
        .cta-buttons {
          display: flex; gap: 14px;
          justify-content: center; flex-wrap: wrap;
          position: relative;
        }
        .store-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: white;
          color: var(--black);
          border-radius: 12px;
          padding: 10px 18px;
          text-decoration: none;
          transition: transform var(--transition), box-shadow var(--transition);
          border: 1px solid var(--grey-200);
          min-width: 148px;
        }
        .store-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
        }
        .store-btn-icon {
          width: 28px;
          height: 28px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .store-btn-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }
        .store-btn-sub {
          font-size: 0.65rem;
          color: var(--grey-400);
          font-weight: 500;
        }
        .store-btn-label {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--black);
        }
        /* CTA section store buttons — white bg already dark, invert */
        .cta-buttons .store-btn {
          background: white;
          border-color: transparent;
        }

        /* Footer */
        .footer {
          background: var(--black);
          padding: 60px 5vw 32px;
          border-top: 1px solid #1a1a1a;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
          margin-bottom: 48px;
        }
        .footer-brand { margin-bottom: 14px; line-height: 0; }
        .footer-tagline {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.4);
          line-height: 1.6;
          max-width: 220px;
        }
        .footer-heading {
          font-size: 0.75rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          font-weight: 700;
          margin-bottom: 20px;
        }
        .footer-links { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .footer-links a {
          font-size: 0.88rem;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          transition: color var(--transition);
        }
        .footer-links a:hover { color: var(--green); }
        .footer-bottom {
          border-top: 1px solid #1a1a1a;
          padding-top: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap; gap: 12px;
        }
        .footer-copy {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.25);
        }

        /* Responsive */
        @media (max-width: 900px) {
          .hero { grid-template-columns: 1fr; min-height: auto; padding-top: 120px; }
          .hero-visual { order: -1; }
          .phone-mockup { width: 220px; }
          .fb-1, .fb-2 { display: none; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .stat-card:nth-child(2) { border-radius: 0; }
          .stat-card:nth-child(3) { border-radius: 0; }
          .services-grid { grid-template-columns: repeat(2, 1fr); }
          .footer-grid { grid-template-columns: 1fr 1fr; }
          .nav-links { display: none; }
          .hamburger { display: flex; }
          .section-header { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 560px) {
          .services-grid { grid-template-columns: repeat(2, 1fr); }
          .stats-grid { grid-template-columns: 1fr 1fr; }
          .footer-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Custom Cursor */}
      <div
        className={`custom-cursor ${cursorVisible ? "" : "hidden"}`}
        style={{ left: cursorPos.x, top: cursorPos.y }}
      />

      {/* Mobile Menu */}
      <nav className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {NAV_LINKS.map((l) => (
          <a key={l} href="#" onClick={() => setMenuOpen(false)}>{l}</a>
        ))}
        <a href="#" onClick={() => setMenuOpen(false)} style={{ color: "var(--green)" }}>Unduh Aplikasi</a>
      </nav>

      {/* Navbar */}
      <header className={`navbar ${scrolled ? "scrolled" : "top"}`}>
        <a href="#" className="logo">
          <Image src="/assets/Gojek.svg" alt="Gojek" width={80} height={28} />
        </a>
        <ul className="nav-links">
          {NAV_LINKS.map((l) => (
            <li key={l}><a href="#">{l}</a></li>
          ))}
          <li><a href="#" className="nav-cta">Unduh Aplikasi</a></li>
        </ul>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span style={menuOpen ? { transform: "rotate(45deg) translate(5px, 5px)" } : {}} />
          <span style={menuOpen ? { opacity: 0 } : {}} />
          <span style={menuOpen ? { transform: "rotate(-45deg) translate(5px, -5px)" } : {}} />
        </button>
      </header>

      {/* Hero */}
      <section className="hero" ref={heroSection.ref}>
        <div className="hero-bg-shape" />
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Aplikasi #1 di Indonesia
          </div>
          <h1 className="hero-title">
            Satu aplikasi<br />
            buat <span className="accent">semua kebutuhan</span><br />
            harianmu.
          </h1>
          <p className="hero-sub">
            Mau pergi, mau makan, mau kirim barang — buka Gojek aja. Sudah dipakai jutaan orang Indonesia setiap hari.
          </p>
          <div className="hero-actions">
            <a href="https://apps.apple.com/us/app/gojek/id944875099" target="_blank" rel="noopener noreferrer" className="store-btn">
              <span className="store-btn-icon">
                <Image src="/assets/AppStore.svg" alt="" width={24} height={24} />
              </span>
              <span className="store-btn-text">
                <span className="store-btn-sub">Unduh di</span>
                <span className="store-btn-label">App Store</span>
              </span>
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.gojek.app&pcampaignid=web_share" target="_blank" rel="noopener noreferrer" className="store-btn">
              <span className="store-btn-icon">
                <Image src="/assets/GooglePlay.svg" alt="" width={24} height={24} />
              </span>
              <span className="store-btn-text">
                <span className="store-btn-sub">Tersedia di</span>
                <span className="store-btn-label">Google Play</span>
              </span>
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="floating-badge fb-1">
            <span className="fb-dot" style={{ background: "#00AA13" }} />
            <span>Driver tiba dalam <strong>3 menit</strong></span>
          </div>
          <div className="floating-badge fb-2">
            <span className="fb-dot" style={{ background: "#E53935" }} />
            <span>GoFood sampai <strong>25 menit</strong></span>
          </div>
          <div className="phone-mockup">
            <div className="phone-notch" />
            <div className="phone-screen">
              <div className="phone-greeting">Selamat pagi! 👋</div>
              <div className="phone-name">Halo, Arkan</div>
              <div className="phone-balance-card">
                <div className="phone-balance-label">Saldo GoPay</div>
                <div className="phone-balance-amount">Rp 25.000.000</div>
              </div>
              <div className="phone-app-grid">
                {[
                  { emoji: "🏍️", bg: "#1a3c1a" },
                  { emoji: "🚗", bg: "#1a3c1a" },
                  { emoji: "🍜", bg: "#3c1a1a" },
                  { emoji: "🛒", bg: "#3c1a1a" },
                  { emoji: "📦", bg: "#1a3c1a" },
                  { emoji: "💊", bg: "#1a2a3c" },
                  { emoji: "💼", bg: "#1a2a3c" },
                  { emoji: "💳", bg: "#2a1a3c" },
                ].map((app, i) => (
                  <div key={i} className="phone-app-icon" style={{ background: app.bg }}>
                    {app.emoji}
                  </div>
                ))}
              </div>
              <div className="phone-quick-order">
                <div className="phone-quick-icon">🍜</div>
                <div>
                  <div className="phone-quick-title">Pesan lagi?</div>
                  <div className="phone-quick-text">Ayam Geprek Bensu · 2 km</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section" ref={statsSection.ref}>
        <div className="stats-label">Gojek dalam angka</div>
        <div className="stats-grid">
          {STATS.map((stat) => (
            <AnimatedStat key={stat.label} stat={stat} active={statsSection.inView} />
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="services-section">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Layanan Kami</div>
            <h2 className="section-title">Ada apa aja<br />di Gojek?</h2>
          </div>
          <div className="category-tabs">
            {(["all", "transport", "food"] as const).map((cat) => (
              <button
                key={cat}
                className={`tab ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {{ all: "Semua", transport: "🚗 Transport", food: "🍜 Makanan" }[cat]}
              </button>
            ))}
          </div>
        </div>
        <div className="services-grid">
          {filtered.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="partners-section">
        <div className="partners-eyebrow section-eyebrow">Tersedia di ribuan tempat yang kamu kunjungi setiap hari</div>
        <div className="partners-strip">
          <div className="partners-track">
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
              <div key={i} className="partner-logo">
                <Image
                  src={p.src}
                  alt={p.name}
                  width={112}
                  height={40}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <div className="cta-pattern" />
          <h2 className="cta-title">Udah jutaan orang pakai.<br />Sekarang giliran kamu.</h2>
          <p className="cta-sub">Unduh Gojek sekarang dan rasakan sendiri bedanya.</p>
          <div className="cta-buttons">
            <a href="https://apps.apple.com/us/app/gojek/id944875099" target="_blank" rel="noopener noreferrer" className="store-btn">
              <span className="store-btn-icon">
                <Image src="/assets/AppStore.svg" alt="" width={24} height={24} />
              </span>
              <span className="store-btn-text">
                <span className="store-btn-sub">Unduh di</span>
                <span className="store-btn-label">App Store</span>
              </span>
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.gojek.app&pcampaignid=web_share" target="_blank" rel="noopener noreferrer" className="store-btn">
              <span className="store-btn-icon">
                <Image src="/assets/GooglePlay.svg" alt="" width={24} height={24} />
              </span>
              <span className="store-btn-text">
                <span className="store-btn-sub">Tersedia di</span>
                <span className="store-btn-label">Google Play</span>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <Image src="/assets/Gojek.svg" alt="Gojek" width={88} height={30} style={{ filter: "brightness(0) invert(1)" }} />
            </div>
            <p className="footer-tagline">Aplikasi yang menemani jutaan orang Indonesia dalam keseharian mereka.</p>
          </div>
          {[
            { heading: "Perusahaan", links: ["Tentang Kami", "Produk", "Blog", "Berita"] },
            { heading: "Gabung", links: ["Mitra Driver", "Mitra Usaha", "GoAds", "GoCorp"] },
            { heading: "Bantuan", links: ["Pusat Bantuan", "Lokasi Kami", "Karir", "Hubungi Kami"] },
          ].map((col) => (
            <div key={col.heading}>
              <div className="footer-heading">{col.heading}</div>
              <ul className="footer-links">
                {col.links.map((l) => (
                  <li key={l}><a href="#">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© 2025 Gojek. Semua hak dilindungi.</span>
        </div>
      </footer>
    </>
  );
}