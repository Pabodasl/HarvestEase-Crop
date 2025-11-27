import React, { useState, useEffect } from 'react';
import axios from 'axios';

const KnowledgeHub = () => {
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [experience, setExperience] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [editedExperience, setEditedExperience] = useState('');
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editImageFile, setEditImageFile] = useState(null);
  const [editPreviewImage, setEditPreviewImage] = useState(null);

  // Fetch existing posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    axios.get('http://localhost:5000/api/posts')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    setEditImageFile(file);
    setEditPreviewImage(URL.createObjectURL(file));
  };

  const validateName = (name) => /^[A-Za-z ]+$/.test(name);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    if (!validateName(value)) {
      setNameError('Name should contain only letters and spaces.');
    } else {
      setNameError('');
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!validateEmail(value)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    setNameError('');
    setEmailError('');

    if (!validateName(name)) {
      setNameError('Name should contain only letters and spaces.');
      valid = false;
    }
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }
    if (!valid) return;

    if (imageFile && experience && name && email) {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('experience', experience);
      formData.append('name', name);
      formData.append('email', email);

      try {
        const response = await axios.post('http://localhost:5000/api/posts', formData);
        setPosts([response.data, ...posts]); // Add new post on top
        // Reset form
        setImageFile(null);
        setPreviewImage(null);
        setExperience('');
        setName('');
        setEmail('');
        setShowAddModal(false); // Close the modal after submission
      } catch (error) {
        console.error('Error submitting post:', error);
      }
    }
  };

  const openEditModal = (post) => {
    setCurrentPost(post);
    setEditedName(post.name);
    setEditedEmail(post.email);
    setEditedExperience(post.experience);
    setEditPreviewImage(`http://localhost:5000${post.imagePath}`);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setCurrentPost(null);
    setEditImageFile(null);
    setEditPreviewImage(null);
  };

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setImageFile(null);
    setPreviewImage(null);
    setExperience('');
    setName('');
    setEmail('');
    setNameError('');
    setEmailError('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!currentPost) return;
    
    const formData = new FormData();
    formData.append('name', editedName);
    formData.append('email', editedEmail);
    formData.append('experience', editedExperience);
    
    if (editImageFile) {
      formData.append('image', editImageFile);
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/posts/${currentPost._id}`, formData);
      setPosts(posts.map(p => p._id === currentPost._id ? response.data : p));
      closeEditModal();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`http://localhost:5000/api/posts/${postId}`);
        setPosts(posts.filter(post => post._id !== postId));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.experience.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      <div className="absolute inset-0 bg-no-repeat bg-center bg-cover opacity-10"
        style={{
          backgroundImage: `url('../../src/assets/shared_bg.png')`,
          backgroundSize: '900px',
        }}
      ></div>

      <div className="relative max-w-5xl mx-auto p-6 z-10 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-green-700 mb-10">
          <span className="inline-block mr-2">🌱</span>
          Knowledge Hub - Plant Disease Experience
        </h2>

        {/* Search and Add New Post */}
        <div className="w-full flex justify-between items-center mb-8">
          <button 
            onClick={openAddModal}
            className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition shadow-md flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Share Your Experience
          </button>
          
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[300px] h-[40px] pl-10 pr-4 py-2 border border-green-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
              placeholder="Search diseases"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Display Posts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 w-full">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div key={post._id} className="relative border border-green-100 p-4 rounded-2xl shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
                {/* Action buttons */}
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button 
                    onClick={() => openEditModal(post)}
                    className="bg-green-50 hover:bg-green-100 text-green-600 p-1.5 rounded-full transition-colors duration-200"
                    title="Edit post"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDelete(post._id)}
                    className="bg-red-50 hover:bg-red-100 text-red-500 p-1.5 rounded-full transition-colors duration-200"
                    title="Delete post"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <div className="flex justify-center mb-4 w-full">
                  <img 
                    src={`http://localhost:5000${post.imagePath}`} 
                    alt="Plant Disease" 
                    className="w-48 h-48 object-cover rounded-xl shadow-sm border border-green-50" 
                  />
                </div>
                <p className="text-lg font-bold text-green-900 mb-2 text-center line-clamp-2">{post.experience}</p>
                <div className="border-t border-green-100 pt-2 mt-2">
                  <h4 className="font-semibold text-base mb-1 text-gray-800 text-center">{post.name}</h4>
                  <p className="text-sm text-gray-600 mb-1 text-center">{post.email}</p>
                  <p className="text-xs text-gray-400 text-center">Posted on: {post.createdAt ? new Date(post.createdAt).toLocaleString() : ''}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center py-10">
              <p className="text-center text-gray-500 text-lg">No posts found matching your search</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl relative">
            <button 
              onClick={closeEditModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="text-2xl font-semibold mb-6 text-green-800 flex items-center">
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </span>
              Edit Post
            </h3>
            
            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-md font-medium text-gray-700">Your Name</label>
                  <input 
                    type="text" 
                    value={editedName} 
                    onChange={(e) => setEditedName(e.target.value)} 
                    className="w-full mt-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700">Your Email</label>
                  <input 
                    type="email" 
                    value={editedEmail} 
                    onChange={(e) => setEditedEmail(e.target.value)} 
                    className="w-full mt-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-md font-medium text-gray-700">Your Experience</label>
                <textarea 
                  value={editedExperience} 
                  onChange={(e) => setEditedExperience(e.target.value)} 
                  rows="3" 
                  className="w-full mt-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                ></textarea>
              </div>
              
              <div>
                <label className="cursor-pointer text-green-600 font-medium flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  Change Image (optional)
                </label>
                <input 
                  type="file" 
                  onChange={handleEditImageChange} 
                  accept="image/*" 
                  className="mt-1 p-2 border border-gray-200 rounded-lg w-full" 
                />
                {editPreviewImage && (
                  <div className="mt-3 flex justify-center">
                    <img 
                      src={editPreviewImage} 
                      alt="Preview" 
                      className="h-48 object-contain rounded-lg" 
                    />
                  </div>
                )}
              </div>
              
              <div className="flex justify-center pt-4">
                <button 
                  type="button" 
                  onClick={closeEditModal}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg mr-4 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md"
                >
                  Update Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Post Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl relative">
            <button 
              onClick={closeAddModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="text-2xl font-semibold mb-6 text-green-800 flex items-center">
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </span>
              Share Your Plant Disease Experience
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-md font-medium text-gray-700">Your Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={handleNameChange} 
                    className="w-full mt-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                    placeholder="Enter your name" 
                  />
                  {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700">Your Email</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={handleEmailChange} 
                    className="w-full mt-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                    placeholder="Enter your email" 
                  />
                  {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-md font-medium text-gray-700">Your Experience</label>
                <textarea 
                  value={experience} 
                  onChange={(e) => setExperience(e.target.value)} 
                  rows="4" 
                  className="w-full mt-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                  placeholder="Describe your experience with this plant disease..."
                ></textarea>
              </div>
              
              <div>
                <label className="cursor-pointer text-green-600 font-medium flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  Upload Plant Disease Image
                </label>
                <input 
                  type="file" 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  className="mt-1 p-2 border border-gray-200 rounded-lg w-full" 
                />
                {previewImage && (
                  <div className="mt-3 flex justify-center">
                    <img src={previewImage} alt="Preview" className="h-48 object-contain rounded-lg" />
                  </div>
                )}
              </div>
              
              <div className="flex justify-center pt-4">
                <button 
                  type="button" 
                  onClick={closeAddModal}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg mr-4 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition shadow-md flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Share Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeHub;
