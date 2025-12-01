import { Link } from 'react-router-dom'
import Button from '@/components/Button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <span className="text-2xl font-bold text-primary-500 font-heading">
              mywabiz
            </span>
            <Link to="/login">
              <Button variant="secondary">Login</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-heading mb-6">
            Turn your WhatsApp into a proper store in 10 minutes.
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            mywabiz lets Delhi shops sell with a simple link, Google Sheet catalog, and WhatsApp checkout. No app, no coding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg">Create your free store</Button>
            </Link>
            <Button variant="secondary" size="lg">
              View demo store
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 font-heading mb-12">
            From zero to WhatsApp store in 3 steps
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Create your store',
                description: 'Enter store name, WhatsApp number, and language. Get your link instantly.',
              },
              {
                step: '2',
                title: 'Add products in Google Sheet',
                description: 'We create a ready-made sheet. Edit like Excel – Name, Price, Size, Stock.',
              },
              {
                step: '3',
                title: 'Share & receive orders on WhatsApp',
                description: 'Customers browse your catalog, checkout, and you get full order details in WhatsApp.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          © 2024 mywabiz. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
