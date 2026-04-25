/**
 * TiltCard — reusable Phase 5 card wrapper.
 * Provides:
 *   • Mouse-tracked 3D rotateX/rotateY tilt (max ±10°)
 *   • Specular shine radial gradient chasing cursor
 *   • Neon glow box-shadow on hover
 *   • Z-pop + scale on hover via Framer Motion whileHover
 */
import { useRef } from 'react';
import { motion, useMotionValue, useMotionTemplate, animate } from 'framer-motion';

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** RGB triplet for glow/shine colour, e.g. "0,212,255" (cyan) or "124,58,237" (purple) */
  glowColor?: string;
  maxTilt?: number;
}

export function TiltCard({
  children,
  className,
  style,
  glowColor = '0,212,255',
  maxTilt = 10,
  ...rest
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotX   = useMotionValue(0);
  const rotY   = useMotionValue(0);
  const shineX = useMotionValue(50);
  const shineY = useMotionValue(50);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const dx = (e.clientX - rect.left  - rect.width  / 2) / (rect.width  / 2);
    const dy = (e.clientY - rect.top   - rect.height / 2) / (rect.height / 2);
    rotX.set(-dy * maxTilt);
    rotY.set( dx * maxTilt);
    shineX.set(((e.clientX - rect.left) / rect.width)  * 100);
    shineY.set(((e.clientY - rect.top)  / rect.height) * 100);
  };

  const handleMouseLeave = () => {
    animate(rotX, 0, { duration: 0.55, ease: 'easeOut' });
    animate(rotY, 0, { duration: 0.55, ease: 'easeOut' });
    shineX.set(50);
    shineY.set(50);
  };

  const shine = useMotionTemplate`radial-gradient(circle at ${shineX}% ${shineY}%, rgba(${glowColor},0.18) 0%, transparent 58%)`;

  return (
    <motion.div
      ref={cardRef}
      className={className}
      {...rest}
      style={{
        ...style,
        rotateX: rotX,
        rotateY: rotY,
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
        position: 'relative',
      }}
      whileHover={{
        scale: 1.04,
        z: 28,
        boxShadow: `0 0 28px rgba(${glowColor},0.40), 0 8px 40px rgba(${glowColor},0.14), inset 0 0 0 1px rgba(${glowColor},0.30)`,
      }}
      transition={{
        scale:     { duration: 0.22, ease: 'easeOut' },
        z:         { duration: 0.22, ease: 'easeOut' },
        boxShadow: { duration: 0.25, ease: 'easeOut' },
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Specular shine — moves with cursor */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          background: shine,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      />
      {children}
    </motion.div>
  );
}
