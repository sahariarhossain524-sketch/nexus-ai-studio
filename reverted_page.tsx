"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Send, Sparkles, Loader2, Download, LayoutTemplate, Share2, 
  RefreshCw, PenTool, Layers, Mic, Globe, ArrowLeft, MoreHorizontal,
  Settings, Trash2, Copy, Bookmark, Image as ImageIcon, 
  Palette, Type, FileImage, Undo2, Redo2, History, Wand2, Crop, Frame,
  CheckCircle2, PlayCircle, FolderOpen, MousePointer2
} from "lucide-react";
import { generateGraphicDesign } from "@/server/actions/chat.actions";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

// --- Types ---
interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
}

interface DesignLayout {
  headline: string;
  subheadline: string;
  cta: string;
  brandName: string;
  themeColor: string;
}

interface Design {
  id: string;
  imageUrl: string;
  layout?: DesignLayout;
  format: string;
  prompt: string;
}

// --- Constants ---
const PIPELINE_STEPS = [
  { name: "Marketing Strategist", icon: "✓", activeColor: "text-emerald-500" },
  { name: "Copywriter", icon: "✓", activeColor: "text-emerald-500" },
  { name: "Art Director", icon: "⚡", activeColor: "text-amber-500" },
  { name: "Graphic Designer", icon: "⚡", activeColor: "text-blue-500" },
  { name: "Quality Reviewer", icon: "⏳", activeColor: "text-purple-500" },
  { name: "Export Engine", icon: "✓", activeColor: "text-emerald-500" }
];

export default function WorkspaceRedesign() {
  // State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      text: "Welcome back to Nexus Studio. I'm your AI Director. Ready to generate high-converting assets?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  
  const [currentDesign, setCurrentDesign] = useState<Design | null>(null);
  const [designHistory, setDesignHistory] = useState<Design[]>([]);
  
  // UI State
  const [activeTab, setActiveTab] = useState("workspace"); // overview, workspace, documents
  const [rightPanelTab, setRightPanelTab] = useState<"edit" | "layers" | "export" | "closed">("closed");
  const [isCanvasActive, setIsCanvasActive] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  // Simulated AI Pipeline Animation
  useEffect(() => {
    if (isGenerating) {
      setGenerationStep(0);
      const interval = setInterval(() => {
        setGenerationStep(prev => {
          if (prev < PIPELINE_STEPS.length - 1) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const handleSend = async (textOverrides?: string) => {
    const textToSend = textOverrides || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsGenerating(true);

    const currentHistory = [...messages, userMsg].map(m => ({
      role: m.role,
      text: m.text,
    }));

    try {
      const result = await generateGraphicDesign(currentHistory);

      if (result.success && result.imagePrompt) {
        const promptEncoded = encodeURIComponent(result.imagePrompt + ", award-winning masterpiece, hyper-realistic, 8k resolution, cinematic lighting");
        
        const newDesign: Design = {
          id: Date.now().toString(),
          imageUrl: `https://image.pollinations.ai/prompt/${promptEncoded}?width=1080&height=1350&nologo=true&enhance=true`,
          layout: {
            headline: result.headline || "Unleash Potential",
            subheadline: result.subheadline || "Experience the next generation.",
            cta: "Discover Now",
            brandName: "NEXUS",
            themeColor: "#10B981" // Primary green
          },
          format: "Instagram Post",
          prompt: result.imagePrompt
        };

        setCurrentDesign(newDesign);
        setDesignHistory(prev => [newDesign, ...prev]);
        
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "ai",
          text: `I've created this design based on your brief. It's fully editable on the right.`
        }]);
      } else {
        toast.error("Pipeline failed to generate assets.");
      }
    } catch (error) {
      toast.error("Connection to AI Pipeline lost.");
    } finally {
      setIsGenerating(false);
    }
  };

  const updateDesignLayout = (key: keyof DesignLayout, value: string) => {
    if (!currentDesign || !currentDesign.layout) return;
    setCurrentDesign({
      ...currentDesign,
      layout: {
        ...currentDesign.layout,
        [key]: value
      }
    });
  };

  // --- RENDERING HELPERS ---
  
  const renderHeader = () => (
    <header className="h-14 border-b border-[#DCFCE7] bg-white/80 backdrop-blur-md flex items-center justify-between px-4 z-50 shrink-0">
      <div className="flex items-center gap-4 w-1/3">
        <Link href="/projects/quickstart/workspace">
          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800 hover:bg-slate-100/50">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-center gap-1 bg-slate-100/50 p-1 rounded-lg border border-slate-200/50 shadow-inner">
        {["Overview", "Workspace", "Documents"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
              activeTab === tab.toLowerCase() 
                ? "bg-white text-emerald-600 shadow-sm border border-slate-200/50" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            {tab === "Workspace" ? "AI Workspace" : tab}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 w-1/3 justify-end">
        <Button variant="ghost" size="sm" className="text-slate-500">
          <PlayCircle className="w-4 h-4 mr-2" /> Resume Session
        </Button>
        <Button size="sm" className="bg-[#10B981] hover:bg-[#059669] text-white rounded-lg shadow-sm shadow-emerald-500/20 transition-all" onClick={() => setRightPanelTab("export")}>
          <Download className="w-4 h-4 mr-2" /> Export Assets
        </Button>
      </div>
    </header>
  );

  const renderLeftPanel = () => (
    <div className="w-[340px] flex flex-col border-r border-[#DCFCE7] bg-white/60 backdrop-blur-xl z-20 shrink-0">
      {/* AI Director Card */}
      <div className="p-4 border-b border-[#DCFCE7]">
        <div className="bg-gradient-to-br from-[#F8FFFC] to-white border border-[#DCFCE7] rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200">
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                Nexus Director <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </h3>
              <p className="text-[11px] font-medium text-slate-500">GPT-4o + Native.builder</p>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 group-hover:text-slate-700 transition-colors">
              <Settings className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
            <span>Conversations: 12</span>
            <button className="text-emerald-600 hover:underline flex items-center" onClick={() => {setMessages([]); setCurrentDesign(null);}}>
              <RefreshCw className="w-3 h-3 mr-1" /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={msg.id} className={cn("group flex gap-3 max-w-[92%]", msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto")}>
            <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm", msg.role === "user" ? "bg-slate-800 text-white" : "bg-emerald-100 text-emerald-700 border border-emerald-200")}>
              {msg.role === "user" ? <span className="text-[10px] font-bold">U</span> : <Sparkles className="w-3.5 h-3.5" />}
            </div>
            <div className={cn("relative p-3 rounded-2xl text-sm leading-relaxed shadow-sm transition-all", msg.role === "user" ? "bg-slate-800 text-white rounded-tr-sm" : "bg-white border border-slate-200/60 rounded-tl-sm text-slate-700")}>
              {msg.text}
              
              {/* Hover Actions */}
              <div className={cn("absolute top-[-10px] flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-slate-200 rounded-md p-0.5 shadow-sm", msg.role === "user" ? "left-0" : "right-0")}>
                <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600" title="Copy"><Copy className="w-3 h-3" /></button>
                <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600" title="Bookmark"><Bookmark className="w-3 h-3" /></button>
                <button className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-500" title="Delete"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          </div>
        ))}
        {isGenerating && (
          <div className="flex gap-3 max-w-[92%] mr-auto">
             <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
             </div>
             <div className="bg-white border border-slate-200/60 rounded-2xl rounded-tl-sm p-4 shadow-sm w-full">
                <div className="flex items-center gap-2 mb-3">
                  <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                  <span className="text-xs font-semibold text-emerald-700 tracking-wide uppercase">AI Pipeline Running</span>
                </div>
                <div className="space-y-2">
                  {PIPELINE_STEPS.map((step, idx) => (
                    <div key={idx} className={cn("flex items-center gap-2 text-xs transition-opacity duration-300", idx === generationStep ? "opacity-100" : idx < generationStep ? "opacity-50" : "opacity-30")}>
                       <span className={cn("w-4 text-center font-bold", idx <= generationStep ? step.activeColor : "text-slate-400")}>
                         {idx < generationStep ? "✓" : idx === generationStep ? "⏳" : "-"}
                       </span>
                       <span className={cn("font-medium", idx === generationStep ? "text-slate-800" : "text-slate-500")}>{step.name}</span>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-[#DCFCE7]">
        <div className="relative group bg-slate-50 border border-slate-200 focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-4 ring-emerald-500/10 rounded-xl transition-all duration-300">
          <div className="flex items-center px-2 pt-2 gap-1">
             <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Upload Brand Kit">
               <ImageIcon className="w-3.5 h-3.5" />
             </Button>
             <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Speechmatics Voice">
               <Mic className="w-3.5 h-3.5" />
             </Button>
             <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg" title="BrightData Scrape">
               <Globe className="w-3.5 h-3.5" />
             </Button>
          </div>
          <div className="flex items-end p-2 gap-2">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!isGenerating) handleSend();
                }
              }}
              placeholder="Describe the campaign..."
              className="flex-1 max-h-32 min-h-[40px] bg-transparent border-0 resize-none px-2 py-1 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-0 leading-relaxed"
              disabled={isGenerating}
              rows={1}
            />
            <Button 
              size="icon"
              className="shrink-0 h-8 w-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm transition-all disabled:opacity-50"
              onClick={() => handleSend()}
              disabled={isGenerating || !input.trim()}
            >
              <Send className="w-3.5 h-3.5 ml-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCanvas = () => (
    <div className="flex-1 relative flex flex-col bg-[#F8FFFC] overflow-hidden">
      {/* Figma Grid Background */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, #10B981 1.5px, transparent 0)', 
          backgroundSize: '24px 24px',
          backgroundPosition: 'center center'
        }}
      />

      {/* Top Floating Toolbar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 pointer-events-auto">
        {currentDesign && (
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-lg shadow-slate-200/20 rounded-full p-1.5 flex items-center gap-1">
            <Button variant={rightPanelTab === "edit" ? "secondary" : "ghost"} size="sm" onClick={() => setRightPanelTab(rightPanelTab === "edit" ? "closed" : "edit")} className="h-8 rounded-full px-4 text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50">
              <Type className="w-3.5 h-3.5 mr-1.5" /> Edit Text
            </Button>
            <Button variant={rightPanelTab === "layers" ? "secondary" : "ghost"} size="sm" onClick={() => setRightPanelTab(rightPanelTab === "layers" ? "closed" : "layers")} className="h-8 rounded-full px-4 text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50">
              <Layers className="w-3.5 h-3.5 mr-1.5" /> Layers
            </Button>
            <div className="w-px h-4 bg-slate-200 mx-1"></div>
            <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Share link copied!"); }} className="h-8 rounded-full px-4 text-xs font-semibold text-slate-600 hover:text-blue-700 hover:bg-blue-50">
              <Share2 className="w-3.5 h-3.5 mr-1.5" /> Share
            </Button>
          </div>
        )}
      </div>

      {/* Center Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-12 relative z-10 overflow-y-auto" onClick={() => setIsCanvasActive(false)}>
        <AnimatePresence mode="wait">
          {currentDesign ? (
            <motion.div 
              key={currentDesign.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => { e.stopPropagation(); setIsCanvasActive(true); }}
              className={cn(
                "relative group rounded-none overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] bg-white max-h-[80vh] aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] ring-2 transition-all duration-300",
                isCanvasActive ? "ring-emerald-500 shadow-emerald-500/20 shadow-2xl" : "ring-transparent hover:ring-slate-300"
              )}
            >
              {/* Floating Interaction Toolbar (Shows when clicked) */}
              {isCanvasActive && (
                 <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 bg-white/90 backdrop-blur-md rounded-lg p-1.5 shadow-xl border border-slate-200">
                    <button className="p-2 hover:bg-slate-100 rounded-md text-slate-600" title="Magic Eraser"><Wand2 className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-slate-100 rounded-md text-slate-600" title="Crop"><Crop className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-slate-100 rounded-md text-slate-600" title="Replace Image"><FileImage className="w-4 h-4" /></button>
                 </div>
              )}

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={currentDesign.imageUrl} alt="Generated Design" className="w-full h-full object-cover" />

              {/* Typography Layer Overlay */}
              {currentDesign.layout && (
                <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-10 z-20 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/40 mix-blend-multiply pointer-events-none"></div>
                  
                  <div className="relative flex justify-between items-start w-full">
                    <span className="font-black tracking-[0.25em] uppercase text-xs text-white/90 drop-shadow-md">
                      {currentDesign.layout.brandName}
                    </span>
                  </div>
                  
                  <div className="relative space-y-4 max-w-[95%] pb-2 mt-auto">
                    <h2 
                      className="text-5xl md:text-6xl font-black leading-[1.05] tracking-tight drop-shadow-2xl"
                      style={{ color: currentDesign.layout.themeColor || "#fff" }}
                    >
                      {currentDesign.layout.headline}
                    </h2>
                    <p className="text-lg md:text-xl font-medium text-white/95 drop-shadow-xl max-w-xl leading-snug">
                      {currentDesign.layout.subheadline}
                    </p>
                    <div className="pt-3">
                      <span 
                        className="inline-block px-6 py-3 rounded-full font-bold text-sm shadow-xl backdrop-blur-sm"
                        style={{ backgroundColor: currentDesign.layout.themeColor || "#10B981", color: "#fff" }}
                      >
                        {currentDesign.layout.cta}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center text-center max-w-md p-8"
            >
              <div className="w-24 h-24 rounded-3xl bg-white border border-[#DCFCE7] shadow-xl shadow-emerald-500/5 flex items-center justify-center mb-6 rotate-3 transform hover:rotate-6 transition-all">
                <Frame className="w-12 h-12 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Blank Canvas</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Send a brief to the AI Director to generate a Figma-ready design instantly.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Toolbar */}
      {currentDesign && (
        <div className="absolute bottom-6 inset-x-0 flex justify-center z-30 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-xl shadow-slate-200/20 rounded-2xl p-1.5 flex items-center gap-1 pointer-events-auto">
             <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-500 hover:text-slate-800"><Undo2 className="w-4 h-4" /></Button>
             <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-500 hover:text-slate-800"><Redo2 className="w-4 h-4" /></Button>
             <div className="w-px h-5 bg-slate-200 mx-1"></div>
             <Button variant="ghost" size="sm" className="h-9 px-4 rounded-xl text-xs font-bold text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700" onClick={() => handleSend("Improve this design slightly")}>
               <Sparkles className="w-3.5 h-3.5 mr-2" /> Improve
             </Button>
             <Button variant="ghost" size="sm" className="h-9 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100" onClick={() => handleSend("Generate a variation of this")}>
               <RefreshCw className="w-3.5 h-3.5 mr-2" /> Variation
             </Button>
             <div className="w-px h-5 bg-slate-200 mx-1"></div>
             <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-500 hover:text-slate-800" title="History"><History className="w-4 h-4" /></Button>
          </div>
        </div>
      )}
    </div>
  );

  const renderRightPanel = () => {
    if (rightPanelTab === "closed") return null;

    return (
      <motion.div 
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        className="w-[320px] bg-white border-l border-[#DCFCE7] flex flex-col shadow-2xl z-40 shrink-0"
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-sm text-slate-800 flex items-center capitalize">
            {rightPanelTab === "edit" ? <Type className="w-4 h-4 mr-2 text-emerald-500" /> : rightPanelTab === "layers" ? <Layers className="w-4 h-4 mr-2 text-emerald-500" /> : <Download className="w-4 h-4 mr-2 text-emerald-500" />}
            {rightPanelTab} Properties
          </h3>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400" onClick={() => setRightPanelTab("closed")}>
             <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {rightPanelTab === "edit" && currentDesign?.layout && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Headline</label>
                <textarea 
                  value={currentDesign.layout.headline} 
                  onChange={(e) => updateDesignLayout("headline", e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                  rows={3}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Subheadline</label>
                <textarea 
                  value={currentDesign.layout.subheadline} 
                  onChange={(e) => updateDesignLayout("subheadline", e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                  rows={2}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">CTA Button</label>
                <input 
                  value={currentDesign.layout.cta} 
                  onChange={(e) => updateDesignLayout("cta", e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Theme Color</label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={currentDesign.layout.themeColor} onChange={(e) => updateDesignLayout("themeColor", e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent p-0" />
                  <input value={currentDesign.layout.themeColor} onChange={(e) => updateDesignLayout("themeColor", e.target.value)} className="flex-1 text-sm p-2.5 rounded-xl border border-slate-200 font-mono uppercase" />
                </div>
              </div>
            </div>
          )}

          {rightPanelTab === "layers" && (
            <div className="space-y-2">
               {["Typography Overlay", "Headline Text", "Subheadline Text", "CTA Button", "Background Generation"].map((layer, i) => (
                 <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors cursor-grab">
                    <div className="flex items-center gap-3">
                      <Layers className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">{layer}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="w-6 h-6 text-slate-400"><MoreHorizontal className="w-3 h-3" /></Button>
                 </div>
               ))}
            </div>
          )}

          {rightPanelTab === "export" && (
            <div className="space-y-5">
               <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-700">File Format</label>
                 <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="h-10 border-emerald-500 bg-emerald-50 text-emerald-700">PNG (Best)</Button>
                    <Button variant="outline" className="h-10 text-slate-600">JPG</Button>
                    <Button variant="outline" className="h-10 text-slate-600">PDF</Button>
                    <Button variant="outline" className="h-10 text-slate-600">SVG</Button>
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-700">Resolution</label>
                 <select className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20">
                   <option>1080 x 1350 (Instagram)</option>
                   <option>1080 x 1080 (Square)</option>
                   <option>1920 x 1080 (Story)</option>
                   <option>4K Ultra (Print)</option>
                 </select>
               </div>
               <Button className="w-full mt-6 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/20" onClick={() => {toast.success("Downloading High-Res Asset..."); setTimeout(() => window.open(currentDesign?.imageUrl, "_blank"), 1500)}}>
                 Download Asset
               </Button>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderOverview = () => (
    <div className="flex-1 overflow-y-auto bg-white p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Campaign Overview</h1>
          <p className="text-slate-500 mt-1">Analytics and performance for your current project.</p>
        </div>
        <div className="grid grid-cols-3 gap-6">
           <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50">
              <h4 className="text-sm font-bold text-slate-500 uppercase">Generated Assets</h4>
              <p className="text-4xl font-black text-emerald-600 mt-2">{designHistory.length}</p>
           </div>
           <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50">
              <h4 className="text-sm font-bold text-slate-500 uppercase">Credits Remaining</h4>
              <p className="text-4xl font-black text-slate-800 mt-2">14,020</p>
           </div>
           <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50">
              <h4 className="text-sm font-bold text-slate-500 uppercase">Active Agents</h4>
              <p className="text-4xl font-black text-blue-600 mt-2">6</p>
           </div>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Document Library</h1>
            <p className="text-slate-500 mt-1">All generated layouts, briefs, and images.</p>
          </div>
          <Button variant="outline" className="bg-white"><FolderOpen className="w-4 h-4 mr-2" /> New Folder</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {designHistory.length === 0 ? (
             <div className="col-span-4 p-12 text-center text-slate-400 border border-dashed border-slate-300 rounded-3xl bg-white">
                No documents generated yet.
             </div>
          ) : (
            designHistory.map((doc, i) => (
              <div key={i} className="group rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer" onClick={() => {setCurrentDesign(doc); setActiveTab("workspace");}}>
                <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src={doc.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="doc" />
                </div>
                <div className="p-4 border-t border-slate-100">
                   <h4 className="font-bold text-sm text-slate-800 truncate">{doc.layout?.headline || "Untitled Design"}</h4>
                   <p className="text-xs text-slate-500 mt-1">{doc.format}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FFFC] text-[#0F172A] flex flex-col font-sans overflow-hidden h-screen selection:bg-emerald-200">
      {renderHeader()}
      
      <main className="flex-1 flex flex-row overflow-hidden relative">
        {activeTab === "workspace" && (
          <>
            {renderLeftPanel()}
            {renderCanvas()}
            <AnimatePresence>
              {renderRightPanel()}
            </AnimatePresence>
          </>
        )}
        
        {activeTab === "overview" && renderOverview()}
        {activeTab === "documents" && renderDocuments()}
      </main>
    </div>
  );
}
