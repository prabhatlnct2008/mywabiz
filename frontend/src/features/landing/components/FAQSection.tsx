import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const faqs = [
  {
    question: 'Do I need a website or app?',
    answer: 'No! mywabiz provides you with a mobile-optimized storefront accessible via a simple link. Your customers can browse and shop without downloading any app. You manage everything from your Google Sheet and receive orders on WhatsApp.',
  },
  {
    question: 'Can I use this only with WhatsApp?',
    answer: 'Yes! WhatsApp is at the heart of mywabiz. Customers complete their checkout by sending a pre-filled message to your WhatsApp number. You receive full order details directly in WhatsApp and can manage everything from there.',
  },
  {
    question: 'Can I take Cash on Delivery?',
    answer: 'Absolutely! mywabiz supports Cash on Delivery (COD) as well as online payment options. You can enable or disable payment methods based on your business needs. Many Delhi merchants prefer starting with COD.',
  },
  {
    question: 'Can I change my language later?',
    answer: 'Yes, you can change your store language anytime from your dashboard. We support Hindi, English, and other regional languages. Your product catalog and customer-facing pages will automatically update to reflect the new language.',
  },
  {
    question: 'How do I update my products?',
    answer: 'Simply edit your Google Sheet! When you create your store, we generate a ready-made Google Sheet with columns for product name, price, image, stock, and more. Any changes you make are reflected on your store within minutes.',
  },
  {
    question: 'What happens after the free trial?',
    answer: 'Your free Starter plan never expires and supports up to 50 products. If you start a trial for Growth or Pro plans, you can continue using those features for 14 days. After the trial, you can choose to upgrade or downgrade to any plan, including staying on the free Starter plan.',
  },
  {
    question: 'Is there a setup fee?',
    answer: 'No setup fees, ever! The Starter plan is completely free. Paid plans start at ₹299/month with no hidden charges or setup costs. You only pay for the plan you choose.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes, you can cancel your paid plan anytime. Your store will automatically downgrade to the free Starter plan (with 50 product limit). All your data remains safe and accessible.',
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
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about mywabiz
          </p>
        </div>

        <div className="space-y-4">
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

        {/* Contact Support */}
        <div className="mt-12 text-center bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 border border-primary-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-4">
            Our team is here to help you get started
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:hello@mywabiz.com"
              className="text-primary-600 hover:text-primary-700 font-medium hover:underline"
            >
              Email us at hello@mywabiz.com
            </a>
            <span className="hidden sm:inline text-gray-400">•</span>
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 font-medium hover:underline"
            >
              WhatsApp us at +91 99999 99999
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
