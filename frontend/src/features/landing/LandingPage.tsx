import { useEffect } from 'react'
import LandingHeader from './components/LandingHeader'
import HeroSection from './components/HeroSection'
import ProblemSection from './components/ProblemSection'
import HowItWorks from './components/HowItWorks'
import TargetAudience from './components/TargetAudience'
import FeaturesGrid from './components/FeaturesGrid'
import DemoSection from './components/DemoSection'
import PricingSection from './components/PricingSection'
import FAQSection from './components/FAQSection'
import LandingFooter from './components/LandingFooter'

export default function LandingPage() {
  // Enable smooth scrolling
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = ''
    }
  }, [])

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible')
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    )

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll(
      '.animate-fade-in, .animate-fade-in-up, .animate-slide-in-right'
    )
    animatedElements.forEach((el) => observer.observe(el))

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <main>
        <HeroSection />
        <ProblemSection />
        <HowItWorks />
        <TargetAudience />
        <FeaturesGrid />
        <DemoSection />
        <PricingSection />
        <FAQSection />
      </main>
      <LandingFooter />
    </div>
  )
}
