import {
  PlusCircleIcon,
  TableCellsIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

const steps = [
  {
    step: '1',
    title: 'Create your store',
    description: 'Enter store name, WhatsApp number, and language. Get your link instantly.',
    icon: PlusCircleIcon,
    color: 'bg-primary-500',
  },
  {
    step: '2',
    title: 'Add products in Google Sheet',
    description: 'We create a ready-made sheet. Edit like Excel – Name, Price, Size, Stock.',
    icon: TableCellsIcon,
    color: 'bg-accent-500',
  },
  {
    step: '3',
    title: 'Share & receive orders on WhatsApp',
    description: 'Customers browse your catalog, checkout, and you get full order details in WhatsApp.',
    icon: ChatBubbleLeftRightIcon,
    color: 'bg-primary-600',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50 px-4" id="how-it-works">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-heading mb-4">
            From zero to WhatsApp store in 3 steps
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            No technical skills needed. Get your online store up and running in minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((item, index) => (
            <div
              key={item.step}
              className="relative text-center group animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Connection Line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-200 to-primary-300 z-0" />
              )}

              {/* Icon Circle */}
              <div className="relative z-10 mb-6">
                <div className={`w-24 h-24 ${item.color} text-white rounded-full flex items-center justify-center mx-auto shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
                  <item.icon className="w-12 h-12" />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white border-2 border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow-md">
                  <span className="text-lg font-bold text-gray-700">{item.step}</span>
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3 font-heading">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
