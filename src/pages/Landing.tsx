import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Instagram, Code, BookOpen, Heart, Mail, Share2, Twitter, Facebook, Linkedin, Rocket } from 'lucide-react';
import { api } from '../lib/api';
import ReactMarkdown from 'react-markdown';

interface Project {
  _id: string;
  title: string;
  description: string;
  link: string;
  image: string;
}

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  video_url?: string;
}

interface Profile {
  avatar_url?: string;
}

const getEmbedUrl = (url: string) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return url;
};

function Landing() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [activeShare, setActiveShare] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogPosts();
    fetchProfile();
    
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserName(user.email.split('@')[0]);
    }
  }, []);

  async function fetchBlogPosts() {
    try {
      const data = await api.posts.getAll();
      if (Array.isArray(data)) {
        setBlogPosts(data);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  }

  async function fetchProfile() {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        const data = await api.profile.get(user.id);
        if (data && data.avatar_url) {
          setProfileImage(data.avatar_url);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }

  const handleShare = (postId: string, platform: string) => {
    const post = blogPosts.find(p => p._id === postId);
    if (!post) return;

    const url = window.location.href;
    const text = `Check out this post: ${post.title}`;

    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        if (navigator.share) {
          navigator.share({
            title: post.title,
            text: text,
            url: url
          });
          return;
        }
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const projects: Project[] = [
    {
      _id: "1",
      title: "Legal Services Platform",
      description: "A platform enhancing access to legal services and improving client-lawyer interactions through innovative technology.",
      link: "https://github.com/quantumNexus0/LegalService",
      image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800"
    },
    {
      _id: "2",
      title: "Railway Reservation System",
      description: "GUI-based desktop application for managing railway reservations using Java (JFrame) and MySQL.",
      link: "https://github.com/quantumNexus0/RailwayReservationSystem-",
      image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <motion.header 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a] text-white"
      >
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 pt-24 md:pt-32">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-3/5 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider text-blue-400 uppercase bg-blue-400/10 border border-blue-400/20 rounded-full"
              >
                Available for New Projects
              </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent capitalize"
                >
                  {userName || 'Vipul Yadav'}
                </motion.h1>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl leading-relaxed">
                  Crafting <span className="text-white font-medium">Exceptional</span> Digital Experiences through <span className="text-blue-500 font-medium">Modern Technology</span> and Creative Problem Solving.
                </p>
                <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
                  <a href="#projects" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                    View My Work
                  </a>
                  <a href="#about" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-semibold backdrop-blur-sm transition-all transform hover:scale-105">
                    About Me
                  </a>
                </div>
              </motion.div>
              
              {/* Socials */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex space-x-6 mt-12 justify-center md:justify-start"
              >
                <a href="https://github.com/quantumNexus0" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <Github size={28} />
                </a>
                <a href="https://www.instagram.com/vipulyadav_02" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <Instagram size={28} />
                </a>
                <a href="mailto:fusionfission55@gmail.com" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <Mail size={28} />
                </a>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
              className="md:w-2/5 flex justify-center relative"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                <img 
                  src={profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"}
                  alt="Vipul Yadav"
                  className="relative rounded-full w-64 h-64 md:w-80 md:h-80 object-cover border-4 border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500"
        >
          <div className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-gray-500 rounded-full"></div>
          </div>
        </motion.div>
      </motion.header>

      {/* Stats Section - 24 Problems Resolved */}
      <section className="py-12 md:py-20 bg-[#0a0a0a] border-y border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-3 gap-4 md:gap-12 text-center">
            {[
              { label: "Resolved", value: "24", suffix: "+", icon: Code, color: "text-blue-500" },
              { label: "Projects", value: "15", suffix: "+", icon: Rocket, color: "text-indigo-500" },
              { label: "B.Tech IT", value: "3rd", suffix: " Yr", icon: BookOpen, color: "text-purple-500" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-3 md:p-8 rounded-2xl md:rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition-all duration-300"
              >
                <div className={`${stat.color} mb-2 md:mb-4 flex justify-center`}>
                  <stat.icon className="w-5 h-5 md:w-8 md:h-8" />
                </div>
                <div className="text-xl md:text-5xl font-bold text-white mb-1 md:mb-2 tracking-tight">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-[10px] md:text-sm text-gray-500 md:text-gray-400 font-medium uppercase tracking-wider md:tracking-widest">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <motion.span 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               className="text-blue-600 font-semibold tracking-widest uppercase text-sm mb-4 block"
            >
              Excellence in Craft
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-gray-900"
            >
              Innovating at the Core
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {[
              { icon: Code, title: "Web Development", desc: "Crafting responsive, high-performance web applications using the MERN stack and modern frameworks." },
              { icon: BookOpen, title: "Continuous Learning", desc: "3rd-year B.Tech IT student dedicated to exploring cloud computing, AI, and system architecture." },
              { icon: Heart, title: "Mind & Body", desc: "Yoga practitioner bringing discipline and focus to every line of code written." }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 md:p-10 rounded-2xl md:rounded-3xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 md:mb-8 group-hover:scale-110 transition-transform duration-500">
                  <item.icon className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-4 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-lg">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-32 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <motion.span 
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 className="text-blue-600 font-semibold tracking-widest uppercase text-sm mb-4 block"
              >
                Selected Works
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold text-gray-900"
              >
                Building the Future
              </motion.h2>
            </div>
            <a href="https://github.com/quantumNexus0" target="_blank" className="flex items-center text-blue-600 font-bold group">
              View All Github <Rocket className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4 md:gap-10">
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl md:rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden"
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>
                <div className="p-4 md:p-10">
                  <h3 className="text-sm md:text-2xl font-bold mb-1 md:mb-4 text-gray-900 underline decoration-blue-500/0 group-hover:decoration-blue-500/100 transition-all duration-300 line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-[10px] md:text-base text-gray-600 mb-4 md:mb-8 leading-relaxed line-clamp-none md:line-clamp-2">{project.description}</p>
                  <a
                    href={project.link}
                    className="inline-flex items-center px-3 py-1.5 md:px-6 md:py-3 rounded-lg md:rounded-xl bg-gray-900 text-[10px] md:text-base text-white font-semibold transform group-hover:-translate-y-1 transition-all duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-3 h-3 md:w-5 md:h-5 mr-1 md:mr-3" />
                    Case Study
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <motion.span 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               className="text-blue-600 font-semibold tracking-widest uppercase text-sm mb-4 block"
            >
              Latest Insights
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-gray-900"
            >
              From the Blog
            </motion.h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:gap-10">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl md:rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden border border-gray-100 flex flex-col"
              >
                <div className="p-4 md:p-10 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-4 gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm md:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 truncate">{post.title}</h3>
                      <p className="text-[10px] md:text-sm text-blue-600 font-medium mt-1">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="relative flex-shrink-0">
                      <button
                        onClick={() => setActiveShare(activeShare === post._id ? null : post._id)}
                        className="p-1.5 md:p-3 bg-gray-50 rounded-lg md:rounded-xl hover:bg-blue-50 transition-all text-gray-400 hover:text-blue-600"
                      >
                        <Share2 size={16} className="md:w-5 md:h-5" />
                      </button>
                      <AnimatePresence>
                        {activeShare === post._id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-xl shadow-xl z-20 border border-gray-100"
                          >
                            <button
                              onClick={() => handleShare(post._id, 'twitter')}
                              className="w-full px-4 py-2 text-left hover:bg-blue-50 hover:text-blue-600 flex items-center transition-colors text-xs font-medium"
                            >
                              <Twitter size={14} className="mr-2" /> Twitter
                            </button>
                            <button
                              onClick={() => handleShare(post._id, 'facebook')}
                              className="w-full px-4 py-2 text-left hover:bg-blue-50 hover:text-blue-600 flex items-center transition-colors text-xs font-medium"
                            >
                              <Facebook size={14} className="mr-2" /> Facebook
                            </button>
                            <button
                              onClick={() => handleShare(post._id, 'linkedin')}
                              className="w-full px-4 py-2 text-left hover:bg-blue-50 hover:text-blue-600 flex items-center transition-colors text-xs font-medium"
                            >
                              <Linkedin size={14} className="mr-2" /> LinkedIn
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  
                  <div className="prose prose-sm md:prose-lg max-w-none text-gray-600 leading-relaxed line-clamp-3 md:line-clamp-none">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                  </div>
                </div>
                {post.video_url && (
                  <div className="mt-8 rounded-[2rem] overflow-hidden shadow-lg aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={getEmbedUrl(post.video_url)}
                      title="Video content"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;