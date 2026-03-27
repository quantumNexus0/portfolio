import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Instagram, Code, BookOpen, Heart, Mail, Share2, Twitter, Facebook, Linkedin } from 'lucide-react';
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

function Landing() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [activeShare, setActiveShare] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogPosts();
    fetchProfile();
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
      // In this version, we fetch the admin's profile by their email or a fixed ID.
      // For now, I'll fetch all profiles and take the first one, or handle it differently.
      // Given the user only has one admin, this is fine for a portfolio.
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
    const post = blogPosts.find(p => p.id === postId);
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
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
      >
        <div className="container mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <motion.h1 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-4xl md:text-6xl font-bold mb-4"
              >
                Hi, I'm Vipul Yadav
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="space-y-4"
              >
                <p className="text-xl">Information Technology Student & Web Developer</p>
                <p className="text-lg">Passionate about technology, yoga, and creating impactful solutions</p>
                <p className="text-lg">Currently pursuing B.Tech in Information Technology</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex space-x-4 mt-8"
              >
                <a href="https://github.com/quantumNexus0" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200 transition-colors duration-300">
                  <Github size={24} />
                </a>
                <a href="https://www.instagram.com/vipulyadav_02" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200 transition-colors duration-300">
                  <Instagram size={24} />
                </a>
                <a href="mailto:fusionfission55@gmail.com" className="text-white hover:text-gray-200 transition-colors duration-300">
                  <Mail size={24} />
                </a>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="md:w-1/3"
            >
              <img 
                src={profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"}
                alt="Vipul Yadav"
                className="rounded-full w-64 h-64 md-6 object-cover border-4 border-white shadow-lg transform hover:scale-105 transition-transform duration-300"
              />
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-8 text-center"
          >
            About Me
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Code, title: "Web Development", desc: "Passionate about creating modern web applications using React and other cutting-edge technologies." },
              { icon: BookOpen, title: "B.Tech IT Student", desc: "Currently in my 3rd year, focusing on building a strong foundation in Information Technology." },
              { icon: Heart, title: "Yoga Enthusiast", desc: "Dedicated practitioner with deep knowledge in yoga and its benefits for mind and body." }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 hover:shadow-lg transition-all duration-300 rounded-lg bg-white"
              >
                <item.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-8 text-center"
          >
            Projects
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300"
              >
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <a
                    href={project.link}
                    className="text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    View on GitHub
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-8 text-center"
          >
            Blog Posts
          </motion.h2>
          <div className="grid grid-cols-1 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{post.title}</h3>
                  <div className="relative">
                    <button
                      onClick={() => setActiveShare(activeShare === post._id ? null : post._id)}
                      className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-300"
                    >
                      <Share2 size={20} />
                    </button>
                    {activeShare === post._id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-10"
                      >
                        <button
                          onClick={() => handleShare(post._id, 'twitter')}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                        >
                          <Twitter size={16} className="mr-2" /> Share on Twitter
                        </button>
                        <button
                          onClick={() => handleShare(post._id, 'facebook')}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                        >
                          <Facebook size={16} className="mr-2" /> Share on Facebook
                        </button>
                        <button
                          onClick={() => handleShare(post._id, 'linkedin')}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                        >
                          <Linkedin size={16} className="mr-2" /> Share on LinkedIn
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
                <div className="prose max-w-none">
                  <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
                {post.video_url && (
                  <div className="mt-4">
                    <iframe
                      width="100%"
                      height="315"
                      src={post.video_url}
                      title="Video content"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg"
                    ></iframe>
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-4">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;