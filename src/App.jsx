import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { 
  Layout, 
  Store, 
  Trophy, 
  Settings, 
  Wallet, 
  Globe, 
  ChevronRight, 
  ExternalLink, 
  Search,
  BookOpen,
  Zap,
  Shield,
  CreditCard,
  Grid,
  Newspaper,
  TrendingUp,
  Play,
  User,
  UserPlus,
  Trash2,
  Cpu,
  Layers,
  Activity,
  LogOut,
  Edit3,
  ShieldCheck,
  Lock,
  AlertTriangle,
  CheckCircle,
  X,
  ShoppingCart,
  Users,
  Plus,
  ChevronLeft,
  RefreshCw,
  Star
} from 'lucide-react';

// Mock dApps Data
const DAPPS = [
  { id: 1, name: 'Uniswap', url: 'https://app.uniswap.org', icon: '🦄', category: 'DeFi', description: 'Swap tokens easily' },
  { id: 2, name: 'SuperRare', url: 'https://superrare.com', icon: '🎨', category: 'NFT', description: 'Curated NFT art marketplace' },
  { id: 3, name: 'Aave', url: 'https://app.aave.com', icon: '👻', category: 'Lending', description: 'Earn interest on deposits' },
  { id: 4, name: 'Compound', url: 'https://compound.finance', icon: '🏦', category: 'Lending', description: 'Algorithmic money markets' },
  { id: 5, name: 'Hela Bridge', url: 'https://hela.network', icon: '🌉', category: 'Bridge', description: 'Move assets across chains' },
  { id: 6, name: 'Magic Eden', url: 'https://magiceden.io', icon: '🪄', category: 'NFT', description: 'Cross-chain NFT marketplace' },
  { id: 7, name: 'PancakeSwap', url: 'https://pancakeswap.finance', icon: '🥞', category: 'DeFi', description: 'Fast decentralized exchange' },
  { id: 8, name: 'Curve', url: 'https://curve.fi', icon: '📈', category: 'DeFi', description: 'Efficient stablecoin swaps' },
  { id: 9, name: 'Blur', url: 'https://blur.io', icon: '🟠', category: 'NFT', description: 'Professional NFT marketplace' },
  { id: 10, name: 'Lido', url: 'https://lido.fi', icon: '💧', category: 'Liquid Staking', description: 'Stake ETH and earn rewards' },
  { id: 11, name: '1inch', url: 'https://app.1inch.io', icon: '🦄', category: 'DeFi Aggregator', description: 'Get the best swap rates' },
  { id: 12, name: 'GMX', url: 'https://app.gmx.io', icon: '🫐', category: 'Perpetuals', description: 'Decentralized perpetual exchange' },
  { id: 13, name: 'Synthetix', url: 'https://synthetix.io', icon: '⚔️', category: 'Derivatives', description: 'Trade synthetic assets' },
  { id: 14, name: 'Trader Joe', url: 'https://traderjoexyz.com', icon: '🚜', category: 'DeFi', description: 'AVAX ecosystem hub' },
  { id: 15, name: 'LooksRare', url: 'https://looksrare.org', icon: '💎', category: 'NFT', description: 'Community-first NFT marketplace' },
  { id: 16, name: 'SushiSwap', url: 'https://sushi.com', icon: '🍣', category: 'DeFi', description: 'Multi-chain DEX ecosystem' },
  { id: 17, name: 'Rocket Pool', url: 'https://rocketpool.net', icon: '🚀', category: 'Liquid Staking', description: 'Decentralized ETH staking' },
  { id: 18, name: 'Aptos Bridge', url: 'https://theaptosbridge.com', icon: '🌀', category: 'Bridge', description: 'Bridge assets to Aptos' },
  { id: 19, name: 'Jupiter', url: 'https://jup.ag', icon: '🪐', category: 'Solana DeFi', description: 'Best swap rates on Solana' },
  { id: 20, name: 'Raydium', url: 'https://raydium.io', icon: '☀️', category: 'Solana DeFi', description: 'Solana AMM and ecosystem' },
  { id: 21, name: 'Arbitrum Bridge', url: 'https://bridge.arbitrum.io', icon: '🔵', category: 'Bridge', description: 'Official Arbitrum bridge' },
  { id: 22, name: 'Etherscan', url: 'https://etherscan.io', icon: '📑', category: 'Explorer', description: 'Ethereum blockchain explorer' },
  { id: 23, name: 'CoinGecko', url: 'https://coingecko.com', icon: '🦎', category: 'Analytics', description: 'Live crypto prices & market data' },
  { id: 24, name: 'CoinMarketCap', url: 'https://coinmarketcap.com', icon: '📊', category: 'Analytics', description: 'Crypto market cap rankings' },
  { id: 25, name: 'Zora', url: 'https://zora.co', icon: '🔮', category: 'NFT', description: 'Create and collect onchain' },
  { id: 26, name: 'Dune Analytics', url: 'https://dune.com', icon: '📉', category: 'Analytics', description: 'Blockchain data dashboards' },
  { id: 27, name: 'Polygon', url: 'https://polygon.technology', icon: '🔷', category: 'Layer 2', description: 'Ethereum scaling solution' },
  { id: 28, name: 'Optimism', url: 'https://optimism.io', icon: '🔴', category: 'Layer 2', description: 'Fast low-cost Ethereum L2' },
  { id: 29, name: 'Solscan', url: 'https://solscan.io', icon: '🌞', category: 'Explorer', description: 'Solana blockchain explorer' },
  { id: 30, name: 'DeFi Llama', url: 'https://defillama.com', icon: '🦙', category: 'Analytics', description: 'DeFi TVL and protocol data' }
];

const API_URL = import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== 'https://your-backend-url.vercel.app' 
  ? import.meta.env.VITE_API_URL 
  : 'https://web3browser-backend.vercel.app';

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('0.00');
  const [points, setPoints] = useState(0);
  const [dappList, setDappList] = useState(DAPPS);
  const [helaBalance, setHelaBalance] = useState('0.00');
  const [isWalletGateOpen, setIsWalletGateOpen] = useState(true);
  
  // UI States for Rewards
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isQuesting, setIsQuesting] = useState(false);
  const [isReferring, setIsReferring] = useState(false);
  const [isCashbacking, setIsCashbacking] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState(1000);

  // New Modals
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [redeemedVouchers, setRedeemedVouchers] = useState([]); // Tracks purchased vouchers
  
  // Browser Tab System
  const [tabs, setTabs] = useState([
    { 
      id: 'tab-1', 
      type: 'explore', 
      url: '', 
      name: 'New Tab', 
      icon: '🌐', 
      history: [], 
      historyIndex: -1, 
      isBookmarked: false,
      query: '',
      dapp: null,
      searchResults: [],
      isSearching: false,
      searchError: null
    }
  ]);
  const [activeTabId, setActiveTabId] = useState('tab-1');
  
  // Helper to get active tab
  const activeTabObj = tabs.find(t => t.id === activeTabId) || tabs[0];
  
  // Refactored helper to update active tab
  const updateActiveTab = (updates) => {
    setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, ...updates } : t));
  };

  const addTab = (type = 'explore', url = '', name = 'New Tab') => {
    const newId = `tab-${Date.now()}`;
    setTabs(prev => [...prev, { 
      id: newId, 
      type, 
      url, 
      name, 
      icon: '🌐', 
      history: [], 
      historyIndex: -1, 
      isBookmarked: false,
      query: '',
      dapp: null,
      searchResults: [],
      isSearching: false,
      searchError: null
    }]);
    setActiveTabId(newId);
  };

  const closeTab = (e, id) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
      // Find the index of the closed tab and pick the one next to it
      const closedIndex = tabs.findIndex(t => t.id === id);
      const nextActiveIndex = Math.max(0, closedIndex - 1);
      setActiveTabId(newTabs[nextActiveIndex].id);
    }
  };

  const [iframeStatus, setIframeStatus] = useState('loading');

  // Quest States
  const [activeQuests, setActiveQuests] = useState([]); // Tracks in-progress quests
  const [completedQuests, setCompletedQuests] = useState(() => {
    const saved = localStorage.getItem('completed_quests');
    if (!saved) return [];
    const { date, quests } = JSON.parse(saved);
    if (date !== new Date().toDateString()) return [];
    return quests;
  });
  const [articleTimer, setArticleTimer] = useState(0);

  // Profile & Accounts State
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('web3_profile');
    return saved ? JSON.parse(saved) : { name: 'Frontier Operative', bio: 'Neural Sync Level 1', avatar: '' };
  });

  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem('web3_accounts');
    return saved ? JSON.parse(saved) : [{ id: 1, name: 'Primary Core', address: '', active: true }];
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeGame, setActiveGame] = useState(null);

  useEffect(() => {
    localStorage.setItem('web3_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('web3_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('completed_quests', JSON.stringify({
      date: new Date().toDateString(),
      quests: completedQuests
    }));
  }, [completedQuests]);

  // Education Article Quest Timer
  useEffect(() => {
    let interval;
    if (activeTabObj.type === 'explore' && activeTabObj.dapp && activeTabObj.dapp.category === 'Education' && activeQuests.includes('scholar')) {
      interval = setInterval(() => {
        setArticleTimer(prev => {
          if (prev >= 9) {
            // Reached 10 seconds
            clearInterval(interval);
            setActiveQuests(q => q.filter(x => x !== 'scholar'));
            claimReward('wtf_quest_action');
            alert('Scholar Quest Complete: +5 Points Synchronized!');
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setArticleTimer(0);
    }
    return () => clearInterval(interval);
  }, [activeTabId, tabs, activeQuests]);

  // Check if activeTabObj.dapp can be framed securely
  useEffect(() => {
    if (activeTabObj.dapp) {
      setIframeStatus('loading');
      
      // VIP Sites: Domains that we KNOW block iframes. 
      // Skip the backend check and go straight to proxy for these for speed.
      const VIP_SITES = [
        'youtube.com', 'google.com', 'opensea.io', 'github.com', 'twitter.com', 'x.com', 
        'facebook.com', 'instagram.com', 'linkedin.com', 'binance.com', 'academy.binance.com',
        'geeksforgeeks.org', 'wikipedia.org', 'en.wikipedia.org', 'investopedia.com', 'medium.com',
        'hela.network', 'magiceden.io', 'helalabs.com', 'superrare.com',
        'coingecko.com', 'coinmarketcap.com', 'zora.co', 'dune.com',
        'polygon.technology', 'optimism.io', 'solscan.io', 'defillama.com'
      ];
      const domain = activeTabObj.dapp.url.toLowerCase();
      
      if (VIP_SITES.some(site => domain.includes(site))) {
        setIframeStatus('blocked');
        return;
      }

      fetch(`${API_URL}/search/check-frame?url=${encodeURIComponent(activeTabObj.dapp.url)}`)
        .then(res => res.json())
        .then(data => {
          if (data.frameable) {
            setIframeStatus('loaded');
          } else {
            setIframeStatus('blocked');
          }
        })
        .catch(() => {
          // If the check fails or times out, default to the proxy (blocked mode) to be safe
          setIframeStatus('blocked');
        });
    }
  }, [activeTabId, tabs]);

  // Fetch dApps from backend on load
  useEffect(() => {
    fetch(`${API_URL}/dapps/`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Merge backend dapps with local ones, ensuring no duplicates by URL
          const combined = [...DAPPS];
          data.forEach(d => {
            if (!combined.some(local => local.url === d.url)) {
              combined.push(d);
            }
          });
          setDappList(combined);
        }
      })
      .catch(err => console.error('Failed to fetch dApps', err));
  }, []);

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounced search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      const activeTab = tabs.find(t => t.id === activeTabId);
      const query = activeTab?.query || '';
      
      if (query.trim().length > 0 && !(/^(http:\/\/|https:\/\/)/i.test(query) || query.includes('.'))) {
        try {
          const res = await fetch(`${API_URL}/search/suggest?q=${encodeURIComponent(query)}`);
          if (res.ok) {
            const data = await res.json();
            setSuggestions(data.slice(0, 5)); // Limit to top 5
            setShowSuggestions(true);
          }
        } catch (e) {
          console.error('Suggest error:', e);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [activeTabId, tabs.find(t => t.id === activeTabId)?.query]);

  const executeSearch = async (queryToSearch) => {
    const query = queryToSearch.trim();
    if (!query) return;

    setShowSuggestions(false);
    
    // URL detection
    const isUrl = query.startsWith('http://') || query.startsWith('https://') || (query.includes('.') && !query.includes(' ') && !query.startsWith(' '));
    
    if (isUrl) {
      const url = query.startsWith('http') ? query : `https://${query}`;
      updateActiveTab({ 
        query: query,
        dapp: { id: 'custom', name: url, url: url, icon: '🌐', category: 'Web' },
        type: 'explore'
      });
    } else {
      // Perform Search
      updateActiveTab({ 
        query: query,
        dapp: null,
        type: 'search',
        searchError: null,
        isSearching: true
      });
      
      const searchUrl = `${API_URL}/search?q=${encodeURIComponent(query)}`;
      
      try {
        const res = await fetch(searchUrl);
        if(res.ok) {
          const data = await res.json();
          const results = Array.isArray(data) ? data : (data.results || []);
          updateActiveTab({ 
            searchResults: results,
            isSearching: false,
            searchError: data.error ? (data.message || data.error) : null
          });
        } else {
          updateActiveTab({ 
            searchResults: [],
            isSearching: false,
            searchError: `Backend error: ${res.status}`
          });
        }
      } catch (err) {
        updateActiveTab({ 
          searchResults: [],
          isSearching: false,
          searchError: 'Connection failed.'
        });
      }
    }
  };

  const connectWallet = async () => {
    // ...existing connectWallet logic...
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        const address = accounts[0];
        setWalletAddress(address);
        
        const balance = await provider.getBalance(address);
        setBalance(ethers.formatEther(balance).substring(0, 6));

        // Register/Login with Backend
        fetch(`${API_URL}/users/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ wallet_address: address })
        });

        // Log connection
        fetch(`${API_URL}/wallet/connect`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ wallet_address: address })
        });

        // Sync with Hela Economic Engine (Gatekeeper close)
        setIsWalletGateOpen(false);

        // Fetch user rewards
        fetch(`${API_URL}/rewards/${address}`)
          .then(res => res.json())
          .then(data => {
            const totalPoints = data.reduce((acc, curr) => acc + curr.points, 0);
            const totalHela = data.reduce((acc, curr) => acc + (curr.token_amount || 0), 0);
            setPoints(totalPoints);
            setHelaBalance(totalHela.toFixed(2));
          });

      } catch (err) {
        console.error('Wallet connection failed', err);
      }
    } else {
      alert('MetaMask not detected');
    }
  };

  const executeRedeem = async () => {
    if (!walletAddress) return alert('Connect wallet first');
    if (redeemAmount < 1000 || points < redeemAmount || redeemAmount % 1000 !== 0) return alert('Invalid redemption amount.');
    
    setIsRedeeming(true);
    setShowRedeemModal(false);
    try {
      const res = await fetch(`${API_URL}/rewards/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet_address: walletAddress, points: redeemAmount })
      });
      
      if (res.ok) {
        setPoints(prev => prev - redeemAmount);
        setHelaBalance(prev => (parseFloat(prev) + (redeemAmount / 1000)).toFixed(2));
        // Add a slight delay for aesthetic loading impression
        setTimeout(() => {
          setIsRedeeming(false);
          alert(`Redemption Successful: +${(redeemAmount/1000).toFixed(2)} Hela synchronized to account matrix.`);
        }, 800);
      } else {
        const data = await res.json();
        alert(data.error || 'Redemption failed');
        setIsRedeeming(false);
      }
    } catch (err) {
      console.error(err);
      setIsRedeeming(false);
      alert('Network error during redemption.');
    }
  };

  const claimReward = async (activityType = 'dapp_interaction') => {
    // ...existing claimReward logic...
    if (!walletAddress) return alert('Connect wallet first');
    
    try {
      const res = await fetch(`${API_URL}/rewards/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet_address: walletAddress, activity_type: activityType })
      });
      
      if (res.ok) {
        const data = await res.json();
        setPoints(prev => prev + (data.points || 0));
        // Track completion for one-time visual removal
        if (activityType === 'wtf_quest' || activityType === 'wtf_quest_action') {
           setCompletedQuests(prev => [...prev, activityType === 'wtf_quest_action' ? (activeQuests[0] || 'scholar') : 'daily']);
        }
        return true;
      } else {
        const data = await res.json();
        console.warn('Reward claim failed:', data.error);
        if (activityType === 'wtf_quest' && !data.error) {
           // Provide a local fallback alert if daily limit blocked it but didn't return an explicit message
           console.warn('Daily quest limit reached.');
        } else if (activityType === 'wtf_quest') {
           alert(data.error || 'Daily quest limit reached.');
        }
      }
    } catch(err) {
      console.error(err);
    }
    return false;
  };

  const truncateAddress = (addr) => addr ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}` : '';

  return (
    <div className={`flex w-full h-screen bg-[#07090c] text-white selection:bg-indigo-500/30 font-sans`}>
      {/* Wallet Gatekeeper UI */}
      {(!walletAddress || isWalletGateOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07090c] overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px] animate-pulse delay-1000"></div>
          </div>
          
          <div className="relative z-10 max-w-xl w-full px-8 text-center space-y-12 animate-in fade-in zoom-in duration-1000">
            <div className="flex flex-col items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-600/40 animate-float">
                <ShieldCheck size={48} className="text-white" />
              </div>
              <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none">IDENTITY <br/><span className="gradient-text">REQUIRED</span></h1>
              <p className="text-white/40 text-lg font-medium tracking-tight">Authenticating your neural signature for decentralized access.</p>
            </div>

            <div className="glass-card p-10 rounded-[3.5rem] border-white/5 space-y-8 bg-white/5 backdrop-blur-3xl">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold uppercase tracking-tighter">Connect MetaMask</h2>
                <p className="text-sm text-white/30 font-medium">Your wallet is your identity. Connect to unlock searching, rewards, and the WTF zone.</p>
              </div>
              
              <button 
                onClick={connectWallet}
                className="w-full bg-white text-indigo-900 py-6 rounded-3xl font-black text-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-4 active:scale-95 group"
              >
                <Wallet size={24} className="group-hover:rotate-12 transition-transform" />
                INITIATE HANDSHAKE
              </button>

              <div className="flex items-center gap-4 justify-center pt-4 opacity-50">
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-[#07090c] bg-indigo-500/20"></div>)}
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">12k+ NODES CONNECTED</span>
              </div>
            </div>
            
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10 italic">Zero-Knowledge Proof Enabled Protocol</p>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative glass-card rounded-[3rem] p-10 max-w-md w-full border border-red-500/20 shadow-2xl shadow-red-500/10 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto mb-6">
              <AlertTriangle size={32} className="text-red-400" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-center mb-2">Wipe Matrix Cache?</h2>
            <p className="text-white/40 text-sm font-bold text-center tracking-wide leading-relaxed mb-8">
              This will permanently delete all your data, profile, accounts, and rewards. <span className="text-red-400">This action cannot be undone.</span>
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-4 glass rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-white/10 transition-all border border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="flex-1 py-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-2xl font-black uppercase text-sm tracking-widest text-red-400 transition-all active:scale-95"
              >
                Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main App Workspace */}
      {/* Sidebar */}
      <aside className="w-20 lg:w-72 border-r border-white/5 flex flex-col items-center lg:items-stretch py-8 px-5 bg-[#0a0c0f] relative z-20 shadow-2xl">
        <div className="flex items-center gap-4 px-3 mb-12 overflow-hidden group cursor-pointer" onClick={() => {updateActiveTab({ type: 'explore', dapp: null })}}>
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform duration-500">
            <Globe size={26} className="text-white animate-pulse" />
          </div>
          <div className="hidden lg:block overflow-hidden">
            <span className="text-2xl font-black tracking-tighter text-white block leading-none">WEB3</span>
            <span className="text-xs font-bold tracking-[0.2em] text-indigo-400 uppercase opacity-80">Browser</span>
          </div>
        </div>

        <nav className="flex-1 space-y-3 w-full">
          <NavItem 
            icon={<Globe size={22}/>} 
            label="Explore" 
            active={activeTabObj.type === 'explore' && !activeTabObj.dapp} 
            onClick={() => {
              updateActiveTab({ type: 'explore', dapp: null, query: '' });
            }} 
          />
          <NavItem 
            icon={<Grid size={22}/>} 
            label="DApps" 
            active={activeTabObj.type === 'dapps'} 
            onClick={() => {
              updateActiveTab({ type: 'dapps', dapp: null });
            }} 
          />
          <NavItem icon={<Trophy size={22}/>} label="Rewards" active={activeTabObj.type === 'rewards'} onClick={() => {updateActiveTab({ type: 'rewards', dapp: null })}} />
          <NavItem icon={<Play size={22}/>} label="WTF Zone" active={activeTabObj.type === 'wtf-zone'} onClick={() => {updateActiveTab({ type: 'wtf-zone', dapp: null })}} />
          <NavItem icon={<BookOpen size={22}/>} label="Education" active={activeTabObj.type === 'education'} onClick={() => {updateActiveTab({ type: 'education', dapp: null })}} />
          <NavItem icon={<Shield size={22}/>} label="Security" active={activeTabObj.type === 'security'} onClick={() => {updateActiveTab({ type: 'security', dapp: null })}} />
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5 w-full">
          <NavItem icon={<Settings size={22}/>} label="Settings" active={activeTabObj.type === 'settings'} onClick={() => {updateActiveTab({ type: 'settings', dapp: null })}} />
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Background Glows */}
        <div className="hero-glow top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full"></div>
        <div className="hero-glow bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full"></div>

        {/* Tab Bar */}
        <div className="h-12 bg-[#0a0c0f] border-b border-white/5 flex items-center px-4 gap-2 overflow-x-auto no-scrollbar relative z-40">
          {tabs.map((tab) => (
            <div 
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`group h-8 px-4 rounded-xl flex items-center gap-3 cursor-pointer transition-all border shrink-0 max-w-[200px] ${
                activeTabId === tab.id 
                  ? 'bg-white/10 border-white/10 text-white' 
                  : 'bg-transparent border-transparent text-white/40 hover:bg-white/5 hover:text-white/60'
              }`}
            >
              <Globe size={14} className={activeTabId === tab.id ? "text-indigo-400" : "text-white/20"} />
              <span className="text-xs font-bold truncate tracking-tight">{tab.name}</span>
              <button 
                onClick={(e) => closeTab(e, tab.id)}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded-md hover:bg-white/10 transition-all"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <button 
            onClick={() => addTab()}
            className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-90 shrink-0"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Header (Integrated Navigation) */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#07090c]/40 backdrop-blur-2xl sticky top-0 z-30">
          <div className="flex items-center gap-5 flex-1 max-w-4xl">
            {/* Nav Controls */}
            <div className="flex items-center gap-2 pr-4 border-r border-white/10">
              <button 
                disabled={activeTabObj.historyIndex <= 0}
                onClick={() => {
                  const newIndex = activeTabObj.historyIndex - 1;
                  const prevHistory = activeTabObj.history[newIndex];
                  if (prevHistory) {
                    updateActiveTab({ 
                      historyIndex: newIndex,
                      query: prevHistory.query,
                      type: prevHistory.type === 'url' ? 'explore' : 'search',
                      dapp: prevHistory.type === 'url' ? { id: 'custom', name: prevHistory.query, url: prevHistory.query.startsWith('http') ? prevHistory.query : `https://${prevHistory.query}`, icon: '🌐', category: 'Web' } : null,
                      name: prevHistory.type === 'url' ? prevHistory.query : `Search: ${prevHistory.query}`
                    });
                  }
                }}
                className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all disabled:opacity-20 disabled:hover:bg-transparent"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                disabled={!activeTabObj.history || activeTabObj.historyIndex >= activeTabObj.history.length - 1}
                onClick={() => {
                  const newIndex = activeTabObj.historyIndex + 1;
                  const nextHistory = activeTabObj.history[newIndex];
                  if (nextHistory) {
                    updateActiveTab({ 
                      historyIndex: newIndex,
                      query: nextHistory.query,
                      type: nextHistory.type === 'url' ? 'explore' : 'search',
                      dapp: nextHistory.type === 'url' ? { id: 'custom', name: nextHistory.query, url: nextHistory.query.startsWith('http') ? nextHistory.query : `https://${nextHistory.query}`, icon: '🌐', category: 'Web' } : null,
                      name: nextHistory.type === 'url' ? nextHistory.query : `Search: ${nextHistory.query}`
                    });
                  }
                }}
                className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all disabled:opacity-20 disabled:hover:bg-transparent"
              >
                <ChevronRight size={20} />
              </button>
              <button 
                onClick={() => {
                  setIframeStatus('loading');
                  // Trigger re-render of iframe by temporarily clearing and resetting status
                  setTimeout(() => {
                    if (activeTabObj.type === 'search') executeSearch(activeTabObj.query);
                    else setIframeStatus('loaded');
                  }, 100);
                }}
                className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all"
              >
                <RefreshCw size={18} />
              </button>
            </div>

            <div className="relative w-full group">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-indigo-400 transition-all duration-300" />
              <input 
                type="text" 
                value={activeTabObj.query || ''}
                onChange={(e) => updateActiveTab({ query: e.target.value })}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    executeSearch(activeTabObj.query);
                    e.target.blur();
                  }
                }}
                placeholder="Search the decentralized web..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-14 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all font-medium text-base placeholder:text-white/20"
              />
              
              <button 
                onClick={() => updateActiveTab({ isBookmarked: !activeTabObj.isBookmarked })}
                className="absolute right-5 top-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <Star size={18} className={activeTabObj.isBookmarked ? "text-yellow-400 fill-yellow-400" : "text-white/20"} />
              </button>

              {/* Autocomplete Dropdown */}
              {showSuggestions && activeTabObj.query && activeTabObj.query.trim().length > 0 && (
                <div className="absolute top-16 left-0 w-full glass rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden z-50 border-white/10 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex flex-col">
                    {suggestions.map((suggestion, index) => (
                    <div 
                      key={index}
                      className="px-6 py-4 hover:bg-white/5 cursor-pointer flex items-center gap-5 transition-colors border-b border-white/5 last:border-0"
                      onClick={() => {
                        updateActiveTab({ query: suggestion.phrase });
                        executeSearch(suggestion.phrase);
                      }}
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                        {suggestion.type === 'internal' ? (
                          <Globe size={16} className="text-indigo-400" />
                        ) : (
                          <Search size={16} className="text-white/20" />
                        )}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-base font-bold text-white/90 truncate">{suggestion.phrase}</span>
                        {suggestion.subtitle && (
                          <span className="text-xs text-white/40 truncate tracking-wide">{suggestion.subtitle}</span>
                        )}
                      </div>
                    </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="hidden xl:flex items-center bg-white/5 border border-white/10 rounded-2xl px-5 py-2.5 gap-4">
               <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black">Points</p>
                  <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{points.toLocaleString()}</p>
               </div>
               <div className="w-px h-8 bg-white/10"></div>
               <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-black">Hela</p>
                  <p className="text-lg font-bold text-emerald-400">{helaBalance}</p>
               </div>
               <div className="w-px h-8 bg-white/10"></div>
               <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center">
                  <Zap size={20} className="text-indigo-400" />
               </div>
            </div>
            
            <button 
              onClick={connectWallet}
              className="group relative flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-7 py-3.5 rounded-2xl transition-all shadow-xl shadow-indigo-600/30 font-bold active:scale-95"
            >
              <Wallet size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="text-base">{walletAddress ? truncateAddress(walletAddress) : 'Connect Wallet'}</span>
              <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar relative z-10">
          {tabs.map(tab => (
            <div key={tab.id} className={tab.id === activeTabId ? "block h-full" : "hidden"}>
              {tab.dapp ? (
                <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <div className="glass-card mb-8 p-4 rounded-3xl flex items-center justify-between border-indigo-500/10">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-bold tracking-wide text-white/60">SECURE CONNECTION ESTABLISHED via PROXY CHANNEL</span>
                    </div>
                    <button 
                      onClick={() => window.open(tab.dapp.url, '_blank')}
                      className="group py-2 px-4 rounded-2xl bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/30 text-indigo-400 hover:text-white transition-all duration-300 font-bold text-sm flex items-center gap-2"
                    >
                      Bypass Browser <ExternalLink size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-6">
                      <button 
                        onClick={() => updateActiveTab({ dapp: null, type: 'explore' })} 
                        className="w-14 h-14 glass hover:bg-white/10 rounded-2xl transition-all flex items-center justify-center group border-white/10"
                      >
                        <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform text-white/40 group-hover:text-white" />
                      </button>
                      <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-4xl shadow-2xl animate-float">
                        {tab.dapp.icon}
                      </div>
                      <div>
                        <h2 className="text-3xl font-black tracking-tight mb-1">{tab.dapp.name}</h2>
                        <p className="text-base text-white/40 font-medium tracking-wide">{tab.dapp.url}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button className="w-14 h-14 glass hover:bg-white/10 rounded-2xl transition-all flex items-center justify-center">
                        <Shield size={24} className="text-white/40" />
                      </button>
                      <button className="w-14 h-14 glass hover:bg-white/10 rounded-2xl transition-all flex items-center justify-center">
                        <Globe size={24} className="text-white/40" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 glass rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 relative bg-[#12141a]">
                    {iframeStatus === 'loading' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl z-20">
                        <div className="w-20 h-20 relative">
                            <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="mt-8 text-xl font-bold tracking-widest uppercase text-white/80">Securing environment</p>
                        <p className="mt-2 text-sm text-white/30 font-medium italic">Resolving cross-origin restrictions...</p>
                      </div>
                    )}

                    {iframeStatus === 'blocked' ? (
                      <iframe 
                        src={`${API_URL}/search/proxy?url=${encodeURIComponent(tab.dapp.url)}`} 
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms" 
                        className="w-full h-full border-none bg-white opacity-95" 
                        title={`${tab.dapp.name} (Proxied)`} 
                        onLoad={() => setIframeStatus('loaded')}
                      />
                    ) : (
                      <iframe 
                        src={tab.dapp.url} 
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms" 
                        className="w-full h-full border-none bg-white opacity-95" 
                        title={tab.dapp.name} 
                        onLoad={() => setIframeStatus('loaded')}
                      />
                    )}
                  </div>
                </div>
              ) : tab.type === 'search' ? (
                 <section className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-5xl mx-auto pb-20">
                   <div className="text-center mb-16">
                      <h1 className="text-5xl font-black mb-4 tracking-tighter uppercase italic opacity-80">SURF RESULTS</h1>
                      <p className="text-white/40 text-lg font-medium tracking-wide">Secure, private indexed results for <span className="text-indigo-400">"{tab.query}"</span></p>
                   </div>
                   
                   {tab.isSearching ? (
                     <div className="py-32 flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                        <p className="mt-8 text-white/30 font-bold uppercase tracking-[0.3em]">Querying Networks</p>
                     </div>
                   ) : tab.searchError ? (
                 <div className="py-20 text-center glass-card rounded-[3rem] p-12">
                   <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Shield size={40} className="text-red-400" />
                   </div>
                   <p className="text-xl text-white/80 font-bold mb-8 italic">{tab.searchError || 'Search failed'}</p>
                   <button 
                     onClick={() => executeSearch(tab.query)}
                     className="px-10 py-4 bg-white/5 hover:bg-indigo-600 rounded-2xl transition-all border border-white/10 font-bold"
                   >
                     Re-Initialize Search
                   </button>
                 </div>
               ) : tab.searchResults.length > 0 ? (
                 <div className="grid grid-cols-1 gap-6">
                   {tab.searchResults.map((result, idx) => (
                      <div 
                         key={idx}
                         onClick={() => {
                           updateActiveTab({ dapp: { id: `search-${idx}`, name: result.domain, url: result.url, icon: '🌐', category: 'Search' } });
                         }}
                         className="group glass-card p-8 rounded-[2rem] cursor-pointer"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center border border-indigo-500/10">
                            <Globe size={18} className="text-indigo-400 group-hover:rotate-12 transition-transform" />
                          </div>
                          <span className="text-xs font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-indigo-400 transition-colors">{result.domain}</span>
                        </div>
                        <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 mb-3 transition-colors tracking-tight leading-tight">{result.title}</h3>
                        <p className="text-base text-white/50 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: result.description }} />
                      </div>
                   ))}
                 </div>
               ) : (
                 <div className="py-32 text-center">
                   <p className="text-2xl font-black text-white/10 italic select-none uppercase tracking-[0.2em]">SEARCH INTERRUPTED - NO PEERS FOUND</p>
                 </div>
               )}
             </section>
          ) : tab.type === 'explore' ? (
            <section className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-6xl mx-auto pb-20">
              <div className="relative text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black tracking-widest uppercase mb-8">
                  <TrendingUp size={14} /> Trending on Web3
                </div>
                <h1 className="text-7xl font-black mb-6 tracking-tighter leading-none uppercase">
                  THE <span className="gradient-text">WEB3</span> FRONTIER
                </h1>
                <p className="text-white/40 text-xl font-medium tracking-tight leading-relaxed px-4">
                  Welcome to the future of the internet. Secure, private, and decentralized.
                </p>
              </div>

              {/* Recommended Searches */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Hela Network', url: 'https://helalabs.com', icon: <Globe size={20} className="text-indigo-400"/>, desc: 'Layer 1 Protocol' },
                  { title: 'Top DeFi Projects', url: 'https://defillama.com', icon: <TrendingUp size={20} className="text-emerald-400"/>, desc: 'Yield & Liquidity' },
                  { title: 'NFT Trends', url: 'https://superrare.com', icon: <Layout size={20} className="text-purple-400"/>, desc: 'Digital Assets' }
                ].map((item, i) => (
                  <div key={i} onClick={() => updateActiveTab({ dapp: { id: `explore-${i}`, name: item.title, url: item.url, icon: '🌐', category: item.desc } })} className="glass-card p-8 rounded-[2.5rem] hover:border-indigo-500/40 transition-all cursor-pointer group">
                    <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all">{item.icon}</div>
                    <h3 className="text-xl font-black mb-2 tracking-tight group-hover:text-indigo-400 transition-colors uppercase">{item.title}</h3>
                    <p className="text-sm text-white/30 font-bold italic">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Recommended Apps Section */}
              <div className="glass-card rounded-[3.5rem] p-12 border-white/5 relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px]"></div>
                <div className="flex items-center justify-between mb-12">
                   <div>
                      <h2 className="text-3xl font-black tracking-tighter uppercase mb-2">Essential Protocols</h2>
                      <p className="text-white/30 font-bold italic">Handpicked elite decentralized applications.</p>
                   </div>
                   <button onClick={() => updateActiveTab({ type: 'dapps' })} className="flex items-center gap-3 text-indigo-400 font-black tracking-widest uppercase text-xs hover:text-white transition-colors group">
                     View Full Grid <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {DAPPS.slice(0, 4).map((dapp) => (
                    <div key={dapp.id} onClick={() => updateActiveTab({ dapp: dapp })} className="flex flex-col items-center text-center group cursor-pointer">
                      <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center text-4xl mb-4 group-hover:scale-110 group-hover:-translate-y-2 transition-all shadow-xl group-hover:shadow-indigo-500/20">
                        {dapp.icon}
                      </div>
                      <span className="text-base font-black uppercase tracking-tight group-hover:text-indigo-400 transition-colors">{dapp.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* News/Feed Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="glass-card rounded-[3rem] p-10 border-white/10">
                  <div className="flex items-center gap-4 mb-10">
                    <Newspaper size={24} className="text-indigo-400" />
                    <h3 className="text-2xl font-black tracking-tight uppercase">Frontier Pulse</h3>
                  </div>
                  <div className="space-y-8">
                    <ActivityItem label="Hela Alpha Synchronized" date="JUST NOW" points="URGENT" />
                    <ActivityItem label="DeFi 2.0 Liquidity Wave" date="2 HOURS AGO" points="SYSTEM" />
                    <ActivityItem label="Mainnet Payload Delivered" date="1 DAY AGO" points="LOG" />
                  </div>
                </div>
                <div className="flex items-center justify-center glass-card rounded-[3rem] p-10 relative overflow-hidden bg-gradient-to-br from-indigo-600/10 to-transparent">
                   <div className="text-center">
                     <Play size={64} className="text-white/20 mx-auto mb-6 animate-pulse" />
                     <h3 className="text-xl font-black tracking-tighter uppercase opacity-30">Watch Tutorial</h3>
                     <p className="text-xs text-white/10 font-bold tracking-[0.3em] mt-4 uppercase">Coming in Cycle 4</p>
                   </div>
                </div>
              </div>
            </section>
          ) : tab.type === 'dapps' ? (
            <section className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-6xl mx-auto pb-20">
              <div className="flex flex-col lg:flex-row items-end justify-between gap-6 border-b border-white/5 pb-10">
                <div>
                  <h1 className="text-6xl font-black mb-4 tracking-tighter uppercase leading-none italic">ECOSYSTEM</h1>
                  <p className="text-white/40 text-xl font-medium tracking-tight">The complete decentralized application registry.</p>
                </div>
                <div className="flex gap-4">
                  <div className="glass px-6 py-3 rounded-2xl text-xs font-black tracking-widest uppercase border-white/10">{dappList.length} NODES FOUND</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {dappList.map((dapp) => (
                  <div 
                    key={dapp.id} 
                    className="group glass-card p-10 rounded-[3rem] relative overflow-hidden cursor-pointer"
                    onClick={() => {
                      updateActiveTab({ dapp: dapp, name: dapp.name });
                      if (walletAddress) {
                        fetch(`${API_URL}/rewards/claim`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ wallet_address: walletAddress })
                        }).then(res => res.json()).then(data => setPoints(p => p + (data.points || 0)));
                      }
                    }}
                  >
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl group-hover:bg-indigo-600/30 transition-all duration-700"></div>
                    
                    <div className="flex items-start justify-between mb-10">
                      <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl border-white/10 group-hover:shadow-indigo-500/20">
                        {dapp.icon || '🌐'}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 bg-indigo-400/10 px-4 py-2 rounded-full border border-indigo-500/20">
                        {dapp.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black mb-3 group-hover:text-indigo-300 transition-colors tracking-tight uppercase leading-none">{dapp.name}</h3>
                    <p className="text-base text-white/40 leading-relaxed font-medium mb-10 h-10 overflow-hidden line-clamp-2">{dapp.description}</p>
                    <div className="flex items-center text-sm font-black text-white/20 group-hover:text-white transition-all tracking-[0.2em] uppercase">
                      Execute Link <ChevronRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform text-indigo-500" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : tab.type === 'rewards' ? (
             <section className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-6xl mx-auto pb-20 relative">
                <div className="absolute top-1/4 left-1/4 w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
                
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
                  <div className="text-center lg:text-left">
                    <h1 className="text-6xl font-black mb-4 tracking-tighter uppercase leading-none italic opacity-90 drop-shadow-xl">REWARDS ENGINE</h1>
                    <p className="text-white/40 text-xl font-medium tracking-tight">Ecosystem contributions and $HELA yield conversion.</p>
                  </div>
                  <button 
                    onClick={() => {
                      if (points >= 1000) {
                        setRedeemAmount(1000); // Default to minimum
                        setShowRedeemModal(true);
                      }
                    }}
                    disabled={isRedeeming || points < 1000}
                    className={`group relative px-10 py-5 rounded-3xl font-black text-lg transition-all shadow-2xl flex items-center gap-3 overflow-hidden ${
                      points >= 1000 
                        ? 'bg-[#00d1ff] hover:bg-[#00b8e6] text-black shadow-[#00d1ff]/20 active:scale-95' 
                        : 'bg-white/10 text-white/30 cursor-not-allowed border border-white/5'
                    }`}
                  >
                    {isRedeeming ? (
                      <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                    ) : (
                      <Zap size={24} className={points >= 1000 ? "group-hover:animate-bounce" : ""} />
                    )}
                    <span className="relative z-10">{isRedeeming ? 'PROCESSING...' : 'REDEEM HELA COINS'}</span>
                    {points >= 1000 && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
                   <div className="lg:col-span-1 space-y-6">
                      <RewardCard icon={<Zap size={20} className="text-yellow-400"/>} label="Points Balance" value={points.toLocaleString()} subValue="1000 pts = 1 Hela" />
                      <RewardCard icon={<CreditCard size={20} className="text-emerald-400"/>} label="Hela Balance" value={`${helaBalance} HELA`} subValue="Verified Chain" />
                   </div>

                   <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Browsing Rewards */}
                      <div className="group glass-card rounded-[3rem] p-8 border-white/5 bg-white/5 hover:bg-white/10 transition-all space-y-6 relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
                           <Globe size={100} />
                         </div>
                         <div className="flex justify-between items-start relative z-10">
                           <h3 className="text-xl font-black uppercase tracking-tighter text-indigo-400">Browsing Payload</h3>
                           <span className="text-[10px] font-black bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/30">Auto-Yield</span>
                         </div>
                         <p className="text-sm text-white/40 font-bold relative z-10">Passive point generation enabled. Browse the ecosystem to automatically stack points over time.</p>
                         <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest text-center shadow-[0_0_15px_rgba(16,185,129,0.1)] relative z-10">Active: +1.5x Multiplier Enabled</div>
                         <button 
                           onClick={() => updateActiveTab({ type: 'dapps' })}
                           className="w-full py-3 glass rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500/20 hover:text-white transition-all border-white/10 mt-2 relative z-10 flex items-center justify-center gap-2"
                         >
                           Explore DApps
                         </button>
                      </div>
                      
                      {/* WTF Quests */}
                      <div className="group glass-card rounded-[3rem] p-8 border-white/5 bg-white/5 hover:bg-white/10 transition-all space-y-6 relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
                           <Trophy size={100} />
                         </div>
                         <div className="flex justify-between items-start relative z-10">
                           <h3 className="text-xl font-black uppercase tracking-tighter text-purple-400">WTF Quests</h3>
                           <span className="text-[10px] font-black bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full border border-purple-500/30">Up to +50 PTS</span>
                         </div>
                         <p className="text-sm text-white/40 font-bold relative z-10">Complete high-value side quests to boost your neural rank and earn point drops.</p>
                         <button 
                           onClick={() => setShowQuestModal(true)}
                           className="w-full py-4 glass rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:bg-purple-500/20 hover:text-white transition-all border-white/10 hover:border-purple-500/50 relative z-10 active:scale-95 flex items-center justify-center gap-2"
                         >
                           <Play size={14} />
                           Launch Quests
                         </button>
                      </div>

                       {/* Partner Cashback */}
                       <div className="group glass-card rounded-[3rem] p-8 border-white/5 bg-white/5 hover:bg-white/10 transition-all space-y-6 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
                            <Store size={100} />
                          </div>
                          <div className="flex justify-between items-start relative z-10">
                            <h3 className="text-xl font-black uppercase tracking-tighter text-emerald-400">Partner Vouchers</h3>
                            <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">Store</span>
                          </div>
                          <p className="text-sm text-white/40 font-bold relative z-10">Redeem your hard-earned points for exclusive brand vouchers and digital gift cards.</p>
                          <button 
                            onClick={() => setShowVoucherModal(true)}
                            className="w-full py-4 glass rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:bg-emerald-500/20 hover:text-white transition-all border-white/10 hover:border-emerald-500/50 relative z-10 active:scale-95 flex items-center justify-center gap-2"
                          >
                            <ShoppingCart size={14} />
                            Voucher Grid
                          </button>
                       </div>

                      {/* Node Referrals */}
                      <div className="group glass-card rounded-[3rem] p-8 border-white/5 bg-white/5 hover:bg-white/10 transition-all space-y-6 relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
                           <Users size={100} />
                         </div>
                         <div className="flex justify-between items-start relative z-10">
                           <h3 className="text-xl font-black uppercase tracking-tighter text-indigo-400">Node Referrals</h3>
                           <span className="text-[10px] font-black bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/30">+50 PTS</span>
                         </div>
                         <p className="text-sm text-white/40 font-bold relative z-10">Expand the matrix by referring new nodes. Earn 50 pts per verified identity sync.</p>
                         <div className="flex gap-2 relative z-10 mt-auto">
                            <button 
                              onClick={() => setShowShareModal(true)}
                              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-black uppercase border-white/10 transition-all shadow-lg active:scale-95 flex items-center justify-center"
                            >
                              Share Node
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
             </section>
          ) : tab.type === 'wtf-zone' ? (
            <section className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-6xl mx-auto pb-20">
               <div className="text-center mb-16 relative">
                  <div className="hero-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-600/10 blur-[100px] -z-10"></div>
                  <h1 className="text-6xl font-black mb-4 tracking-tighter uppercase italic leading-tight">WTF ZONE</h1>
                  <p className="text-white/30 text-xl font-medium tracking-tight uppercase tracking-widest">Connect your skills to the Hela economy.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  <div className="group glass-card rounded-[3.5rem] p-10 border-white/5 hover:border-red-500/20 transition-all cursor-pointer bg-gradient-to-br from-red-500/5 to-transparent">
                     <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-red-500 mb-8 group-hover:scale-110 transition-all">🐍</div>
                     <h3 className="text-2xl font-black uppercase tracking-tight mb-3">Snake Terminal</h3>
                     <p className="text-sm text-white/40 font-bold mb-8">Navigate the neural grid. Collect fragments to earn points. Highly addictive.</p>
                     <button 
                       onClick={() => setActiveGame('snake')}
                       className="w-full py-4 glass rounded-2xl font-black text-xs uppercase tracking-widest border-white/10 group-hover:bg-red-500 group-hover:text-white transition-all"
                     >
                       PLAY & EARN
                     </button>
                  </div>

                  <div className="group glass-card rounded-[3.5rem] p-10 border-white/5 hover:border-indigo-500/20 transition-all cursor-pointer bg-gradient-to-br from-indigo-500/5 to-transparent">
                     <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-indigo-400 mb-8 group-hover:scale-110 transition-all">🧩</div>
                     <h3 className="text-2xl font-black uppercase tracking-tight mb-3">Maze Solver</h3>
                     <p className="text-sm text-white/40 font-bold mb-8">Deconstruct complex encryption mazes. Speed is currency.</p>
                     <button 
                       onClick={() => setActiveGame('maze')}
                       className="w-full py-4 glass rounded-2xl font-black text-xs uppercase tracking-widest border-white/10 group-hover:bg-indigo-500 group-hover:text-white transition-all"
                     >
                       PLAY & EARN
                     </button>
                  </div>

                  <div className="group glass-card rounded-[3.5rem] p-10 border-white/5 hover:border-emerald-500/20 transition-all cursor-pointer bg-gradient-to-br from-emerald-500/5 to-transparent">
                     <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-emerald-400 mb-8 group-hover:scale-110 transition-all">🎯</div>
                     <h3 className="text-2xl font-black uppercase tracking-tight mb-3">Crypto Hit</h3>
                     <p className="text-sm text-white/40 font-bold mb-8">Aura calibration test. Hit the targets to sync with the network pulse.</p>
                     <button 
                       onClick={() => alert('Crypto Hit Initializing... Syncing points...')}
                       className="w-full py-4 glass rounded-2xl font-black text-xs uppercase tracking-widest border-white/10 group-hover:bg-emerald-500 group-hover:text-white transition-all"
                     >
                       PLAY & EARN
                     </button>
                  </div>
               </div>
            </section>
          ) : tab.type === 'education' ? (
            <section className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-6xl mx-auto pb-20">
              <div className="text-center mb-16 relative">
                 <div className="hero-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 blur-[100px] -z-10"></div>
                 <h1 className="text-6xl font-black mb-4 tracking-tighter uppercase italic leading-tight">EDUCATION HUB</h1>
                 <p className="text-white/30 text-xl font-medium tracking-tight uppercase tracking-widest">Master the decentralized frontier.</p>
              </div>

              {/* Web3 Basics Section */}
              <div className="space-y-10">
                <div className="flex items-center gap-4 border-l-4 border-indigo-500 pl-6">
                  <h2 className="text-3xl font-black uppercase tracking-tighter">Web3 Basics</h2>
                  <div className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full border border-indigo-500/20">Beginner Friendly</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <EduCard 
                    title="What is Web3?" 
                    description="The new version of the internet where you own your own data, identity, and digital assets instead of relying on a few big companies."
                    icon={<Globe size={24} className="text-indigo-400" />}
                    url="https://en.wikipedia.org/wiki/Web3"
                    onLearnMore={(url) => updateActiveTab({ dapp: { id: 'edu-web3', name: 'Web3 Guide', url, icon: '🌐', category: 'Education' } })}
                  />
                  <EduCard 
                    title="What is Blockchain?" 
                    description="A secure, shared digital ledger that records transactions without needing a bank or middleman, making it transparent and permanent."
                    icon={<Layers size={24} className="text-emerald-400" />}
                    url="https://en.wikipedia.org/wiki/Blockchain"
                    onLearnMore={(url) => updateActiveTab({ dapp: { id: 'edu-blockchain', name: 'Blockchain Guide', url, icon: '⛓️', category: 'Education' } })}
                  />
                  <EduCard 
                    title="What is a Crypto Wallet?" 
                    description="A digital tool that lets you store, send, and receive cryptocurrencies and NFTs. It acts as your ID in the decentralized world."
                    icon={<Wallet size={24} className="text-purple-400" />}
                    url="https://en.wikipedia.org/wiki/Cryptocurrency_wallet"
                    onLearnMore={(url) => updateActiveTab({ dapp: { id: 'edu-wallet', name: 'Wallet Essentials', url, icon: '👛', category: 'Education' } })}
                  />
                  <EduCard 
                    title="What are Smart Contracts?" 
                    description="Automatic programs that execute agreements when specific conditions are met, ensuring trust without needing a lawyer."
                    icon={<Cpu size={24} className="text-yellow-400" />}
                    url="https://en.wikipedia.org/wiki/Smart_contract"
                    onLearnMore={(url) => updateActiveTab({ dapp: { id: 'edu-sc', name: 'Smart Contract Hub', url, icon: '📜', category: 'Education' } })}
                  />
                  <EduCard 
                    title="What are dApps?" 
                    description="Decentralized applications that run on a blockchain instead of a private company server, so they can't be easily shut down or censored."
                    icon={<Zap size={24} className="text-indigo-400" />}
                    url="https://en.wikipedia.org/wiki/Decentralized_application"
                    onLearnMore={(url) => updateActiveTab({ dapp: { id: 'edu-dapps', name: 'dApp Essentials', url, icon: '🏗️', category: 'Education' } })}
                  />
                </div>
              </div>

              {/* Popular dApps Section */}
              <div className="space-y-10 pt-10">
                <div className="flex items-center gap-4 border-l-4 border-purple-500 pl-6">
                  <h2 className="text-3xl font-black uppercase tracking-tighter">Popular Web3 dApps</h2>
                  <div className="text-[10px] font-black uppercase text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full border border-purple-500/20">Protocol Spotlight</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <EduCard 
                    title="Uniswap" 
                    description="A decentralized exchange (DEX) where you can swap tokens directly from your wallet without needing a central middleman."
                    tag="DeFi Exchange"
                    url="https://app.uniswap.org"
                    onLearnMore={(url) => updateActiveTab({ dapp: { id: 'edu-uniswap', name: 'Uniswap', url, icon: '🦄', category: 'dApp' } })}
                  />
                  <EduCard 
                    title="OpenSea" 
                    description="The largest marketplace for digital collectibles (NFTs). You can buy, sell, or discover unique digital art and music here."
                    tag="NFT Marketplace"
                    url="https://opensea.io"
                    onLearnMore={(url) => updateActiveTab({ dapp: { id: 'edu-opensea', name: 'OpenSea', url, icon: '⛵', category: 'dApp' } })}
                  />
                  <EduCard 
                    title="Aave" 
                    description="A protocol where you can lend or borrow crypto. It lets users earn interest on their deposits or take out loans instantly."
                    tag="Lending & Borrowing"
                    url="https://app.aave.com"
                    onLearnMore={(url) => updateActiveTab({ dapp: { id: 'edu-aave', name: 'Aave', url, icon: '👻', category: 'dApp' } })}
                  />
                  <EduCard 
                    title="Lens Protocol" 
                    description="A decentralized social network graph. It allows users to own their social profile and content instead of the platform owning it."
                    tag="Decentralized Social"
                    url="https://www.lens.xyz/"
                    onLearnMore={(url) => updateActiveTab({ dapp: { id: 'edu-lens', name: 'Lens', url, icon: '🌿', category: 'dApp' } })}
                  />
                  <EduCard 
                    title="Friend.tech" 
                    description="A social app that lets you buy and sell 'keys' of social profiles, giving you access to private chats and community perks."
                    tag="Social Finance"
                    url="https://www.friend.tech/"
                    onLearnMore={(url) => updateActiveTab({ dapp: { id: 'edu-ft', name: 'Friend.tech', url, icon: '🤝', category: 'dApp' } })}
                  />
                </div>
              </div>

              {/* Concept Visualization */}
              <div className="glass-card rounded-[4rem] p-16 border-indigo-500/10 relative overflow-hidden bg-gradient-to-br from-indigo-900/10 to-transparent flex flex-col lg:flex-row items-center gap-12">
                 <div className="flex-1 space-y-8">
                    <h2 className="text-5xl font-black tracking-tighter uppercase italic leading-none">THE BLOCKCHAIN <br/><span className="gradient-text">REVOLUTION</span></h2>
                    <p className="text-white/40 text-lg font-medium leading-relaxed">
                       Blockchain technology is the foundation of Web3. It creates a digital environment where users can interact, trade, and build without permission from central authorities.
                    </p>
                    <div className="flex gap-6">
                       <button 
                         onClick={() => updateActiveTab({ dapp: { id: 'edu-web3', name: 'Web3 Guide', url: 'https://en.wikipedia.org/wiki/Web3', icon: '🌐', category: 'Education' } })}
                         className="bg-white text-indigo-900 px-10 py-5 rounded-[2rem] font-black text-lg hover:shadow-2xl transition-all active:scale-95"
                       >
                          START JOURNEY
                       </button>
                    </div>
                 </div>
                 <div className="flex-1 w-full flex justify-center">
                    <div className="w-full max-w-md aspect-square glass rounded-[3rem] border-white/5 overflow-hidden flex items-center justify-center relative group">
                        <div className="absolute inset-0 bg-indigo-600/10 group-hover:bg-indigo-600/20 transition-colors"></div>
                        <Layers size={100} className="text-indigo-400 animate-float opacity-30" />
                        <div className="absolute flex flex-col items-center gap-2">
                           <div className="w-4 h-4 rounded-full bg-indigo-500 shadow-glow"></div>
                           <div className="w-1 h-32 bg-gradient-to-b from-indigo-500 to-transparent"></div>
                        </div>
                    </div>
                 </div>
              </div>
            </section>
          ) : tab.type === 'security' ? (
            <section className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-6xl mx-auto pb-20">
              <div className="text-center mb-16 relative">
                 <div className="hero-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/10 blur-[100px] -z-10"></div>
                 <h1 className="text-6xl font-black mb-4 tracking-tighter uppercase italic leading-tight">SECURITY PROTOCOL</h1>
                 <p className="text-white/30 text-xl font-medium tracking-tight uppercase tracking-widest">Fortifying your decentralized presence.</p>
              </div>

              {/* Security Protocol Dashboard */}
              <div className="space-y-10">
                <div className="flex items-center gap-4 border-l-4 border-red-500 pl-6">
                  <h2 className="text-3xl font-black uppercase tracking-tighter">Active Protection</h2>
                  <div className="text-[10px] font-black uppercase text-red-400 bg-red-400/10 px-3 py-1 rounded-full border border-red-500/20">Critical Shield Active</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <EduCard 
                    title="Privacy Protection" 
                    description="Our browser automatically neutralizes ads, trackers, and malicious scripts, ensuring your decentralized journey remains private and invisible to data harvesters."
                    icon={<ShieldCheck size={24} className="text-red-400" />}
                    tag="Active Defense"
                    url="https://en.wikipedia.org/wiki/Internet_privacy"
                    onLearnMore={(url) => updateActiveTab({ dapp: { id: 'sec-privacy', name: 'Privacy Protocol', url, icon: '🛡️', category: 'Security' } })}
                  />
                  <EduCard 
                    title="Wallet Security" 
                    description="Safely manage connections with MetaMask or WalletConnect. View balances and networks while maintaining 100% sovereignty over your private keys."
                    icon={<Lock size={24} className="text-blue-400" />}
                    tag="Key Protection"
                    url="https://en.wikipedia.org/wiki/Cryptocurrency_wallet#Security"
                    onLearnMore={(url) => updateActiveTab({ dapp: { id: 'sec-wallet', name: 'Wallet Security', url, icon: '🔐', category: 'Security' } })}
                  />
                  <EduCard 
                    title="dApp Safety Check" 
                    description="Every protocol is scanned for known vulnerabilities. Our system provides instant status indicators: Verified, Unknown, or Warning."
                    icon={<Activity size={24} className="text-emerald-400" />}
                    tag="Verification"
                    url="https://en.wikipedia.org/wiki/Decentralized_application"
                    onLearnMore={(url) => updateActiveTab({ dapp: { id: 'sec-dapps', name: 'dApp Verification', url, icon: '✅', category: 'Security' } })}
                  />
                  <EduCard 
                    title="Smart Contract Alerts" 
                    description="Receive instant alerts when a dApp requests wallet or token permissions. Always review the scope of access before approving any transaction."
                    icon={<AlertTriangle size={24} className="text-yellow-400" />}
                    tag="Guardianship"
                    url="https://en.wikipedia.org/wiki/Smart_contract"
                    onLearnMore={(url) => updateActiveTab({ dapp: { id: 'sec-sc', name: 'Contract Alerts', url, icon: '📜', category: 'Security' } })}
                  />
                  <div className="glass-card rounded-[3rem] p-8 border-white/5 space-y-6 bg-red-500/5 col-span-1 md:col-span-2">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center">
                        <CheckCircle size={24} className="text-red-400" />
                      </div>
                      <h3 className="text-3xl font-black tracking-tight uppercase">Web3 Safety Tips</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <ul className="space-y-4 text-base font-bold text-white/50">
                         <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0 shadow-glow" />Never share your seed phrase or private keys.</li>
                         <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0 shadow-glow" />Verify website URLs before connecting your wallet.</li>
                       </ul>
                       <ul className="space-y-4 text-base font-bold text-white/50">
                         <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0 shadow-glow" />Avoid suspicious or unknown decentralized apps.</li>
                         <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0 shadow-glow" />Review smart contract permissions carefully.</li>
                       </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : tab.type === 'settings' ? (
            <section className="animate-in fade-in duration-700 max-w-6xl mx-auto pb-20">

              {/* Hero Banner */}
              <div className="relative rounded-[3rem] overflow-hidden mb-8 h-52" style={{background: 'linear-gradient(135deg, #1a1050 0%, #2d1b69 40%, #0f172a 100%)'}}>
                <div className="absolute inset-0 opacity-30" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, #6366f1 0%, transparent 50%), radial-gradient(circle at 80% 20%, #a855f7 0%, transparent 50%), radial-gradient(circle at 60% 80%, #06b6d4 0%, transparent 40%)'}} />
                <div className="absolute inset-0" style={{backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.03) 39px, rgba(255,255,255,0.03) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.03) 39px, rgba(255,255,255,0.03) 40px)'}} />
                <div className="absolute bottom-6 left-8">
                  <div className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-300/60 mb-1">Web3 Identity Matrix</div>
                  <h1 className="text-4xl font-black tracking-tighter text-white uppercase">{userProfile.name}</h1>
                  <p className="text-sm text-indigo-300/70 font-bold tracking-widest uppercase mt-1">{userProfile.bio}</p>
                </div>
                {/* Avatar floating on banner - clickable upload */}
                <div className="absolute bottom-[-30px] right-10">
                  <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-upload').click()}>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => setUserProfile({...userProfile, avatar: ev.target.result});
                        reader.readAsDataURL(file);
                      }}
                    />
                    <div className="absolute inset-0 rounded-[2rem] blur-xl bg-indigo-500/50 scale-110" />
                    <div className="relative w-24 h-24 rounded-[2rem] border-4 border-[#0f172a] shadow-2xl overflow-hidden" style={{background: 'linear-gradient(135deg, #6366f1, #a855f7)'}}>
                      {userProfile.avatar ? (
                        <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User size={38} className="text-white" />
                        </div>
                      )}
                      {/* Hover overlay with camera icon */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                        <span className="text-white text-[8px] font-black uppercase tracking-widest">Upload</span>
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#0f172a] shadow-lg" />
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 mt-10">
                {[
                  { label: 'Points', value: points.toLocaleString(), icon: <Trophy size={16} className="text-amber-400" />, color: 'from-amber-500/20 to-amber-600/5', border: 'border-amber-500/20' },
                  { label: 'HELA Balance', value: helaBalance, icon: <Zap size={16} className="text-indigo-400" />, color: 'from-indigo-500/20 to-indigo-600/5', border: 'border-indigo-500/20' },
                  { label: 'Accounts', value: accounts.length, icon: <UserPlus size={16} className="text-purple-400" />, color: 'from-purple-500/20 to-purple-600/5', border: 'border-purple-500/20' },
                  { label: 'Status', value: 'ELITE', icon: <ShieldCheck size={16} className="text-emerald-400" />, color: 'from-emerald-500/20 to-emerald-600/5', border: 'border-emerald-500/20' },
                ].map((stat, i) => (
                  <div key={i} className={`glass-card rounded-[2rem] p-6 bg-gradient-to-br ${stat.color} border ${stat.border} hover:scale-[1.02] transition-all duration-300`}>
                    <div className="flex items-center gap-2 mb-3">{stat.icon}<span className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</span></div>
                    <div className="text-2xl font-black tracking-tight text-white">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Achievement Badges */}
              <div className="glass-card rounded-[2.5rem] p-8 mb-8 border-white/5">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-5 flex items-center gap-2"><Trophy size={12} /> Achievements</h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: 'Web3 Pioneer', icon: '🚀', color: 'from-indigo-500/30 to-purple-500/20', border: 'border-indigo-500/30' },
                    { label: 'DeFi Explorer', icon: '🌊', color: 'from-emerald-500/20 to-teal-500/10', border: 'border-emerald-500/25' },
                    { label: 'Hela Holder', icon: '⚡', color: 'from-amber-500/20 to-orange-500/10', border: 'border-amber-500/25' },
                    { label: 'NFT Collector', icon: '🎨', color: 'from-pink-500/20 to-rose-500/10', border: 'border-pink-500/25' },
                    { label: 'Block Master', icon: '🔷', color: 'from-blue-500/20 to-cyan-500/10', border: 'border-blue-500/25' },
                    { label: 'Game Winner', icon: '🎮', color: 'from-violet-500/20 to-fuchsia-500/10', border: 'border-violet-500/25' },
                  ].map((badge, i) => (
                    <div key={i} className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${badge.color} border ${badge.border} hover:scale-105 transition-transform cursor-default`}>
                      <span className="text-sm">{badge.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/70">{badge.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left: Edit Profile + Danger Zone */}
                <div className="space-y-6">
                  {/* Edit Profile Card */}
                  <div className="glass-card rounded-[2.5rem] p-7 border-white/5">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-5 flex items-center gap-2"><Edit3 size={12} /> Identity</h3>
                    {isEditingProfile ? (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Name</label>
                          <input type="text" value={userProfile.name} onChange={(e) => setUserProfile({...userProfile, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-bold text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Bio</label>
                          <input type="text" value={userProfile.bio} onChange={(e) => setUserProfile({...userProfile, bio: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-bold text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Avatar URL</label>
                          <input type="text" value={userProfile.avatar} onChange={(e) => setUserProfile({...userProfile, avatar: e.target.value})} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
                        </div>
                        <div className="flex gap-3 pt-1">
                          <button onClick={() => setIsEditingProfile(false)} className="flex-1 py-3 glass rounded-xl text-xs font-black uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all">Cancel</button>
                          <button onClick={() => setIsEditingProfile(false)} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all active:scale-95 shadow-lg shadow-indigo-600/30">Save</button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                          <div className="text-[10px] font-black uppercase tracking-widest text-white/25">Name</div>
                          <div className="text-sm font-black uppercase tracking-tight text-white">{userProfile.name}</div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="text-[10px] font-black uppercase tracking-widest text-white/25">Bio</div>
                          <div className="text-sm font-bold text-indigo-400">{userProfile.bio}</div>
                        </div>
                        <button onClick={() => setIsEditingProfile(true)} className="w-full py-3 glass rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all border border-white/5 flex items-center justify-center gap-2">
                          <Edit3 size={12} /> Edit Profile
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Danger Zone */}
                  <div className="glass-card rounded-[2.5rem] p-7 border-red-500/5 hover:border-red-500/15 transition-all">
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-red-400 mb-5 flex items-center gap-2"><Shield size={12} /> Danger Zone</h4>
                    <button onClick={() => { if(window.ethereum) window.ethereum.removeAllListeners(); localStorage.removeItem('web3_walletAddress'); setWalletAddress(''); setIsWalletGateOpen(true); updateActiveTab({ type: '' }); updateActiveTab({ dapp: null }); }}
                      className="w-full py-3 mb-3 text-xs font-black uppercase tracking-[0.2em] text-white/40 hover:text-amber-400 hover:bg-amber-400/10 rounded-xl border border-white/5 hover:border-amber-400/20 transition-all flex items-center justify-center gap-2">
                      <LogOut size={12} /> Disconnect
                    </button>
                    <button onClick={() => setShowDeleteConfirm(true)}
                      className="w-full py-3 text-xs font-black uppercase tracking-[0.2em] text-white/25 hover:text-red-400 hover:bg-red-400/10 rounded-xl border border-white/5 hover:border-red-400/15 transition-all">
                      Wipe Cache
                    </button>
                  </div>
                </div>

                {/* Right: Active Accounts + Wallet Card */}
                <div className="md:col-span-2 space-y-6">
                  <div className="glass-card rounded-[2.5rem] p-8 border-white/5">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-black uppercase tracking-tight">Active Accounts</h3>
                      <button onClick={async () => { try { const provider = new ethers.BrowserProvider(window.ethereum); const signer = await provider.getSigner(); const addr = await signer.getAddress(); if(accounts.find(a => a.address === addr)) return alert('Identity already synchronized.'); setAccounts([...accounts, { id: Date.now(), name: 'Sub-Core ' + (accounts.length + 1), address: addr, active: false }]); } catch(e) { alert('MetaMask auth failed.'); } }}
                        className="flex items-center gap-2 text-indigo-400 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors">
                        <UserPlus size={14} /> Sync New
                      </button>
                    </div>
                    <div className="space-y-3">
                      {accounts.map((acc) => (
                        <div key={acc.id} className={`flex items-center justify-between p-5 rounded-[1.5rem] border transition-all ${acc.active ? 'bg-indigo-600/10 border-indigo-500/30' : 'bg-white/3 border-white/5 hover:border-white/10'}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${acc.active ? 'bg-indigo-400 shadow-glow animate-pulse' : 'bg-white/15'}`} />
                            <div>
                              <div className="font-black uppercase tracking-tight text-sm text-white">{acc.name}</div>
                              <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">UID: {acc.id.toString().slice(-4)}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {!acc.active && (
                              <button onClick={() => { setAccounts(accounts.map(a => ({...a, active: a.id === acc.id}))); setWalletAddress(acc.address); setIsWalletGateOpen(false); }} className="px-3 py-1.5 glass rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border-white/10">Switch</button>
                            )}
                            {acc.active && <span className="px-3 py-1.5 text-[10px] font-black uppercase text-indigo-400 tracking-widest">Active</span>}
                            <button onClick={() => { if(accounts.length > 1) setAccounts(accounts.filter(a => a.id !== acc.id)); else alert('Need at least one account.'); }} className="w-8 h-8 flex items-center justify-center text-white/15 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Wallet Identity Card */}
                  <div className="relative rounded-[2.5rem] p-8 overflow-hidden" style={{background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)'}}>
                    <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 75% 25%, #818cf8 0%, transparent 50%)'}} />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-8">
                        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-300/60">Wallet Identity</div>
                        <div className="flex gap-1">{[1,2,3].map(i => <div key={i} className="w-6 h-4 rounded-sm bg-white/10" />)}</div>
                      </div>
                      <div className="font-mono text-sm text-indigo-200/70 tracking-widest mb-1">
                        {walletAddress ? `${walletAddress.slice(0,8)}...${walletAddress.slice(-6)}` : 'NOT CONNECTED'}
                      </div>
                      <div className="font-black text-xl text-white tracking-tight">{userProfile.name}</div>
                      <div className="flex items-center justify-between mt-8">
                        <div>
                          <div className="text-[9px] font-black uppercase tracking-widest text-indigo-300/50 mb-0.5">Points</div>
                          <div className="font-black text-white">{points.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-[9px] font-black uppercase tracking-widest text-indigo-300/50 mb-0.5">HELA</div>
                          <div className="font-black text-white">{helaBalance}</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                          <Zap size={18} className="text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Matrix Status */}
                  <div className="glass-card rounded-[2.5rem] p-6 bg-gradient-to-br from-emerald-600/10 to-transparent border-emerald-500/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-emerald-400"><Layers size={24} /></div>
                      <div>
                        <div className="font-black uppercase tracking-tight text-sm">Matrix Status: Elite</div>
                        <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest">All neural connections established</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">LIVE</span>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 animate-in zoom-in duration-1000">
                <div className="w-32 h-32 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-10 border border-white/10 shadow-2xl animate-float">
                    <Globe size={64} className="text-white/10" />
                </div>
                <h3 className="text-5xl font-black mb-4 tracking-tighter uppercase italic opacity-20">Protocol Offline</h3>
                <p className="font-bold text-white/10 tracking-[0.4em] uppercase text-sm">Awaiting Network Sync</p>
            </div>
            )}
            </div>
          ))}
        </div>
      </main>

      {/* Redeem Modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07090c]/95 backdrop-blur-3xl animate-in zoom-in duration-300 px-6">
          <div className="glass-card max-w-md w-full p-8 rounded-[3rem] border-white/10 relative overflow-hidden bg-gradient-to-br from-indigo-900/10 to-transparent shadow-[0_0_100px_rgba(0,209,255,0.1)]">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-2">REDEEM <span className="text-[#00d1ff]">HELA</span></h2>
            <p className="text-white/40 text-sm font-bold mb-8">Select the amount of points you wish to convert. 1000 PTS = 1 HELA.</p>
            
            <div className="glass rounded-[2rem] p-6 border-white/5 mb-8 text-center space-y-4 relative">
               <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Conversion Preview</div>
               <div className="flex items-center justify-center gap-6">
                 <div>
                    <div className="text-2xl font-black text-white px-4 py-2 bg-black/40 rounded-xl tabular-nums drop-shadow-md">{redeemAmount.toLocaleString()}</div>
                    <div className="text-[10px] font-bold text-white/30 uppercase mt-2">PTS Deducted</div>
                 </div>
                 <ChevronRight size={24} className="text-white/20" />
                 <div>
                    <div className="text-2xl font-black text-[#00d1ff] px-4 py-2 bg-[#00d1ff]/10 rounded-xl tabular-nums drop-shadow-md">+{(redeemAmount/1000).toFixed(2)}</div>
                    <div className="text-[10px] font-bold text-[#00d1ff]/50 uppercase mt-2">HELA Yield</div>
                 </div>
               </div>
            </div>

            <div className="space-y-6 mb-10">
               <div className="flex justify-between text-xs font-black uppercase text-white/40">
                 <span>1,000</span>
                 <span>Max: {(Math.floor(points/1000)*1000).toLocaleString()}</span>
               </div>
               <input 
                 type="range" 
                 min="1000" 
                 max={Math.floor(points/1000)*1000 || 1000} 
                 step="1000" 
                 value={redeemAmount} 
                 onChange={(e) => setRedeemAmount(Number(e.target.value))}
                 className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#00d1ff]"
               />
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setShowRedeemModal(false)}
                className="flex-1 py-4 glass rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white/50 border-white/5 active:scale-95"
              >
                Cancel
              </button>
              <button 
                onClick={executeRedeem}
                className="flex-1 py-4 bg-[#00d1ff] hover:bg-[#00b8e6] text-black rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(0,209,255,0.3)] hover:shadow-[0_0_30px_rgba(0,209,255,0.5)] active:scale-95"
              >
                Confirm Sync
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quest Modal */}
      {showQuestModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07090c]/95 backdrop-blur-3xl animate-in zoom-in duration-300 px-6">
          <div className="glass-card max-w-lg w-full p-8 rounded-[3rem] border-purple-500/20 relative overflow-hidden bg-gradient-to-br from-purple-900/10 to-transparent">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-1 text-purple-400">WTF <span className="text-white">QUESTS</span></h2>
                <p className="text-white/40 text-sm font-bold">Complete neural sync tasks for points.</p>
              </div>
              <button onClick={() => setShowQuestModal(false)} className="w-10 h-10 flex items-center justify-center glass rounded-full hover:bg-white/10 transition-all active:scale-95 text-white/50"><X size={18} /></button>
            </div>
            
            <div className="space-y-4">
               {/* Scholar Quest */}
               {!completedQuests.includes('scholar') && (
                 <div className="glass rounded-[2rem] p-5 border-white/5 flex items-center justify-between group hover:border-purple-500/30 transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400"><Layers size={20} /></div>
                       <div>
                         <div className="font-black uppercase tracking-tight text-sm text-white">The Scholar</div>
                         <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Read an Education Article for 10s</div>
                       </div>
                    </div>
                    {activeQuests.includes('scholar') ? (
                       <div className="text-xs font-black text-purple-400 bg-purple-500/10 px-4 py-2 rounded-xl animate-pulse flex items-center gap-2 tracking-widest"><Play size={10} /> {articleTimer}s / 10s</div>
                    ) : (
                       <button onClick={() => { setActiveQuests(prev => [...prev.filter(q => q !== 'scholar'), 'scholar']); setShowQuestModal(false); updateActiveTab({ type: '' }); }} className="px-5 py-2.5 bg-white/5 hover:bg-purple-500/20 text-xs font-black uppercase tracking-widest text-white rounded-xl transition-all border border-white/10">Start +5</button>
                    )}
                 </div>
               )}
 
               {/* Explorer Quest */}
               {!completedQuests.includes('explorer') && (
                 <div className="glass rounded-[2rem] p-5 border-white/5 flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400"><Globe size={20} /></div>
                       <div>
                         <div className="font-black uppercase tracking-tight text-sm text-white">The Explorer</div>
                         <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Launch any Ecosystem dApp</div>
                       </div>
                    </div>
                    <button onClick={() => { setActiveQuests(['explorer']); claimReward('wtf_quest_action'); alert('Explorer Quest: +5 points!'); setShowQuestModal(false); updateActiveTab({ type: '' }); }} className="px-5 py-2.5 bg-white/5 hover:bg-indigo-500/20 text-xs font-black uppercase tracking-widest text-white rounded-xl transition-all border border-white/10">Quick +5</button>
                 </div>
               )}
 
               {/* Gamer Quest */}
               {!completedQuests.includes('gamer') && (
                 <div className="glass rounded-[2rem] p-5 border-white/5 flex items-center justify-between group hover:border-red-500/30 transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400"><Activity size={20} /></div>
                       <div>
                         <div className="font-black uppercase tracking-tight text-sm text-white">The Gamer</div>
                         <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Play a WTF Zone Game</div>
                       </div>
                    </div>
                    <button onClick={() => { setActiveQuests(['gamer']); claimReward('wtf_quest_action'); alert('Gamer Quest: +5 points!'); setShowQuestModal(false); updateActiveTab({ type: '' }); }} className="px-5 py-2.5 bg-white/5 hover:bg-red-500/20 text-xs font-black uppercase tracking-widest text-white rounded-xl transition-all border border-white/10">Play +5</button>
                 </div>
               )}
             </div>
             
             {!completedQuests.includes('daily') && (
               <button onClick={async () => {
                    if (!walletAddress) return alert('Connect wallet first');
                    setIsQuesting(true);
                    const success = await claimReward('wtf_quest');
                    setIsQuesting(false);
                    if (success) {
                      setShowQuestModal(false);
                      alert('Daily Main Quest Sync Complete: +50 Points!');
                    }
                  }}
                  disabled={isQuesting} className="w-full mt-6 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 border border-white/10">
                    {isQuesting ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : 'Complete Daily Check-in (+50)'}
               </button>
             )}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07090c]/95 backdrop-blur-3xl animate-in zoom-in duration-300 px-6">
          <div className="glass-card max-w-sm w-full p-8 rounded-[3rem] border-indigo-500/20 relative overflow-hidden bg-gradient-to-br from-indigo-900/10 to-transparent text-center">
            <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-400"><Users size={32} /></div>
            <h2 className="text-2xl font-black uppercase tracking-tighter italic mb-2">SHARE <span className="text-indigo-400">NODE</span></h2>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-8">Broadcast your identity to expand the matrix and earn 50 PTS.</p>
            
            <div className="space-y-3 mb-6">
               <button onClick={() => { window.open('https://api.whatsapp.com/send?text=Check%20out%20this%20Web3%20Browser!%20https%3A%2F%2Fweb3browser-sooty.vercel.app%2F', '_blank'); claimReward('node_referral'); setShowShareModal(false); }} className="w-full py-4 glass rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#25D366]/20 hover:text-[#25D366] transition-all border border-white/10 flex items-center justify-center gap-3"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12A12 12 0 0 0 12.029 4.456zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825.001 6.938 3.113 6.938 6.938-.001 3.825-3.114 6.938-6.938 6.942z"/></svg> WhatsApp</button>
               <button onClick={() => { window.open('https://twitter.com/intent/tweet?text=Check%20out%20this%20Web3%20Browser!%20https%3A%2F%2Fweb3browser-sooty.vercel.app%2F', '_blank'); claimReward('node_referral'); setShowShareModal(false); }} className="w-full py-4 glass rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10 flex items-center justify-center gap-3"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg> X (Twitter)</button>
               <button onClick={() => { window.open('https://t.me/share/url?url=https://web3browser-sooty.vercel.app/&text=Check%20out%20this%20Web3%20Browser!', '_blank'); claimReward('node_referral'); setShowShareModal(false); }} className="w-full py-4 glass rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#0088cc]/20 hover:text-[#0088cc] transition-all border border-white/10 flex items-center justify-center gap-3"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg> Telegram</button>
            </div>
            
            <button onClick={() => setShowShareModal(false)} className="text-[10px] font-black uppercase text-white/30 hover:text-white transition-colors tracking-widest">Close Matrix</button>
          </div>
        </div>
      )}

      {/* Voucher Modal */}
      {showVoucherModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07090c]/95 backdrop-blur-3xl animate-in zoom-in duration-300 px-6">
          <div className="glass-card max-w-4xl w-full p-10 rounded-[3rem] border-emerald-500/20 relative overflow-hidden bg-gradient-to-br from-emerald-900/10 to-transparent max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-start mb-8 shrink-0">
              <div>
                <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-1 text-emerald-400">PARTNER <span className="text-white">VOUCHERS</span></h2>
                <p className="text-white/40 text-sm font-bold">Redeem points for real-world assets and exclusive brand gift cards.</p>
              </div>
              <button onClick={() => setShowVoucherModal(false)} className="w-12 h-12 flex items-center justify-center glass rounded-full hover:bg-white/10 transition-all active:scale-95 text-white/50"><X size={24} /></button>
            </div>
            
            <div className="flex items-center justify-between mb-8 shrink-0 bg-black/20 p-6 rounded-3xl border border-white/5">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-yellow-400/20 rounded-2xl flex items-center justify-center"><Zap size={24} className="text-yellow-400" /></div>
                   <div>
                     <div className="text-[10px] font-black uppercase text-white/40 tracking-widest">Available Points</div>
                     <div className="text-2xl font-black text-white">{points.toLocaleString()} PTS</div>
                   </div>
                </div>
             </div>

            <h3 className="text-sm font-black uppercase tracking-widest text-emerald-400 mb-4 px-2">Available Vouchers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-4 pb-4 custom-scrollbar mb-8">
               {[
                 { brand: 'Amazon', value: '$10 Gift Card', icon: '🛒', cost: 10000, color: 'hover:border-yellow-500/50 hover:bg-yellow-500/10' },
                 { brand: 'Apple', value: '$25 Gift Card', icon: '🍎', cost: 25000, color: 'hover:border-white/50 hover:bg-white/10' },
                 { brand: 'Flipkart', value: '₹500 Voucher', icon: '🛍️', cost: 5000, color: 'hover:border-blue-500/50 hover:bg-blue-500/10' },
                 { brand: 'Croma', value: '10% Discount', icon: '💻', cost: 2000, color: 'hover:border-teal-500/50 hover:bg-teal-500/10' },
                 { brand: 'Myntra', value: '₹1000 Voucher', icon: '👗', cost: 10000, color: 'hover:border-pink-500/50 hover:bg-pink-500/10' },
                 { brand: 'Steam', value: '$20 Wallet', icon: '🎮', cost: 20000, color: 'hover:border-indigo-500/50 hover:bg-indigo-500/10' },
               ].map((v, i) => (
                  <div key={i} className={`glass rounded-[2rem] p-6 border-white/5 transition-all group cursor-pointer ${v.color}`}>
                     <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">{v.icon}</div>
                     <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">{v.brand}</h3>
                     <p className="text-sm font-bold text-white/40 mb-6">{v.value}</p>
                     <div className="flex items-center justify-between mt-auto">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-black/40 px-3 py-1.5 rounded-lg text-white/70">{v.cost.toLocaleString()} PTS</span>
                        <button 
                          onClick={() => {
                            if (points < v.cost) return alert('Insufficient points for this voucher.');
                            setPoints(p => p - v.cost);
                            const code = Math.random().toString(36).substring(2, 10).toUpperCase();
                            const keyId = 'KEY-' + Math.floor(Math.random() * 100000);
                            setRedeemedVouchers(prev => [...prev, { brand: v.brand, value: v.value, code, keyId }]);
                            alert(`Success! Redeemed ${v.brand} voucher.`);
                          }}
                          className="px-4 py-2 glass rounded-lg text-[10px] font-black uppercase tracking-widest text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all"
                        >
                          Redeem
                        </button>
                     </div>
                  </div>
               ))}
            </div>

            {redeemedVouchers.length > 0 && (
               <>
                 <h3 className="text-sm font-black uppercase tracking-widest text-purple-400 mb-4 px-2">Redeemed Rewards</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {redeemedVouchers.map((rv, idx) => (
                     <div key={idx} className="glass rounded-2xl p-5 border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-transparent flex flex-col gap-3 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-bl-[100%]"></div>
                       <div className="flex justify-between items-center">
                         <span className="font-black uppercase tracking-widest text-white">{rv.brand}</span>
                         <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">Active</span>
                       </div>
                       <div className="text-lg font-black text-white/80">{rv.value}</div>
                       <div className="bg-black/40 rounded-xl p-3 border border-white/5 space-y-2 mt-2">
                         <div className="flex justify-between items-center">
                           <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Coupon Code</span>
                           <span className="font-mono text-xs font-bold text-amber-400 tracking-widest select-all">{rv.code}</span>
                         </div>
                         <div className="flex justify-between items-center">
                           <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Key ID</span>
                           <span className="font-mono text-[10px] text-white/50">{rv.keyId}</span>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               </>
            )}
          </div>
        </div>
      )}

      {/* Game Overlays */}
      {activeGame === 'snake' && (
        <SnakeGame 
          onExit={() => setActiveGame(null)} 
          onScore={(score) => {
            setPoints(prev => prev + score);
            alert(`Neural Sync Results: +${score} Points added to your Identity.`);
          }} 
        />
      )}
      {activeGame === 'maze' && (
        <MazeGame 
          onExit={() => setActiveGame(null)} 
          onScore={(score) => {
            setPoints(prev => prev + score);
            alert(`Maze Deconstructed: +${score} Points added to your Identity.`);
          }} 
        />
      )}
    </div>
  );
}

function EduCard({ title, description, icon, tag, url, onLearnMore }) {
  return (
    <div 
      className="glass-card p-10 rounded-[3rem] hover:border-indigo-500/40 transition-all cursor-pointer group flex flex-col items-start min-h-[300px] relative overflow-hidden"
      onClick={() => onLearnMore && onLearnMore(url)}
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl group-hover:bg-indigo-600/10 transition-colors"></div>
      
      <div className="flex items-center justify-between w-full mb-8">
        <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center shadow-lg border-white/5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
          {icon || <Activity size={24} className="text-purple-400" />}
        </div>
        {tag && (
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            {tag}
          </span>
        )}
      </div>

      <h3 className="text-2xl font-black mb-4 uppercase tracking-tight group-hover:text-indigo-400 transition-colors leading-tight">
        {title}
      </h3>
      <p className="text-base text-white/40 font-medium leading-relaxed group-hover:text-white/60 transition-colors">
        {description}
      </p>
      
      <div 
        className="mt-auto pt-8 flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-white/10 group-hover:text-indigo-400 transition-colors"
      >
        Learn More <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}



function SnakeGame({ onExit, onScore }) {
  const [snake, setSnake] = useState([[5, 5]]);
  const [food, setFood] = useState([10, 10]);
  const [direction, setDirection] = useState([0, 1]);
  const [gameOver, setGameOver] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake(prev => {
        const newHead = [prev[0][0] + direction[0], prev[0][1] + direction[1]];
        if (newHead[0] < 0 || newHead[0] >= 20 || newHead[1] < 0 || newHead[1] >= 20 || prev.some(s => s[0] === newHead[0] && s[1] === newHead[1])) {
          setGameOver(true);
          return prev;
        }
        const newSnake = [newHead, ...prev];
        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setCurrentScore(s => s + 10);
          setFood([Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)]);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [direction, food, gameOver]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#07090c]/95 backdrop-blur-3xl animate-in zoom-in duration-500 px-6">
      <div className="glass-card max-w-2xl w-full p-12 rounded-[4rem] border-white/10 relative overflow-hidden bg-gradient-to-br from-indigo-900/10 to-transparent">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter italic">SNAKE <span className="text-indigo-400">TERMINAL</span></h2>
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest mt-2">Neural Coordination Test</p>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">Local Score</p>
             <p className="text-3xl font-black text-indigo-400 tracking-tighter">{currentScore}</p>
          </div>
        </div>

        <div className="aspect-square w-full max-w-[400px] mx-auto bg-black/40 rounded-[2rem] border-2 border-white/5 relative mb-12 grid grid-cols-20 grid-rows-20 p-2">
           {gameOver ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-10 rounded-[1.8rem]">
                <h3 className="text-4xl font-black uppercase italic mb-4">CRITICAL FAILURE</h3>
                <p className="text-white/40 font-bold mb-8 italic text-center">Neural sync lost at {currentScore} cycles.</p>
                <div className="flex gap-4">
                   <button onClick={() => { setSnake([[5, 5]]); setGameOver(false); setCurrentScore(0); }} className="px-8 py-4 bg-indigo-600 rounded-2xl font-black uppercase text-sm">Restart Sync</button>
                   <button onClick={() => { onScore(currentScore); onExit(); }} className="px-8 py-4 glass rounded-2xl font-black uppercase text-sm border-white/10">Exit Matrix</button>
                </div>
             </div>
           ) : (
             <>
               {snake.map((s, i) => (
                 <div key={i} style={{ gridColumnStart: s[1] + 1, gridRowStart: s[0] + 1 }} className={`w-full h-full rounded-sm ${i === 0 ? 'bg-indigo-400 shadow-glow z-10' : 'bg-indigo-400/30'}`}></div>
               ))}
               <div style={{ gridColumnStart: food[1] + 1, gridRowStart: food[0] + 1 }} className="w-full h-full bg-emerald-400 rounded-full shadow-glow-emerald animate-pulse"></div>
             </>
           )}
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-[200px] mx-auto">
           <div />
           <button onClick={() => setDirection([-1, 0])} className="w-12 h-12 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-all border-white/10"><ChevronRight size={20} className="-rotate-90 translate-y-[-2px] text-white/40" /></button>
           <div />
           <button onClick={() => setDirection([0, -1])} className="w-12 h-12 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-all border-white/10"><ChevronRight size={20} className="rotate-180 translate-x-[-2px] text-white/40" /></button>
           <button onClick={() => setDirection([1, 0])} className="w-12 h-12 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-all border-white/10"><ChevronRight size={20} className="rotate-90 translate-y-[2px] text-white/40" /></button>
           <button onClick={() => setDirection([0, 1])} className="w-12 h-12 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-all border-white/10"><ChevronRight size={20} className="translate-x-[2px] text-white/40" /></button>
        </div>

        <p className="mt-12 text-center text-[10px] text-white/10 font-black uppercase tracking-[0.4em]">Use Directional Pad or Arrow Keys to navigate</p>
      </div>
    </div>
  )
}

function MazeGame({ onExit, onScore }) {
  const [level, setLevel] = useState(1);
  const [solved, setSolved] = useState(false);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#07090c]/95 backdrop-blur-3xl animate-in fade-in duration-500 px-6">
      <div className="glass-card max-w-2xl w-full p-12 rounded-[4rem] border-white/10 relative overflow-hidden bg-gradient-to-br from-purple-900/10 to-transparent">
        <div className="text-center space-y-8">
          <div className="w-20 h-20 bg-indigo-600/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
             <Layers size={40} className="text-indigo-400 animate-pulse" />
          </div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">MAZE <span className="text-purple-400">SOLVER</span></h2>
          <p className="text-white/40 font-medium">Algorithmic Pathfinding Simulation</p>
          
          <div className="py-12 glass rounded-[2rem] border-white/5 bg-black/40 relative group overflow-hidden">
             <div className="absolute inset-0 flex items-center justify-center">
                {!solved ? (
                  <div className="space-y-6">
                    <p className="text-indigo-400 font-black animate-pulse">SOLVING ENCRYPTION LAYER {level}...</p>
                    <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mx-auto">
                       <div className="h-full bg-indigo-500 animate-[loading_3s_linear_infinite]"></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <CheckCircle size={64} className="text-emerald-400 mx-auto" />
                    <p className="text-2xl font-black uppercase text-emerald-400 tracking-tighter">LAYER DECONSTRUCTED</p>
                  </div>
                )}
             </div>
             <style>{`
               @keyframes loading {
                 0% { width: 0%; }
                 100% { width: 100%; }
               }
             `}</style>
          </div>

          {!solved ? (
            <button 
              onClick={() => {
                setTimeout(() => {
                  setSolved(true);
                  onScore(150 * level);
                }, 3000);
              }}
              className="w-full bg-white text-indigo-900 py-5 rounded-2xl font-black text-lg hover:shadow-2xl transition-all"
            >
              EXECUTE SOLVER
            </button>
          ) : (
            <div className="flex gap-4">
              <button onClick={() => { setLevel(l => l + 1); setSolved(false); }} className="flex-1 bg-indigo-600 py-5 rounded-2xl font-black text-lg">Next Level</button>
              <button onClick={onExit} className="flex-1 glass py-5 rounded-2xl font-black text-lg border-white/10">Exit Matrix</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Final Synchronization Signature: 0x817a68d-matrix-core-v5.0-playwall-complete
export default App;

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${
        active 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
          : 'text-white/40 hover:bg-white/5 hover:text-white'
      }`}
    >
      <div className={`${active ? 'text-white' : 'group-hover:text-indigo-400'} transition-colors`}>
        {icon}
      </div>
      <span className="hidden lg:block text-sm font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

function RewardCard({ icon, label, value, subValue }) {
  return (
    <div className="glass-card p-8 rounded-[2.5rem] border-white/5 bg-white/5 space-y-4">
      <div className="w-10 h-10 glass rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">{label}</p>
        <p className="text-2xl font-black text-white tracking-tighter">{value}</p>
        <p className="text-[10px] font-bold text-indigo-400 italic uppercase tracking-widest mt-2">{subValue}</p>
      </div>
    </div>
  );
}

function ActivityItem({ label, date, points }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer hover:translate-x-1 transition-transform">
      <div className="flex items-center gap-4">
        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
        <div>
          <p className="text-sm font-black uppercase text-white group-hover:text-indigo-400 transition-colors">{label}</p>
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{date}</p>
        </div>
      </div>
      <div className="text-[10px] font-black text-indigo-400/50 bg-indigo-400/5 px-3 py-1 rounded-lg border border-indigo-400/10 uppercase tracking-widest">
        {points}
      </div>
    </div>
  );
}
