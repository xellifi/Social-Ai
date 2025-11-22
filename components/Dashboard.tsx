
import React, { useState } from 'react';
import { ConnectedPage } from '../types';
import { Plus, Facebook, Bot, BrainCircuit, Trash2, MessageSquareText, Book } from 'lucide-react';
import { Modal } from './Modal';

interface DashboardProps {
  pages: ConnectedPage[];
  setPages: React.Dispatch<React.SetStateAction<ConnectedPage[]>>;
  onNavigateToReplies: (pageId: string) => void;
  onNavigateToGuide: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ pages, setPages, onNavigateToReplies, onNavigateToGuide }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTrainModalOpen, setIsTrainModalOpen] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

  // Form States
  const [newPageAppId, setNewPageAppId] = useState('');
  const [newPageToken, setNewPageToken] = useState('');
  const [trainingText, setTrainingText] = useState('');

  const handleAddPage = () => {
    const newPage: ConnectedPage = {
      id: Date.now().toString(),
      name: `Page ${newPageAppId.slice(0, 4)}...`, // Simulated name
      accessToken: newPageToken,
      isConnected: true,
      automationEnabled: false,
      followers: Math.floor(Math.random() * 5000) + 100,
      aiInstructions: "Be polite and helpful.",
      avatarUrl: `https://picsum.photos/seed/${Date.now()}/200/200`,
    };
    setPages([...pages, newPage]);
    setIsAddModalOpen(false);
    setNewPageAppId('');
    setNewPageToken('');
  };

  const handleToggleAutomation = (id: string) => {
    setPages(pages.map(p => p.id === id ? { ...p, automationEnabled: !p.automationEnabled } : p));
  };

  const openTrainModal = (page: ConnectedPage) => {
    setSelectedPageId(page.id);
    setTrainingText(page.aiInstructions);
    setIsTrainModalOpen(true);
  };

  const saveTraining = () => {
    if (selectedPageId) {
      setPages(pages.map(p => p.id === selectedPageId ? { ...p, aiInstructions: trainingText } : p));
    }
    setIsTrainModalOpen(false);
  };
  
  const deletePage = (id: string) => {
      setPages(pages.filter(p => p.id !== id));
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Dashboard</h2>
          <p className="text-slate-400 mt-1">Manage your Facebook ecosystem.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus size={20} /> Connect Page
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface border border-slate-700 p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
              <Facebook size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Connected Pages</p>
              <p className="text-2xl font-bold text-white">{pages.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-surface border border-slate-700 p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
              <Bot size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Active Bots</p>
              <p className="text-2xl font-bold text-white">{pages.filter(p => p.automationEnabled).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-surface border border-slate-700 p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
              <BrainCircuit size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Followers</p>
              <p className="text-2xl font-bold text-white">
                {pages.reduce((acc, curr) => acc + curr.followers, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pages List */}
      <div className="bg-surface border border-slate-700 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-xl font-semibold text-white">Connected Pages</h3>
        </div>
        <div className="divide-y divide-slate-700">
          {pages.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No pages connected yet. Click "Connect Page" to start.
            </div>
          ) : (
            pages.map((page) => (
              <div key={page.id} className="relative p-6 hover:bg-slate-800/30 transition-colors group">
                {/* Delete Button - Positioned Top Right */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePage(page.id);
                  }}
                  className="absolute top-4 right-4 p-2 text-red-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 z-10"
                  title="Disconnect Page"
                >
                  <Trash2 size={18} /> 
                </button>

                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pr-8 lg:pr-12">
                  
                  {/* Left Side: Avatar & Info */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src={page.avatarUrl} alt={page.name} className="w-14 h-14 rounded-full ring-2 ring-slate-700 object-cover" />
                      {page.automationEnabled && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-slate-800 flex items-center justify-center shadow-sm">
                           <Bot size={10} className="text-white"/>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-lg">{page.name}</h4>
                      <p className="text-xs text-slate-400 font-mono">ID: {page.id}</p>
                    </div>
                  </div>
                  
                  {/* Right Side: Controls */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                    
                    {/* Automation Switch */}
                    <button 
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg border transition-all w-full sm:w-auto justify-between sm:justify-start ${page.automationEnabled ? 'bg-green-500/10 border-green-500/30' : 'bg-slate-900 border-slate-700 hover:border-slate-600'}`}
                      onClick={() => handleToggleAutomation(page.id)}
                    >
                      <span className={`text-sm font-medium ${page.automationEnabled ? 'text-green-400' : 'text-slate-400'}`}>
                        {page.automationEnabled ? 'Auto ON' : 'Auto OFF'}
                      </span>
                      <div className={`w-9 h-5 rounded-full relative transition-colors ${page.automationEnabled ? 'bg-green-500' : 'bg-slate-600'}`}>
                        <span className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${page.automationEnabled ? 'translate-x-4' : 'translate-x-0'}`}></span>
                      </div>
                    </button>

                    {/* Action Buttons Group */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => onNavigateToReplies(page.id)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-2 rounded-lg transition-colors"
                      >
                        <MessageSquareText size={16} /> Replies
                      </button>

                      <button 
                        onClick={() => openTrainModal(page)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-2 rounded-lg transition-colors"
                      >
                        <BrainCircuit size={16} /> Train
                      </button>

                      <button
                        onClick={onNavigateToGuide}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 border border-slate-600 px-3 py-2 rounded-lg transition-colors"
                        title="View Guide"
                      >
                        <Book size={16} /> Guide
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Page Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Connect Facebook Page">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">App ID</label>
            <input 
              type="text" 
              value={newPageAppId}
              onChange={(e) => setNewPageAppId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="1234567890"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Page Access Token</label>
            <input 
              type="password" 
              value={newPageToken}
              onChange={(e) => setNewPageToken(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="EAAG..."
            />
          </div>
          <button 
            onClick={handleAddPage}
            disabled={!newPageAppId || !newPageToken}
            className="w-full bg-primary hover:bg-indigo-600 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save & Connect
          </button>
        </div>
      </Modal>

      {/* Train AI Modal */}
      <Modal isOpen={isTrainModalOpen} onClose={() => setIsTrainModalOpen(false)} title="Train AI Agent">
        <div className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
            <p className="text-sm text-blue-300">
              Provide system instructions for this page. The AI will use this "personality" and knowledge base when replying to comments and DMs.
            </p>
          </div>
          <textarea 
            value={trainingText}
            onChange={(e) => setTrainingText(e.target.value)}
            rows={8}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
            placeholder="e.g., You are a helpful assistant for a Pizza Shop. Our hours are 9am-9pm. We do not deliver on Sundays. Be witty and fun."
          />
          <button 
            onClick={saveTraining}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl transition-colors"
          >
            Save Knowledge Base
          </button>
        </div>
      </Modal>
    </div>
  );
};
