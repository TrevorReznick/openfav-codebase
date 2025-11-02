'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { HeroSection } from '@/react/components/dashboard/sub/HeroSection'
import { 
  Rocket, 
  Zap, 
  Box, 
  Trophy, 
  Users as UsersIcon, 
  ThumbsUp
} from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Rocket,
      title: 'Lightning Fast',
      description: 'Access your resources instantly with our optimized platform.'
    },
    {
      icon: Zap,
      title: 'Easy to Use',
      description: 'Intuitive interface that makes organizing a breeze.'
    },
    {
      icon: Box,
      title: 'All in One Place',
      description: 'Keep all your important links organized in one secure location.'
    },
    {
      icon: Trophy,
      title: 'Powerful Features',
      description: 'Advanced tools to manage and categorize your resources.'
    },
    {
      icon: UsersIcon,
      title: 'Collaborate',
      description: 'Share and collaborate on resources with your team.'
    },
    {
      icon: ThumbsUp,
      title: 'Reliable',
      description: 'Built with the latest technologies for maximum reliability.'
    }
  ];

  const steps = [
    {
      number: 1,
      title: 'Sign Up',
      description: 'Create your free account in seconds.'
    },
    {
      number: 2,
      title: 'Add Links',
      description: 'Save your favorite websites and resources.'
    },
    {
      number: 3,
      title: 'Organize',
      description: 'Categorize and tag your links for easy access.'
    },
    {
      number: 4,
      title: 'Access Anywhere',
      description: 'Your resources are available on all your devices.'
    }
  ];

  // Riferimenti per l'animazione
  const featuresRef = useRef(null);
  const stepsRef = useRef(null);
  
  const isInViewFeatures = useInView(featuresRef, { once: true, amount: 0.2 });
  const isInViewSteps = useInView(stepsRef, { once: true, amount: 0.2 });

  return (
    <div className="flex flex-col overflow-hidden">
      <HeroSection />
      
      {/* Features Section */}
      <section 
        ref={featuresRef}
        className="py-24 px-6 bg-secondary/50 relative overflow-hidden"
      >
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/30" />
          <div className="absolute inset-0 bg-grid-white/5" />
        </div>
        
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Amazing Features
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Everything you need to organize your digital life
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInViewFeatures ? { 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    delay: 0.2 + (index * 0.1),
                    duration: 0.5,
                    ease: "easeOut"
                  }
                } : {}}
                className="glass-card p-6 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section 
        ref={stepsRef}
        className="py-28 px-6 bg-secondary/50 relative overflow-hidden"
      >
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/30" />
          <div className="absolute inset-0 bg-grid-white/5" />
        </div>
        
        <div className="container mx-auto max-w-4xl">
          <motion.h2 
            className="text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isInViewSteps ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            How It Works
          </motion.h2>
          
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={isInViewSteps ? { 
                  opacity: 1, 
                  x: 0,
                  transition: { 
                    delay: 0.1 * index,
                    duration: 0.5
                  }
                } : {}}
                className="glass-card p-6 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
