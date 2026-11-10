"use client";

import React, { useRef, useEffect, useState } from "react";

export type RoutePoint = {
  x: number;
  y: number;
  delay: number;
};

export const DotMap = ({ dotColor, lineColor }: { dotColor: string, lineColor: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Set up routes that will animate to form the EXACT IntelliAttend logo geometry
  const routes: { start: RoutePoint; end: RoutePoint; color: string }[] = [
    // --- Blue Web Structure ---
    // N1 (Top) connections
    { start: { x: 228, y: 36, delay: 0 }, end: { x: 191, y: 60, delay: 1.5 }, color: lineColor }, // N1 -> N2
    { start: { x: 228, y: 36, delay: 0 }, end: { x: 195, y: 115, delay: 1.5 }, color: lineColor }, // N1 -> N4
    { start: { x: 228, y: 36, delay: 0.5 }, end: { x: 270, y: 186, delay: 2 }, color: lineColor }, // N1 -> P1 (Right edge)

    // N2 (Top-Left) connections
    { start: { x: 191, y: 60, delay: 1.5 }, end: { x: 140, y: 111, delay: 3 }, color: lineColor }, // N2 -> N3
    { start: { x: 191, y: 60, delay: 1.5 }, end: { x: 195, y: 115, delay: 3 }, color: lineColor }, // N2 -> N4
    { start: { x: 191, y: 60, delay: 1.5 }, end: { x: 193, y: 181, delay: 3 }, color: lineColor }, // N2 -> N6 (Vertical Spine)

    // N3 (Far-Left) connections
    { start: { x: 140, y: 111, delay: 3 }, end: { x: 195, y: 115, delay: 4.5 }, color: lineColor }, // N3 -> N4
    { start: { x: 140, y: 111, delay: 3 }, end: { x: 140, y: 179, delay: 4.5 }, color: lineColor }, // N3 -> N5
    { start: { x: 140, y: 111, delay: 3 }, end: { x: 193, y: 181, delay: 4.5 }, color: lineColor }, // N3 -> N6 (Diagonal)

    // N5 (Bottom-Left) connections
    { start: { x: 140, y: 179, delay: 4.5 }, end: { x: 195, y: 115, delay: 6 }, color: lineColor }, // N5 -> N4 (Diagonal)
    { start: { x: 140, y: 179, delay: 4.5 }, end: { x: 193, y: 181, delay: 6 }, color: lineColor }, // N5 -> N6 (Bottom horizontal)

    // Bottom Right Triangle
    { start: { x: 193, y: 181, delay: 6 }, end: { x: 226, y: 142, delay: 7.5 }, color: lineColor }, // N6 -> LB
    { start: { x: 226, y: 142, delay: 7.5 }, end: { x: 270, y: 186, delay: 9 }, color: lineColor }, // LB -> P1

    // --- The Lightbulb ---
    { start: { x: 226, y: 142, delay: 7.5 }, end: { x: 215, y: 130, delay: 8 }, color: lineColor }, // Stem to bulb bottom
    // Bulb Diamond Shape
    { start: { x: 215, y: 130, delay: 8 }, end: { x: 211, y: 124, delay: 8.5 }, color: lineColor },
    { start: { x: 211, y: 124, delay: 8.5 }, end: { x: 215, y: 118, delay: 9 }, color: lineColor },
    { start: { x: 215, y: 118, delay: 9 }, end: { x: 219, y: 124, delay: 9.5 }, color: lineColor },
    { start: { x: 219, y: 124, delay: 9.5 }, end: { x: 215, y: 130, delay: 10 }, color: lineColor },
    
    // Rays
    { start: { x: 209, y: 118, delay: 9 }, end: { x: 205, y: 114, delay: 9.5 }, color: lineColor },
    { start: { x: 215, y: 114, delay: 9.1 }, end: { x: 215, y: 108, delay: 9.6 }, color: lineColor },
    { start: { x: 221, y: 118, delay: 9.2 }, end: { x: 225, y: 114, delay: 9.7 }, color: lineColor },
    { start: { x: 207, y: 124, delay: 9.3 }, end: { x: 201, y: 124, delay: 9.8 }, color: lineColor },
    { start: { x: 223, y: 124, delay: 9.4 }, end: { x: 229, y: 124, delay: 9.9 }, color: lineColor },

    // --- The Green Checkmark ---
    { start: { x: 231, y: 93, delay: 6 }, end: { x: 246, y: 131, delay: 7.5 }, color: lineColor }, // Short leg
    { start: { x: 246, y: 131, delay: 7.5 }, end: { x: 297, y: 27, delay: 9.5 }, color: lineColor }, // Long leg
  ];

  // Create dots for the sparse square grid
  const generateDots = (width: number, height: number) => {
    const dots = [];
    const gap = 24; // Spacing between grid points
    const dotSize = 2.5; // Size of the square dot

    // Create a uniform dot grid pattern with random omissions
    for (let x = 0; x < width; x += gap) {
      for (let y = 0; y < height; y += gap) {
        // Only render some dots randomly to create a sparse grid effect (e.g. 30% chance to render)
        if (Math.random() > 0.7) {
          dots.push({
            x,
            y,
            size: dotSize,
            opacity: Math.random() * 0.4 + 0.1, // Random opacity between 0.1 and 0.5
          });
        }
      }
    }
    return dots;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
      canvas.width = width;
      canvas.height = height;
    });

    resizeObserver.observe(canvas.parentElement as Element);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const context = ctx;
    
    // Create an offscreen canvas for the static dots to prevent re-rendering them every frame
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = dimensions.width;
    offscreenCanvas.height = dimensions.height;
    const offscreenCtx = offscreenCanvas.getContext("2d");
    
    if (offscreenCtx) {
      const dots = generateDots(dimensions.width, dimensions.height);
      dots.forEach(dot => {
        offscreenCtx.fillStyle = `rgba(${dotColor}, ${dot.opacity})`;
        offscreenCtx.fillRect(dot.x, dot.y, dot.size, dot.size);
      });
    }

    let animationFrameId: number;
    let startTime = Date.now();

    // Draw background dots
    function drawDots() {
      context.clearRect(0, 0, dimensions.width, dimensions.height);
      context.drawImage(offscreenCanvas, 0, 0);
    }

    // Draw animated routes
    function drawRoutes() {
      const currentTime = (Date.now() - startTime) / 1000; // Time in seconds
      
      routes.forEach(route => {
        const elapsed = currentTime - route.start.delay;
        if (elapsed <= 0) return;
        
        const duration = 3; // Animation duration in seconds
        const progress = Math.min(elapsed / duration, 1);
        
        const x = route.start.x + (route.end.x - route.start.x) * progress;
        const y = route.start.y + (route.end.y - route.start.y) * progress;
        
        // Draw the route line
        context.beginPath();
        context.moveTo(route.start.x, route.start.y);
        context.lineTo(x, y);
        context.strokeStyle = route.color;
        context.lineWidth = 1.5;
        context.stroke();
        
        // Draw the start point
        context.beginPath();
        context.arc(route.start.x, route.start.y, 3, 0, Math.PI * 2);
        context.fillStyle = route.color;
        context.fill();
        
        // Draw the moving point
        context.beginPath();
        context.arc(x, y, 3, 0, Math.PI * 2);
        context.fillStyle = lineColor;
        context.fill();
        
        // Add glow effect to the moving point
        context.beginPath();
        context.arc(x, y, 6, 0, Math.PI * 2);
        context.fillStyle = `rgba(${dotColor}, 0.4)`;
        context.fill();
        
        // If the route is complete, draw the end point
        if (progress === 1) {
          context.beginPath();
          context.arc(route.end.x, route.end.y, 3, 0, Math.PI * 2);
          context.fillStyle = route.color;
          context.fill();
        }
      });
    }
    
    // Animation loop
    let isAnimating = false;
    function animate() {
      if (!isAnimating) return;
      drawDots();
      drawRoutes();
      
      // If all routes are complete, restart the animation
      const currentTime = (Date.now() - startTime) / 1000;
      if (currentTime > 15) { // Reset after 15 seconds
        startTime = Date.now();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    }
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (!isAnimating) {
          isAnimating = true;
          animate();
        }
      } else {
        isAnimating = false;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      }
    });

    observer.observe(canvas);

    return () => {
      observer.disconnect();
      isAnimating = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [dimensions]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

