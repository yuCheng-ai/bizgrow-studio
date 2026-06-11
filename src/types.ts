export interface OntologyConcept {
  id: string;
  name: string;
  type: string;
  description: string;
  attributes: string[];
  actions: string[];
  relations: string[];
}

export interface ObjectField {
  id: string;
  name: string;
  code: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'enum' | 'relation' | 'subtable';
  required: boolean;
  unique: boolean;
  defaultValue?: string;
  description: string;
}

export interface BusinessObject {
  id: string;
  name: string;
  code: string;
  ontologyConcept: string;
  businessMeaning: string;
  lifecycleStates: string[];
  relatedObjects: string[];
  triggerableEvents: string[];
  executableActions: string[];
  agentOperableScope: string[];
  fields: ObjectField[];
}

export interface Relation {
  id: string;
  source: string;
  target: string;
  type: string;
  description: string;
}

export interface State {
  id: string;
  name: string;
  type: 'start' | 'normal' | 'end' | 'exception';
  allowedActions: string[];
  enterCondition: string;
  leaveValidation: string;
  roles: string[];
  timeoutPolicy: string;
}

export interface ProcessNode {
  id: string;
  name: string;
  type: 'human' | 'system' | 'agent' | 'condition' | 'parallel' | 'fallback';
  input: string;
  output: string;
  executor: string;
  condition: string;
  failureAction: string;
  needManualConfirm: boolean;
}

export interface Rule {
  id: string;
  name: string;
  whenEvent: string;
  ifCondition: string;
  thenAction: string;
  riskLevel: 'low' | 'medium' | 'high';
  enabled: boolean;
  relatedObjects: string[];
  relatedAgent: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  targetObjects: string[];
  readAccess: string[];
  allowedActions: string[];
  forbiddenActions: string[];
  manualConfirmRules: string[];
  outputs: string[];
  executionLog: string[];
}

export interface Task {
  id: string;
  name: string;
  source: 'human' | 'process' | 'rule' | 'agent' | 'system';
  targetObject: string;
  status: 'pending' | 'running' | 'waiting' | 'completed' | 'blocked' | 'failed';
  owner: string;
  priority: 'low' | 'medium' | 'high';
  deadline: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  event: string;
  reads: string[];
  rulesHit: string[];
  agentJudgment: string;
  action: string;
  modifiedObjects: string[];
  manualConfirmed: boolean;
  result: 'success' | 'failed' | 'waiting';
}
