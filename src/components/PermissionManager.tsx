import { useState } from 'react';
import { Shield, Users, Key, Search, Check } from 'lucide-react';
import { User, Role } from '../types';
import { cn } from '../lib/utils';

const INITIAL_USERS: User[] = [
  { id: 'u_1', name: 'Alice Smith', role: 'admin', department: '研发部' },
  { id: 'u_2', name: 'Bob Johnson', role: 'manager', department: '销售部' },
  { id: 'u_3', name: 'Carol Williams', role: 'user', department: '客服部' },
];

const INITIAL_ROLES: Role[] = [
  { id: 'role_admin', name: '系统管理员', permissions: ['obj_read', 'obj_write', 'rule_edit', 'process_edit'] },
  { id: 'role_manager', name: '部门主管', permissions: ['obj_read', 'obj_write', 'rule_edit'] },
  { id: 'role_user', name: '普通员工', permissions: ['obj_read'] },
];

const PERMISSION_KEYS = [
  { id: 'obj_read', label: '读取数据对象' },
  { id: 'obj_write', label: '修改数据对象' },
  { id: 'rule_edit', label: '编辑业务规则' },
  { id: 'process_edit', label: '修改流程图' },
];

export function PermissionManager() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('roles');
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [selectedRole, setSelectedRole] = useState<Role | null>(INITIAL_ROLES[0]);

  const togglePermission = (roleId: string, permId: string) => {
    setRoles(roles.map(r => {
      if (r.id !== roleId) return r;
      const hasPerm = r.permissions.includes(permId);
      const newPerms = hasPerm ? r.permissions.filter(p => p !== permId) : [...r.permissions, permId];
      if (selectedRole?.id === roleId) {
        setSelectedRole({ ...r, permissions: newPerms });
      }
      return { ...r, permissions: newPerms };
    }));
  };

  return (
    <div className="flex flex-col h-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      <div className="p-6 border-b border-white/10 bg-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-400" /> 安全与权限管理
        </h2>
        
        <div className="flex gap-4 mt-6">
          <button 
            onClick={() => setActiveTab('roles')}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-colors",
              activeTab === 'roles' ? "bg-blue-500/20 text-blue-400 border border-blue-500/50" : "text-slate-400 hover:text-white"
            )}
          >
            角色权限矩阵
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-colors",
              activeTab === 'users' ? "bg-blue-500/20 text-blue-400 border border-blue-500/50" : "text-slate-400 hover:text-white"
            )}
          >
            用户角色分配
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-6">
        {activeTab === 'roles' ? (
          <div className="flex h-full gap-6">
            <div className="w-64 flex flex-col gap-2 border-r border-white/10 pr-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">已定义角色</span>
              </div>
              {roles.map(role => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={cn(
                    "text-left p-3 rounded-lg transition-all border flex items-center gap-3",
                    selectedRole?.id === role.id
                      ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                      : "bg-white/5 border-white/10 text-slate-300 hover:border-white/20"
                  )}
                >
                  <Key className="h-4 w-4" />
                  <span className="text-sm font-medium">{role.name}</span>
                </button>
              ))}
            </div>
            
            <div className="flex-1">
              {selectedRole ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-slate-200">{selectedRole.name} 权限配置</h3>
                    <p className="text-sm text-slate-500 mt-1">为此角色配置相应的操作权限。</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {PERMISSION_KEYS.map(perm => {
                      const hasPerm = selectedRole.permissions.includes(perm.id);
                      return (
                        <div 
                          key={perm.id}
                          className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors"
                        >
                          <span className="text-sm text-white font-medium">{perm.label}</span>
                          <button 
                            onClick={() => togglePermission(selectedRole.id, perm.id)}
                            className={cn(
                              "w-10 h-6 rounded-full transition-colors relative flex items-center px-1",
                              hasPerm ? "bg-blue-500" : "bg-white/10"
                            )}
                          >
                            <div className={cn(
                              "h-4 w-4 rounded-full bg-white transition-transform transform shadow-sm",
                              hasPerm ? "translate-x-4" : "translate-x-0"
                            )} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                 <div className="h-full flex items-center justify-center text-slate-500">选择左侧角色以进行权限配置</div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4 h-full flex flex-col">
            <div className="relative w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="搜索用户..."
                className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-slate-500"
              />
            </div>
            
            <div className="rounded-lg border border-white/10 overflow-hidden flex-1">
              <table className="w-full text-sm text-left">
                <thead className="bg-white/5 text-slate-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">用户姓名</th>
                    <th className="px-4 py-3 font-medium">所属部门</th>
                    <th className="px-4 py-3 font-medium">分配角色</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {INITIAL_USERS.map(user => (
                    <tr key={user.id} className="hover:bg-white/10 transition-colors bg-white/5">
                      <td className="px-4 py-3 font-medium text-slate-200 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs text-blue-400 border border-white/10">
                          {user.name.substring(0, 2).toUpperCase()}
                        </div>
                        {user.name}
                      </td>
                      <td className="px-4 py-3 text-slate-300">{user.department}</td>
                      <td className="px-4 py-3">
                        <select 
                          defaultValue={user.role}
                          className="bg-transparent border border-white/10 rounded px-2 py-1 outline-none focus:border-blue-500 text-slate-200 text-xs [&>option]:bg-slate-900"
                        >
                          <option value="admin">系统管理员</option>
                          <option value="manager">部门主管</option>
                          <option value="user">普通员工</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
