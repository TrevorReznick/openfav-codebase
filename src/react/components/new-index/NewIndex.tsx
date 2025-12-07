import React from 'react'
import { Rocket, Zap, Box, Trophy } from 'lucide-react'

import { FeatureCard } from '@/react/components/dashboard/FeatureCard'
import { ThemeToggle } from '@/react/components/common/ThemeToggle'
import { Button } from '@/react/components/ui/button'

const NewIndex: React.FC = () => {
  const features = [
    {
      icon: Rocket,
      title: 'Lightning Fast',
      description: 'Experience blazing fast performance with our optimized stack.',
    },
    {
      icon: Zap,
      title: 'Easy to Use',
      description: 'Intuitive interface that gets you up and running in minutes.',
    },
    {
      icon: Box,
      title: 'Powerful Features',
      description: 'All the tools you need to manage your content effectively.',
    },
    {
      icon: Trophy,
      title: 'Award Winning',
      description: 'Recognized by industry leaders for excellence in design.',
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top bar / navbar semplificata */}
      <header className="border-b border-border bg-background/80 backdrop-blur flex items-center justify-between px-6 py-4 sticky top-0 z-20">
        <div className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          OpenFav
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <a href="#features">Features</a>
          </Button>
          <Button asChild size="sm">
            <a href="/auth">Get Started</a>
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 flex-1 flex flex-col gap-16">
        {/* Hero Section */}
        <section className="text-center py-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Welcome to OpenFav
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            The modern way to manage and share your favorite links and resources.
          </p>
          <Button size="lg" asChild>
            <a href="/auth">Get Started</a>
          </Button>
        </section>

        {/* Features Section */}
        <section id="features" className="py-8">
          <h2 className="text-3xl font-bold text-center mb-10">Amazing Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} OpenFav. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default NewIndex
