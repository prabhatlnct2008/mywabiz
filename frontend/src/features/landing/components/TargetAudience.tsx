import {
  SparklesIcon,
  ShoppingBagIcon,
  CakeIcon,
  CubeIcon
} from '@heroicons/react/24/outline'

const useCases = [
  {
    title: 'Clothing & fashion sellers',
    description: 'Show full collections with sizes and colours, not just scattered product photos in chat.',
    icon: SparklesIcon,
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    title: 'Grocery & daily essentials',
    description: 'Keep prices updated in one sheet. Customers add items themselves; you get one clear list.',
    icon: ShoppingBagIcon,
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Home chefs & tiffin services',
    description: 'List today\'s menu, capture address and delivery time in a structured form, not voice notes.',
    icon: CakeIcon,
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    title: 'Wholesalers & resellers',
    description: 'Let buyers pick quantities and variants without back-and-forth messages for every item.',
    icon: CubeIcon,
    gradient: 'from-purple-500 to-indigo-500',
  },
]

export default function TargetAudience() {
  return (
    <section className="py-20 px-4 bg-white" id="who-its-for">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-heading mb-4">
            Works beautifully for…
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built specifically for small businesses that already sell on WhatsApp.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {useCases.map((useCase, index) => (
            <div
              key={useCase.title}
              className="group relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${useCase.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />

              <div className="relative">
                <div className={`w-14 h-14 bg-gradient-to-br ${useCase.gradient} rounded-xl flex items-center justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <useCase.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-heading">
                  {useCase.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {useCase.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
