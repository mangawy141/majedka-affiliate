"use client";

export function CTABanner() {
  const handleScroll = () => {
    const formSection = document.getElementById("form");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-y border-cyan-500/30">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold">
          <span className="gradient-text">ابدأ الآن</span> وخلّي
          <br />
          متابعينك <span className="gradient-text">مصدر دخلك</span>
        </h2>

        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          لا تحتاج لأي خبرة سابقة، كل ما تحتاجه هو متابعين مهتمين والقليل من
          الجهد
        </p>

        <button
          onClick={handleScroll}
          className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold text-lg rounded-lg transition-all duration-300 transform hover:scale-105 inline-block"
        >
          ابدأ الآن مجانًا
        </button>
      </div>
    </section>
  );
}
