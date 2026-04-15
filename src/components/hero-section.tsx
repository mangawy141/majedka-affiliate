export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto text-center">
        {/* Animated badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-blue-900/30 border border-blue-500/50 rounded-full backdrop-blur">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <span className="text-sm text-blue-300">برنامج الشركاء الجدد</span>
        </div>

        {/* Main headline - Arabic */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          حوّل شغفك بالألعاب <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            إلى مصدر دخل
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          انضم إلى برنامج مجيدكا للمسوّقين وابدأ في الربح من تروجك للألعاب. احصل
          على كود خاص بك واكسب عمولة من كل عملية شراء
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a
            href="/apply"
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
          >
            انضم الآن
          </a>
          <a
            href="#how-it-works"
            className="px-8 py-4 border border-slate-500 text-slate-300 font-semibold rounded-lg hover:border-blue-400 hover:text-blue-400 transition-all duration-300"
          >
            تعرف أكثر
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-400">500+</div>
            <p className="text-sm text-slate-400">شريك نشط</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400">10%</div>
            <p className="text-sm text-slate-400">عمولة لكل عملية</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-cyan-400">$50K+</div>
            <p className="text-sm text-slate-400">أرباح الشركاء</p>
          </div>
        </div>
      </div>
    </section>
  );
}
