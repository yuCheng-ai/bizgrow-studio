import { useState, useEffect } from 'react';
import { Bot, Terminal, Loader2, CheckCircle2, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { AgentTask } from '../types';
import { cn } from '../lib/utils';

const INITIAL_TASKS: AgentTask[] = [
  {
    id: 'tsk_1',
    nodeName: '发票数据提取代理',
    status: 'success',
    input: '{"fileId": "inv_8923.pdf", "type": "invoice"}',
    output: '{"amount": 1050.00, "vendor": "TechCorp Inc", "dueDate": "2026-06-30"}',
    logs: [
      '[INFO] 正在初始化视觉大模型...',
      '[INFO] 正在解析目标文档 inv_8923.pdf',
      '[INFO] 成功提取 3 个关键键值对',
      '[SUCCESS] 任务执行完毕，耗时 1.2s'
    ]
  },
  {
    id: 'tsk_2',
    nodeName: '客户情感倾向分析',
    status: 'running',
    input: '{"ticketId": "t_991", "text": "客服态度很差，我要退款！"}',
    output: '处理中...',
    logs: [
      '[INFO] 加载历史上下文...',
      '[INFO] 正在分析情感向量...',
    ]
  },
  {
    id: 'tsk_3',
    nodeName: '代码自动审查助手',
    status: 'failed',
    input: '{"repo": "frontend-app", "prId": "120"}',
    output: '{"error": "API 请求达到速率限制。"}',
    logs: [
      '[INFO] 获取变更代码diff...',
      '[WARN] 差异文件大小超过 10MB 阈值',
      '[ERROR] 连接代码库超时'
    ]
  }
];

export function AgentPanel() {
  const [tasks, setTasks] = useState<AgentTask[]>(INITIAL_TASKS);
  const [expandedTask, setExpandedTask] = useState<string | null>(INITIAL_TASKS[0].id);

  // Simulate real-time progress
  useEffect(() => {
    const timer = setInterval(() => {
      setTasks(prev => prev.map(t => {
        if (t.status === 'running') {
          // just simulate some log appending
          const newLogs = [...t.logs, `[INFO] 正在处理第 ${Math.floor(Math.random() * 100)} 步...`];
          return { ...t, logs: newLogs };
        }
        return t;
      }));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'running': return <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />;
      case 'failed': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <div className="h-5 w-5 rounded-full border-2 border-slate-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'running': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'failed': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-slate-400 bg-white/10 border-white/20';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
            <Bot className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Agent执行监控面板</h2>
            <p className="text-sm text-slate-400 mt-1">监控实时AI节点执行状态与分析日志。</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {tasks.map(task => (
          <div 
            key={task.id} 
            className="border border-white/10 rounded-xl bg-white/5 overflow-hidden transition-all hover:border-white/20"
          >
            {/* Header */}
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5"
              onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(task.status)}
                <span className="font-medium text-slate-200">{task.nodeName}</span>
                <span className={cn("text-xs px-2 py-0.5 rounded border uppercase tracking-wider font-semibold", getStatusColor(task.status))}>
                  {task.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-slate-500">
                <span className="text-xs font-mono">{task.id}</span>
                {expandedTask === task.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </div>
            </div>

            {/* Details (Expanded) */}
            {expandedTask === task.id && (
              <div className="p-4 border-t border-white/10 grid grid-cols-2 gap-4 bg-white/5">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2 block">输入参数 (Payload)</label>
                    <pre className="bg-black/20 border border-white/10 p-3 rounded-md text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap">
                      {task.input}
                    </pre>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2 block">输出结果 (Output)</label>
                    <pre className="bg-black/20 border border-white/10 p-3 rounded-md text-xs font-mono text-blue-300 overflow-x-auto whitespace-pre-wrap">
                      {task.output}
                    </pre>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <label className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Terminal className="h-3 w-3" /> 运行日志
                  </label>
                  <div className="flex-1 bg-black/40 border border-white/10 rounded-md p-3 font-mono text-[11px] overflow-y-auto space-y-1 backdrop-blur-sm">
                    {task.logs.map((log, i) => (
                      <div key={i} className={cn(
                        "font-mono",
                        log.includes('[ERROR]') || log.includes('[WARN]') ? "text-red-400" : 
                        log.includes('[SUCCESS]') ? "text-green-400" : "text-slate-400"
                      )}>
                        {log}
                      </div>
                    ))}
                    {task.status === 'running' && (
                      <div className="text-blue-400 animate-pulse">_</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
