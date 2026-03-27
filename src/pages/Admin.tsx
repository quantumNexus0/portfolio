import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Plus, Upload, X, Camera } from 'lucide-react';
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

interface ProgressEvent {
  loaded: number;
  total: number;
}

interface Profile {
  avatar_url?: string;
}

function Admin() {
  const navigate = useNavigate();
  // Blog state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Project state
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [projectImage, setProjectImage] = useState('');

  // About section state
  const [aboutSections, setAboutSections] = useState<AboutSection[]>([]);
  const [editingAbout, setEditingAbout] = useState<AboutSection | null>(null);
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutDescription, setAboutDescription] = useState('');
  const [aboutIcon, setAboutIcon] = useState('');

  // Active tab state
  const [activeTab, setActiveTab] = useState<'blog' | 'projects' | 'about'>('blog');

  // Add new state for profile
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchData();
    fetchProfile();
  }, []);

  function checkAuth() {
    const token = localStorage.getItem('portfolio_token');
    if (!token) {
      navigate('/login');
    }
  }

  async function fetchData() {
    fetchPosts();
    fetchProjects();
    fetchAboutSections();
  }

  async function fetchProfile() {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;
      const user = JSON.parse(userStr);

      const data = await api.profile.get(user.id);
      if (data && data.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('No user');
      const user = JSON.parse(userStr);

      const file = event.target.files?.[0];
      if (!file) return;

      // NOTE: Still using a placeholder logic for avatar upload as we didn't migrate storage
      // In a real app, you'd upload to your own storage or Cloundinary etc.
      // For now, let's assume the user provides a URL or we use the old one.
      alert('Avatar upload is currently restricted to URL updates in this migration. Please use the profile API.');
      
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Error uploading avatar!');
    } finally {
      setUploading(false);
    }
  }

  async function fetchPosts() {
    const data = await api.posts.getAll();
    if (data) setPosts(data);
  }

  async function fetchProjects() {
    const data = await api.projects.getAll();
    if (data) setProjects(data);
  }

  async function fetchAboutSections() {
    const data = await api.about.getAll();
    if (data) setAboutSections(data);
  }

  async function handleVideoUpload(file: File) {
    // Placeholder as storage is not migrated
    alert('Video upload is restricted. Please use direct URLs.');
    return null;
  }

  async function handleBlogSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert('Please log in to create posts');
      setLoading(false);
      return;
    }

    let finalVideoUrl = videoUrl;
    if (videoFile) {
      const uploadedUrl = await handleVideoUpload(videoFile);
      if (uploadedUrl) {
        finalVideoUrl = uploadedUrl;
      }
    }

    if (editingPost) {
      try {
        await api.posts.update(editingPost._id, {
          title,
          content,
          video_url: finalVideoUrl || null
        });
        alert('Post updated successfully!');
        clearBlogForm();
        fetchPosts();
      } catch (err) {
        alert('Error updating post');
      }
    } else {
      try {
        await api.posts.create({
          title,
          content,
          video_url: finalVideoUrl || null
        });
        alert('Post created successfully!');
        clearBlogForm();
        fetchPosts();
      } catch (err) {
        alert('Error creating post');
      }
    }

    setLoading(false);
    setUploadProgress(0);
  }

  async function handleProjectSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert('Please log in to manage projects');
      setLoading(false);
      return;
    }

    if (editingProject) {
      try {
        await api.projects.update(editingProject._id, {
          title: projectTitle,
          description: projectDescription,
          link: projectLink,
          image: projectImage
        });
        alert('Project updated successfully!');
        clearProjectForm();
        fetchProjects();
      } catch (err) {
        alert('Error updating project');
      }
    } else {
      try {
        await api.projects.create({
          title: projectTitle,
          description: projectDescription,
          link: projectLink,
          image: projectImage
        });
        alert('Project created successfully!');
        clearProjectForm();
        fetchProjects();
      } catch (err) {
        alert('Error creating project');
      }
    }

    setLoading(false);
  }

  async function handleAboutSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert('Please log in to manage about sections');
      setLoading(false);
      return;
    }

    if (editingAbout) {
      try {
        await api.about.update(editingAbout._id, {
          title: aboutTitle,
          description: aboutDescription,
          icon: aboutIcon
        });
        alert('About section updated successfully!');
        clearAboutForm();
        fetchAboutSections();
      } catch (err) {
        alert('Error updating about section');
      }
    } else {
      try {
        await api.about.create({
          title: aboutTitle,
          description: aboutDescription,
          icon: aboutIcon
        });
        alert('About section created successfully!');
        clearAboutForm();
        fetchAboutSections();
      } catch (err) {
        alert('Error creating about section');
      }
    }

    setLoading(false);
  }

  function clearBlogForm() {
    setTitle('');
    setContent('');
    setVideoUrl('');
    setVideoFile(null);
    setEditingPost(null);
    setUploadProgress(0);
  }

  function clearProjectForm() {
    setProjectTitle('');
    setProjectDescription('');
    setProjectLink('');
    setProjectImage('');
    setEditingProject(null);
  }

  function clearAboutForm() {
    setAboutTitle('');
    setAboutDescription('');
    setAboutIcon('');
    setEditingAbout(null);
  }

  async function handleEditPost(post: BlogPost) {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
    setVideoUrl(post.video_url || '');
    setVideoFile(null);
    setActiveTab('blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleEditProject(project: Project) {
    setEditingProject(project);
    setProjectTitle(project.title);
    setProjectDescription(project.description);
    setProjectLink(project.link);
    setProjectImage(project.image);
    setActiveTab('projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleEditAbout(about: AboutSection) {
    setEditingAbout(about);
    setAboutTitle(about.title);
    setAboutDescription(about.description);
    setAboutIcon(about.icon);
    setActiveTab('about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(type: 'blog' | 'project' | 'about', id: string) {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        switch (type) {
          case 'blog':
            await api.posts.delete(id);
            fetchPosts();
            break;
          case 'project':
            await api.projects.delete(id);
            fetchProjects();
            break;
          case 'about':
            await api.about.delete(id);
            fetchAboutSections();
            break;
        }
        alert(`${type} deleted successfully!`);
      } catch (err) {
        alert(`Error deleting ${type}`);
      }
    }
  }

  async function handleSignOut() {
    localStorage.removeItem('portfolio_token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1.5 cursor-pointer hover:bg-blue-700 transition-colors">
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={uploadAvatar}
                  disabled={uploading}
                />
              </label>
            </div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <button
            onClick={handleSignOut}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('blog')}
            className={`px-4 py-2 rounded ${activeTab === 'blog' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Blog Posts
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded ${activeTab === 'projects' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 rounded ${activeTab === 'about' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            About Sections
          </button>
        </div>

        {/* Blog Posts Section */}
        {activeTab === 'blog' && (
          <>
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">
                {editingPost ? 'Edit Post' : 'Create New Post'}
              </h2>
              <form onSubmit={handleBlogSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Content (Markdown supported)
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-64"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Video
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
                        <Upload className="w-5 h-5 mr-2" />
                        Choose Video
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setVideoFile(file);
                              setVideoUrl('');
                            }
                          }}
                        />
                      </label>
                      {videoFile && (
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600">{videoFile.name}</span>
                          <button
                            type="button"
                            onClick={() => setVideoFile(null)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                    <p className="text-sm text-gray-500">Or enter a video URL:</p>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => {
                        setVideoUrl(e.target.value);
                        setVideoFile(null);
                      }}
                      placeholder="https://example.com/video.mp4"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex-grow"
                  >
                    {loading ? 'Saving...' : (editingPost ? 'Update Post' : 'Create Post')}
                  </button>
                  {editingPost && (
                    <button
                      type="button"
                      onClick={clearBlogForm}
                      className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Manage Posts</h2>
              <div className="space-y-4">
                {posts.map((post: BlogPost) => (
                  <div key={post._id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{post.title}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                        {post.video_url && (
                          <p className="text-sm text-blue-600">Has video</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditPost(post)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete('blog', post._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Projects Section */}
        {activeTab === 'projects' && (
          <>
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h2>
              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Description
                  </label>
                  <textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    GitHub Link
                  </label>
                  <input
                    type="url"
                    value={projectLink}
                    onChange={(e) => setProjectLink(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={projectImage}
                    onChange={(e) => setProjectImage(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex-grow"
                  >
                    {loading ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}
                  </button>
                  {editingProject && (
                    <button
                      type="button"
                      onClick={clearProjectForm}
                      className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Manage Projects</h2>
              <div className="space-y-4">
                {projects.map((project: Project) => (
                  <div key={project._id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{project.title}</h3>
                        <p className="text-sm text-gray-600">{project.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProject(project)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete('project', project._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* About Sections */}
        {activeTab === 'about' && (
          <>
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">
                {editingAbout ? 'Edit About Section' : 'Create New About Section'}
              </h2>
              <form onSubmit={handleAboutSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={aboutTitle}
                    onChange={(e) => setAboutTitle(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Description
                  </label>
                  <textarea
                    value={aboutDescription}
                    onChange={(e) => setAboutDescription(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Icon Name (from Lucide)
                  </label>
                  <input
                    type="text"
                    value={aboutIcon}
                    onChange={(e) => setAboutIcon(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="e.g., Code, BookOpen, Heart"
                    required
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex-grow"
                  >
                    {loading ? 'Saving...' : (editingAbout ? 'Update Section' : 'Create Section')}
                  </button>
                  {editingAbout && (
                    <button
                      type="button"
                      onClick={clearAboutForm}
                      className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Manage About Sections</h2>
              <div className="space-y-4">
                {aboutSections.map((section: AboutSection) => (
                  <div key={section._id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{section.title}</h3>
                        <p className="text-sm text-gray-600">{section.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditAbout(section)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete('about', section._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Admin;