// ===== 字段类型分类 =====
export type FieldTypeCategory = 'basic' | 'reference' | 'computed' | 'special';

export interface FieldTypeCategoryMeta {
  key: FieldTypeCategory;
  label: string;
  tone: 'blue' | 'purple' | 'green' | 'amber';
  description: string;
}

export const FIELD_TYPE_CATEGORIES: FieldTypeCategoryMeta[] = [
  { key: 'basic', label: '基础类型', tone: 'blue', description: '文本、数字、日期等基础数据字段' },
  { key: 'reference', label: '关联类型', tone: 'purple', description: '引用其他对象、附件、图片等' },
  { key: 'computed', label: '计算类型', tone: 'green', description: '公式、自动编号、汇总等自动计算字段' },
  { key: 'special', label: '特殊类型', tone: 'amber', description: '选项、状态、JSON 等特殊用途字段' },
];

// ===== 字段类型属性定义 =====
export interface FieldTypeProperty {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'textarea';
  defaultValue?: unknown;
  placeholder?: string;
  options?: { label: string; value: string }[];
  required?: boolean;
}

export interface FieldTypeDefinition {
  code: string;
  label: string;
  category: FieldTypeCategory;
  description: string;
  icon: string; // lucide icon name, used for lookup in FieldForm
  configurableProperties: FieldTypeProperty[];
}

// ===== 所有字段类型 =====
export const FIELD_TYPES: FieldTypeDefinition[] = [
  // ---- 基础类型 ----
  {
    code: 'text',
    label: '文本',
    category: 'basic',
    description: '单行文本输入',
    icon: 'Type',
    configurableProperties: [
      { key: 'maxLength', label: '最大长度', type: 'number', defaultValue: 255, placeholder: '255' },
      { key: 'placeholder', label: '占位提示', type: 'text', placeholder: '输入提示文字' },
      { key: 'defaultValue', label: '默认值', type: 'text' },
      { key: 'unique', label: '唯一性校验', type: 'boolean', defaultValue: false },
    ],
  },
  {
    code: 'longText',
    label: '长文本',
    category: 'basic',
    description: '多行文本/文本域',
    icon: 'AlignLeft',
    configurableProperties: [
      { key: 'maxLength', label: '最大长度', type: 'number', defaultValue: 4000, placeholder: '4000' },
      { key: 'richText', label: '富文本编辑', type: 'boolean', defaultValue: false },
      { key: 'placeholder', label: '占位提示', type: 'text' },
    ],
  },
  {
    code: 'number',
    label: '数字',
    category: 'basic',
    description: '整数或小数',
    icon: 'Hash',
    configurableProperties: [
      { key: 'min', label: '最小值', type: 'number' },
      { key: 'max', label: '最大值', type: 'number' },
      { key: 'decimalPlaces', label: '小数位数', type: 'number', defaultValue: 0 },
      { key: 'unit', label: '单位', type: 'text', placeholder: '如：件、kg、m' },
      { key: 'defaultValue', label: '默认值', type: 'number' },
    ],
  },
  {
    code: 'amount',
    label: '金额',
    category: 'basic',
    description: '货币金额',
    icon: 'DollarSign',
    configurableProperties: [
      { key: 'currency', label: '币种', type: 'select', defaultValue: 'CNY', options: [
        { label: '人民币 (CNY)', value: 'CNY' },
        { label: '美元 (USD)', value: 'USD' },
        { label: '欧元 (EUR)', value: 'EUR' },
      ]},
      { key: 'min', label: '最小值', type: 'number', defaultValue: 0 },
      { key: 'max', label: '最大值', type: 'number' },
      { key: 'defaultValue', label: '默认值', type: 'number' },
    ],
  },
  {
    code: 'boolean',
    label: '布尔/开关',
    category: 'basic',
    description: '是/否、开/关',
    icon: 'ToggleLeft',
    configurableProperties: [
      { key: 'trueLabel', label: '是标签', type: 'text', defaultValue: '是' },
      { key: 'falseLabel', label: '否标签', type: 'text', defaultValue: '否' },
      { key: 'defaultValue', label: '默认值', type: 'boolean', defaultValue: false },
    ],
  },
  {
    code: 'date',
    label: '日期',
    category: 'basic',
    description: '日期选择器',
    icon: 'Calendar',
    configurableProperties: [
      { key: 'includeTime', label: '包含时间', type: 'boolean', defaultValue: false },
      { key: 'minDate', label: '最早日期', type: 'text', placeholder: '如：2024-01-01' },
      { key: 'maxDate', label: '最晚日期', type: 'text', placeholder: '如：2026-12-31' },
      { key: 'defaultValue', label: '默认值', type: 'text', placeholder: 'today 或固定日期' },
    ],
  },
  {
    code: 'dateTime',
    label: '日期时间',
    category: 'basic',
    description: '日期与时间选择',
    icon: 'Clock',
    configurableProperties: [
      { key: 'minDate', label: '最早日期时间', type: 'text', placeholder: '如：2024-01-01 00:00' },
      { key: 'maxDate', label: '最晚日期时间', type: 'text' },
      { key: 'defaultValue', label: '默认值', type: 'text', placeholder: 'now 或固定时间' },
    ],
  },
  {
    code: 'email',
    label: '邮箱',
    category: 'basic',
    description: '电子邮箱地址',
    icon: 'Mail',
    configurableProperties: [
      { key: 'placeholder', label: '占位提示', type: 'text', placeholder: 'example@company.com' },
      { key: 'unique', label: '唯一性校验', type: 'boolean', defaultValue: false },
    ],
  },
  {
    code: 'phone',
    label: '电话',
    category: 'basic',
    description: '电话号码',
    icon: 'Phone',
    configurableProperties: [
      { key: 'placeholder', label: '占位提示', type: 'text' },
      { key: 'unique', label: '唯一性校验', type: 'boolean', defaultValue: false },
    ],
  },
  {
    code: 'url',
    label: '链接',
    category: 'basic',
    description: 'URL 超链接',
    icon: 'Link',
    configurableProperties: [
      { key: 'placeholder', label: '占位提示', type: 'text', placeholder: 'https://...' },
      { key: 'openInNewTab', label: '新窗口打开', type: 'boolean', defaultValue: true },
    ],
  },
  {
    code: 'password',
    label: '密码',
    category: 'basic',
    description: '密文输入',
    icon: 'Lock',
    configurableProperties: [
      { key: 'minLength', label: '最小长度', type: 'number', defaultValue: 8 },
      { key: 'maxLength', label: '最大长度', type: 'number', defaultValue: 128 },
    ],
  },
  {
    code: 'percentage',
    label: '百分比',
    category: 'basic',
    description: '百分比数值',
    icon: 'Percent',
    configurableProperties: [
      { key: 'min', label: '最小值', type: 'number', defaultValue: 0 },
      { key: 'max', label: '最大值', type: 'number', defaultValue: 100 },
      { key: 'decimalPlaces', label: '小数位数', type: 'number', defaultValue: 2 },
    ],
  },

  // ---- 关联类型 ----
  {
    code: 'reference',
    label: '引用对象',
    category: 'reference',
    description: '关联单个其他业务对象',
    icon: 'ArrowRight',
    configurableProperties: [
      { key: 'targetObject', label: '目标对象', type: 'select', required: true, options: [] }, // dynamically populated
      { key: 'displayField', label: '展示字段', type: 'text', placeholder: '如：name' },
      { key: 'required', label: '必填', type: 'boolean', defaultValue: true },
    ],
  },
  {
    code: 'multiReference',
    label: '多引用',
    category: 'reference',
    description: '关联多个业务对象',
    icon: 'GitBranch',
    configurableProperties: [
      { key: 'targetObject', label: '目标对象', type: 'select', required: true, options: [] },
      { key: 'displayField', label: '展示字段', type: 'text', placeholder: '如：name' },
      { key: 'maxItems', label: '最大关联数', type: 'number' },
    ],
  },
  {
    code: 'attachment',
    label: '附件',
    category: 'reference',
    description: '文件上传',
    icon: 'Paperclip',
    configurableProperties: [
      { key: 'maxFileSize', label: '文件大小上限(MB)', type: 'number', defaultValue: 10 },
      { key: 'allowedTypes', label: '允许格式', type: 'text', placeholder: '如：.pdf,.docx,.xlsx' },
      { key: 'maxFiles', label: '最大文件数', type: 'number', defaultValue: 1 },
    ],
  },
  {
    code: 'image',
    label: '图片',
    category: 'reference',
    description: '图片上传',
    icon: 'Image',
    configurableProperties: [
      { key: 'maxFileSize', label: '大小上限(MB)', type: 'number', defaultValue: 5 },
      { key: 'maxWidth', label: '最大宽度(px)', type: 'number' },
      { key: 'maxHeight', label: '最大高度(px)', type: 'number' },
      { key: 'maxFiles', label: '最大张数', type: 'number', defaultValue: 1 },
    ],
  },

  // ---- 计算类型 ----
  {
    code: 'formula',
    label: '公式',
    category: 'computed',
    description: '基于表达式自动计算',
    icon: 'Sigma',
    configurableProperties: [
      { key: 'expression', label: '表达式', type: 'textarea', required: true, placeholder: '如：amount * qty' },
      { key: 'resultType', label: '结果类型', type: 'select', defaultValue: 'number', options: [
        { label: '数字', value: 'number' },
        { label: '文本', value: 'text' },
        { label: '日期', value: 'date' },
        { label: '布尔', value: 'boolean' },
      ]},
      { key: 'autoRecalculate', label: '自动重算', type: 'boolean', defaultValue: true },
    ],
  },
  {
    code: 'autoNumber',
    label: '自动编号',
    category: 'computed',
    description: '自增序列号',
    icon: 'ListOrdered',
    configurableProperties: [
      { key: 'prefix', label: '前缀', type: 'text', placeholder: '如：OR-' },
      { key: 'suffix', label: '后缀', type: 'text' },
      { key: 'startAt', label: '起始值', type: 'number', defaultValue: 1 },
      { key: 'step', label: '步长', type: 'number', defaultValue: 1 },
    ],
  },
  {
    code: 'lookup',
    label: '查找字段',
    category: 'computed',
    description: '从关联对象获取字段值',
    icon: 'Search',
    configurableProperties: [
      { key: 'sourceReferenceField', label: '关联引用字段', type: 'select', required: true, options: [] },
      { key: 'sourceField', label: '取值字段', type: 'text', required: true, placeholder: '如：customer.creditLevel' },
    ],
  },
  {
    code: 'rollup',
    label: '汇总字段',
    category: 'computed',
    description: '聚合子表数据',
    icon: 'BarChart3',
    configurableProperties: [
      { key: 'sourceObject', label: '子对象', type: 'select', required: true, options: [] },
      { key: 'aggregateFunction', label: '聚合函数', type: 'select', required: true, defaultValue: 'SUM', options: [
        { label: '求和 SUM', value: 'SUM' },
        { label: '计数 COUNT', value: 'COUNT' },
        { label: '平均 AVG', value: 'AVG' },
        { label: '最小 MIN', value: 'MIN' },
        { label: '最大 MAX', value: 'MAX' },
      ]},
      { key: 'sourceField', label: '聚合字段', type: 'text', required: true },
    ],
  },

  // ---- 特殊类型 ----
  {
    code: 'enum',
    label: '选项',
    category: 'special',
    description: '单选下拉/按钮组',
    icon: 'ChevronDown',
    configurableProperties: [
      { key: 'options', label: '可选项', type: 'textarea', required: true, placeholder: '每行一个，格式：值|标签\n如：\nnormal|正常\nurgent|加急' },
      { key: 'allowOther', label: '允许填写其他', type: 'boolean', defaultValue: false },
      { key: 'displayAs', label: '展示方式', type: 'select', defaultValue: 'select', options: [
        { label: '下拉选择', value: 'select' },
        { label: '单选按钮组', value: 'radio' },
      ]},
      { key: 'defaultValue', label: '默认值', type: 'text' },
    ],
  },
  {
    code: 'multiEnum',
    label: '多选',
    category: 'special',
    description: '多选下拉/复选框组',
    icon: 'CheckSquare',
    configurableProperties: [
      { key: 'options', label: '可选项', type: 'textarea', required: true, placeholder: '每行一个，格式：值|标签' },
      { key: 'maxSelect', label: '最多可选', type: 'number' },
      { key: 'displayAs', label: '展示方式', type: 'select', defaultValue: 'select', options: [
        { label: '多选下拉', value: 'select' },
        { label: '复选框组', value: 'checkbox' },
      ]},
    ],
  },
  {
    code: 'status',
    label: '状态',
    category: 'special',
    description: '系统管控的状态字段',
    icon: 'CircleDot',
    configurableProperties: [
      { key: 'linkedLifecycle', label: '绑定生命周期', type: 'select', options: [] },
      { key: 'initialState', label: '初始状态', type: 'text', placeholder: '如：草稿' },
    ],
  },
  {
    code: 'json',
    label: 'JSON',
    category: 'special',
    description: '结构化 JSON 数据',
    icon: 'Braces',
    configurableProperties: [
      { key: 'editorHeight', label: '编辑器高度(px)', type: 'number', defaultValue: 200 },
      { key: 'placeholder', label: '占位提示', type: 'text' },
      { key: 'defaultValue', label: '默认值', type: 'textarea', placeholder: '{}' },
    ],
  },
];

// ===== O(1) 查找表 =====
export const FIELD_TYPE_MAP: Record<string, FieldTypeDefinition> = {};
for (const ft of FIELD_TYPES) {
  FIELD_TYPE_MAP[ft.code] = ft;
}

// ===== 从旧版 free-text type 映射到新 fieldTypeCode =====
const LEGACY_TYPE_MAP: Record<string, string> = {
  '文本': 'text',
  '长文本': 'longText',
  '数字': 'number',
  '金额': 'amount',
  '日期': 'date',
  '引用对象': 'reference',
  '状态': 'status',
};

export function mapLegacyTypeToCode(legacyType: string): string {
  return LEGACY_TYPE_MAP[legacyType] ?? 'text';
}

// ===== 校验规则类型 =====
export type ValidationRuleType = 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'unique';

export interface FieldValidationRule {
  id: string;
  type: ValidationRuleType;
  value?: string | number;
  message: string;
}

export const VALIDATION_RULE_OPTIONS: { label: string; value: ValidationRuleType; needsValue: boolean; valueType: string }[] = [
  { label: '必填', value: 'required', needsValue: false, valueType: '' },
  { label: '最小值', value: 'min', needsValue: true, valueType: 'number' },
  { label: '最大值', value: 'max', needsValue: true, valueType: 'number' },
  { label: '最小长度', value: 'minLength', needsValue: true, valueType: 'number' },
  { label: '最大长度', value: 'maxLength', needsValue: true, valueType: 'number' },
  { label: '正则匹配', value: 'pattern', needsValue: true, valueType: 'text' },
  { label: '唯一性', value: 'unique', needsValue: false, valueType: '' },
];

// ===== Agent 权限选项 =====
export const AGENT_PERMISSION_OPTIONS = [
  { value: '只读', label: '只读' },
  { value: '可读', label: '可读' },
  { value: '可建议', label: '可建议' },
  { value: '不可改', label: '不可改' },
  { value: '系统控制', label: '系统控制' },
];

// ===== 风险等级选项 =====
export const RISK_LEVEL_OPTIONS = [
  { value: '低', label: '低' },
  { value: '中', label: '中' },
  { value: '高', label: '高' },
];
