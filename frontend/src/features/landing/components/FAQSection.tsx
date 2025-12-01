import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import Button from '@/components/Button'

const faqs = [
  {
    question: 'Do I need a separate website or app?',
    answer: 'No. mywabiz gives you a store link that works in any browser. Your customers browse there and confirm orders on WhatsApp.',
  },
  {
    question: 'Can I keep using my existing WhatsApp number?',
    answer: 'Yes. All orders come to your existing WhatsApp number as structured messages. No new app is required.',
  },
  {
    question: 'Which languages do you support?',
    answer: 'You can show store buttons and system messages in English, Hindi, Punjabi, Gujarati, or Haryanvi. Product names and descriptions stay exactly as you write them.',
  },
  {
    question: 'Can I use Cash on Delivery?',
    answer: 'Yes. You can accept COD, and you can also enable online payments through supported providers if you want to.',
  },
  {
    question: 'How long does setup really take?',
    answer: 'Most sellers can go from zero to a working store in under 10 minutes, including adding their first products.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 px-4 bg-white" id="faq">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-heading mb-4">
            Questions you might have.
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about mywabiz
          </p>
        </div>

        <div className="space-y-4 mb-16">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-primary-300 transition-colors duration-200 animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="font-semibold text-gray-900 text-lg">
                  {faq.question}
                </span>
                <ChevronDownIcon
                  className={`w-5 h-5 text-primary-500 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Final CTA Band */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold font-heading mb-4">
            Ready to turn your WhatsApp into a real store?
          </h3>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Create your free mywabiz store today, share a single link, and start getting clear orders in the languages your customers love.
          </p>
          <Link to="/login">
            <Button
              size="lg"
              className="bg-white text-primary-600 hover:bg-primary-50 border-none"
            >
              Create your free store
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
