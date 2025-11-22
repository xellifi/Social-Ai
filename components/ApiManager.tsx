
import React from 'react';
import { ApiConfig } from '../types';
import { Key, Save, Bot, Sparkles, BrainCircuit, Zap, ExternalLink, MessageSquareText, Image, Video, ScanSearch, Wind, X, Network, Palette, Film, Aperture } from 'lucide-react';

interface ApiManagerProps {
  apiConfigs: ApiConfig[];
  setApiConfigs: React.Dispatch<React.SetStateAction<ApiConfig[]>>;
}

const PROVIDER_META: Record<string, { 
  label: string; 
  icon: React.ElementType; 
  color: string; 
  category: 'text' | 'image' | 'video';
  link: string;
  desc: string;
}> = {
  // Text Providers
  openai: { 
    label: 'OpenAI', 
    icon: Bot, 
    color: 'text-green-400', 
    category: 'text',
    link: 'https://platform.openai.com/api-keys',
    desc: 'GPT-4o, GPT-3.5 Turbo'
  },
  deepseek: { 
    label: 'DeepSeek', 
    icon: ScanSearch, 
    color: 'text-blue-400', 
    category: 'text',
    link: 'https://platform.deepseek.com/api_keys',
    desc: 'DeepSeek V3, Coder'
  },
  anthropic: { 
    label: 'Claude (Anthropic)', 
    icon: BrainCircuit, 
    color: 'text-purple-400', 
    category: 'text',
    link: 'https://console.anthropic.com/settings/keys',
    desc: 'Claude 3.5 Sonnet, Opus'
  },
  mistral: { 
    label: 'Mistral AI', 
    icon: Wind, 
    color: 'text-amber-400', 
    category: 'text',
    link: 'https://console.mistral.ai/api-keys/',
    desc: 'Mistral Large, Small, Le Chat'
  },
  xai: { 
    label: 'xAI (Grok)', 
    icon: X, 
    color: 'text-slate-100', 
    category: 'text',
    link: 'https://console.x.ai/',
    desc: 'Grok-1, Grok-2'
  },
  cohere: { 
    label: 'Cohere', 
    icon: Network, 
    color: 'text-teal-400', 
    category: 'text',
    link: 'https://dashboard.cohere.com/api-keys',
    desc: 'Command R, Command R+'
  },

  // Image Providers
  gemini: { 
    label: 'Google Gemini', 
    icon: Sparkles, 
    color: 'text-blue-400', 
    category: 'image',
    link: 'https://aistudio.google.com/app/apikey',
    desc: 'Gemini 2.5 Flash (Image Gen)'
  },
  stability: { 
    label: 'Stability AI', 
    icon: Palette, 
    color: 'text-indigo-400', 
    category: 'image',
    link: 'https://platform.stability.ai/account/keys',
    desc: 'Stable Diffusion 3, SDXL'
  },

  // Video Providers
  veo: { 
    label: 'Google Veo', 
    icon: Video, 
    color: 'text-pink-400', 
    category: 'video',
    link: 'https://aistudio.google.com/app/apikey',
    desc: 'Veo 3.1 Video Generation'
  },
  runway: { 
    label: 'RunwayML', 
    icon: Film, 
    color: 'text-rose-400', 
    category: 'video',
    link: 'https://app.runwayml.com/account/api-keys',
    desc: 'Gen-3 Alpha, Gen-2'
  },
  luma: { 
    label: 'Luma Dream Machine', 
    icon: Aperture, 
    color: 'text-cyan-400', 
    category: 'video',
    link: 'https://lumalabs.ai/dream-machine/api',
    desc: 'Dream Machine Video Generation'
  }
};

export const ApiManager: React.FC<ApiManagerProps> = ({ apiConfigs, setApiConfigs }) => {
  const handleSave = () => {
    localStorage.setItem('api_configs', JSON.stringify(apiConfigs));
    alert('Settings saved locally');
  };

  const handleChange = (provider: string, value: string) => {
    setApiConfigs(apiConfigs.map(api => api.provider === provider ? { ...api, apiKey: value } : api));
  };

  const toggleActive = (provider: string) => {
    setApiConfigs(apiConfigs.map(api => api.provider === provider ? { ...api, isActive: !api.isActive } : api));
  };

  const renderProviderCard = (api: ApiConfig) => {
    const meta = PROVIDER_META[api.provider] || { label: api.provider, icon: Zap, color: 'text-slate-400', link: '#', desc: '' };
    const Icon = meta.icon;

    return (
      <div key={api.provider} className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-all group">
        <div className="flex items-start gap-4">
          <div className={`p-3 bg-slate-800 rounded-lg border border-slate-700 shrink-0 ${meta.color}`}>
            <Icon size={24} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-white font-semibold">{meta.label}</h4>
              <div className="flex items-center gap-3">
                <a 
                  href={meta.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="hidden sm:flex items-center gap-1 text-[10px] text-primary hover:text-indigo-300 transition-colors bg-primary/10 px-2 py-1 rounded-md border border-primary/20"
                >
                  <ExternalLink size={10} /> Get Key
                </a>
                <button 
                  onClick={() => toggleActive(api.provider)}
                  className={`w-9 h-5 rounded-full relative transition-colors ${api.isActive ? 'bg-green-500' : 'bg-slate-600'}`}
                >
                  <span className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${api.isActive ? 'translate-x-4' : 'translate-x-0'}`}></span>
                </button>
              </div>
            </div>
            
            <p className="text-slate-500 text-xs mb-3">{meta.desc}</p>
            
            <div className="relative">
              <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                  type="password" 
                  value={api.apiKey}
                  onChange={(e) => handleChange(api.provider, e.target.value)}
                  placeholder={`Paste ${meta.label} API Key`}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-slate-300 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder-slate-600"
                />
            </div>
            <div className="mt-2 sm:hidden text-right">
               <a href={meta.link} target="_blank" rel="noreferrer" className="text-[10px] text-primary underline">Get API Key Here</a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getProvidersByCategory = (category: 'text' | 'image' | 'video') => {
    return apiConfigs
      .filter(api => PROVIDER_META[api.provider]?.category === category)
      .sort((a, b) => {
        // Prefer logical ordering
        const order = ['openai', 'deepseek', 'anthropic', 'mistral', 'xai', 'cohere', 'gemini', 'stability', 'veo', 'runway', 'luma'];
        return order.indexOf(a.provider) - order.indexOf(b.provider);
      });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
      <div className="flex items-center justify-between sticky top-0 z-20 bg-background/95 backdrop-blur py-4 border-b border-slate-800">
        <div>
           <h2 className="text-2xl font-bold text-white">API Management</h2>
           <p className="text-slate-400 text-sm">Configure and manage your AI model providers.</p>
        </div>
         <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-primary hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
           >
             <Save size={18} /> Save
           </button>
      </div>

      {/* Text / Replies Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white pb-2 border-b border-slate-800">
          <MessageSquareText className="text-green-400" size={20}/>
          <h3 className="text-lg font-bold">Text Messaging & Replies</h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {getProvidersByCategory('text').map(renderProviderCard)}
        </div>
      </div>

      {/* Image Generation Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white pb-2 border-b border-slate-800">
          <Image className="text-blue-400" size={20}/>
          <h3 className="text-lg font-bold">Image Generation</h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
           {getProvidersByCategory('image').map(renderProviderCard)}
        </div>
      </div>

      {/* Video Generation Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white pb-2 border-b border-slate-800">
          <Video className="text-pink-400" size={20}/>
          <h3 className="text-lg font-bold">Video Creation</h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
           {getProvidersByCategory('video').map(renderProviderCard)}
        </div>
      </div>

      <div className="bg-surface border border-slate-700 rounded-2xl p-6 mt-8">
         <p className="text-xs text-slate-400 text-center">
           <strong>Note:</strong> All API keys are stored locally in your browser. We do not save them to any server. 
           Ensure you check the pricing for each provider before use.
         </p>
      </div>
    </div>
  );
};
