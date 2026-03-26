import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black selection:bg-neutral-800 selection:text-white text-white">
      {/* 滿版背景圖 (使用剛剛 AI 生成的頂級沙龍情境圖) */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/hero.png"
          alt="DMD Hair Salon Interior"
          fill
          className="object-cover object-center scale-105 animate-[slowZoom_20s_ease-in-out_infinite_alternate]"
          priority
        />
        {/* 高質感漸層遮罩 - 讓文字更清晰 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90 mix-blend-multiply" />
      </div>

      {/* 核心內容區塊 */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 max-w-4xl mx-auto text-center space-y-10">
        
        {/* 標題與副標 */}
        <div className="space-y-4 fade-in-up">
          <p className="tracking-[0.4em] text-xs md:text-sm text-neutral-400 uppercase font-light">
            Premium Hair Artistry
          </p>
          <h1 className="text-5xl md:text-7xl font-light tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 via-white to-neutral-400 drop-shadow-sm">
            DMD
            <span className="block mt-2 text-2xl md:text-4xl tracking-[0.2em] font-extralight text-neutral-300">
              HAIR DESIGN
            </span>
          </h1>
        </div>

        <p className="max-w-md mx-auto text-neutral-300 font-light leading-relaxed md:text-lg opacity-90 delay-100 fade-in-up">
          不只是剪髮，而是為您量身打造的專屬訂製藝術。
          <br className="hidden md:block" />
          感受頂級質感的服務體驗，從即刻預約開始。
        </p>

        {/* 玻璃擬態 (Glassmorphism) 預約按鈕 */}
        <div className="pt-8 fade-in-up delay-200">
          <Link
            href="/booking"
            className="group relative inline-flex items-center justify-center px-8 py-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-full overflow-hidden transition-all duration-500 hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:scale-105"
          >
            <span className="relative z-10 text-sm md:text-base tracking-[0.1em] font-medium text-white group-hover:text-white transition-colors">
              立即 線上預約
            </span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
          </Link>
        </div>
      </div>

      {/* Tailwind 任意值微動畫 CSS 注入 (讓開發者不用去 config 改) */}
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
        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </main>
  );
}
