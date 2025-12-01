import { Link } from 'react-router-dom'
import Button from '@/components/Button'

export default function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary-500 font-heading">
              mywabiz
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="secondary" size="md">Login</Button>
            </Link>
            <Link to="/login">
              <Button variant="primary" size="md">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
