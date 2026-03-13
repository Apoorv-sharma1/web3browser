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
  CreditCard
} from 'lucide-react';

// Mock dApps Data
const DAPPS = [
  { id: 1, name: 'Uniswap', url: 'https://app.uniswap.org', icon: '🦄', category: 'DeFi', description: 'Swap tokens easily' },
  { id: 2, name: 'OpenSea', url: 'https://opensea.io', icon: '⛵', category: 'NFT', description: 'Discover & collect NFTs' },
  { id: 3, name: 'Aave', url: 'https://app.aave.com', icon: '👻', category: 'Lending', description: 'Earn interest on deposits' },
  { id: 4, name: 'Compound', url: 'https://compound.finance', icon: '🏦', category: 'Lending', description: 'Algorithmic money markets' },
  { id: 5, name: 'Hela Bridge', url: 'https://hela.network', icon: '🌉', category: 'Bridge', description: 'Move assets across chains' },
  { id: 6, name: 'Magic Eden', url: 'https://magiceden.io', icon: '🪄', category: 'NFT', description: 'Cross-chain NFT marketplace' },
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [activeTab, setActiveTab] = useState('explore');
  const [activeDApp, setActiveDApp] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('0.00');
  const [points, setPoints] = useState(0);
  const [dappList, setDappList] = useState(DAPPS);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch dApps from backend on load
  useEffect(() => {
    fetch(`${API_URL}/dapps/`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDappList(data);
      })
      .catch(err => console.error('Failed to fetch dApps', err));
  }, []);

  const connectWallet = async () => {
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

        // Fetch user rewards
        fetch(`${API_URL}/rewards/${address}`)
          .then(res => res.json())
          .then(data => {
            const totalPoints = data.reduce((acc, curr) => acc + curr.points, 0);
            setPoints(totalPoints);
          });

      } catch (err) {
        console.error('Wallet connection failed', err);
      }
    } else {
      alert('MetaMask not detected');
    }
  };

  const claimReward = async () => {
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
    <div className="flex w-full h-screen bg-[#0c0e12] text-white">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 border-r border-white/5 flex flex-col items-center lg:items-stretch py-6 px-4 bg-[#0a0c0f]">
        <div className="flex items-center gap-3 px-2 mb-10 overflow-hidden">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
            <Globe size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold hidden lg:block tracking-tight text-white/90">Web3Browser</span>
        </div>

        <nav className="flex-1 space-y-2 w-full">
          <NavItem icon={<Store size={22}/>} label="Explore" active={activeTab === 'explore' && !activeDApp} onClick={() => {setActiveTab('explore'); setActiveDApp(null)}} />
          <NavItem icon={<Trophy size={22}/>} label="Rewards" active={activeTab === 'rewards'} onClick={() => setActiveTab('rewards')} />
          <NavItem icon={<BookOpen size={22}/>} label="Education" active={activeTab === 'education'} onClick={() => setActiveTab('education')} />
          <NavItem icon={<Shield size={22}/>} label="Security" active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 w-full">
          <NavItem icon={<Settings size={22}/>} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-br from-[#0c0e12] to-[#161a1f]">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0c0e12]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    const query = searchQuery.trim();
                    // Basic URL detection
                    if (/^(http:\/\/|https:\/\/)/i.test(query) || /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/.*)?$/.test(query)) {
                      const url = query.startsWith('http') ? query : `https://${query}`;
                      setActiveDApp({ id: 'custom', name: url, url: url, icon: '🌐', category: 'Web' });
                      setActiveTab('explore');
                    } else {
                      // Perform Search
                      setActiveDApp(null);
                      setActiveTab('search');
                      setIsSearching(true);
                      try {
                        const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
                        if(res.ok) {
                          const data = await res.json();
                          setSearchResults(data);
                        } else {
                          setSearchResults([]);
                        }
                      } catch (err) {
                        console.error('Search failed', err);
                        setSearchResults([]);
                      } finally {
                        setIsSearching(false);
                      }
                    }
                  }
                }}
                placeholder="Search the web or enter URL..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-light"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col items-end mr-2">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Activity Points</span>
              <span className="text-sm font-semibold text-indigo-400">{points.toLocaleString()} pts</span>
            </div>
            
            <button 
              onClick={connectWallet}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 font-medium whitespace-nowrap"
            >
              <Wallet size={18} />
              <span>{walletAddress ? truncateAddress(walletAddress) : 'Connect Wallet'}</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeDApp ? (
            <div className="w-full h-full flex flex-col">
              <div className="bg-white/5 border border-white/10 text-white/70 px-4 py-3 rounded-2xl mb-4 flex items-center justify-between shadow-sm">
                <span className="text-sm font-light">If the site refuses to connect, it blocks embedded viewing for security.</span>
                <button 
                  onClick={() => window.open(activeDApp.url, '_blank')}
                  className="text-xs bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/40 px-3 py-1.5 rounded-xl font-medium transition-colors flex items-center gap-1.5"
                >
                  Open Externally <ExternalLink size={14} />
                </button>
              </div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <button onClick={() => setActiveDApp(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <ChevronRight size={24} className="rotate-180" />
                  </button>
                  <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-2xl">
                    {activeDApp.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{activeDApp.name}</h2>
                    <p className="text-sm text-white/50">{activeDApp.url}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => window.open(activeDApp.url, '_blank')}
                    className="p-2.5 glass shadow-xl hover:bg-white/10 rounded-xl transition-all text-white/70"
                  >
                    <ExternalLink size={20} />
                  </button>
                </div>
              </div>
              <div className="flex-1 glass rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative">
                <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none"></div>
                <iframe src={activeDApp.url} sandbox="allow-scripts allow-same-origin allow-popups allow-forms" className="w-full h-full border-none bg-white" title={activeDApp.name} />
              </div>
            </div>
          ) : activeTab === 'search' ? (
             <section className="space-y-8 animate-in fade-in max-w-4xl mx-auto">
               <div>
                  <h1 className="text-3xl font-bold mb-2 tracking-tight">Search Results</h1>
                  <p className="text-white/50 font-light">Showing private search results for "{searchQuery}"</p>
               </div>
               
               {isSearching ? (
                 <div className="py-20 flex justify-center">
                    <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                 </div>
               ) : searchResults.length > 0 ? (
                 <div className="space-y-4">
                   {searchResults.map((result, idx) => (
                     <div 
                        key={idx}
                        onClick={() => {
                          setActiveDApp({ id: `search-${idx}`, name: result.domain, url: result.url, icon: '🌐', category: 'Search' });
                        }}
                        className="group bg-white/5 hover:bg-white/10 border border-white/5 p-6 rounded-3xl cursor-pointer transition-all hover:border-indigo-500/30"
                     >
                       <div className="flex items-center gap-2 mb-2">
                         <div className="w-6 h-6 bg-indigo-600/20 rounded-full flex items-center justify-center">
                           <Globe size={12} className="text-indigo-400" />
                         </div>
                         <span className="text-sm text-white/50">{result.domain}</span>
                       </div>
                       <h3 className="text-xl font-bold text-indigo-400 group-hover:text-indigo-300 mb-2">{result.title}</h3>
                       <p className="text-sm text-white/70 leading-relaxed font-light" dangerouslySetInnerHTML={{ __html: result.description }} />
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="py-20 text-center text-white/50">
                   <p>No results found. Try a different search term.</p>
                 </div>
               )}
             </section>
          ) : activeTab === 'explore' ? (
            <section className="space-y-12">
              <div className="relative">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
                
                <h1 className="text-4xl font-bold mb-2 tracking-tight">Explore the <span className="gradient-text">Web3 Ecosystem</span></h1>
                <p className="text-white/50 text-lg font-light">Securely browse and interact with premium dApps from one integrated interface.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dappList.map((dapp) => (
                  <div 
                    key={dapp.id} 
                    className="group glass rounded-3xl p-6 border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/10 relative overflow-hidden"
                    onClick={() => {
                      setActiveDApp(dapp);
                      if (walletAddress) {
                        // Record interaction
                        fetch(`${API_URL}/rewards/claim`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ wallet_address: walletAddress })
                        }).then(res => res.json()).then(data => setPoints(p => p + (data.points || 0)));
                      }
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-indigo-500/0 group-hover:to-indigo-500/5 transition-all"></div>
                    <div className="flex items-start justify-between mb-6 relative">
                      <div className="w-16 h-16 bg-white/5 group-hover:bg-indigo-600/20 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-all duration-500">
                        {dapp.icon || '🌐'}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-lg">
                        {dapp.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-300 transition-colors uppercase tracking-tight">{dapp.name}</h3>
                    <p className="text-sm text-white/50 leading-relaxed font-light">{dapp.description}</p>
                    <div className="mt-8 flex items-center text-sm font-bold text-white/30 group-hover:text-indigo-400 transition-colors">
                      Launch dApp <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : activeTab === 'rewards' ? (
             <section className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-4xl font-bold mb-2 tracking-tight">Rewards <span className="gradient-text">Dashboard</span></h1>
                    <p className="text-white/50 font-light">Track your contributions and claim your Hela tokens.</p>
                  </div>
                  <button 
                    onClick={claimReward}
                    className="bg-indigo-600 px-6 py-3 rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/30"
                  >
                    Claim All Rewards
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="col-span-2 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <RewardCard icon={<Zap className="text-yellow-400"/>} label="Total Points" value={points.toLocaleString()} subValue="+120 this week" />
                      <RewardCard icon={<CreditCard className="text-emerald-400"/>} label="Token Balance" value={`${balance} HELA`} subValue="$0.00 USD" />
                    </div>

                    <div className="glass rounded-3xl p-8 border border-white/10">
                      <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
                      <div className="space-y-6">
                        <ActivityItem label="Uniswap Interaction" date="2 hours ago" points={"+50 pts"} />
                        <ActivityItem label="OpenSea Browsing" date="5 hours ago" points={"+20 pts"} />
                        <ActivityItem label="Daily Login Bonus" date="Today" points={"+100 pts"} />
                        <ActivityItem label="Educational Video" date="Yesterday" points={"+200 pts"} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                      <h3 className="text-xl font-bold mb-2 relative">Pro Account</h3>
                      <p className="text-white/80 text-sm mb-6 relative">Unlock premium dApps and 2x points multiplier.</p>
                      <button className="w-full bg-white text-indigo-600 font-bold py-3 rounded-2xl hover:bg-opacity-90 transition-all shadow-xl">
                        Upgrade Now
                      </button>
                    </div>

                    <div className="glass rounded-3xl p-8 border border-white/10">
                      <h3 className="text-xl font-bold mb-4">Refer & Earn</h3>
                      <p className="text-sm text-white/50 mb-6">Invite friends and get 500 points for each signup.</p>
                      <div className="flex gap-2">
                        <input type="text" readOnly value="hela.network/ref/0x7k...2" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none" />
                        <button className="bg-white/10 p-2 rounded-xl hover:bg-white/20 transition-colors">
                           <ExternalLink size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
             </section>
          ) : (
             <div className="flex flex-col items-center justify-center py-20 opacity-50">
                <Globe size={64} className="mb-6 text-white/20" />
                <h3 className="text-2xl font-bold mb-2">Section Under Development</h3>
                <p className="font-light">We're building something amazing. Check back soon!</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
        active 
          ? 'bg-indigo-600/10 text-indigo-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]' 
          : 'text-white/40 hover:text-white hover:bg-white/5'
      }`}
    >
      <span className={`${active ? 'text-indigo-400' : 'group-hover:text-white'} transition-colors`}>{icon}</span>
      <span className="font-medium hidden lg:block tracking-wide">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.8)]"></div>}
    </button>
  );
}

function RewardCard({ icon, label, value, subValue }) {
  return (
    <div className="glass border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 glass rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <span className="text-sm text-white/40 font-medium uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-2xl font-bold mb-1 tracking-tight">{value}</div>
      <div className="text-xs text-indigo-400/80 font-bold">{subValue}</div>
    </div>
  )
}

function ActivityItem({ label, date, points }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-4">
        <div className="w-2 h-2 bg-indigo-500/50 rounded-full group-hover:scale-150 transition-transform"></div>
        <div>
          <div className="font-bold text-white/90 group-hover:text-white transition-colors uppercase tracking-tight text-sm">{label}</div>
          <div className="text-xs text-white/30">{date}</div>
        </div>
      </div>
      <div className="text-sm font-bold text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-lg">{points}</div>
    </div>
  )
}

export default App;
