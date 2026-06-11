export interface FieldDef {
  id: string;
  name: string;
  type: 'text' | 'number' | 'enum' | 'date' | 'relation';
  required: boolean;
}

export interface BusinessObject {
  id: string;
  name: string;
  description: string;
  fields: FieldDef[];
}

export interface RuleDef {
  id: string;
  name: string;
  condition: string;
  action: string;
}

export interface AgentTask {
  id: string;
  nodeName: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  input: string;
  output: string;
  logs: string[];
}

export interface User {
  id: string;
  name: string;
  role: string;
  department: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}
