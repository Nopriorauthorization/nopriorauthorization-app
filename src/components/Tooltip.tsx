import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiInfo, FiX } from 'react-icons/fi';

interface TooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click';
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({
  content,
  position = 'top',
  trigger = 'hover',
  children,
  className = ''
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (trigger === 'hover') setIsVisible(true);
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') setIsVisible(false);
  };

  const handleClick = () => {
    if (trigger === 'click') setIsVisible(!isVisible);
  };

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-gray-800';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-gray-800';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-gray-800';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-gray-800';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-gray-800';
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="cursor-pointer"
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 ${getPositionClasses()}`}
          >
            {/* Arrow */}
            <div
              className={`absolute w-0 h-0 border-4 ${getArrowClasses()}`}
              style={{ borderWidth: '6px' }}
            />

            {/* Tooltip Content */}
            <div className="bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg border border-gray-700 max-w-xs">
              <div className="flex items-start gap-3">
                <FiInfo className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm leading-relaxed">{content}</p>
                {trigger === 'click' && (
                  <button
                    onClick={() => setIsVisible(false)}
                    className="text-gray-400 hover:text-white transition flex-shrink-0"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Pre-built contextual tooltips for common scenarios
export function FeatureTooltip({ featureId, children }: { featureId: string; children: React.ReactNode }) {
  const getTooltipContent = (id: string) => {
    switch (id) {
      case 'personal-documents':
        return 'Start here! Upload your insurance cards, medical records, and important documents. This unlocks all other features.';
      case 'rich-health-timeline':
        return 'Build a visual timeline of your health journey. Add photos, voice notes, and medical events for a complete picture.';
      case 'lab-decoder':
        return 'AI-powered analysis of your lab results. Get expert insights and explanations in plain English.';
      case 'family-tree':
        return 'Connect with family members to understand hereditary patterns and shared health insights.';
      case 'provider-portal':
        return 'Securely share your health data with healthcare providers. Control exactly what they can see.';
      case 'ai-insights':
        return 'Advanced AI analysis of your health patterns, trends, and personalized recommendations.';
      default:
        return 'Learn more about this feature';
    }
  };

  return (
    <Tooltip content={getTooltipContent(featureId)} position="top">
      {children}
    </Tooltip>
  );
}