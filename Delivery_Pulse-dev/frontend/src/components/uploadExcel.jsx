import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ResourceUpload = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadStatus(''); // Reset status
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Validate file type
      const validTypes = ['.xlsx', '.xls', '.csv'];
      const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!validTypes.includes(fileExt)) {
        setUploadStatus('❌ Invalid file type. Please upload Excel (.xlsx, .xls) or CSV file.');
        setSelectedFile(null);
        return;
      }
      
      setSelectedFile(file);
      setUploadStatus('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('❌ Please select a file first');
      return;
    }

    setUploading(true);
    setUploadStatus('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await api.post('/resources/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Override for file upload
        },
      });
      setUploadStatus(`✅ ${response.data.message}`);
      console.log('Upload success:', response.data);
      
      // Reset file after successful upload
      setSelectedFile(null);
      const fileInput = document.getElementById('file-upload');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus(`❌ Upload failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:block">
        <nav className="p-4 space-y-2">
          <button
            onClick={() => navigate('/dsr')}
            className="w-full flex items-center gap-3 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-primary dark:text-white font-semibold border-l-4 border-primary"
          >
            <span className="material-symbols-outlined text-xl">home</span>
            <span className="text-sm">Home</span>
          </button>
          <button
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
          >
            <span className="material-symbols-outlined text-xl">settings</span>
            <span className="text-sm">Settings</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-sans">Admin Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-sans">Manage data and system configurations.</p>
          </div>

          {/* Upload Card */}
          <div className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 p-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 font-sans">Upload Data</h2>
            
            <div className="space-y-6">
              {/* Drag & Drop Area */}
              <div
                className={`border-2 border-dashed ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-800'
                } p-12 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-slate-800/50 transition-colors cursor-pointer`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-5xl mb-4">
                  cloud_upload
                </span>
                <p className="text-base font-semibold text-slate-700 dark:text-slate-200 mb-1 font-sans">
                  {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-sans">
                  Excel (.xlsx) or CSV (.csv) files only
                </p>
                <input
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Error/Success Messages */}
              {uploadStatus && (
                <div className={`flex items-start gap-3 p-4 ${
                  uploadStatus.startsWith('✅') 
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30'
                }`}>
                  <span className={`material-symbols-outlined text-xl ${
                    uploadStatus.startsWith('✅') 
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {uploadStatus.startsWith('✅') ? 'check_circle' : 'error'}
                  </span>
                  <p className={`text-sm font-medium font-sans ${
                    uploadStatus.startsWith('✅')
                      ? 'text-green-700 dark:text-green-400'
                      : 'text-red-700 dark:text-red-400'
                  }`}>
                    {uploadStatus.replace('✅ ', '').replace('❌ ', '')}
                  </p>
                </div>
              )}

              {/* Upload Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className="bg-primary hover:opacity-95 text-white px-8 py-3 font-semibold transition-all shadow-md active:scale-95 font-sans flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <span className="material-symbols-outlined text-lg animate-spin">refresh</span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">upload</span>
                      Upload File
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 text-center pb-8">
            <p className="text-xs text-slate-400 dark:text-slate-500 font-sans">
              © 2026 DSR Tracker. All rights reserved.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default ResourceUpload;
