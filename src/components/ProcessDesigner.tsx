import { useState, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Play, Settings2, User, Bot, Cpu } from 'lucide-react';

const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'input',
    data: { label: '开始请求' },
    position: { x: 250, y: 50 },
    className: '!bg-slate-800 !text-slate-200 !border-white/20 shadow-xl shadow-blue-900/20',
  },
  {
    id: 'agent_1',
    data: { 
      label: (
        <div className="flex justify-center items-center gap-2">
          <Bot className="h-4 w-4 text-blue-400" />
          <span>数据提取</span>
        </div>
      ) 
    },
    position: { x: 250, y: 150 },
    className: '!bg-blue-600 !text-white !border-blue-400 shadow-lg',
  },
  {
    id: 'human_1',
    data: { 
      label: (
        <div className="flex justify-center items-center gap-2">
          <User className="h-4 w-4 text-purple-400" />
          <span>经理审批</span>
        </div>
      ) 
    },
    position: { x: 250, y: 250 },
    className: '!bg-white/10 !text-white !border-white/20 backdrop-blur',
  },
  {
    id: 'system_1',
    type: 'output',
    data: { 
      label: (
        <div className="flex justify-center items-center gap-2">
          <Cpu className="h-4 w-4 text-green-400" />
          <span>更新数据库</span>
        </div>
      ) 
    },
    position: { x: 250, y: 350 },
    className: '!bg-slate-800 !text-slate-200 !border-white/20',
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'start', target: 'agent_1', animated: true, style: { stroke: '#3b82f6' } },
  { id: 'e2-3', source: 'agent_1', target: 'human_1' },
  { id: 'e3-4', source: 'human_1', target: 'system_1' },
];

export function ProcessDesigner() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="flex h-full gap-6">
      {/* Canvas */}
      <div className="flex-1 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 relative overflow-hidden flex flex-col">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <div className="bg-black/40 backdrop-blur border border-white/10 p-2 rounded-lg text-sm flex gap-4 text-slate-300">
            <span className="flex items-center gap-1.5"><Bot className="h-4 w-4 text-blue-400"/> 智能体节点</span>
            <span className="flex items-center gap-1.5"><User className="h-4 w-4 text-purple-400"/> 人工任务</span>
            <span className="flex items-center gap-1.5"><Cpu className="h-4 w-4 text-green-400"/> 系统动作</span>
          </div>
        </div>
        
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onSelectionChange={(params) => {
            if (params.nodes.length > 0) {
              setSelectedNodeId(params.nodes[0].id);
            } else {
              setSelectedNodeId(null);
            }
          }}
          className="bg-transparent"
          fitView
        >
          <Background color="#ffffff" style={{opacity: 0.1}} gap={20} size={1} />
          <Controls className="fill-slate-300" />
        </ReactFlow>
      </div>

      {/* Properties Panel */}
      <div className="w-80 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-y-auto flex flex-col">
        <div className="p-4 border-b border-white/10 bg-white/5 sticky top-0 font-medium text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-blue-400" /> 
            节点属性配置
          </div>
          {selectedNodeId && (
             <span className="text-xs bg-white/10 px-2 py-1 rounded text-slate-300 font-mono">{selectedNodeId}</span>
          )}
        </div>
        
        <div className="p-4 flex flex-col gap-4">
          {selectedNode ? (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">节点类型</label>
                <div className="text-sm bg-white/5 border border-white/10 px-3 py-2 rounded-md capitalize text-white">
                  {selectedNode.type || 'default'}
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">节点名称</label>
                <input 
                  type="text" 
                  defaultValue={typeof selectedNode.data.label === 'string' ? selectedNode.data.label : '自定义节点'}
                  className="w-full text-sm bg-white/5 border border-white/10 px-3 py-2 rounded-md focus:border-blue-500 outline-none text-white"
                />
              </div>

              {selectedNode.id.includes('agent') && (
                 <div className="space-y-1">
                 <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">业务大模型选择</label>
                 <select className="w-full text-sm bg-white/5 border border-white/10 px-3 py-2 rounded-md focus:border-blue-500 outline-none text-white [&>option]:bg-slate-900">
                   <option>Gemini 1.5 Pro</option>
                   <option>Gemini 1.5 Flash</option>
                 </select>
               </div>
              )}
              
              <div className="pt-4 mt-2 border-t border-white/10">
                <button className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors text-sm font-medium">
                  <Play className="h-4 w-4" /> 执行测试
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-slate-500 text-sm mt-10">
              在画布中选定节点即可配置参数
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
