import {
  SparklesIcon,
  ShoppingBagIcon,
  HomeIcon,
  CakeIcon
} from '@heroicons/react/24/outline'

const audiences = [
  {
    title: 'Clothing & Boutiques',
    description: 'Showcase your latest collections with beautiful product images and manage inventory effortlessly.',
    icon: SparklesIcon,
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    title: 'Kirana & Grocery Shops',
    description: 'Let customers order daily essentials online and receive orders directly on WhatsApp.',
    icon: ShoppingBagIcon,
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Home Chefs & Tiffin Services',
    description: 'Share your daily menu, accept pre-orders, and manage delivery schedules with ease.',
    icon: CakeIcon,
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    title: 'Home-based Businesses',
    description: 'Perfect for handmade crafts, jewelry, home decor, and other home-based ventures.',
    icon: HomeIcon,
    gradient: 'from-purple-500 to-indigo-500',
  },
]

export default function TargetAudience() {
  return (
    <section className="py-20 px-4 bg-white" id="who-its-for">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-heading mb-4">
            Perfect for Delhi Merchants
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built specifically for small businesses and entrepreneurs who want to sell online without complexity.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {audiences.map((audience, index) => (
            <div
              key={audience.title}
              className="group relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${audience.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />

              <div className="relative">
                <div className={`w-14 h-14 bg-gradient-to-br ${audience.gradient} rounded-xl flex items-center justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <audience.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-heading">
                  {audience.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {audience.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quote Section */}
        <div className="relative bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 md:p-12 border border-primary-200">
          <div className="absolute top-6 left-6 text-6xl text-primary-300 opacity-50 font-serif">"</div>
          <div className="relative text-center max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl text-gray-800 font-medium mb-4 italic">
              If your customers already message you on WhatsApp, you're one step away from having a complete online store.
            </p>
            <p className="text-primary-600 font-semibold">
              Stop losing orders. Start selling smarter.
            </p>
          </div>
          <div className="absolute bottom-6 right-6 text-6xl text-primary-300 opacity-50 font-serif rotate-180">"</div>
        </div>
      </div>
    </section>
  )
}
