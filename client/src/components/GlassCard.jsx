import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';

const GlassCard = ({ 
  children, 
  hover = true, 
  blur = 20,
  brightness = 180,
  opacity = 0.15,
  borderOpacity = 0.3,
  glow = true,
  ...props 
}) => {
  const glassBg = useColorModeValue(
    `rgba(255, 255, 255, ${opacity})`,
    `rgba(0, 0, 0, ${opacity + 0.1})`
  );

  const glassBorder = useColorModeValue(
    `rgba(255, 255, 255, ${borderOpacity})`,
    `rgba(255, 255, 255, ${borderOpacity * 0.5})`
  );

  const glassShadow = useColorModeValue(
    glow ? '0 8px 32px 0 rgba(31, 38, 135, 0.2), 0 0 40px rgba(100, 200, 150, 0.1)' : '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
    glow ? '0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 0 40px rgba(100, 200, 150, 0.15)' : '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
  );

  return (
    <Box
      bg={glassBg}
      sx={{
        backdropFilter: `blur(${blur}px) saturate(${brightness}%)`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(${brightness}%)`,
        backgroundColor: glassBg,
      }}
      border={`1px solid ${glassBorder}`}
      borderRadius="24px"
      boxShadow={glassShadow}
      transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={
        hover
          ? {
              transform: 'translateY(-12px) scale(1.03)',
              boxShadow: '0 24px 80px 0 rgba(31, 38, 135, 0.3), 0 0 60px rgba(100, 200, 150, 0.2)',
              border: `1px solid rgba(100, 200, 150, ${borderOpacity + 0.3})`,
              '& .glossy-overlay': {
                opacity: 1,
              },
            }
          : {}
      }
      position="relative"
      overflow="hidden"
      {...props}
    >
      {/* Animated glossy overlay effect */}
      <Box
        className="glossy-overlay"
        position="absolute"
        top={0}
        left={0}
        right={0}
        height="60%"
        bg="linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%)"
        pointerEvents="none"
        opacity={0.8}
        transition="opacity 0.4s ease"
      />

      {/* Shimmer effect on hover */}
      <Box
        position="absolute"
        top={0}
        left="-100%"
        right={0}
        bottom={0}
        bg="linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)"
        pointerEvents="none"
        _groupHover={{
          left: '100%',
          transition: 'left 0.6s ease-in-out',
        }}
        sx={{
          '.group:hover &': {
            left: '100%',
            transition: 'left 0.6s ease-in-out',
          },
        }}
      />

      {/* Corner accent */}
      <Box
        position="absolute"
        top={0}
        right={0}
        width="80px"
        height="80px"
        bg="radial-gradient(circle at top right, rgba(100, 200, 150, 0.2), transparent 70%)"
        pointerEvents="none"
      />

      {/* Content */}
      {children}
    </Box>
  );
};

export default GlassCard;
