"use client";

import { Star, Heart, ShoppingCart } from "lucide-react";

const featuredProducts = [
  {
    id: 1,
    name: "Final Fantasy VII Rebirth",
    category: "RPG",
    price: 149.99,
    originalPrice: 299.99,
    discount: 50,
    rating: 4.9,
    reviews: 2150,
    image: "🎮",
    badge: "الجديد",
  },
  {
    id: 2,
    name: "Baldur's Gate 3",
    category: "RPG",
    price: 179.99,
    originalPrice: 359.99,
    discount: 50,
    rating: 4.8,
    reviews: 5230,
    image: "⚔️",
    badge: "الأفضل بيعاً",
  },
  {
    id: 3,
    name: "Palworld",
    category: "Adventure",
    price: 89.99,
    originalPrice: 199.99,
    discount: 55,
    rating: 4.7,
    reviews: 3890,
    image: "🎯",
    badge: "محبوب",
  },
  {
    id: 4,
    name: "Helldivers 2",
    category: "Shooter",
    price: 59.99,
    originalPrice: 149.99,
    discount: 60,
    rating: 4.6,
    reviews: 4120,
    image: "🚀",
    badge: "خصم كبير",
  },
  {
    id: 5,
    name: "Dragon's Dogma 2",
    category: "Action RPG",
    price: 139.99,
    originalPrice: 299.99,
    discount: 53,
    rating: 4.8,
    reviews: 2890,
    image: "🐉",
    badge: "إعادة تقييم",
  },
  {
    id: 6,
    name: "Tekken 8",
    category: "Fighting",
    price: 109.99,
    originalPrice: 279.99,
    discount: 61,
    rating: 4.9,
    reviews: 1560,
    image: "👊",
    badge: "الأكثر تقييماً",
  },
];

export default function ProductsSection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background Effects */}
      <div className="absolute -top-20 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      {/* Section Header */}
      <div className="relative z-10 text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
          الألعاب المميزة هذا الأسبوع
        </h2>
        <p className="text-slate-400 text-lg">
          اختر من أفضل الإصدارات بأسعار لا تقبل المنافسة
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {featuredProducts.map((product) => (
          <div
            key={product.id}
            className="group relative overflow-hidden rounded-xl border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300"
          >
            {/* Product Card Base */}
            <div className="glass h-96 p-4 flex flex-col relative">
              {/* Image Section */}
              <div className="relative mb-4 h-32 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg overflow-hidden flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                <span className="text-6xl group-hover:scale-125 transition-transform duration-300">
                  {product.image}
                </span>

                {/* Badge */}
                <div className="absolute top-2 left-2 px-3 py-1 bg-cyan-500/80 text-white text-xs font-bold rounded-full backdrop-blur-sm">
                  {product.badge}
                </div>

                {/* Wishlist Button */}
                <button className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-red-500/30 rounded-lg backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100">
                  <Heart className="w-4 h-4 text-red-400" />
                </button>

                {/* Discount Badge */}
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-red-500/80 text-white text-xs font-bold rounded backdrop-blur-sm">
                  -{product.discount}%
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 flex flex-col">
                {/* Product Info */}
                <div className="mb-3">
                  <p className="text-xs text-cyan-400 font-semibold mb-1">
                    {product.category}
                  </p>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition line-clamp-2">
                    {product.name}
                  </h3>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price Section */}
                <div className="flex items-end justify-between mb-4 mt-auto">
                  <div>
                    <p className="text-sm text-slate-500 line-through">
                      {product.originalPrice} ر.س
                    </p>
                    <p className="text-2xl font-bold text-cyan-400">
                      {product.price} ر.س
                    </p>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 group/btn">
                  <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition" />
                  أضف للسلة
                </button>
              </div>

              {/* Hover Glow Border */}
              <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-cyan-500/30 pointer-events-none transition duration-300" />
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-16 text-center relative z-10">
        <button className="px-8 py-4 glass border-cyan-500/50 text-cyan-300 font-bold hover:bg-cyan-500/20 transition-all duration-300 rounded-lg hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]">
          عرض جميع الألعاب
        </button>
      </div>
    </section>
  );
}
