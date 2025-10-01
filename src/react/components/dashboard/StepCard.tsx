import { cn } from '~/lib/utils';

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  className?: string;
}

export const StepCard = ({
  number,
  title,
  description,
  className,
}: StepCardProps) => {
  return (
    <div className={cn("card-border-gradient p-6 transition-all duration-300 group hover:shadow-lg relative", className)}>
      <div className="relative h-full flex flex-col z-10">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg mb-4 group-hover:bg-primary/20 transition-colors duration-300">
          <span className="group-hover:scale-110 transition-transform duration-300">
            {number}
          </span>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300">
          {description}
        </p>
      </div>
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
    </div>
  );
};
