import { useState } from 'react';
import { Search, Plus, Trash2, Edit2, Filter } from 'lucide-react';
import { cn } from '../lib/utils';
import { BusinessObject, FieldDef } from '../types';

const INITIAL_DATA: BusinessObject[] = [
  {
    id: 'obj_1',
    name: '客户订单',
    description: '管理电商客户订单记录',
    fields: [
      { id: 'f_1', name: '订单编号', type: 'text', required: true },
      { id: 'f_2', name: '订单总额', type: 'number', required: true },
      { id: 'f_3', name: '订单状态', type: 'enum', required: true },
    ],
  },
  {
    id: 'obj_2',
    name: '员工档案',
    description: '记录企业员工基本信息',
    fields: [
      { id: 'f_4', name: '员工工号', type: 'text', required: true },
      { id: 'f_5', name: '入职日期', type: 'date', required: true },
      { id: 'f_6', name: '所属部门', type: 'relation', required: false },
    ],
  },
];

export function ObjectManager() {
  const [objects, setObjects] = useState<BusinessObject[]>(INITIAL_DATA);
  const [selectedObj, setSelectedObj] = useState<BusinessObject | null>(INITIAL_DATA[0]);
  const [search, setSearch] = useState('');

  const filteredObjects = objects.filter(obj => 
    obj.name.toLowerCase().includes(search.toLowerCase())
  );

  const addField = () => {
    if (!selectedObj) return;
    const newField: FieldDef = {
      id: `f_${Date.now()}`,
      name: '新字段',
      type: 'text',
      required: false,
    };
    const updated = { ...selectedObj, fields: [...selectedObj.fields, newField] };
    setSelectedObj(updated);
    setObjects(objects.map(o => o.id === selectedObj.id ? updated : o));
  };

  const removeField = (fieldId: string) => {
    if (!selectedObj) return;
    const updated = { ...selectedObj, fields: selectedObj.fields.filter(f => f.id !== fieldId) };
    setSelectedObj(updated);
    setObjects(objects.map(o => o.id === selectedObj.id ? updated : o));
  };

  return (
    <div className="flex h-full gap-6">
      {/* List Panel */}
      <div className="w-80 flex flex-col gap-4 border-r border-white/10 pr-6">
        <h2 className="text-xl font-semibold text-white">
          业务对象管理
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="搜索业务对象..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-slate-500"
          />
        </div>
        
        <div className="flex-1 overflow-y-auto flex flex-col gap-2">
          {filteredObjects.map(obj => (
            <button
              key={obj.id}
              onClick={() => setSelectedObj(obj)}
              className={cn(
                "text-left p-3 rounded-lg transition-all border",
                selectedObj?.id === obj.id
                  ? "bg-blue-500/20 border-blue-500/50"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              )}
            >
              <div className="font-medium text-slate-200">{obj.name}</div>
              <div className="text-xs text-slate-500 truncate mt-1">{obj.description}</div>
            </button>
          ))}
        </div>
        <button className="flex items-center justify-center gap-2 w-full py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 rounded-md transition-colors text-sm font-medium">
          <Plus className="h-4 w-4" /> 新建对象
        </button>
      </div>

      {/* Editor Panel */}
      <div className="flex-1 flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        {selectedObj ? (
          <>
            <div className="p-6 border-b border-white/10 bg-white/5 flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
                  {selectedObj.name}
                  <button className="text-slate-500 hover:text-blue-400 transition-colors"><Edit2 className="h-4 w-4" /></button>
                </h3>
                <p className="text-slate-400 text-sm mt-1">{selectedObj.description}</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-md text-sm hover:bg-white/10 transition-colors">
                <Trash2 className="h-4 w-4 text-red-400" /> 删除对象
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-medium text-white flex items-center gap-2">
                  <Filter className="h-4 w-4 text-blue-500" /> 字段配置
                </h4>
                <button 
                  onClick={addField}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded hover:bg-blue-500/30 transition-colors text-sm"
                >
                  <Plus className="h-4 w-4" /> 添加字段
                </button>
              </div>

              <div className="rounded-lg border border-white/10 overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-white/5 text-slate-400">
                    <tr>
                      <th className="px-4 py-3 font-medium">字段名称</th>
                      <th className="px-4 py-3 font-medium">字段类型</th>
                      <th className="px-4 py-3 font-medium">是否必填</th>
                      <th className="px-4 py-3 font-medium text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {selectedObj.fields.map(field => (
                      <tr key={field.id} className="bg-white/5 hover:bg-white/10 transition-colors">
                        <td className="px-4 py-3">
                          <input 
                            type="text" 
                            defaultValue={field.name}
                            className="bg-transparent border-b border-transparent focus:border-blue-500 outline-none w-full text-slate-200"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select 
                            defaultValue={field.type}
                            className="bg-transparent border border-white/10 rounded px-2 py-1 outline-none focus:border-blue-500 text-slate-200 [&>option]:bg-slate-900"
                          >
                            <option value="text">文本 (Text)</option>
                            <option value="number">数字 (Number)</option>
                            <option value="enum">枚举 (Enum)</option>
                            <option value="date">日期 (Date)</option>
                            <option value="relation">关联 (Relation)</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked={field.required} className="sr-only peer" />
                            <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                          </label>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => removeField(field.id)}
                            className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {selectedObj.fields.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                          暂未配置任何字段。
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            请从左侧列表选择一个对象以查看或编辑详情。
          </div>
        )}
      </div>
    </div>
  );
}
