'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Star, Users, BrainCircuit, PenTool, Image as ImageIcon, Code, Sparkles, Filter } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'All Agents', icon: BrainCircuit },
  { id: 'writing', name: 'Writing Assistants', icon: PenTool },
  { id: 'visual', name: 'Visual Creators', icon: ImageIcon },
  { id: 'dev', name: 'Developer Tools', icon: Code },
  { id: 'productivity', name: 'Productivity', icon: Sparkles },
];

const AGENTS = [
  {
    id: '1',
    name: 'Story Weaver',
    description: 'Turns your daily bullet points into engaging narrative stories.',
    category: 'writing',
    author: 'ClawLabs',
    downloads: 12400,
    rating: 4.9,
    tags: ['Narrative', 'Creative', 'Daily'],
    isInstalled: true,
  },
  {
    id: '2',
    name: 'Mood Visualizer',
    description: 'Generates abstract art based on the emotional tone of your diary entries.',
    category: 'visual',
    author: 'ArtisanalAI',
    downloads: 8300,
    rating: 4.7,
    tags: ['Art', 'Emotion', 'Stable Diffusion'],
    isInstalled: false,
  },
  {
    id: '3',
    name: 'Habit Tracker Pro',
    description: 'Automatically extracts habit completions from text and visualizes trends.',
    category: 'productivity',
    author: 'QuantifiedSelf',
    downloads: 25100,
    rating: 4.8,
    tags: ['Analytics', 'Habits', 'Charts'],
    isInstalled: false,
  },
  {
    id: '4',
    name: 'Code Snippet Explainer',
    description: 'Documents and explains code snippets saved in your dev journal.',
    category: 'dev',
    author: 'DevTools',
    downloads: 5200,
    rating: 4.6,
    tags: ['Code', 'Documentation', 'Learning'],
    isInstalled: false,
  },
  {
    id: '5',
    name: 'Weekly Synthesizer',
    description: 'Reads your weekly entries and generates a comprehensive summary with insights.',
    category: 'writing',
    author: 'ClawLabs',
    downloads: 18900,
    rating: 4.9,
    tags: ['Summary', 'Insights', 'Weekly'],
    isInstalled: true,
  },
  {
    id: '6',
    name: 'Dream Interpreter',
    description: 'Analyzes dream logs using Jungian psychology frameworks.',
    category: 'productivity',
    author: 'PsycheAI',
    downloads: 3400,
    rating: 4.5,
    tags: ['Dreams', 'Psychology', 'Analysis'],
    isInstalled: false,
  }
];

export function AgentMarketplace() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [installedState, setInstalledState] = useState<Record<string, boolean>>(
    Object.fromEntries(AGENTS.map(a => [a.id, a.isInstalled]))
  );

  const filteredAgents = AGENTS.filter(agent => {
    const matchesCategory = activeCategory === 'all' || agent.category === activeCategory;
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleInstall = (id: string) => {
    setInstalledState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Agent Marketplace</h1>
            <p className="text-gray-600 dark:text-gray-400">Discover and install specialized AI agents to supercharge your diary.</p>
          </div>
          
          <div className="w-full md:w-96 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search agents..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(category => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-blue-500 hover:text-blue-500'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              key={agent.id}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 flex flex-col hover:shadow-xl transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl font-bold">
                  {agent.name.charAt(0)}
                </div>
                <button 
                  onClick={() => toggleInstall(agent.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    installedState[agent.id]
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                  }`}
                >
                  {installedState[agent.id] ? 'Installed' : 'Install'}
                </button>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{agent.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow mb-4">{agent.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {agent.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-md bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">{agent.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  <span>{(agent.downloads / 1000).toFixed(1)}k</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span className="truncate max-w-[80px]">{agent.author}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredAgents.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No agents found</h3>
            <p className="text-gray-500">Try adjusting your search or category filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}