import { Button } from '@/react/components/ui/button';

export const HeroSection = () => (
  <section className="relative py-24 px-6 overflow-hidden">
    {/* Background gradient */}
    <div className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/30" />
      <div className="absolute inset-0 bg-grid-white/5" />
    </div>
    
    <div className="container mx-auto text-center relative">
      <div className="glass-panel max-w-4xl mx-auto p-8 md:p-12 rounded-2xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Organize Your Digital Resources
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Save, organize, and access your favorite links from anywhere, anytime.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="group relative overflow-hidden">
            <span className="relative z-10">Get Started</span>
            <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
          <Button variant="outline" size="lg" className="relative group">
            <span className="relative z-10">Learn More</span>
            <span className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-md -z-10" />
          </Button>
        </div>
      </div>
    </div>
  </section>
);
