import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const services = [
    "微分碎蓋",
    "韓式服貼燙",
    "韓式氣墊燙",
    "萊斯利捲",
    "羊毛捲",
    "摩根前刺燙",
    "束狀紋理燙",
    "縮毛矯正",
  ];

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-neutral-50 selection:bg-neutral-200 selection:text-black text-neutral-900">
      {/* 滿版背景圖 */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/hero.png"
          alt="Premium Hair Salon Interior"
          fill
          className="object-cover object-center scale-105 animate-[slowZoom_20s_ease-in-out_infinite_alternate]"
          priority
        />
        {/* 明亮質感漸層遮罩 (晨光白) */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/60 to-white/95" />
      </div>

      {/* 核心內容區塊 */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 max-w-5xl mx-auto text-center space-y-12">
        
        {/* Logo 區塊 */}
        <div className="fade-in-up flex flex-col items-center">
          <div className="relative w-48 h-48 md:w-64 md:h-64 mb-6 transition-transform duration-700 hover:-translate-y-2">
            <Image
              src="/Logo.jpg"
              alt="DMD Hair Design Logo"
              fill
              className="object-contain drop-shadow-sm"
              priority
            />
          </div>
          <p className="tracking-[0.4em] text-xs md:text-sm text-neutral-500 uppercase font-medium">
            Premium Hair Artistry
          </p>
        </div>

        {/* 專屬服務標籤牆 (關鍵字) */}
        <div className="delay-100 fade-in-up w-full max-w-3xl">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {services.map((service, idx) => (
              <span 
                key={service}
                className="px-5 py-2.5 text-sm md:text-base font-medium tracking-[0.1em] text-neutral-700 border border-neutral-200/60 rounded-full bg-white/70 backdrop-blur-md hover:bg-white hover:border-neutral-300 hover:-translate-y-1 transition-all duration-300 shadow-sm cursor-default hover:shadow-md"
                style={{ animationDelay: `${200 + idx * 50}ms` }}
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        <p className="max-w-md mx-auto text-neutral-600 font-light leading-relaxed md:text-lg opacity-90 delay-200 fade-in-up">
          不只是剪髮，而是為您量身打造的專屬訂製藝術。
          <br className="hidden md:block" />
          感受頂級質感的服務體驗，從即刻預約開始。
        </p>

        {/* 實體色塊預約按鈕 (強烈對比 CTA) */}
        <div className="pt-4 fade-in-up delay-300">
          <Link
            href="/booking"
            className="group relative inline-flex items-center justify-center px-10 py-5 bg-zinc-900 border border-transparent rounded-full overflow-hidden transition-all duration-500 hover:bg-zinc-800 hover:shadow-[0_10px_40px_rgba(0,0,0,0.2)] hover:scale-105"
          >
            <span className="relative z-10 text-base md:text-lg tracking-[0.15em] font-medium text-white transition-colors">
              立即 線上預約
            </span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
          </Link>
        </div>

        {/* 聯絡資訊與社群 */}
        <div className="pt-8 fade-in-up delay-300 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 text-sm md:text-base font-medium tracking-wide text-neutral-500">
          <a 
            href="https://maps.app.goo.gl/1gGGA1kDUPveGLt1A" 
            target="_blank" 
            rel="noreferrer" 
            className="group flex items-center gap-2 hover:text-zinc-900 transition-colors"
          >
            <svg className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            510彰化縣員林市員東路二段282號
          </a>
          
          <a 
            href="https://www.instagram.com/dmd_sky?igshid=NTc4MTIwNjQ2YQ%3D%3D" 
            target="_blank" 
            rel="noreferrer" 
            className="group flex items-center gap-2 hover:text-zinc-900 transition-colors"
          >
            <svg className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            Follow on Instagram
          </a>
        </div>
      </div>

      {/* Tailwind 任意值微動畫 CSS 注入 */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slowZoom {
          0% { transform: scale(1.05); }
          100% { transform: scale(1.15); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .fade-in-up {
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        .delay-100 { animation-delay: 200ms; }
        .delay-200 { animation-delay: 400ms; }
        .delay-300 { animation-delay: 600ms; }
        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </main>
  );
}
