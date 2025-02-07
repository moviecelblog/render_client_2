import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  image: string;
  content: string;
  sector: 'agency' | 'smb' | 'ecommerce';
}

const testimonials: Testimonial[] = [
  {
    name: "Sophie Martin",
    role: "Directrice Marketing",
    company: "MediaPulse Agency",
    image: "/images/testimonials/sophie.webp",
    content: "Trio a révolutionné notre façon de gérer les réseaux sociaux. Nous économisons 70% du temps passé sur la création de contenu tout en maintenant une qualité exceptionnelle.",
    sector: "agency"
  },
  {
    name: "Thomas Dubois",
    role: "E-commerce Manager",
    company: "ModeFashion",
    image: "/images/testimonials/thomas.webp",
    content: "L'IA de Trio comprend parfaitement notre marque et génère du contenu qui résonne avec notre audience. Nos engagements ont augmenté de 150% !",
    sector: "ecommerce"
  },
  {
    name: "Marie Laurent",
    role: "CEO",
    company: "TechStart Solutions",
    image: "/images/testimonials/marie.webp",
    content: "En tant que PME, nous n'avions pas les ressources pour une équipe social media dédiée. Trio nous permet d'avoir une présence professionnelle à moindre coût.",
    sector: "smb"
  }
];

const generationExamples = [
  {
    title: "Mode & Lifestyle",
    description: "Posts engageants pour marques de mode",
    image: "/images/examples/fashion.webp"
  },
  {
    title: "Tech & Innovation",
    description: "Contenu B2B percutant",
    image: "/images/examples/tech.webp"
  },
  {
    title: "Food & Hospitality",
    description: "Visuels appétissants et storytelling",
    image: "/images/examples/food.webp"
  }
];

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden bg-[#2d2d67]">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2d2d67] via-[#2d2d67]/90 to-[#53dfb2]/20" />
          <div className="absolute inset-0 opacity-10 grid-pattern" />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-[#53dfb2] to-[#53dfb2]/0 rounded-full blur-xl" />
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 h-screen">
          <div className="flex flex-col lg:flex-row items-center justify-between h-full gap-12">
            {/* Left Column - Text Content */}
            <div className="flex-1 text-left z-10 mt-20 lg:mt-0">
              <Logo size="large" color="white" className="mb-12 relative animate-fadeIn" />
              
              <div className="space-y-8">
                <h1 className="text-6xl lg:text-8xl font-bold leading-tight">
                  <span className="block bg-gradient-to-r from-white to-[#53dfb2] bg-clip-text text-transparent animate-gradient">
                    Presence
                  </span>
                  <span className="block text-white text-4xl lg:text-5xl mt-4">
                    L'IA qui révolutionne<br />votre présence sociale
                  </span>
                </h1>
                
                <p className="text-xl text-white/80 max-w-xl">
                  Générez des mois de contenu social media en quelques clics avec notre IA spécialisée dans votre secteur.
                </p>

                <div className="flex gap-6 items-center">
                  <Link 
                    to="/register" 
                    className="glass-button text-lg py-6 px-12 bg-gradient-to-r from-[#53dfb2] to-[#53dfb2]/80 hover:from-[#53dfb2]/90 hover:to-[#53dfb2]/70 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#53dfb2]/20 flex items-center gap-3"
                  >
                    <span>Commencer gratuitement</span>
                    <svg className="w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  
                  <a 
                    href="#demo" 
                    className="glass-button text-lg py-6 px-12 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-all duration-300 backdrop-blur-md border border-white/10 hover:border-white/20 flex items-center gap-3"
                  >
                    <span>Voir la démo</span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Hero Image */}
            <div className="flex-1 relative z-10">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#53dfb2]/20 to-[#2d2d67]/20 blur-xl rounded-full" />
                <img 
                  src="/images/landing-hero-final.webp"
                  alt="Robot futuriste sur un chameau dans le désert algérien"
                  className="relative w-full h-auto rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-700 hover:shadow-[#53dfb2]/20 hover:shadow-2xl"
                />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#2d2d67]/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#2d2d67]" id="demo">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-[#53dfb2] bg-clip-text text-transparent">
            Une IA qui comprend votre marque
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {generationExamples.map((example, index) => (
              <div key={index} className="glass-panel p-6 hover:scale-105 transition-transform duration-300">
                <img 
                  src={example.image} 
                  alt={example.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold text-white mb-2">{example.title}</h3>
                <p className="text-white/60">{example.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-[#2d2d67] to-[#1a1a4d]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#53dfb2]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#53dfb2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">90% plus rapide</h3>
              <p className="text-white/60">Générez un mois de contenu en quelques minutes au lieu de plusieurs jours.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#53dfb2]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#53dfb2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">+150% d'engagement</h3>
              <p className="text-white/60">Du contenu optimisé par l'IA pour maximiser les interactions.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#53dfb2]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#53dfb2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">-60% de coûts</h3>
              <p className="text-white/60">Réduisez vos dépenses marketing tout en augmentant votre impact.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[#1a1a4d]">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-[#53dfb2] bg-clip-text text-transparent">
            Ils nous font confiance
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="glass-panel p-6">
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="text-white font-medium">{testimonial.name}</h4>
                    <p className="text-white/60 text-sm">{testimonial.role}</p>
                    <p className="text-[#53dfb2] text-sm">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-white/80 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-[#1a1a4d] to-[#2d2d67]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white to-[#53dfb2] bg-clip-text text-transparent">
            Prêt à révolutionner votre présence sociale ?
          </h2>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Rejoignez les entreprises qui transforment leur communication avec Trio.
          </p>
          <Link 
            to="/register" 
            className="glass-button text-lg py-4 px-8 inline-flex items-center group"
          >
            Commencer maintenant
            <svg 
              className="ml-2 w-5 h-5 transform transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
