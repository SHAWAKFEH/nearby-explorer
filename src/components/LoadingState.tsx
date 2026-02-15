import { MapPin, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function LoadingState({ message = 'Finding nearby places...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center shadow-glow mb-6"
      >
        <MapPin size={36} className="text-white" />
      </motion.div>
      <Loader2 className="animate-spin text-primary mb-4" size={24} />
      <p className="text-muted-foreground text-center">{message}</p>
    </div>
  );
}
