import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Pencil, Trash2, Plus, X, 
  LayoutDashboard, BookOpen, Briefcase, User as UserIcon, 
  LogOut, Settings, Bell, Search, ChevronRight,
  BarChart2, Globe, MessageSquare, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  video_url?: string;
  createdAt: string;
  user: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  link: string;
  image: string;
  user: string;
}

interface AboutSection {
  _id: string;
  title: string;
  description: string;
  icon: string;
  user: string;
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

function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'blog' | 'projects' | 'about' | 'profile'>('overview');
  const [isSidebarOpen] = useState(true);
  
  // Blog state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Project state
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [projectImage, setProjectImage] = useState('');

  // About state
  const [aboutSections, setAboutSections] = useState<AboutSection[]>([]);
  const [editingAbout, setEditingAbout] = useState<AboutSection | null>(null);
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutDescription, setAboutDescription] = useState('');
  const [aboutIcon, setAboutIcon] = useState('');

  // Profile/Identity state
  const [fullName, setFullName] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [github, setGithub] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('portfolio_token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(userStr);
    setUserName(user.email.split('@')[0]);
    fetchData();
  }, [navigate]);

  async function fetchData() {
    try {
      const postsData = await api.posts.getAll();
      const projectsData = await api.projects.getAll();
      const aboutData = await api.about.getAll();
      
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        const profileData = await api.profile.get(user.id);
        if (profileData) {
          setFullName(profileData.fullName || '');
          setHeroTitle(profileData.heroTitle || '');
          setBio(profileData.bio || '');
          setAvatarUrl(profileData.avatar_url || '');
          setGithub(profileData.socialLinks?.github || '');
          setInstagram(profileData.socialLinks?.instagram || '');
          setLinkedin(profileData.socialLinks?.linkedin || '');
          setProfileEmail(profileData.socialLinks?.email || '');
        }
      }

      if (postsData) setPosts(postsData);
      if (projectsData) setProjects(projectsData);
      if (aboutData) setAboutSections(aboutData);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem('portfolio_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.profile.upsert({
        fullName,
        heroTitle,
        bio,
        avatar_url: avatarUrl,
        socialLinks: {
          github,
          instagram,
          linkedin,
          email: profileEmail
        }
      });
      alert('Profile updated successfully!');
      fetchData();
    } catch (err) {
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  }

  // Form handlers
  async function handleBlogSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingPost?._id) {
        await api.posts.update(editingPost._id, { title, content, video_url: videoUrl });
      } else {
        await api.posts.create({ title, content, video_url: videoUrl });
      }
      fetchData();
      clearForms();
    } catch (err) {
      alert('Error saving post');
    } finally {
      setLoading(false);
    }
  }

  async function handleProjectSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingProject?._id) {
        await api.projects.update(editingProject._id, { 
          title: projectTitle, description: projectDescription, 
          link: projectLink, image: projectImage 
        });
      } else {
        await api.projects.create({ 
          title: projectTitle, description: projectDescription, 
          link: projectLink, image: projectImage 
        });
      }
      fetchData();
      clearForms();
    } catch (err) {
      alert('Error saving project');
    } finally {
      setLoading(false);
    }
  }

  async function handleAboutSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingAbout?._id) {
        await api.about.update(editingAbout._id, { 
          title: aboutTitle, description: aboutDescription, icon: aboutIcon 
        });
      } else {
        await api.about.create({ 
          title: aboutTitle, description: aboutDescription, icon: aboutIcon 
        });
      }
      fetchData();
      clearForms();
    } catch (err) {
      alert('Error saving section');
    } finally {
      setLoading(false);
    }
  }

  const clearForms = () => {
    setTitle(''); setContent(''); setVideoUrl(''); setEditingPost(null);
    setProjectTitle(''); setProjectDescription(''); setProjectLink(''); setProjectImage(''); setEditingProject(null);
    setAboutTitle(''); setAboutDescription(''); setAboutIcon(''); setEditingAbout(null);
  };

  async function handleDelete(type: 'blog' | 'project' | 'about', id: string) {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      if (type === 'blog') await api.posts.delete(id);
      else if (type === 'project') await api.projects.delete(id);
      else if (type === 'about') await api.about.delete(id);
      fetchData();
    } catch (err) {
      alert('Error deleting item');
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-white border-r border-slate-200 sticky top-0 h-screen overflow-hidden flex flex-col z-30"
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-200">
            <Globe className="text-white" size={24} />
          </div>
          {isSidebarOpen && (
            <span className="font-bold text-xl tracking-tight text-slate-800">PortfolioPro</span>
          )}
        </div>

        <nav className="flex-grow px-4 mt-4 space-y-2">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'profile', label: 'Identity', icon: UserIcon },
            { id: 'blog', label: 'Blog Posts', icon: BookOpen },
            { id: 'projects', label: 'Projects', icon: Briefcase },
            { id: 'about', label: 'Skills/Bio', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-600 font-semibold' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <item.icon size={22} className={activeTab === item.id ? 'text-blue-600' : 'text-slate-400'} />
              {isSidebarOpen && <span>{item.label}</span>}
              {activeTab === item.id && isSidebarOpen && (
                <motion.div layoutId="active" className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium"
          >
            <LogOut size={22} />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-20">
          <div className="flex items-center bg-slate-100 rounded-full px-4 py-2 w-96 max-w-full">
            <Search className="text-slate-400 mr-2" size={18} />
            <input 
              type="text" 
              placeholder="Search content..." 
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-slate-600">
              <Bell size={22} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 capitalize">{fullName || userName}</p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden ring-2 ring-slate-100">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold uppercase">
                    {(fullName || userName)?.[0]}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8 flex-grow">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">Welcome, {fullName || userName}!</h1>
                  <p className="text-slate-500 mt-1">Here's what's happening with your portfolio today.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Posts', value: posts.length, icon: BookOpen, color: 'blue' },
                    { label: 'Total Projects', value: projects.length, icon: Briefcase, color: 'indigo' },
                    { label: 'Skills/Sections', value: aboutSections.length, icon: UserIcon, color: 'emerald' },
                    { label: 'Portfolio Analytics', value: '2.4k', icon: BarChart2, color: 'orange' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 inline-flex mb-4`}>
                        <stat.icon size={24} />
                      </div>
                      <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                      <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                      <h2 className="text-lg font-bold text-slate-800 mb-8">Recent Activity</h2>
                      <div className="space-y-6">
                        {posts.slice(0, 4).map((post) => (
                           <div key={post._id} className="flex items-start gap-4">
                             <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                <MessageSquare size={18} className="text-blue-600" />
                             </div>
                             <div className="flex-grow min-w-0">
                                <p className="text-sm font-bold text-slate-800 truncate">{post.title}</p>
                                <p className="text-xs text-slate-500 mt-1">
                                  {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                             </div>
                           </div>
                        ))}
                      </div>
                   </div>
                   <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                      <h2 className="text-lg font-bold text-slate-800 mb-6">Quick Links</h2>
                      <div className="space-y-3">
                         {[
                           { name: 'View My Portfolio', icon: Globe, onClick: () => navigate('/') },
                           { name: 'Profile Settings', icon: Settings, onClick: () => setActiveTab('profile') },
                         ].map((link, i) => (
                           <button key={i} onClick={link.onClick} className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-all group text-left">
                             <div className="h-10 w-10 flex items-center justify-center bg-slate-50 rounded-xl group-hover:bg-white transition-all">
                               <link.icon className="text-slate-500" size={20} />
                             </div>
                             <span className="text-sm font-bold text-slate-600">{link.name}</span>
                             <ChevronRight size={16} className="ml-auto text-slate-300" />
                           </button>
                         ))}
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">Public Identity</h1>
                  <p className="text-slate-500 mt-1">Customize how you appear on the landing page.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-xl">
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 col-span-2">
                           <label className="text-sm font-bold text-slate-600">Full Name</label>
                           <input 
                              type="text" value={fullName} onChange={e => setFullName(e.target.value)} required 
                              placeholder="Vipul Yadav"
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all font-medium"
                           />
                        </div>
                        <div className="space-y-2 col-span-2">
                           <label className="text-sm font-bold text-slate-600">Hero Main Title</label>
                           <input 
                              type="text" value={heroTitle} onChange={e => setHeroTitle(e.target.value)} required 
                              placeholder="Crafting Exceptional Digital Experiences"
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all font-medium"
                           />
                        </div>
                        <div className="space-y-2 col-span-2">
                           <label className="text-sm font-bold text-slate-600">Bio / Strapline</label>
                           <textarea 
                              value={bio} onChange={e => setBio(e.target.value)} rows={3}
                              placeholder="Modern Technology and Creative Problem Solving..."
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all font-medium resize-none"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-600">Avatar Image URL</label>
                           <input 
                              type="text" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} 
                              placeholder="https://images.unsplash.com/..."
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all font-medium"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-600">Public Email</label>
                           <input 
                              type="email" value={profileEmail} onChange={e => setProfileEmail(e.target.value)} 
                              placeholder="vipul@example.com"
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all font-medium"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-600">GitHub Link</label>
                           <input 
                              type="text" value={github} onChange={e => setGithub(e.target.value)} 
                              placeholder="https://github.com/..."
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all font-medium"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-600">Instagram Link</label>
                           <input 
                              type="text" value={instagram} onChange={e => setInstagram(e.target.value)} 
                              placeholder="https://instagram.com/..."
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all font-medium"
                           />
                        </div>
                        <div className="space-y-2 col-span-2">
                           <label className="text-sm font-bold text-slate-600">LinkedIn Link</label>
                           <input 
                              type="text" value={linkedin} onChange={e => setLinkedin(e.target.value)} 
                              placeholder="https://linkedin.com/in/..."
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all font-medium"
                           />
                        </div>
                      </div>
                      <button 
                        type="submit" disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-100"
                      >
                        {loading ? 'Saving Changes...' : 'Save Profile Settings'}
                      </button>
                    </form>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
                      <h3 className="font-bold text-slate-800 mb-6">Profile Preview</h3>
                      <div className="w-32 h-32 rounded-full bg-slate-100 mx-auto mb-6 flex items-center justify-center overflow-hidden ring-4 ring-blue-50">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon size={48} className="text-slate-300" />
                        )}
                      </div>
                      <h4 className="text-xl font-bold text-slate-800">{fullName || 'Your Name'}</h4>
                      <p className="text-sm text-slate-500 mt-2 line-clamp-2">{heroTitle || 'Your Title'}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'blog' && (
              <motion.div 
                key="blog"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800">Blog Posts</h1>
                    <p className="text-slate-500 mt-1">Manage and publish your articles here.</p>
                  </div>
                  <button 
                    onClick={() => { clearForms(); setEditingPost({} as any); }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100"
                  >
                    <Plus size={20} /> New Post
                  </button>
                </div>

                {editingPost && (
                  <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl overflow-hidden relative">
                    <button onClick={() => setEditingPost(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X /></button>
                    <h2 className="text-xl font-bold text-slate-800 mb-6">{editingPost._id ? 'Edit Post' : 'Create Post'}</h2>
                    <form onSubmit={handleBlogSubmit} className="space-y-6">
                      <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-600">Post Title</label>
                           <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 outline-none" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-600">Video URL</label>
                           <input type="text" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 outline-none" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-600">Content</label>
                           <textarea value={content} onChange={e => setContent(e.target.value)} required rows={8} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 outline-none" />
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-2xl">
                          {loading ? 'Saving...' : 'Save Post'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                      <tr>
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {posts.map(post => (
                        <tr key={post._id}>
                          <td className="px-6 py-4 font-bold text-slate-800">{post.title}</td>
                          <td className="px-6 py-4 text-slate-500">{new Date(post.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-right">
                             <div className="flex justify-end gap-2">
                               <button onClick={() => { setEditingPost(post); setTitle(post.title); setContent(post.content); setVideoUrl(post.video_url || ''); }} className="text-blue-600"><Pencil size={18} /></button>
                               <button onClick={() => handleDelete('blog', post._id)} className="text-red-600"><Trash2 size={18} /></button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'projects' && (
              <motion.div 
                key="projects"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800">Projects</h1>
                    <p className="text-slate-500 mt-1">Showcase your best work.</p>
                  </div>
                  <button 
                    onClick={() => { clearForms(); setEditingProject({} as any); }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold"
                  >
                    <Plus size={20} /> Add Project
                  </button>
                </div>

                {editingProject && (
                  <div className="bg-white rounded-3xl p-8 border border-slate-200">
                    <form onSubmit={handleProjectSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input type="text" placeholder="Title" value={projectTitle} onChange={e => setProjectTitle(e.target.value)} required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 outline-none" />
                        <input type="text" placeholder="Link" value={projectLink} onChange={e => setProjectLink(e.target.value)} required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 outline-none" />
                        <input type="text" placeholder="Image URL" value={projectImage} onChange={e => setProjectImage(e.target.value)} required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 outline-none" />
                        <textarea placeholder="Description" value={projectDescription} onChange={e => setProjectDescription(e.target.value)} required rows={3} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 outline-none md:col-span-2" />
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-2xl md:col-span-2">
                          {loading ? 'Saving...' : 'Save Project'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {projects.map(project => (
                    <div key={project._id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm p-4">
                      <img src={project.image} alt="" className="w-full h-32 object-cover rounded-2xl mb-4" />
                      <h3 className="font-bold text-slate-800">{project.title}</h3>
                      <div className="flex justify-end gap-2 mt-4">
                        <button onClick={() => { setEditingProject(project); setProjectTitle(project.title); setProjectDescription(project.description); setProjectLink(project.link); setProjectImage(project.image); }} className="text-blue-600"><Pencil size={18} /></button>
                        <button onClick={() => handleDelete('project', project._id)} className="text-red-600"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'about' && (
              <motion.div 
                key="about"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800">Skills/Bio Sections</h1>
                    <p className="text-slate-500 mt-1">Manage sections on your landing page.</p>
                  </div>
                  <button 
                    onClick={() => { clearForms(); setEditingAbout({} as any); }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold"
                  >
                    <Plus size={20} /> Add Section
                  </button>
                </div>

                {editingAbout && (
                  <div className="bg-white rounded-3xl p-8 border border-slate-200">
                    <form onSubmit={handleAboutSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 gap-6">
                        <input type="text" placeholder="Title" value={aboutTitle} onChange={e => setAboutTitle(e.target.value)} required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 outline-none" />
                        <input type="text" placeholder="Icon (e.g. Code)" value={aboutIcon} onChange={e => setAboutIcon(e.target.value)} required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 outline-none" />
                        <textarea placeholder="Description" value={aboutDescription} onChange={e => setAboutDescription(e.target.value)} required rows={3} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 outline-none" />
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-2xl">
                          {loading ? 'Saving...' : 'Save Section'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {aboutSections.map(section => (
                    <div key={section._id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-slate-800">{section.title}</h3>
                        <p className="text-sm text-slate-500">{section.description.substring(0, 50)}...</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingAbout(section); setAboutTitle(section.title); setAboutDescription(section.description); setAboutIcon(section.icon); }} className="text-blue-600"><Pencil size={18} /></button>
                        <button onClick={() => handleDelete('about', section._id)} className="text-red-600"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default Admin;
