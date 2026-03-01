import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Target, 
  BrainCircuit, 
  Zap, 
  FileText, 
  ChevronRight,
  AlertTriangle,
  TrendingUp,
  ShieldAlert,
  Loader2,
  X,
  BarChart3,
  Search,
  CheckCircle2,
  Activity,
  Mic,
  MicOff,
  MessageSquare,
  Bot,
  Globe,
  Newspaper,
  ArrowUpRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { cn } from './lib/utils';
import { Deal, AIAnalysisResult } from './types';

// --- Components ---

function CompetitorIntelWidget({ intel }: { intel: NonNullable<AIAnalysisResult['competitorIntel']> }) {
  if (!intel || intel.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-[#1e1e24] to-[#141414] text-white p-6 rounded-xl shadow-xl border border-white/10 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h3 className="text-sm font-bold uppercase tracking-widest text-blue-400 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Live Market Intel
        </h3>
        <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30 animate-pulse">
          LIVE SEARCH
        </span>
      </div>

      <div className="space-y-4 relative z-10">
        {intel.map((item, i) => (
          <div key={i} className="p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Vs. {item.competitorName}
              </span>
              {item.sourceUrl && (
                <a 
                  href={item.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              )}
            </div>
            <p className="text-sm font-medium text-white mb-2 line-clamp-2">
              "{item.recentNews}"
            </p>
            <div className="flex gap-2 items-start mt-3 pt-3 border-t border-white/5">
              <Zap className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-300 italic">
                Strategy: {item.winStrategy}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConnectScreen({ onConnect, onDemo }: { onConnect: () => void, onDemo: () => void }) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const res = await fetch('/api/auth/url');
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (errorData.error === "Missing HUBSPOT_CLIENT_ID") {
          alert("HubSpot Configuration Missing\n\nTo connect a real account, you must configure HUBSPOT_CLIENT_ID and HUBSPOT_CLIENT_SECRET in your environment variables.\n\nPlease use 'Demo Mode' to explore the app without configuration.");
        } else {
          alert("Connection failed: " + (errorData.error || res.statusText));
        }
        setIsConnecting(false);
        return;
      }

      const { url } = await res.json();
      
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      window.open(
        url, 
        'HubSpotAuth', 
        `width=${width},height=${height},left=${left},top=${top}`
      );
    } catch (e) {
      console.error("Failed to get auth url", e);
      alert("Failed to connect. Please try Demo Mode if configuration is incomplete.");
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        onConnect();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onConnect]);

  return (
    <div className="min-h-screen bg-[#E4E3E0] flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-[#141414] text-white p-8 rounded-2xl shadow-2xl relative overflow-hidden"
      >
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5C35] opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

        <div className="flex justify-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-[#FF5C35] rounded-2xl flex items-center justify-center shadow-lg shadow-orange-900/20">
            <BrainCircuit className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl font-light text-center mb-2 tracking-tight">AI Pipeline Coach</h1>
        <p className="text-gray-400 text-center mb-8 text-xs uppercase tracking-widest font-medium">HubSpot Revenue Intelligence</p>
        
        <div className="space-y-4 relative z-10">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
            <h3 className="font-medium text-[#FF5C35] mb-3 text-xs uppercase tracking-wider">System Capabilities</h3>
            <ul className="text-sm text-gray-300 space-y-2.5">
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" /> 
                Real-time pipeline diagnostics
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" /> 
                Deal risk detection & coaching
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]" /> 
                Forecast confidence modeling
              </li>
            </ul>
          </div>

          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full bg-[#FF5C35] hover:bg-[#ff7a5c] text-white font-medium py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20"
          >
            {isConnecting ? <Loader2 className="animate-spin" /> : <Zap className="w-5 h-5" />}
            Connect HubSpot
          </button>
          
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-800"></div>
            <span className="flex-shrink-0 mx-4 text-gray-600 text-xs uppercase">Or</span>
            <div className="flex-grow border-t border-gray-800"></div>
          </div>

          <button
            onClick={onDemo}
            className="w-full bg-white/5 hover:bg-white/10 text-gray-300 font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-white/10 text-sm"
          >
            Launch Demo Mode
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function DealInspector({ deal, risk, onClose }: { deal: Deal, risk?: any, onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Deal Inspection</span>
              {risk && (
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide",
                  risk.severity === 'High' ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                )}>
                  {risk.severity} Risk
                </span>
              )}
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">{deal.properties.dealname}</h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="font-mono font-medium text-gray-900">${deal.properties.amount?.toLocaleString() || '0'}</span>
              <span>•</span>
              <span>{deal.properties.dealstage}</span>
              <span>•</span>
              <span>Last active: {new Date(deal.properties.hs_lastmodifieddate).toLocaleDateString()}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {risk ? (
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-100 rounded-xl p-5">
                <h3 className="text-red-800 font-medium flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  Risk Detected
                </h3>
                <p className="text-red-700 text-sm leading-relaxed">{risk.risk}</p>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                <h3 className="text-blue-800 font-medium flex items-center gap-2 mb-2">
                  <BrainCircuit className="w-4 h-4" />
                  AI Coaching Tip
                </h3>
                <p className="text-blue-700 text-sm leading-relaxed italic">
                  "{risk.coachingTip || "Review recent communications to ensure alignment on value proposition."}"
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-3">Suggested Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-[#FF5C35] hover:bg-orange-50 transition-all text-sm text-gray-700 flex items-center justify-between group">
                    <span>Draft re-engagement email</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#FF5C35]" />
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-[#FF5C35] hover:bg-orange-50 transition-all text-sm text-gray-700 flex items-center justify-between group">
                    <span>Schedule pipeline review with rep</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#FF5C35]" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p>No critical risks detected for this deal.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Helper for Stage Names ---
const STAGE_NAMES: Record<string, string> = {
  'appointmentscheduled': 'Appointment Scheduled',
  'qualifiedtobuy': 'Qualified to Buy',
  'presentationscheduled': 'Presentation Scheduled',
  'decisionmakerbought': 'Decision Maker Bought',
  'contractsent': 'Contract Sent',
  'closedwon': 'Closed Won',
  'closedlost': 'Closed Lost'
};

function VelocityInsight({ analysis }: { analysis: AIAnalysisResult }) {
  if (!analysis.velocityAnalysis) return null;
  
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Deal Velocity & Bottlenecks
        </h3>
      </div>
      <p className="text-sm text-gray-600 mb-6 italic border-l-2 border-[#FF5C35] pl-4">
        "{analysis.velocityAnalysis.insight}"
      </p>
      <div className="space-y-5">
        {analysis.velocityAnalysis.stageBottlenecks.map((item, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-gray-700">{STAGE_NAMES[item.stage] || item.stage}</span>
              <span className={cn(
                "font-mono",
                item.status === 'Critical' ? "text-red-600 font-bold" : 
                item.status === 'Warning' ? "text-orange-500" : "text-gray-500"
              )}>
                {item.avgDays} days avg
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div 
                className={cn("h-full rounded-full transition-all duration-1000", 
                  item.status === 'Critical' ? "bg-red-500" : 
                  item.status === 'Warning' ? "bg-orange-400" : "bg-blue-400"
                )}
                style={{ width: `${Math.min(item.avgDays * 3, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CopilotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<{text: string, type: 'user' | 'ai', time: string}[]>([]);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = true;
        reco.interimResults = true;
        reco.lang = 'en-US';
        
        reco.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          if (finalTranscript) {
             setTranscript(prev => [...prev, {
               text: finalTranscript,
               type: 'user',
               time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
             }]);
             
             // Simulate AI response to keywords
             if (finalTranscript.toLowerCase().includes('risk') || finalTranscript.toLowerCase().includes('forecast')) {
               setTimeout(() => {
                 setTranscript(prev => [...prev, {
                   text: "I've detected a query about pipeline risk. Based on current velocity, Q3 forecast is trending 15% below target.",
                   type: 'ai',
                   time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                 }]);
               }, 1000);
             }
          }
        };

        reco.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };
        
        reco.onend = () => {
          if (isListening) {
            // reco.start(); // Auto-restart if needed, but risky for loops
            setIsListening(false);
          }
        };

        setRecognition(reco);
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#FF5C35] rounded-full shadow-2xl flex items-center justify-center z-40 hover:bg-[#ff7a5c] transition-colors"
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <Bot className="w-8 h-8 text-white" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-8 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-40 flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#FF5C35]" />
                <h3 className="font-bold text-gray-900">Pipeline Copilot</h3>
              </div>
              <div className="flex items-center gap-2">
                {isListening && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50/30">
              {transcript.length === 0 && (
                <div className="text-center text-gray-400 mt-10 text-sm">
                  <p>Start speaking to transcribe audio...</p>
                  <p className="text-xs mt-2">Try saying "Analyze risk" or "Check forecast"</p>
                </div>
              )}
              {transcript.map((msg, i) => (
                <div key={i} className={cn("flex flex-col max-w-[85%]", msg.type === 'user' ? "ml-auto items-end" : "mr-auto items-start")}>
                  <div className={cn(
                    "p-3 rounded-xl text-sm shadow-sm",
                    msg.type === 'user' ? "bg-[#141414] text-white rounded-tr-none" : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
                  )}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100 bg-white">
              <button
                onClick={toggleListening}
                className={cn(
                  "w-full py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all",
                  isListening 
                    ? "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100" 
                    : "bg-[#141414] text-white hover:bg-gray-800"
                )}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    Start Live Transcription
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function PipelineHealthMap({ deals, analysis, onSelectDeal }: { deals: Deal[], analysis: AIAnalysisResult, onSelectDeal: (id: string) => void }) {
  const stages = ['appointmentscheduled', 'qualifiedtobuy', 'presentationscheduled', 'decisionmakerbought', 'contractsent'];
  
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
          <LayoutDashboard className="w-4 h-4" />
          Pipeline Health Map
        </h3>
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider text-gray-400">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> High Risk</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-400" /> Med Risk</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-300" /> Healthy</div>
        </div>
      </div>

      <div className="flex gap-4 min-w-[800px]">
        {stages.map(stage => {
          const stageDeals = deals.filter(d => d.properties.dealstage === stage);
          const totalValue = stageDeals.reduce((sum, d) => sum + Number(d.properties.amount || 0), 0);
          
          return (
            <div key={stage} className="flex-1 min-w-[160px] flex flex-col">
              <div className="mb-3 pb-2 border-b border-gray-100">
                <h4 className="text-xs font-semibold text-gray-700 truncate" title={STAGE_NAMES[stage] || stage}>
                  {STAGE_NAMES[stage] || stage}
                </h4>
                <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                  ${(totalValue / 1000).toFixed(0)}k • {stageDeals.length} deals
                </div>
              </div>
              
              <div className="space-y-2 flex-grow">
                {stageDeals.map(deal => {
                  const risk = analysis.keyRisks.find(r => r.dealId === deal.id);
                  const riskColor = risk?.severity === 'High' ? 'bg-red-500 border-red-600' : 
                                   risk?.severity === 'Medium' ? 'bg-orange-400 border-orange-500' : 
                                   'bg-white border-gray-200 hover:border-gray-300';
                  
                  return (
                    <motion.div
                      key={deal.id}
                      layoutId={`deal-${deal.id}`}
                      onClick={() => onSelectDeal(deal.id)}
                      className={cn(
                        "p-2 rounded-lg border text-xs cursor-pointer transition-all hover:shadow-md relative group",
                        risk ? "text-white shadow-sm" : "text-gray-700 bg-gray-50/50"
                      )}
                      style={{
                        backgroundColor: risk?.severity === 'High' ? '#EF4444' : risk?.severity === 'Medium' ? '#FB923C' : '#FFFFFF'
                      }}
                    >
                      <div className="font-medium truncate pr-4">{deal.properties.dealname}</div>
                      <div className={cn("text-[10px] mt-1 font-mono opacity-80", risk ? "text-white" : "text-gray-500")}>
                        ${Number(deal.properties.amount).toLocaleString()}
                      </div>
                      
                      {risk && (
                        <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      )}
                    </motion.div>
                  );
                })}
                {stageDeals.length === 0 && (
                  <div className="h-24 rounded-lg border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-300 text-xs">
                    Empty
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Dashboard({ deals, analysis }: { deals: Deal[], analysis: AIAnalysisResult | null }) {
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#FF5C35]" />
        <p className="uppercase tracking-widest text-xs font-medium">Analyzing Pipeline Data...</p>
      </div>
    );
  }

  // Prepare chart data
  const stageData = deals.reduce((acc: any, deal) => {
    const stage = STAGE_NAMES[deal.properties.dealstage] || deal.properties.dealstage || 'Unknown';
    acc[stage] = (acc[stage] || 0) + Number(deal.properties.amount || 0);
    return acc;
  }, {});
  
  const chartData = Object.keys(stageData).map(key => ({
    name: key,
    value: stageData[key]
  }));

  const selectedDeal = selectedDealId ? deals.find(d => d.id === selectedDealId) : null;
  const selectedRisk = selectedDealId ? analysis.keyRisks.find(r => r.dealId === selectedDealId) : null;

  return (
    <div className="space-y-6 pb-12">
      <AnimatePresence>
        {selectedDeal && (
          <DealInspector 
            deal={selectedDeal} 
            risk={selectedRisk} 
            onClose={() => setSelectedDealId(null)} 
          />
        )}
      </AnimatePresence>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Pipeline Health</h3>
            <div className={cn("p-1.5 rounded-lg", analysis.pipelineHealthScore > 70 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600")}>
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-mono font-medium text-gray-900">{analysis.pipelineHealthScore}</span>
            <span className="text-sm text-gray-400">/ 100</span>
          </div>
          <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className={cn("h-full rounded-full", analysis.pipelineHealthScore > 70 ? "bg-green-500" : "bg-red-500")} 
                style={{ width: `${analysis.pipelineHealthScore}%` }} 
              />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Forecast Confidence</h3>
            <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-mono font-medium text-gray-900">{analysis.forecastConfidence}</div>
          <div className="mt-3 text-xs text-gray-500">AI-adjusted probability model</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">At-Risk Revenue</h3>
            <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-mono font-medium text-gray-900">
            {analysis.keyRisks.length} <span className="text-lg text-gray-400 font-sans">Deals</span>
          </div>
          <div className="mt-3 text-xs text-gray-500">Requiring immediate attention</div>
        </motion.div>
      </div>

      {/* Pipeline Health Map - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <PipelineHealthMap deals={deals} analysis={analysis} onSelectDeal={setSelectedDealId} />
      </motion.div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Strategy & Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Revenue Distribution
              </h3>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#6B7280'}} interval={0} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#6B7280'}} tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip 
                    cursor={{fill: '#F3F4F6'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#141414' : '#FF5C35'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Strategy Brief */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg">
                <FileText className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="font-serif italic text-xl text-gray-900">Executive Strategy Brief</h3>
            </div>
            
            <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
              {analysis.executiveSummary
                ? analysis.executiveSummary.split('\n').map((line, i) => (
                    <p key={i} className="mb-3">{line}</p>
                  ))
                : <p className="text-gray-400 italic">No executive summary available.</p>
              }
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Recommended Actions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(analysis.recommendedActions ?? []).length > 0
                  ? (analysis.recommendedActions ?? []).map((action, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group border border-transparent hover:border-gray-200">
                      <div className="mt-0.5 w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-[#FF5C35] group-hover:bg-[#FF5C35] transition-colors shrink-0">
                        <ChevronRight className="w-3 h-3 text-transparent group-hover:text-white" />
                      </div>
                      <span className="text-sm text-gray-700">{action}</span>
                    </div>
                  ))
                  : <p className="text-gray-400 italic col-span-2">No recommended actions available.</p>
                }
              </div>
            </div>
          </motion.div>

          {/* Velocity Insight */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <VelocityInsight analysis={analysis} />
          </motion.div>

          {/* Competitor Intel Widget */}
          {analysis.competitorIntel && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <CompetitorIntelWidget intel={analysis.competitorIntel} />
            </motion.div>
          )}
        </div>

        {/* Right Column: Risk Feed */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#141414] text-white p-6 rounded-xl shadow-xl flex flex-col h-full"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#FF5C35]" />
              Risk Detection Feed
            </h3>
            <span className="bg-white/10 text-white/60 px-2 py-0.5 rounded text-[10px] font-mono">
              {analysis.keyRisks.length} ALERTS
            </span>
          </div>
          
          <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-grow">
            {analysis.keyRisks.map((risk, i) => {
              const deal = deals.find(d => d.id === risk.dealId);
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  onClick={() => setSelectedDealId(risk.dealId)}
                  className="p-4 bg-white/5 rounded-lg border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={cn(
                      "font-mono text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider",
                      risk.severity === 'High' ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400"
                    )}>
                      {risk.severity} RISK
                    </span>
                    <span className="text-xs text-gray-500 font-mono">{deal?.properties.amount ? `$${Number(deal.properties.amount).toLocaleString()}` : 'N/A'}</span>
                  </div>
                  <h4 className="font-medium text-sm mb-1 text-gray-200 group-hover:text-white transition-colors line-clamp-1">{deal?.properties.dealname || 'Unknown Deal'}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{risk.risk}</p>
                  
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-[10px] text-gray-500 group-hover:text-[#FF5C35] transition-colors">
                    <BrainCircuit className="w-3 h-3" />
                    <span>View AI Coaching Tip</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  // Check auth status on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/hubspot/me');
        if (res.ok) {
          setIsAuthenticated(true);
          fetchData(false);
        } else {
          setLoading(false);
        }
      } catch (e) {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const fetchData = async (useDemo = false) => {
    setLoading(true);
    try {
      let dealsData;
      if (useDemo) {
        const res = await fetch('/api/demo/data');
        dealsData = await res.json();
      } else {
        const dealsRes = await fetch('/api/hubspot/deals');
        dealsData = await dealsRes.json();
      }
      
      setDeals(dealsData);

      // OPTIMIZATION: For demo mode, show dashboard immediately
      if (useDemo) {
        setLoading(false);
      }

      // Trigger AI Analysis
      const analysisRes = await fetch('/api/ai/analyze-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deals: dealsData })
      });
      const analysisData = await analysisRes.json();
      
      // Trigger Competitor Analysis (Parallel)
      fetch('/api/ai/analyze-competitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deals: dealsData })
      })
      .then(res => res.json())
      .then(data => {
        if (data.competitorIntel) {
          setAnalysis(prev => prev ? ({ ...prev, competitorIntel: data.competitorIntel }) : null);
        }
      })
      .catch(err => console.error("Competitor analysis failed", err));

      setAnalysis(analysisData);
    } catch (e) {
      console.error("Data fetch error", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    setIsDemo(true);
    setIsAuthenticated(true);
    fetchData(true);
  };

  if (!isAuthenticated) {
    return <ConnectScreen onConnect={() => { setIsAuthenticated(true); fetchData(false); }} onDemo={handleDemo} />;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#141414] font-sans selection:bg-[#FF5C35] selection:text-white">
      {/* Sidebar / Nav */}
      <nav className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 p-6 hidden md:flex flex-col z-20">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 bg-[#FF5C35] rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold tracking-tight text-gray-900">Pipeline Coach</span>
        </div>

        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-[#141414] text-white rounded-lg text-sm font-medium shadow-md">
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-lg text-sm font-medium transition-colors">
            <Target className="w-4 h-4" />
            Forecasting
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-lg text-sm font-medium transition-colors">
            <Zap className="w-4 h-4" />
            Coaching
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-lg text-sm font-medium transition-colors">
            <FileText className="w-4 h-4" />
            Strategy Brief
          </button>
        </div>

        <div className="mt-auto space-y-4">
          {isDemo && (
             <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-700">
               <span className="font-bold block mb-1">DEMO MODE</span>
               You are viewing simulated data. Connect HubSpot for real insights.
             </div>
          )}
          
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">System Status</div>
            <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              AI Engine Online
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="md:ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Revenue Intelligence</h1>
            <p className="text-sm text-gray-500 mt-1">Real-time diagnostics & coaching</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search deals..." 
                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5C35]/20 w-64"
              />
            </div>
            <div className="h-8 w-[1px] bg-gray-200 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-medium text-gray-900">Owen M</div>
                <div className="text-[10px] text-gray-500">RevOps Director</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-white shadow-sm" />
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
             <div className="relative">
               <div className="w-16 h-16 border-4 border-gray-200 border-t-[#FF5C35] rounded-full animate-spin" />
               <div className="absolute inset-0 flex items-center justify-center">
                 <BrainCircuit className="w-6 h-6 text-gray-400" />
               </div>
             </div>
             <p className="text-gray-500 font-mono text-sm mt-6 animate-pulse">INGESTING PIPELINE DATA...</p>
          </div>
        ) : (
          <>
            <Dashboard deals={deals} analysis={analysis} />
            <CopilotWidget />
          </>
        )}
      </main>
    </div>
  );
}
