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
  X
} from 'lucide-react';

// Mock dApps Data
const DAPPS = [
  { id: 1, name: 'Uniswap', url: 'https://app.uniswap.org', icon: '🦄', category: 'DeFi', description: 'Swap tokens easily' },
  { id: 2, name: 'OpenSea', url: 'https://opensea.io', icon: '⛵', category: 'NFT', description: 'Discover & collect NFTs' },
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
  { id: 22, name: 'Etherscan', url: 'https://etherscan.io', icon: '📑', category: 'Explorer', description: 'Ethereum blockchain explorer' }
];

const API_URL = import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== 'https://your-backend-url.vercel.app' 
  ? import.meta.env.VITE_API_URL 
  : 'https://web3browser-backend.vercel.app';

function App() {
  const [activeTab, setActiveTab] = useState('explore');
  const [activeDApp, setActiveDApp] = useState(null);
  const [iframeStatus, setIframeStatus] = useState('loading');
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('0.00');
  const [points, setPoints] = useState(0);
  const [dappList, setDappList] = useState(DAPPS);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState(null);
  const [helaBalance, setHelaBalance] = useState('0.00');
  const [isWalletGateOpen, setIsWalletGateOpen] = useState(true);

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
  const [activeGame, setActiveGame] = useState(null);

  useEffect(() => {
    localStorage.setItem('web3_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('web3_accounts', JSON.stringify(accounts));
  }, [accounts]);

  // Check if activeDApp can be framed securely
  useEffect(() => {
    if (activeDApp) {
      setIframeStatus('loading');
      
      // VIP Sites: Domains that we KNOW block iframes. 
      // Skip the backend check and go straight to proxy for these for speed.
      const VIP_SITES = [
        'youtube.com', 'google.com', 'opensea.io', 'github.com', 'twitter.com', 'x.com', 
        'facebook.com', 'instagram.com', 'linkedin.com', 'binance.com', 'academy.binance.com',
        'geeksforgeeks.org', 'wikipedia.org', 'en.wikipedia.org', 'investopedia.com', 'medium.com',
        'hela.network', 'magiceden.io'
      ];
      const domain = activeDApp.url.toLowerCase();
      
      if (VIP_SITES.some(site => domain.includes(site))) {
        setIframeStatus('blocked');
        return;
      }

      fetch(`${API_URL}/search/check-frame?url=${encodeURIComponent(activeDApp.url)}`)
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
  }, [activeDApp]);

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
      if (searchQuery.trim().length > 0 && !(/^(http:\/\/|https:\/\/)/i.test(searchQuery) || searchQuery.includes('.'))) {
        try {
          const res = await fetch(`${API_URL}/search/suggest?q=${encodeURIComponent(searchQuery)}`);
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
  }, [searchQuery]);

  const executeSearch = async (queryToSearch) => {
    const query = queryToSearch.trim();
    if (!query) return;

    setShowSuggestions(false);
    
    // URL detection based on user rules
    const isUrl = query.startsWith('http://') || query.startsWith('https://') || (query.includes('.') && !query.includes(' ') && !query.startsWith(' '));
    
    if (isUrl) {
      const url = query.startsWith('http') ? query : `https://${query}`;
      setSearchQuery(query);
      setActiveDApp({ id: 'custom', name: url, url: url, icon: '🌐', category: 'Web' });
      setActiveTab('explore');
    } else {
      // Perform Search
      setSearchQuery(query);
      setActiveDApp(null);
      setActiveTab('search');
      setSearchError(null);
      setIsSearching(true);
      
      const searchUrl = `${API_URL}/search?q=${encodeURIComponent(query)}`;
      console.log('Fetching results from:', searchUrl);
      
      try {
        const res = await fetch(searchUrl);
        if(res.ok) {
          const data = await res.json();
          console.log('Search results received:', data);
          
          if (Array.isArray(data)) {
            setSearchResults(data);
          } else if (data.results) {
            setSearchResults(data.results);
            if (data.warning) {
              setSearchError(data.warning);
            }
          } else if (data.error) {
            setSearchResults([]);
            setSearchError(data.message || data.error);
          }
        } else {
          setSearchResults([]);
          setSearchError(`Backend error: ${res.status}`);
        }
      } catch (err) {
        console.error('Search failed', err);
        setSearchResults([]);
        setSearchError('Connection failed: Please check if VITE_API_URL is correct on Vercel.');
      } finally {
        setIsSearching(false);
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
            setPoints(totalPoints);
            setHelaBalance((totalPoints / 1000).toFixed(2));
          });

      } catch (err) {
        console.error('Wallet connection failed', err);
      }
    } else {
      alert('MetaMask not detected');
    }
  };

  const redeemPoints = () => {
    if (points < 1000) return alert('Insufficient points: Min 1,000 pts required for 1 Hela.');
    
    if(confirm(`Convert 1,000 Points into 1 Hela?`)) {
       setPoints(prev => prev - 1000);
       setHelaBalance(prev => (parseFloat(prev) + 1).toFixed(2));
       alert('Redemption Successful: +1 Hela synchronized to account matrix.');
    }
  };

  const claimReward = async () => {
    // ...existing claimReward logic...
    if (!walletAddress) return alert('Connect wallet first');
    
    fetch(`${API_URL}/rewards/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet_address: walletAddress })
    })
    .then(res => res.json())
    .then(data => {
      setPoints(prev => prev + (data.points || 0));
    });
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

      {/* Main App Workspace */}
      {/* Sidebar */}
      <aside className="w-20 lg:w-72 border-r border-white/5 flex flex-col items-center lg:items-stretch py-8 px-5 bg-[#0a0c0f] relative z-20 shadow-2xl">
        <div className="flex items-center gap-4 px-3 mb-12 overflow-hidden group cursor-pointer" onClick={() => {setActiveTab('explore'); setActiveDApp(null)}}>
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
            active={activeTab === 'explore' && !activeDApp} 
            onClick={() => {
              setActiveTab('explore'); 
              setActiveDApp(null); 
              setSearchQuery('');
            }} 
          />
          <NavItem 
            icon={<Grid size={22}/>} 
            label="DApps" 
            active={activeTab === 'dapps'} 
            onClick={() => {
              setActiveTab('dapps'); 
              setActiveDApp(null);
            }} 
          />
          <NavItem icon={<Trophy size={22}/>} label="Rewards" active={activeTab === 'rewards'} onClick={() => {setActiveTab('rewards'); setActiveDApp(null)}} />
          <NavItem icon={<Play size={22}/>} label="WTF Zone" active={activeTab === 'wtf-zone'} onClick={() => {setActiveTab('wtf-zone'); setActiveDApp(null)}} />
          <NavItem icon={<BookOpen size={22}/>} label="Education" active={activeTab === 'education'} onClick={() => {setActiveTab('education'); setActiveDApp(null)}} />
          <NavItem icon={<Shield size={22}/>} label="Security" active={activeTab === 'security'} onClick={() => {setActiveTab('security'); setActiveDApp(null)}} />
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5 w-full">
          <NavItem icon={<Settings size={22}/>} label="Settings" active={activeTab === 'settings'} onClick={() => {setActiveTab('settings'); setActiveDApp(null)}} />
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Background Glows */}
        <div className="hero-glow top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full"></div>
        <div className="hero-glow bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full"></div>

        {/* Header */}
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-10 bg-[#07090c]/40 backdrop-blur-2xl sticky top-0 z-30">
          <div className="flex items-center gap-6 flex-1 max-w-2xl">
            <div className="relative w-full group">
              <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-indigo-400 transition-all duration-300" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    executeSearch(searchQuery);
                    e.target.blur();
                  }
                }}
                placeholder="Search the decentralized web..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-14 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all font-medium text-lg placeholder:text-white/20"
              />
              
              {searchQuery && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchQuery('');
                  }}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-all duration-200 hover:scale-110 active:scale-95"
                >
                  <X size={18} />
                </button>
              )}

              {/* Autocomplete Dropdown */}
              {showSuggestions && searchQuery.trim().length > 0 && (
                <div className="absolute top-16 left-0 w-full glass rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden z-50 border-white/10 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div 
                    className="px-6 py-4 hover:bg-white/5 cursor-pointer flex items-center gap-4 transition-colors border-b border-white/5"
                    onClick={() => executeSearch(searchQuery)}
                  >
                    {searchQuery.includes('.') || searchQuery.startsWith('http') ? (
                      <Globe size={16} className="text-white/40" />
                    ) : (
                      <Search size={16} className="text-white/40" />
                    )}
                    <span className="text-base font-medium text-white/80">
                      <span className="text-indigo-400 font-bold">{searchQuery}</span>
                      <span className="text-white/30 ml-3 text-sm italic">
                        - {searchQuery.includes('.') || searchQuery.startsWith('http') ? 'Jump to URL' : 'Private Search'}
                      </span>
                    </span>
                  </div>

                  {suggestions.map((suggestion, index) => (
                    <div 
                      key={index}
                      className="px-6 py-4 hover:bg-white/5 cursor-pointer flex items-center gap-5 transition-colors border-b border-white/5 last:border-0"
                      onClick={() => {
                        setSearchQuery(suggestion.phrase);
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
          {activeDApp ? (
            <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="glass-card mb-8 p-4 rounded-3xl flex items-center justify-between border-indigo-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold tracking-wide text-white/60">SECURE CONNECTION ESTABLISHED via PROXY CHANNEL</span>
                </div>
                <button 
                  onClick={() => window.open(activeDApp.url, '_blank')}
                  className="group py-2 px-4 rounded-2xl bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/30 text-indigo-400 hover:text-white transition-all duration-300 font-bold text-sm flex items-center gap-2"
                >
                  Bypass Browser <ExternalLink size={16} />
                </button>
              </div>

              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => setActiveDApp(null)} 
                    className="w-14 h-14 glass hover:bg-white/10 rounded-2xl transition-all flex items-center justify-center group border-white/10"
                  >
                    <ChevronRight size={32} className="rotate-180 group-hover:-translate-x-1 transition-transform text-white/40 group-hover:text-white" />
                  </button>
                  <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-4xl shadow-2xl animate-float">
                    {activeDApp.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black tracking-tight mb-1">{activeDApp.name}</h2>
                    <p className="text-base text-white/40 font-medium tracking-wide">{activeDApp.url}</p>
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
                    src={`${API_URL}/search/proxy?url=${encodeURIComponent(activeDApp.url)}`} 
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms" 
                    className="w-full h-full border-none bg-white opacity-95" 
                    title={`${activeDApp.name} (Proxied)`} 
                    onLoad={() => setIframeStatus('loaded')}
                  />
                ) : (
                  <iframe 
                    src={activeDApp.url} 
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms" 
                    className="w-full h-full border-none bg-white opacity-95" 
                    title={activeDApp.name} 
                    onLoad={() => setIframeStatus('loaded')}
                  />
                )}
              </div>
            </div>
          ) : activeTab === 'search' ? (
             <section className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-5xl mx-auto pb-20">
               <div className="text-center mb-16">
                  <h1 className="text-5xl font-black mb-4 tracking-tighter uppercase italic opacity-80">SURF RESULTS</h1>
                  <p className="text-white/40 text-lg font-medium tracking-wide">Secure, private indexed results for <span className="text-indigo-400">"{searchQuery}"</span></p>
               </div>
               
               {isSearching ? (
                 <div className="py-32 flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="mt-8 text-white/30 font-bold uppercase tracking-[0.3em]">Querying Networks</p>
                 </div>
               ) : searchError ? (
                 <div className="py-20 text-center glass-card rounded-[3rem] p-12">
                   <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Shield size={40} className="text-red-400" />
                   </div>
                   <p className="text-xl text-white/80 font-bold mb-8 italic">{searchError}</p>
                   <button 
                     onClick={() => executeSearch(searchQuery)}
                     className="px-10 py-4 bg-white/5 hover:bg-indigo-600 rounded-2xl transition-all border border-white/10 font-bold"
                   >
                     Re-Initialize Search
                   </button>
                 </div>
               ) : searchResults.length > 0 ? (
                 <div className="grid grid-cols-1 gap-6">
                   {searchResults.map((result, idx) => (
                      <div 
                         key={idx}
                         onClick={() => {
                           setActiveDApp({ id: `search-${idx}`, name: result.domain, url: result.url, icon: '🌐', category: 'Search' });
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
          ) : activeTab === 'explore' ? (
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
                  { title: 'Hela Network', url: 'https://docs.hela.network', icon: <Globe size={20} className="text-indigo-400"/>, desc: 'Layer 1 Protocol' },
                  { title: 'Top DeFi Projects', url: 'https://defillama.com', icon: <TrendingUp size={20} className="text-emerald-400"/>, desc: 'Yield & Liquidity' },
                  { title: 'NFT Trends', url: 'https://magiceden.io', icon: <Layout size={20} className="text-purple-400"/>, desc: 'Digital Assets' }
                ].map((item, i) => (
                  <div key={i} onClick={() => setActiveDApp({ id: `explore-${i}`, name: item.title, url: item.url, icon: '🌐', category: item.desc })} className="glass-card p-8 rounded-[2.5rem] hover:border-indigo-500/40 transition-all cursor-pointer group">
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
                   <button onClick={() => setActiveTab('dapps')} className="flex items-center gap-3 text-indigo-400 font-black tracking-widest uppercase text-xs hover:text-white transition-colors group">
                     View Full Grid <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {DAPPS.slice(0, 4).map((dapp) => (
                    <div key={dapp.id} onClick={() => setActiveDApp(dapp)} className="flex flex-col items-center text-center group cursor-pointer">
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
          ) : activeTab === 'dapps' ? (
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
                      setActiveDApp(dapp);
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
          ) : activeTab === 'rewards' ? (
             <section className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-6xl mx-auto pb-20">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="text-center lg:text-left">
                    <h1 className="text-6xl font-black mb-4 tracking-tighter uppercase leading-none italic opacity-90">REWARDS ENGINE</h1>
                    <p className="text-white/40 text-xl font-medium tracking-tight">Ecosystem contributions and $HELA yield conversion.</p>
                  </div>
                  <button 
                    onClick={redeemPoints}
                    className="group relative bg-[#00d1ff] hover:bg-[#00b8e6] px-10 py-5 rounded-3xl font-black text-lg transition-all shadow-2xl shadow-[#00d1ff]/20 active:scale-95 flex items-center gap-3 text-black"
                  >
                    <Zap size={24} className="group-hover:animate-bounce" />
                    REDEEM HELA COINS
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                   <div className="lg:col-span-1 space-y-6">
                      <RewardCard icon={<Zap size={20} className="text-yellow-400"/>} label="Points Balance" value={points.toLocaleString()} subValue="1000 pts = 1 Hela" />
                      <RewardCard icon={<CreditCard size={20} className="text-emerald-400"/>} label="Hela Balance" value={`${helaBalance} HELA`} subValue="Verified Chain" />
                   </div>

                   <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="glass-card rounded-[3rem] p-8 border-white/5 bg-white/5 space-y-6">
                         <h3 className="text-xl font-black uppercase tracking-tighter text-indigo-400">Browsing Rewards</h3>
                         <p className="text-sm text-white/40 font-bold">Earn points automatically as you search and navigate the decentralized web.</p>
                         <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest text-center">Active: +1.5x Multiplier Enabled</div>
                      </div>
                      <div className="glass-card rounded-[3rem] p-8 border-white/5 bg-white/5 space-y-6">
                         <h3 className="text-xl font-black uppercase tracking-tighter text-purple-400">Santa Quests</h3>
                         <p className="text-sm text-white/40 font-bold">Complete high-value side quests to boost your neural rank and earn massive point drops.</p>
                         <button className="w-full py-3 glass rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border-white/10">Launch Quests</button>
                      </div>
                      <div className="glass-card rounded-[3rem] p-8 border-white/5 bg-white/5 space-y-6">
                         <h3 className="text-xl font-black uppercase tracking-tighter text-emerald-400">Partner Cashback</h3>
                         <p className="text-sm text-white/40 font-bold">Get $HELA cashback on vouchers and transactions with our verified partner network.</p>
                         <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">No Active Partners in your sector</div>
                      </div>
                      <div className="glass-card rounded-[3rem] p-8 border-white/5 bg-white/5 space-y-6">
                         <h3 className="text-xl font-black uppercase tracking-tighter text-indigo-400">Node Referrals</h3>
                         <p className="text-sm text-white/40 font-bold">Expand the matrix by referring new nodes. Earn 5,000 pts per verified identity sync.</p>
                         <div className="flex gap-2">
                            <input type="text" readOnly value="WEBB.NET/0x7K...2" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black tracking-widest text-indigo-400" />
                            <button className="px-4 py-2 glass rounded-xl text-[10px] font-black uppercase border-white/10 hover:bg-white/10 transition-all">Copy</button>
                         </div>
                      </div>
                   </div>
                </div>
             </section>
          ) : activeTab === 'wtf-zone' ? (
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
          ) : activeTab === 'education' ? (
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
                    onLearnMore={(url) => setActiveDApp({ id: 'edu-web3', name: 'Web3 Guide', url, icon: '🌐', category: 'Education' })}
                  />
                  <EduCard 
                    title="What is Blockchain?" 
                    description="A secure, shared digital ledger that records transactions without needing a bank or middleman, making it transparent and permanent."
                    icon={<Layers size={24} className="text-emerald-400" />}
                    url="https://en.wikipedia.org/wiki/Blockchain"
                    onLearnMore={(url) => setActiveDApp({ id: 'edu-blockchain', name: 'Blockchain Guide', url, icon: '⛓️', category: 'Education' })}
                  />
                  <EduCard 
                    title="What is a Crypto Wallet?" 
                    description="A digital tool that lets you store, send, and receive cryptocurrencies and NFTs. It acts as your ID in the decentralized world."
                    icon={<Wallet size={24} className="text-purple-400" />}
                    url="https://en.wikipedia.org/wiki/Cryptocurrency_wallet"
                    onLearnMore={(url) => setActiveDApp({ id: 'edu-wallet', name: 'Wallet Essentials', url, icon: '👛', category: 'Education' })}
                  />
                  <EduCard 
                    title="What are Smart Contracts?" 
                    description="Automatic programs that execute agreements when specific conditions are met, ensuring trust without needing a lawyer."
                    icon={<Cpu size={24} className="text-yellow-400" />}
                    url="https://en.wikipedia.org/wiki/Smart_contract"
                    onLearnMore={(url) => setActiveDApp({ id: 'edu-sc', name: 'Smart Contract Hub', url, icon: '📜', category: 'Education' })}
                  />
                  <EduCard 
                    title="What are dApps?" 
                    description="Decentralized applications that run on a blockchain instead of a private company server, so they can't be easily shut down or censored."
                    icon={<Zap size={24} className="text-indigo-400" />}
                    url="https://en.wikipedia.org/wiki/Decentralized_application"
                    onLearnMore={(url) => setActiveDApp({ id: 'edu-dapps', name: 'dApp Essentials', url, icon: '🏗️', category: 'Education' })}
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
                    onLearnMore={(url) => setActiveDApp({ id: 'edu-uniswap', name: 'Uniswap', url, icon: '🦄', category: 'dApp' })}
                  />
                  <EduCard 
                    title="OpenSea" 
                    description="The largest marketplace for digital collectibles (NFTs). You can buy, sell, or discover unique digital art and music here."
                    tag="NFT Marketplace"
                    url="https://opensea.io"
                    onLearnMore={(url) => setActiveDApp({ id: 'edu-opensea', name: 'OpenSea', url, icon: '⛵', category: 'dApp' })}
                  />
                  <EduCard 
                    title="Aave" 
                    description="A protocol where you can lend or borrow crypto. It lets users earn interest on their deposits or take out loans instantly."
                    tag="Lending & Borrowing"
                    url="https://app.aave.com"
                    onLearnMore={(url) => setActiveDApp({ id: 'edu-aave', name: 'Aave', url, icon: '👻', category: 'dApp' })}
                  />
                  <EduCard 
                    title="Lens Protocol" 
                    description="A decentralized social network graph. It allows users to own their social profile and content instead of the platform owning it."
                    tag="Decentralized Social"
                    url="https://www.lens.xyz/"
                    onLearnMore={(url) => setActiveDApp({ id: 'edu-lens', name: 'Lens', url, icon: '🌿', category: 'dApp' })}
                  />
                  <EduCard 
                    title="Friend.tech" 
                    description="A social app that lets you buy and sell 'keys' of social profiles, giving you access to private chats and community perks."
                    tag="Social Finance"
                    url="https://www.friend.tech/"
                    onLearnMore={(url) => setActiveDApp({ id: 'edu-ft', name: 'Friend.tech', url, icon: '🤝', category: 'dApp' })}
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
                         onClick={() => setActiveDApp({ id: 'edu-web3', name: 'Web3 Guide', url: 'https://en.wikipedia.org/wiki/Web3', icon: '🌐', category: 'Education' })}
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
          ) : activeTab === 'security' ? (
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
                    onLearnMore={(url) => setActiveDApp({ id: 'sec-privacy', name: 'Privacy Protocol', url, icon: '🛡️', category: 'Security' })}
                  />
                  <EduCard 
                    title="Wallet Security" 
                    description="Safely manage connections with MetaMask or WalletConnect. View balances and networks while maintaining 100% sovereignty over your private keys."
                    icon={<Lock size={24} className="text-blue-400" />}
                    tag="Key Protection"
                    url="https://en.wikipedia.org/wiki/Cryptocurrency_wallet#Security"
                    onLearnMore={(url) => setActiveDApp({ id: 'sec-wallet', name: 'Wallet Security', url, icon: '🔐', category: 'Security' })}
                  />
                  <EduCard 
                    title="dApp Safety Check" 
                    description="Every protocol is scanned for known vulnerabilities. Our system provides instant status indicators: Verified, Unknown, or Warning."
                    icon={<Activity size={24} className="text-emerald-400" />}
                    tag="Verification"
                    url="https://en.wikipedia.org/wiki/Decentralized_application"
                    onLearnMore={(url) => setActiveDApp({ id: 'sec-dapps', name: 'dApp Verification', url, icon: '✅', category: 'Security' })}
                  />
                  <EduCard 
                    title="Smart Contract Alerts" 
                    description="Receive instant alerts when a dApp requests wallet or token permissions. Always review the scope of access before approving any transaction."
                    icon={<AlertTriangle size={24} className="text-yellow-400" />}
                    tag="Guardianship"
                    url="https://en.wikipedia.org/wiki/Smart_contract"
                    onLearnMore={(url) => setActiveDApp({ id: 'sec-sc', name: 'Contract Alerts', url, icon: '📜', category: 'Security' })}
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
          ) : activeTab === 'settings' ? (
            <section className="animate-in fade-in slide-in-from-bottom-10 duration-700">
               <div className="flex items-center justify-between mb-16">
                  <div>
                    <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none">ACCOUNT MATRIX</h1>
                    <p className="text-white/40 text-xl font-medium tracking-tight mt-2">Managing your neural presence across the net.</p>
                  </div>
                  <User size={48} className="text-white/10" />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="md:col-span-1 space-y-10">
                     <div className="glass-card rounded-[3rem] p-8 text-center relative overflow-hidden group">
                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl relative z-10">
                           {userProfile.avatar ? (
                             <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover rounded-[2.5rem]" />
                           ) : (
                             <User size={40} className="text-white" />
                           )}
                        </div>
                        <h3 className="text-2xl font-black tracking-tight mb-2 uppercase">{userProfile.name}</h3>
                        <p className="text-xs text-indigo-400 font-bold tracking-[0.2em] uppercase">{userProfile.bio}</p>
                        <button 
                          onClick={() => setIsEditingProfile(!isEditingProfile)}
                          className="mt-8 w-full glass py-3 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all border-white/5"
                        >
                           {isEditingProfile ? 'CANCEL EDIT' : 'EDIT PROFILE'}
                        </button>
                     </div>

                     <div className="glass-card rounded-[3rem] p-8 border-red-500/5 hover:border-red-500/20 transition-all">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-red-400 mb-6 flex items-center gap-2">
                          <Shield size={14} /> Danger Zone
                        </h4>
                        <button 
                          onClick={() => {
                            if(confirm('PURGE ALL DATA? This cannot be undone.')) {
                               localStorage.clear();
                               window.location.reload();
                            }
                          }}
                          className="w-full py-4 text-xs font-black uppercase tracking-[0.3em] text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-2xl border border-white/5 transition-all text-center"
                        >
                           WIPE MATRIX CACHE
                        </button>
                     </div>
                  </div>

                  <div className="md:col-span-2 space-y-10">
                     {isEditingProfile ? (
                       <div className="glass-card rounded-[3.5rem] p-10 border-indigo-500/20 space-y-8 animate-in zoom-in duration-300">
                          <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-indigo-400">Update Identity</h3>
                          <div className="space-y-6">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 px-1">Network Alias</label>
                                <input 
                                  type="text" 
                                  value={userProfile.name}
                                  onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-black uppercase text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 px-1">Neural Bio</label>
                                <input 
                                  type="text" 
                                  value={userProfile.bio}
                                  onChange={(e) => setUserProfile({...userProfile, bio: e.target.value})}
                                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-black uppercase text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 px-1">Avatar Sequence URL</label>
                                <input 
                                  type="text" 
                                  value={userProfile.avatar}
                                  onChange={(e) => setUserProfile({...userProfile, avatar: e.target.value})}
                                  placeholder="https://..."
                                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                                />
                             </div>
                             <button 
                               onClick={() => setIsEditingProfile(false)}
                               className="w-full bg-indigo-600 py-5 rounded-2xl font-black uppercase text-lg transition-all hover:bg-indigo-500 active:scale-95 shadow-xl shadow-indigo-600/30"
                             >
                                SAVE CHANGES
                             </button>
                          </div>
                       </div>
                     ) : (
                       <div className="space-y-10">
                          <div className="glass-card rounded-[3.5rem] p-10 border-white/5">
                             <div className="flex items-center justify-between mb-10">
                                <h3 className="text-2xl font-black uppercase tracking-tight">Active Accounts</h3>
                                <button 
                                   onClick={async () => {
                                     try {
                                       const provider = new ethers.BrowserProvider(window.ethereum);
                                       const signer = await provider.getSigner();
                                       const addr = await signer.getAddress();
                                       if(accounts.find(a => a.address === addr)) return alert('Identity already synchronized in Matrix.');
                                       setAccounts([...accounts, { id: Date.now(), name: 'Sub-Core ' + (accounts.length + 1), address: addr, active: false }]);
                                     } catch(e) {
                                       alert('MetaMask authentication failed.');
                                     }
                                   }}
                                  className="flex items-center gap-2 text-indigo-400 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors"
                                >
                                    <UserPlus size={16} /> SYNC NEW IDENTITY
                                </button>
                             </div>
                             <div className="space-y-4">
                                 {accounts.map((acc) => (
                                  <div key={acc.id} className={`flex items-center justify-between p-6 rounded-[2rem] border transition-all ${acc.active ? 'bg-indigo-600/10 border-indigo-500/40' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
                                     <div className="flex items-center gap-4">
                                        <div className={`w-3 h-3 rounded-full ${acc.active ? 'bg-indigo-400 shadow-glow' : 'bg-white/10'}`}></div>
                                        <div>
                                           <div className="font-black uppercase tracking-tight text-white mb-1">{acc.name}</div>
                                           <div className="text-[10px] font-black uppercase text-white/20 tracking-widest">UID: {acc.id.toString().slice(-4)}</div>
                                        </div>
                                     </div>
                                     <div className="flex items-center gap-3">
                                        {!acc.active && (
                                           <button 
                                             onClick={() => {
                                               setAccounts(accounts.map(a => ({...a, active: a.id === acc.id})));
                                               setWalletAddress(acc.address);
                                               setIsWalletGateOpen(false);
                                               alert(`Switched to Core: ${acc.name}`);
                                             }}
                                             className="px-4 py-2 glass rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border-white/10"
                                           >
                                             Switch
                                           </button>
                                        )}
                                        <button 
                                          onClick={() => {
                                            if(accounts.length > 1) {
                                              setAccounts(accounts.filter(a => a.id !== acc.id));
                                            } else {
                                              alert('Deployment must have at least one active nucleus.');
                                            }
                                          }}
                                          className="w-10 h-10 flex items-center justify-center text-white/20 hover:text-red-400 transition-colors"
                                        >
                                           <Trash2 size={18} />
                                        </button>
                                     </div>
                                  </div>
                                ))}
                             </div>
                          </div>

                          <div className="glass-card rounded-[3rem] p-10 bg-gradient-to-br from-indigo-600/20 to-transparent border-indigo-500/10">
                             <div className="flex items-center gap-6">
                                <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-indigo-400">
                                   <Layers size={32} />
                                </div>
                                <div className="flex-1">
                                   <h3 className="text-xl font-black uppercase tracking-tight mb-1">Matrix Status: Elite</h3>
                                   <p className="text-xs text-white/40 font-bold uppercase tracking-widest">All neural connections established.</p>
                                </div>
                                <div className="text-right">
                                   <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">LIVE UNIT</span>
                                </div>
                             </div>
                          </div>
                       </div>
                     )}
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
      </main>

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
