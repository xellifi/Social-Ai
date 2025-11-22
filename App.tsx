
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Replies } from './components/Replies';
import { Activity } from './components/Activity';
import { Poster } from './components/Poster';
import { ApiManager } from './components/ApiManager';
import { Guide } from './components/Guide';
import { Legal } from './components/Legal';
import { View, ConnectedPage, ScheduledPost, ApiConfig } from './types';

// Mock Initial Data
const INITIAL_PAGES: ConnectedPage[] = [
  {
    id: '1',
    name: 'Tech Daily',
    accessToken: 'mock_token_1',
    isConnected: true,
    automationEnabled: true,
    followers: 12500,
    aiInstructions: 'You are a tech enthusiast. Keep replies short and geeky.',
    avatarUrl: 'https://picsum.photos/id/1/200/200'
  },
  {
    id: '2',
    name: 'Cozy Coffee',
    accessToken: 'mock_token_2',
    isConnected: true,
    automationEnabled: false,
    followers: 3200,
    aiInstructions: 'Friendly barista vibe. Always mention we have oat milk.',
    avatarUrl: 'https://picsum.photos/id/106/200/200'
  }
];

const INITIAL_POSTS: ScheduledPost[] = [
  {
    id: '101',
    pageId: '1',
    content: 'Check out the latest AI trends! #tech #ai',
    mediaType: 'image',
    mediaUrl: 'https://picsum.photos/seed/tech/800/600',
    scheduledTime: '2023-12-01T10:00',
    status: 'published',
    recurrence: 'once'
  },
  {
    id: '102',
    pageId: '1',
    content: 'Good morning everyone! ☀️',
    mediaType: 'text',
    scheduledTime: '2023-12-02T08:00',
    status: 'published',
    recurrence: 'daily'
  },
  {
    id: '103',
    pageId: '2',
    content: 'Fresh brew is ready! Come get your cup.',
    mediaType: 'image',
    mediaUrl: 'https://picsum.photos/seed/coffee/800/600',
    scheduledTime: '2023-12-03T09:00',
    status: 'queued',
    recurrence: 'daily'
  },
   {
    id: '104',
    pageId: '1',
    content: '5 tips for better coding standards.',
    mediaType: 'video',
    scheduledTime: '2023-12-04T15:00',
    status: 'queued',
    recurrence: 'weekly'
  },
  {
    id: '105',
    pageId: '2',
    content: 'Weekend vibes at the shop.',
    mediaType: 'image',
    mediaUrl: 'https://picsum.photos/seed/shop/800/600',
    scheduledTime: '2023-12-05T11:00',
    status: 'queued',
    recurrence: 'once'
  },
  {
    id: '106',
    pageId: '1',
    content: 'Our new gadget review is up!',
    mediaType: 'text',
    scheduledTime: '2023-11-28T14:00',
    status: 'published',
    recurrence: 'once'
  }
];

const DEFAULT_APIS: ApiConfig[] = [
  { provider: 'openai', apiKey: '', isActive: false },
  { provider: 'deepseek', apiKey: '', isActive: false },
  { provider: 'anthropic', apiKey: '', isActive: false },
  { provider: 'mistral', apiKey: '', isActive: false },
  { provider: 'xai', apiKey: '', isActive: false },
  { provider: 'cohere', apiKey: '', isActive: false },
  { provider: 'gemini', apiKey: '', isActive: true },
  { provider: 'stability', apiKey: '', isActive: false },
  { provider: 'veo', apiKey: '', isActive: false },
  { provider: 'runway', apiKey: '', isActive: false },
  { provider: 'luma', apiKey: '', isActive: false },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [pages, setPages] = useState<ConnectedPage[]>(INITIAL_PAGES);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(INITIAL_POSTS);
  const [apiConfigs, setApiConfigs] = useState<ApiConfig[]>(DEFAULT_APIS);
  
  // State to track which page is selected in the Replies view
  const [repliesSelectedPageId, setRepliesSelectedPageId] = useState<string>('');

  useEffect(() => {
    const storedApis = localStorage.getItem('api_configs');
    if (storedApis) {
      const parsed: ApiConfig[] = JSON.parse(storedApis);
      // Merge with defaults to ensure new providers exist if local storage is old
      const merged = DEFAULT_APIS.map(def => {
        const existing = parsed.find(p => p.provider === def.provider);
        return existing || def;
      });
      setApiConfigs(merged);
    }
  }, []);

  // Ensure we always have a valid selection for replies if pages exist
  useEffect(() => {
    if (!repliesSelectedPageId && pages.length > 0) {
      setRepliesSelectedPageId(pages[0].id);
    }
  }, [pages, repliesSelectedPageId]);

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return (
          <Dashboard 
            pages={pages} 
            setPages={setPages} 
            onNavigateToReplies={(pageId) => {
              setRepliesSelectedPageId(pageId);
              setCurrentView(View.REPLIES);
            }}
            onNavigateToGuide={() => setCurrentView(View.GUIDE)}
          />
        );
      case View.REPLIES:
        return (
          <Replies 
            pages={pages} 
            setPages={setPages}
            apiConfigs={apiConfigs} 
            selectedPageId={repliesSelectedPageId}
            setSelectedPageId={setRepliesSelectedPageId}
            onClose={() => setCurrentView(View.DASHBOARD)}
            onNavigateToApiManager={() => setCurrentView(View.API_MANAGER)}
          />
        );
      case View.ACTIVITY:
        return <Activity pages={pages} />;
      case View.POSTER:
        return <Poster pages={pages} scheduledPosts={scheduledPosts} setScheduledPosts={setScheduledPosts} apiConfigs={apiConfigs} />;
      case View.API_MANAGER:
        return <ApiManager apiConfigs={apiConfigs} setApiConfigs={setApiConfigs} />;
      case View.GUIDE:
        return <Guide onClose={() => setCurrentView(View.DASHBOARD)} />;
      case View.LEGAL:
        return <Legal />;
      default:
        return <Dashboard pages={pages} setPages={setPages} onNavigateToReplies={() => {}} onNavigateToGuide={() => {}}/>;
    }
  };

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

export default App;
