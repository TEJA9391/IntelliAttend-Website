"use client";

import React, { useEffect, useRef } from 'react';

export function NeuralMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let isAnimating = false;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(45, 212, 191, 0.6)';
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const densityParticles = Math.floor((canvas.width * canvas.height) / 12000);
      const maxParticles = window.innerWidth < 768 ? 40 : 100;
      const numParticles = Math.min(maxParticles, densityParticles);
      
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    };

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(45, 212, 191, ${0.4 * (1 - distance / 150)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      if (!isAnimating) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (const p of particles) {
        p.update();
        p.draw();
      }
      
      drawConnections();
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();

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
    }, { threshold: 0 });

    observer.observe(canvas);

    return () => {
      window.removeEventListener('resize', resize);
      observer.disconnect();
      isAnimating = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
