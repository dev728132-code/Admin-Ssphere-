import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
  size?: number;
  theme?: 'slate' | 'cosmic';
}

export default function Logo({ className, size = 24, theme = 'cosmic' }: LogoProps) {
  const isCosmic = theme === 'cosmic';
  
  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <motion.svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background Shield/Hexagon shape */}
        <motion.path
          d="M50 5 L90 27 V73 L50 95 L10 73 V27 L50 5Z"
          stroke={isCosmic ? "#00D2FF" : "#0F172A"}
          strokeWidth="4"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        
        {/* Stylized 'N' or Nova shape */}
        <motion.path
          d="M30 70 V30 L70 70 V30"
          stroke={isCosmic ? "#00D2FF" : "#0F172A"}
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeInOut" }}
        />
        
        {/* Accent dots/spark */}
        <motion.circle
          cx="50"
          cy="50"
          r="4"
          fill={isCosmic ? "#00D2FF" : "#0F172A"}
          animate={{ 
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.svg>
    </div>
  );
}
