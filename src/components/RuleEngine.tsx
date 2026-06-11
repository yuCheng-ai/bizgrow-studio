import { useState } from 'react';
import { Plus, GripVertical, Trash2, Edit } from 'lucide-react';
import { RuleDef } from '../types';

const INITIAL_RULES: RuleDef[] = [
  { id: 'r_1', name: '高价值订单', condition: 'order.totalAmount > 10000', action: '需要经理审批' },
  { id: 'r_2', name: '新员工入职配置', condition: 'employee.status == "NEW"', action: '触发IT账号开通' },
  { id: 'r_3', name: '自动拒绝垃圾工单', condition: 'ticket.spamScore > 0.9', action: '移入系统回收站' },
];

export function RuleEngine() {
  const [rules, setRules] = useState<RuleDef[]>(INITIAL_RULES);

  const addRule = () => {
    const newRule: RuleDef = {
      id: `r_${Date.now()}`,
      name: '新建规则',
      condition: '',
      action: '',
    };
    setRules([...rules, newRule]);
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const updateRule = (id: string, field: keyof RuleDef, value: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const moveRule = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === rules.length - 1)) return;
    
    const newRules = [...rules];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newRules[index];
    newRules[index] = newRules[targetIndex];
    newRules[targetIndex] = temp;
    setRules(newRules);
  };

  return (
    <div className="flex flex-col h-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">业务规则引擎</h2>
          <p className="text-sm text-slate-400 mt-1">配置业务逻辑的触发条件与执行动作。</p>
        </div>
        <button 
          onClick={addRule}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors text-sm font-medium shadow-lg shadow-blue-500/20"
        >
          <Plus className="h-4 w-4" /> 添加规则
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-3">
          {rules.map((rule, idx) => (
            <div 
              key={rule.id} 
              className="flex items-stretch gap-3 bg-white/5 border border-white/10 rounded-xl p-2 hover:bg-white/10 hover:border-white/20 transition-colors group"
            >
              <div className="flex flex-col items-center justify-center gap-1 px-2 text-slate-500">
                <button onClick={() => moveRule(idx, 'up')} disabled={idx === 0} className="hover:text-slate-300 disabled:opacity-30">▲</button>
                <GripVertical className="h-4 w-4" />
                <button onClick={() => moveRule(idx, 'down')} disabled={idx === rules.length -1} className="hover:text-slate-300 disabled:opacity-30">▼</button>
              </div>
              
              <div className="flex-1 grid grid-cols-12 gap-4 items-start py-2">
                <div className="col-span-3 space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">规则名称</label>
                  <input 
                    type="text" 
                    value={rule.name}
                    onChange={(e) => updateRule(rule.id, 'name', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 px-3 py-1.5 rounded text-sm text-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="col-span-4 space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">当满足条件 (When)</label>
                  <input 
                    type="text" 
                    value={rule.condition}
                    placeholder="例如：amount > 100"
                    onChange={(e) => updateRule(rule.id, 'condition', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 px-3 py-1.5 rounded text-sm text-amber-300 font-mono focus:border-blue-500 outline-none placeholder:text-slate-500"
                  />
                </div>
                <div className="col-span-4 space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">则执行动作 (Then)</label>
                  <input 
                    type="text" 
                    value={rule.action}
                    placeholder="执行动作..."
                    onChange={(e) => updateRule(rule.id, 'action', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 px-3 py-1.5 rounded text-sm text-green-300 font-mono focus:border-blue-500 outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="flex items-center px-2">
                 <button 
                  onClick={() => removeRule(rule.id)}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          
          {rules.length === 0 && (
            <div className="text-center py-12 text-slate-500 border-2 border-dashed border-white/10 rounded-2xl">
              暂未配置任何规则。请点击"添加规则"进行创建。
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
