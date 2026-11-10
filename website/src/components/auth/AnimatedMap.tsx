"use client";

import React, { useRef, useEffect, useState } from "react";

type RoutePoint = {
  x: number;
  y: number;
  delay: number;
};

export const AnimatedMap = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Set up routes that will animate across the map
  const routes: { start: RoutePoint; end: RoutePoint; color: string }[] = [
    {
      start: { x: 100, y: 150, delay: 0 },
      end: { x: 200, y: 80, delay: 2 },
      color: "#2DD4BF",
    },
    {
      start: { x: 200, y: 80, delay: 2 },
      end: { x: 260, y: 120, delay: 4 },
      color: "#2DD4BF",
    },
    {
      start: { x: 50, y: 50, delay: 1 },
      end: { x: 150, y: 180, delay: 3 },
      color: "#2DD4BF",
    },
    {
      start: { x: 280, y: 60, delay: 0.5 },
      end: { x: 180, y: 180, delay: 2.5 },
      color: "#2DD4BF",
    },
  ];

  // Create dots for the world map
  const generateDots = (width: number, height: number) => {
    const dots = [];
    const gap = 12;
    const dotRadius = 1.5;

    // Create a dot grid pattern with random opacity
    for (let x = 0; x < width; x += gap) {
      for (let y = 0; y < height; y += gap) {
        // Shape the dots to form a world map silhouette
        const isInMapShape =
          ((x < width * 0.25 && x > width * 0.05) && (y < height * 0.4 && y > height * 0.1)) ||
          ((x < width * 0.25 && x > width * 0.15) && (y < height * 0.8 && y > height * 0.4)) ||
          ((x < width * 0.45 && x > width * 0.3) && (y < height * 0.35 && y > height * 0.15)) ||
          ((x < width * 0.5 && x > width * 0.35) && (y < height * 0.65 && y > height * 0.35)) ||
          ((x < width * 0.7 && x > width * 0.45) && (y < height * 0.5 && y > height * 0.1)) ||
          ((x < width * 0.8 && x > width * 0.65) && (y < height * 0.8 && y > height * 0.6));

        if (isInMapShape && Math.random() > 0.3) {
          dots.push({
            x,
            y,
            radius: dotRadius,
            opacity: Math.random() * 0.5 + 0.2,
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
    const dots = generateDots(dimensions.width, dimensions.height);
    let animationFrameId: number;
    let startTime = Date.now();

    function drawDots() {
      context.clearRect(0, 0, dimensions.width, dimensions.height);
      
      dots.forEach(dot => {
        context.beginPath();
        context.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(45, 212, 191, ${dot.opacity})`; 
        context.fill();
      });
    }

    function drawRoutes() {
      const currentTime = (Date.now() - startTime) / 1000; 
      
      routes.forEach(route => {
        const elapsed = currentTime - route.start.delay;
        if (elapsed <= 0) return;
        
        const duration = 3; 
        const progress = Math.min(elapsed / duration, 1);
        
        const x = route.start.x + (route.end.x - route.start.x) * progress;
        const y = route.start.y + (route.end.y - route.start.y) * progress;
        
        context.beginPath();
        context.moveTo(route.start.x, route.start.y);
        context.lineTo(x, y);
        context.strokeStyle = route.color;
        context.lineWidth = 1.5;
        context.stroke();
        
        context.beginPath();
        context.arc(route.start.x, route.start.y, 3, 0, Math.PI * 2);
        context.fillStyle = route.color;
        context.fill();
        
        context.beginPath();
        context.arc(x, y, 3, 0, Math.PI * 2);
        context.fillStyle = "#2DD4BF";
        context.fill();
        
        context.beginPath();
        context.arc(x, y, 6, 0, Math.PI * 2);
        context.fillStyle = "rgba(45, 212, 191, 0.4)";
        context.fill();
        
        if (progress === 1) {
          context.beginPath();
          context.arc(route.end.x, route.end.y, 3, 0, Math.PI * 2);
          context.fillStyle = route.color;
          context.fill();
        }
      });
    }
    
    let isAnimating = false;
    function animate() {
      if (!isAnimating) return;
      drawDots();
      drawRoutes();
      
      const currentTime = (Date.now() - startTime) / 1000;
      if (currentTime > 15) { 
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
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
