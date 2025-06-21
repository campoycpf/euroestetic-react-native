"use client";
import { motion, AnimatePresence } from "framer-motion";

interface AddToCartAnimationProps {
  isVisible: boolean;
  productName: string;
}

const AddToCartAnimation = ({ isVisible, productName }: AddToCartAnimationProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed bg-gradient-to-r from-euroestetic via-euroestetic/90 to-euroestetic/70 text-white px-6 py-3 rounded-lg shadow-lg z-[999] bottom-0 right-0 text-sm"
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p>{productName} añadido a la cesta!</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddToCartAnimation;