import { motion } from "framer-motion";

export default function AuroraBackground({ children }) {
  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            transform: [
              "translate(0%, 0%) scale(1)",
              "translate(5%, 10%) scale(1.1)",
              "translate(-5%, -5%) scale(0.9)",
              "translate(0%, 0%) scale(1)",
            ],
          }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/30 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            transform: [
              "translate(0%, 0%) scale(1)",
              "translate(-10%, 5%) scale(1.2)",
              "translate(5%, -10%) scale(0.8)",
              "translate(0%, 0%) scale(1)",
            ],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-600/20 rounded-full blur-[150px]"
        />
      </div>
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
