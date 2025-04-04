import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function PortalTooltip({
  children,
  content
}: {
  children: React.ReactNode;
  content: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Update position when tooltip is opened
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY,
        left: rect.right + window.scrollX + 10 // 10px offset from the trigger
      });
    }
  }, [isOpen]);

  // Close tooltip when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen]);

  return (
    <>
      <div
        className="inline"
        ref={triggerRef}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        {children}
      </div>
      {isOpen &&
        createPortal(
          <div
            ref={tooltipRef}
            className="absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-md border bg-background text-popover-foreground shadow-md fade-in-0 zoom-in-95"
            style={
              {
                // top: `${position.top - 10}px`,
                // left: `${
                //   position.left - (tooltipRef.current?.offsetWidth ?? 0) - 45
                // }px`
                // maxWidth: '400px'
              }
            }
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
}
