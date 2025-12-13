import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, Phone, MapPin, ExternalLink, ChevronDown, Code, Shield, Briefcase, Award } from 'lucide-react';

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    // Initialize particles with random positions and velocities
    const initialParticles = [...Array(25)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      size: 3 + Math.random() * 3,
      color: i % 3 === 0 ? 'rgba(168, 85, 247, 0.6)' : i % 3 === 1 ? 'rgba(139, 92, 246, 0.5)' : 'rgba(16, 185, 129, 0.4)'
    }));
    particlesRef.current = initialParticles;
    setParticles(initialParticles);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = ['home', 'about', 'experience', 'projects', 'skills', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Animate particles using RAF for better performance
  useEffect(() => {
    const animateParticles = () => {
      const heroSection = document.getElementById('home');
      if (!heroSection) return;
      
      const rect = heroSection.getBoundingClientRect();
      const mouseX = mousePosition.x - rect.left;
      const mouseY = mousePosition.y - rect.top;
      
      particlesRef.current = particlesRef.current.map(particle => {
        let { x, y, vx, vy } = particle;
        
        // Move particle by its velocity
        x += vx;
        y += vy;
        
        // Bounce off edges
        if (x <= 0 || x >= 100) vx *= -1;
        if (y <= 0 || y >= 100) vy *= -1;
        
        // Repel from mouse (optimized calculation)
        const particleScreenX = (x / 100) * rect.width;
        const particleScreenY = (y / 100) * rect.height;
        
        const dx = particleScreenX - mouseX;
        const dy = particleScreenY - mouseY;
        const distanceSquared = dx * dx + dy * dy;
        const repelRadiusSquared = 120 * 120; // 120px repel radius
        
        // Only calculate repulsion if within radius (avoids sqrt for performance)
        if (distanceSquared < repelRadiusSquared && distanceSquared > 0) {
          const distance = Math.sqrt(distanceSquared);
          const force = (120 - distance) / 120;
          const angle = Math.atan2(dy, dx);
          vx += Math.cos(angle) * force * 0.3;
          vy += Math.sin(angle) * force * 0.3;
          
          // Limit velocity
          const speedSquared = vx * vx + vy * vy;
          if (speedSquared > 0.64) { // 0.8 * 0.8
            const speed = Math.sqrt(speedSquared);
            vx = (vx / speed) * 0.8;
            vy = (vy / speed) * 0.8;
          }
        }
        
        // Apply friction
        vx *= 0.98;
        vy *= 0.98;
        
        // Maintain minimum speed
        const speedSquared = vx * vx + vy * vy;
        if (speedSquared < 0.01) {
          vx += (Math.random() - 0.5) * 0.08;
          vy += (Math.random() - 0.5) * 0.08;
        }
        
        return { ...particle, x, y, vx, vy };
      });
      
      setParticles([...particlesRef.current]);
      animationFrameRef.current = requestAnimationFrame(animateParticles);
    };

    animationFrameRef.current = requestAnimationFrame(animateParticles);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mousePosition]);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const experiences = [
    {
      company: "SDLC Corp",
      role: "Fullstack Blockchain Developer",
      location: "Delhi (Remote)",
      period: "July 2025 - Present",
      highlights: [
        "Designed ERC-1400 hybrid RWA tokens (NGAUX, NGLYTH) with compliance and custody verification",
        "Developed multi-token ecosystem with staking tiers and diversified asset exposure"
      ]
    },
    {
      company: "Paisa",
      role: "Full Stack Blockchain Developer",
      location: "Dubai (Remote)",
      period: "August 2023 - October 2024",
      highlights: [
        "Deployed Ethereum smart contracts with $140K+ TVL staking pools",
        "Migrated DeFi contracts to Base L2, achieving 90% gas efficiency improvement",
        "Integrated Chainlink VRF and Price Feeds, reducing oracle bugs by 30%",
        "Achieved 99% test coverage with zero vulnerabilities (Hacken audit)"
      ]
    },
    {
      company: "BooBoo Games PVT LTD",
      role: "Blockchain Developer",
      location: "Hyderabad, India",
      period: "June 2022 - Dec 2022",
      highlights: [
        "Integrated wallets (Metamask, Phantom, Web3Auth) into React DApps",
        "Developed upgradable smart contracts (ERC20, ERC721, ERC1155)",
        "Assisted Unity developers with blockchain integration using Nethereum"
      ]
    }
  ];

  const projects = [
    {
      name: "$MBLK Token & Staking",
      tech: "Solidity, Hardhat, Chainlink",
      description: "ERC-20 utility token live on Uniswap, Gate.io, and MEXC with $140K+ TVL across two staking pools",
      highlights: ["99% test coverage", "Zero vulnerabilities", "30d & 90d lock periods"],
      link: "https://etherscan.io/token/0xF47245e9A3Ba3dCa8B004E34afc1290B1d435a52"
    },
    {
      name: "RWA Token System",
      tech: "Solidity, ERC-1400",
      description: "Hybrid real-world asset tokens with integrated compliance and custody verification mechanisms",
      highlights: ["Multi-token ecosystem", "Governance integration", "ETF capabilities"]
    },
    {
      name: "Base L2 Migration",
      tech: "Solidity, Base, Optimism",
      description: "Successfully migrated DeFi staking contracts to Base L2 rollup",
      highlights: ["90% gas reduction", "Backward compatibility", "Chainlink integration"]
    },
    {
      name: "Kryptofam NFT Platform",
      tech: "React, Web3.js, IPFS",
      description: "NFT minting and management platform with IPFS storage integration",
      highlights: ["Minting features", "Collection management", "Pinata Gateway"]
    }
  ];

  const skills = {
    "Smart Contracts": ["Solidity", "Rust", "ERC-20/721/1155/4907", "ERC-1400"],
    "Frameworks": ["Hardhat", "Foundry", "Truffle", "Hyperledger"],
    "DeFi": ["Uniswap", "Staking", "Yield Farming", "Liquidity Pools"],
    "Oracles & Tools": ["Chainlink VRF", "Price Feeds", "Echidna", "Slither", "MythX"],
    "Layer 2": ["Base", "zkSync", "Optimism", "ZK Rollups"],
    "Frontend": ["React.js", "Web3.js", "Ethers.js", "Next.js"],
    "Backend": ["Node.js", "Express.js", "MongoDB", "IPFS"],
    "Other": ["Python", "C++", "Bitcoin Ordinals", "Dune Analytics"]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white relative overflow-hidden">
      {/* Animated blockchain grid background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }}></div>
      </div>
      
      {/* Floating blockchain nodes */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-emerald-400 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-violet-400 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-700"></div>
      </div>
      
      <style>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        .delay-300 { animation-delay: 300ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-700 { animation-delay: 700ms; }
      `}</style>
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-lg shadow-lg shadow-purple-500/20 border-b border-purple-500/20' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
            AJ
          </div>
          <div className="hidden md:flex gap-8">
            {['Home', 'About', 'Experience', 'Projects', 'Skills', 'Contact'].map(item => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className={`transition-colors hover:text-purple-400 ${activeSection === item.toLowerCase() ? 'text-purple-400' : 'text-gray-300'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative px-6 overflow-hidden">
        {/* Animated particles that repel from mouse */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                background: particle.color,
                boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
                willChange: 'transform',
              }}
            />
          ))}
        </div>

        {/* Subtle radial glow that follows mouse */}
        <div 
          className="absolute inset-0 pointer-events-none transition-all duration-500 ease-out"
          style={{
            zIndex: 2,
            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(168, 85, 247, 0.1), transparent 50%)`
          }}
        />

        {/* Glowing orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl top-20 left-20 animate-pulse" />
          <div className="absolute w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl bottom-20 right-20 animate-pulse delay-700" />
          <div className="absolute w-64 h-64 bg-violet-500/20 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse delay-500" />
        </div>
        
        <div className="text-center z-10 max-w-4xl relative" style={{ zIndex: 10 }}>
          {/* <div className="mb-6 inline-block">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 via-violet-500 to-emerald-500 flex items-center justify-center text-5xl font-bold mx-auto mb-6 shadow-2xl shadow-purple-500/50 animate-pulse">
              AJ
            </div>
          </div> */}
          <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent animate-fade-in">
            Aadesh Jadhav
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300 mb-6 font-light">
            Smart Contract Engineer & Auditor
          </p>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Building secure DeFi protocols and RWA token systems with 99% test coverage.
            Specialized in gas optimization, Layer 2 migrations, and Chainlink integrations.
          </p>
          
          <div className="flex gap-4 justify-center mb-12">
            <a href="https://github.com/aadeshjadhav" target="_blank" rel="noopener noreferrer" 
               className="p-3 bg-purple-900/50 hover:bg-purple-800/50 rounded-full transition-all hover:scale-110 border border-purple-500/30 hover:border-purple-400">
              <Github className="w-6 h-6" />
            </a>
            <a href="https://linkedin.com/in/aadeshjadhav" target="_blank" rel="noopener noreferrer"
               className="p-3 bg-purple-900/50 hover:bg-purple-800/50 rounded-full transition-all hover:scale-110 border border-purple-500/30 hover:border-purple-400">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href="https://twitter.com/aadeshjadhav" target="_blank" rel="noopener noreferrer"
               className="p-3 bg-purple-900/50 hover:bg-purple-800/50 rounded-full transition-all hover:scale-110 border border-purple-500/30 hover:border-purple-400">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="mailto:aadeshjadhav14@gmail.com"
               className="p-3 bg-purple-900/50 hover:bg-purple-800/50 rounded-full transition-all hover:scale-110 border border-purple-500/30 hover:border-purple-400">
              <Mail className="w-6 h-6" />
            </a>
          </div>

          <button onClick={() => scrollToSection('about')} className="animate-bounce">
            <ChevronDown className="w-8 h-8 text-purple-400" />
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-black/50 backdrop-blur-sm relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">About Me</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-purple-950/30 p-6 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all backdrop-blur-sm">
              <Shield className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Security First</h3>
              <p className="text-gray-400">
                Audited smart contracts with 99% test coverage and zero vulnerabilities. Experienced with Hacken audits, 
                Slither, Echidna, and MythX for comprehensive security analysis.
              </p>
            </div>

            <div className="bg-purple-950/30 p-6 rounded-xl border border-purple-500/30 hover:border-emerald-400/50 transition-all backdrop-blur-sm">
              <Code className="w-12 h-12 text-emerald-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">DeFi Expertise</h3>
              <p className="text-gray-400">
                Deployed protocols managing $140K+ TVL with optimized staking strategies, Chainlink integrations, 
                and 90% gas efficiency improvements through Layer 2 migrations.
              </p>
            </div>

            <div className="bg-purple-950/30 p-6 rounded-xl border border-purple-500/30 hover:border-violet-400/50 transition-all backdrop-blur-sm">
              <Briefcase className="w-12 h-12 text-violet-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">RWA Innovation</h3>
              <p className="text-gray-400">
                Designed ERC-1400 hybrid tokens for real-world assets with integrated compliance, 
                custody verification, and multi-token ecosystem architecture.
              </p>
            </div>

            <div className="bg-purple-950/30 p-6 rounded-xl border border-purple-500/30 hover:border-emerald-400/50 transition-all backdrop-blur-sm">
              <Award className="w-12 h-12 text-emerald-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Education</h3>
              <p className="text-gray-400">
                <strong>PG Diploma in Blockchain</strong> from IIT Kanpur<br/>
                <strong>B.E. Computer Engineering</strong> from Savitribai Phule Pune University
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 justify-center text-gray-400">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-400" />
              <span>Nashik, India</span>
            </div>
            <div className="flex items-center gap-2">
               <span>@khlokhloduode</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-400" />
              <span>aadeshjadhav14@gmail.com</span>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">Experience</span>
          </h2>

          <div className="space-y-8">
            {experiences.map((exp, idx) => (
              <div key={idx} className="bg-purple-950/30 p-6 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all hover:transform hover:scale-[1.02] backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-purple-400">{exp.company}</h3>
                    <p className="text-xl text-gray-300 mt-1">{exp.role}</p>
                  </div>
                  <div className="text-gray-400 mt-2 md:mt-0 text-right">
                    <p>{exp.period}</p>
                    <p className="text-sm">{exp.location}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {exp.highlights.map((highlight, i) => (
                    <li key={i} className="text-gray-400 flex gap-2">
                      <span className="text-purple-400 mt-1">▹</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 bg-black/50 backdrop-blur-sm relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">Featured Projects</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, idx) => (
              <div key={idx} className="bg-purple-950/30 p-6 rounded-xl border border-purple-500/30 hover:border-emerald-400/50 transition-all hover:transform hover:scale-[1.02] group backdrop-blur-sm">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{project.name}</h3>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" 
                       className="text-gray-400 hover:text-purple-400 transition-colors">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
                <p className="text-sm text-purple-400 mb-3">{project.tech}</p>
                <p className="text-gray-400 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.highlights.map((highlight, i) => (
                    <span key={i} className="text-xs bg-purple-900/50 px-3 py-1 rounded-full text-gray-300 border border-purple-500/30">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">Technical Skills</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category} className="bg-purple-950/30 p-6 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all backdrop-blur-sm">
                <h3 className="text-lg font-bold mb-4 text-purple-400">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill, i) => (
                    <span key={i} className="text-sm bg-purple-900/50 px-3 py-1 rounded-full text-gray-300 border border-purple-500/30 hover:border-emerald-400/50 transition-all">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-black/50 backdrop-blur-sm relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">Get In Touch</span>
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Looking for a Smart Contract Engineer or Security Auditor? Let's build something secure and innovative together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:aadeshjadhav14@gmail.com" 
               className="bg-gradient-to-r from-purple-600 to-violet-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105 flex items-center justify-center gap-2">
              <Mail className="w-5 h-5" />
              
            </a>
            <a href="https://www.linkedin.com/in/aadesh-jadhav-7a4445174/" target="_blank" rel="noopener noreferrer"
               className="bg-purple-900/50 border border-purple-500/30 px-8 py-3 rounded-lg font-semibold hover:bg-purple-800/50 transition-all hover:scale-105 flex items-center justify-center gap-2">
              <Linkedin className="w-5 h-5" />
              
            </a>
            <a href="https://twitter.com/Adijdhv" target="_blank" rel="noopener noreferrer"
               className="bg-purple-900/50 border border-purple-500/30 px-8 py-3 rounded-lg font-semibold hover:bg-purple-800/50 transition-all hover:scale-105 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              
            </a>
            <a href="https://github.com/adijdhv" target="_blank" rel="noopener noreferrer"
               className="bg-purple-900/50 border border-purple-500/30 px-8 py-3 rounded-lg font-semibold hover:bg-purple-800/50 transition-all hover:scale-105 flex items-center justify-center gap-2">
              <Github className="w-5 h-5" />
              
            </a>
            <a href="https://t.me/khlokhloduode" target="_blank" rel="noopener noreferrer"
               className="bg-purple-900/50 border border-purple-500/30 px-8 py-3 rounded-lg font-semibold hover:bg-purple-800/50 transition-all hover:scale-105 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
              
            </a>
            <a href="https://discord.com/users/khlokhlo" target="_blank" rel="noopener noreferrer"
               className="bg-purple-900/50 border border-purple-500/30 px-8 py-3 rounded-lg font-semibold hover:bg-purple-800/50 transition-all hover:scale-105 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-purple-500/20 text-center text-gray-400">
        <p>© 2024 Aadesh Jadhav. Built with React & Tailwind CSS.</p>
      </footer>
    </div>
  );
}