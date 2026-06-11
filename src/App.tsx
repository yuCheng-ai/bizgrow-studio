import { useState } from 'react';
import { Database, GitMerge, FileCheck2, Bot, ShieldAlert, BarChart3, CloudIcon, LogOut } from 'lucide-react';
import { cn } from './lib/utils';
import { ObjectManager } from './components/ObjectManager';
import { ProcessDesigner } from './components/ProcessDesigner';
import { RuleEngine } from './components/RuleEngine';
import { AgentPanel } from './components/AgentPanel';
import { PermissionManager } from './components/PermissionManager';
import { Dashboard } from './components/Dashboard';

type Module = 'object' | 'process' | 'rule' | 'agent' | 'auth' | 'dashboard';

const NAV_ITEMS = [
  { id: 'dashboard', label: '监控大盘', icon: BarChart3 },
  { id: 'object', label: '数据对象', icon: Database },
  { id: 'process', label: '流程设计', icon: GitMerge },
  { id: 'rule', label: '规则引擎', icon: FileCheck2 },
  { id: 'agent', label: '智能体', icon: Bot },
  { id: 'auth', label: '权限安全', icon: ShieldAlert },
] as const;

export default function App() {
  const [activeModule, setActiveModule] = useState<Module>('dashboard');

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden font-sans relative">
      {/* Background Mesh Gradients */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Sidebar Navigation */}
      <div className="w-16 md:w-64 border-r border-white/10 bg-white/5 backdrop-blur-md flex flex-col transition-all duration-300 z-10 shrink-0">
        <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-white/10">
          <CloudIcon className="h-6 w-6 text-blue-400" />
          <span className="hidden md:block ml-3 font-bold text-lg tracking-tight text-white">
            Aura <span className="text-slate-400 font-normal">OS</span>
          </span>
        </div>
        
        <div className="flex-1 py-6 flex flex-col gap-2 px-2 md:px-4">
          <div className="hidden md:block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">核心模块</div>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id as Module)}
              className={cn(
                "flex items-center justify-center md:justify-start px-2 py-3 md:px-3 md:py-2.5 rounded-lg transition-all group",
                activeModule === item.id 
                  ? "bg-blue-500/20 text-blue-400" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5",
                activeModule === item.id ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
              )} />
              <span className="hidden md:block ml-3 text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center justify-center md:justify-start w-full px-2 py-2 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
            <LogOut className="h-5 w-5" />
            <span className="hidden md:block ml-3 text-sm font-medium">退出系统</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-transparent">
        
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/10 bg-white/5 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-slate-400 font-mono tracking-widest uppercase">系统在线</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-white">系统管理员</div>
              <div className="text-xs text-slate-400">工作区所有者</div>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-600 border border-slate-900 flex items-center justify-center text-white font-bold text-sm">
              AD
            </div>
          </div>
        </header>

        {/* Dynamic Module Container */}
        <main className="flex-1 p-6 overflow-hidden flex flex-col">
          {activeModule === 'dashboard' && <Dashboard />}
          {activeModule === 'object' && <ObjectManager />}
          {activeModule === 'process' && <ProcessDesigner />}
          {activeModule === 'rule' && <RuleEngine />}
          {activeModule === 'agent' && <AgentPanel />}
          {activeModule === 'auth' && <PermissionManager />}
        </main>
      </div>
    </div>
  );
}
