import React, { useState, useCallback, useMemo } from 'react';
import {
  AlignLeft,
  ArrowRight,
  BarChart3,
  Braces,
  Calendar,
  CheckSquare,
  ChevronDown,
  CircleDot,
  Clock,
  DollarSign,
  GitBranch,
  Hash,
  Image,
  Link,
  ListOrdered,
  Lock,
  Mail,
  Paperclip,
  Percent,
  Phone,
  Plus,
  Search,
  Sigma,
  ToggleLeft,
  Type,
  X,
} from 'lucide-react';
import type { ObjectFieldMock, BusinessObjectMock } from '../data/platformMock';
import { OBJECT_FIELDS_MAP } from '../data/platformMock';
import {
  FIELD_TYPES,
  FIELD_TYPE_CATEGORIES,
  FIELD_TYPE_MAP,
  VALIDATION_RULE_OPTIONS,
  AGENT_PERMISSION_OPTIONS,
  RISK_LEVEL_OPTIONS,
  type FieldTypeDefinition,
  type FieldValidationRule,
} from '../data/fieldTypes';
import { TextInput, NumberInput, SelectInput, TextAreaInput, ToggleInput } from './FormField';

// ===== Icon mapping =====
const ICON_MAP: Record<string, React.ElementType> = {
  AlignLeft, ArrowRight, BarChart3, Braces, Calendar, CheckSquare, ChevronDown,
  CircleDot, Clock, DollarSign, GitBranch, Hash, Image, Link, ListOrdered,
  Lock, Mail, Paperclip, Percent, Phone, Plus, Search, Sigma, ToggleLeft, Type, X,
};

function FieldIcon({ icon }: { icon: string }) {
  const Icon = ICON_MAP[icon];
  return Icon ? <Icon className="h-4 w-4" /> : <Type className="h-4 w-4" />;
}

// ===== Section header =====
function SectionTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-3">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</h4>
      {desc ? <p className="mt-0.5 text-xs text-slate-400">{desc}</p> : null}
    </div>
  );
}

// ===== Props =====
interface FieldFormProps {
  mode: 'create' | 'edit';
  initialData?: ObjectFieldMock;
  existingFields: ObjectFieldMock[];
  businessObjects: BusinessObjectMock[];
  onSave: (field: ObjectFieldMock) => void;
  onCancel: () => void;
}

// ===== Helper: slug from name =====
function slugFromName(name: string): string {
  // Simple camelCase conversion: "订单金额" -> "orderAmount" is too complex for pure client-side
  // Instead, generate a readable pinyin-like code or just use a timestamp-based fallback
  if (!name.trim()) return '';
  // For Chinese names, use the first chars or let user type manually
  return name
    .trim()
    .toLowerCase()
    .replace(/[^\w一-鿿]/g, '_')
    .slice(0, 40);
}

// ===== Category badge tones =====
const categoryToneMap: Record<string, { active: string; inactive: string; ring: string }> = {
  blue: { active: 'border-blue-400 bg-blue-50 text-blue-700', inactive: 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50', ring: 'ring-blue-200' },
  purple: { active: 'border-purple-400 bg-purple-50 text-purple-700', inactive: 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50', ring: 'ring-purple-200' },
  green: { active: 'border-emerald-400 bg-emerald-50 text-emerald-700', inactive: 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50', ring: 'ring-emerald-200' },
  amber: { active: 'border-amber-400 bg-amber-50 text-amber-700', inactive: 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50', ring: 'ring-amber-200' },
};

export function FieldForm({ mode, initialData, existingFields, businessObjects, onSave, onCancel }: FieldFormProps) {
  // ---- Derive initial type from data ----
  const initialTypeCode = initialData?.fieldTypeCode ?? 'text';
  const [selectedTypeCode, setSelectedTypeCode] = useState(initialTypeCode);
  const selectedType = FIELD_TYPE_MAP[selectedTypeCode] ?? FIELD_TYPES[0];

  // ---- Active category ----
  const [activeCategory, setActiveCategory] = useState(selectedType.category);

  // ---- Form state ----
  const [form, setForm] = useState({
    name: initialData?.name ?? '',
    code: initialData?.code ?? '',
    semantic: initialData?.semantic ?? '',
    risk: initialData?.risk ?? ('低' as '低' | '中' | '高'),
    agentPermission: initialData?.agentPermission ?? '可读',
    views: initialData?.views ?? '',
    description: initialData?.description ?? '',
    defaultValue: initialData?.defaultValue ?? '',
  });

  // ---- Type properties state ----
  const [typeProperties, setTypeProperties] = useState<Record<string, unknown>>(
    initialData?.typeProperties ?? {},
  );

  // ---- Validation rules state ----
  const [validationRules, setValidationRules] = useState<FieldValidationRule[]>(
    initialData?.validationRules ?? [],
  );

  // ---- Errors ----
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ---- Handlers ----
  const updateField = useCallback(<K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const handleNameChange = useCallback((name: string) => {
    setForm((prev) => {
      const code = prev.code === slugFromName(prev.name) || !prev.code
        ? slugFromName(name)
        : prev.code;
      return { ...prev, name, code };
    });
  }, []);

  const handleTypeSelect = useCallback((ft: FieldTypeDefinition) => {
    setSelectedTypeCode(ft.code);
    // Reset type properties when switching types
    setTypeProperties({});
  }, []);

  const handleTypePropChange = useCallback((key: string, value: unknown) => {
    setTypeProperties((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ---- Validation rules handlers ----
  const addValidationRule = useCallback(() => {
    setValidationRules((prev) => [
      ...prev,
      { id: `vr_${Date.now()}`, type: 'required', message: '' },
    ]);
  }, []);

  const removeValidationRule = useCallback((id: string) => {
    setValidationRules((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const updateValidationRule = useCallback(
    (id: string, patch: Partial<FieldValidationRule>) => {
      setValidationRules((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...patch } : r)),
      );
    },
    [],
  );

  // ---- Validate ----
  const validate = useCallback((): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = '字段名不能为空';
    if (!form.code.trim()) errs.code = '编码不能为空';
    const codeConflict = existingFields.some(
      (f) => f.code === form.code && f.id !== initialData?.id,
    );
    if (codeConflict) errs.code = '编码与已有字段冲突';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form, existingFields, initialData?.id]);

  // ---- Save ----
  const handleSave = useCallback(() => {
    if (!validate()) return;

    const field: ObjectFieldMock = {
      id: initialData?.id ?? `field_${Date.now()}`,
      name: form.name.trim(),
      code: form.code.trim(),
      type: selectedType.label, // keep legacy type display in sync
      fieldTypeCode: selectedTypeCode,
      semantic: form.semantic.trim(),
      risk: form.risk,
      agentPermission: form.agentPermission,
      views: form.views || '未配置视图',
      ruleHits: initialData?.ruleHits ?? '0',
      description: form.description.trim() || undefined,
      defaultValue: form.defaultValue || undefined,
      validationRules,
      typeProperties,
    };
    onSave(field);
  }, [form, selectedType, selectedTypeCode, validationRules, typeProperties, initialData, validate, onSave]);

  // ---- Filtered types by active category ----
  const visibleTypes = useMemo(
    () => FIELD_TYPES.filter((ft) => ft.category === activeCategory),
    [activeCategory],
  );

  // ---- Context: business objects for "目标对象" selection ----
  const businessObjectOptions = useMemo(
    () => businessObjects.map((obj) => ({ label: `${obj.name} (${obj.code})`, value: obj.id })),
    [businessObjects],
  );

  // ---- Context: current fields for "sourceReferenceField" selection ----
  const fieldOptions = useMemo(
    () =>
      existingFields
        .filter((f) => f.id !== initialData?.id)
        .map((f) => ({ label: `${f.name} (${f.code})`, value: f.id })),
    [existingFields, initialData?.id],
  );

  // ---- Render a single type property editor ----
  const renderProperty = (prop: (typeof selectedType.configurableProperties)[0]) => {
    const val = typeProperties[prop.key] ?? prop.defaultValue ?? '';

    const editor = (() => {
      // "目标对象" / "子对象" -> pick from business objects
      if (prop.key === 'targetObject' || prop.key === 'sourceObject') {
        const opts = businessObjectOptions.length > 0 ? businessObjectOptions : [{ label: '（暂无对象）', value: '' }];
        return (
          <SelectInput
            label={prop.label}
            value={String(val)}
            onChange={(v) => handleTypePropChange(prop.key, v)}
            options={opts}
            placeholder={prop.placeholder ?? `选择${prop.label}`}
            required={prop.required}
          />
        );
      }

      // "关联引用字段" -> pick from current object's fields
      if (prop.key === 'sourceReferenceField') {
        const opts = fieldOptions.length > 0 ? fieldOptions : [{ label: '（暂无字段）', value: '' }];
        return (
          <SelectInput
            label={prop.label}
            value={String(val)}
            onChange={(v) => handleTypePropChange(prop.key, v)}
            options={opts}
            placeholder={prop.placeholder ?? `选择${prop.label}`}
            required={prop.required}
          />
        );
      }

      // "展示字段" / "聚合字段" -> pick from selected target/sub-object's fields
      if (prop.key === 'displayField' || prop.key === 'sourceField') {
        const targetId = String(typeProperties.targetObject || typeProperties.sourceObject || '');
        const targetFields = targetId ? OBJECT_FIELDS_MAP[targetId] : undefined;
        if (targetFields && targetFields.length > 0) {
          const opts = targetFields.map((f) => ({
            label: `${f.name} (${f.code})`,
            value: f.code,
          }));
          return (
            <SelectInput
              label={prop.label}
              value={String(val)}
              onChange={(v) => handleTypePropChange(prop.key, v)}
              options={opts}
              placeholder="选择字段"
              required={prop.required}
            />
          );
        }
        // fallback: show text input if no target object selected yet
        return (
          <TextInput
            label={prop.label}
            value={String(val)}
            onChange={(v) => handleTypePropChange(prop.key, v)}
            placeholder={prop.placeholder ?? '请先选择目标对象'}
            disabled={!targetId}
          />
        );
      }

      switch (prop.type) {
        case 'text':
          return (
            <TextInput
              label={prop.label}
              value={String(val)}
              onChange={(v) => handleTypePropChange(prop.key, v)}
              placeholder={prop.placeholder}
              required={prop.required}
            />
          );
        case 'number':
          return (
            <NumberInput
              label={prop.label}
              value={val != null ? Number(val) : undefined}
              onChange={(v) => handleTypePropChange(prop.key, v)}
              placeholder={prop.placeholder}
              required={prop.required}
            />
          );
        case 'boolean':
          return (
            <ToggleInput
              label={prop.label}
              value={Boolean(val)}
              onChange={(v) => handleTypePropChange(prop.key, v)}
            />
          );
        case 'select':
          return (
            <SelectInput
              label={prop.label}
              value={String(val)}
              onChange={(v) => handleTypePropChange(prop.key, v)}
              options={prop.options ?? []}
              placeholder={prop.placeholder ?? `选择${prop.label}`}
              required={prop.required}
            />
          );
        case 'textarea':
          return (
            <TextAreaInput
              label={prop.label}
              value={String(val)}
              onChange={(v) => handleTypePropChange(prop.key, v)}
              placeholder={prop.placeholder}
              required={prop.required}
            />
          );
        default:
          return null;
      }
    })();

    return <div key={prop.key}>{editor}</div>;
  };

  // ================== RENDER ==================
  return (
    <div className="space-y-8">
      {/* ---- Section: Type Selector ---- */}
      <div>
        <SectionTitle title="字段类型" desc="选择字段的数据类型，不同类型决定后续可配置的属性" />
        {/* Category tabs */}
        <div className="mb-3 flex gap-1.5">
          {FIELD_TYPE_CATEGORIES.map((cat) => {
            const tones = categoryToneMap[cat.tone];
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeCategory === cat.key ? tones.active : tones.inactive
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
        {/* Type cards grid */}
        <div className="grid grid-cols-4 gap-2">
          {visibleTypes.map((ft) => {
            const isSelected = selectedTypeCode === ft.code;
            const cat = FIELD_TYPE_CATEGORIES.find((c) => c.key === ft.category);
            const tones = categoryToneMap[cat?.tone ?? 'blue'];
            return (
              <button
                key={ft.code}
                onClick={() => handleTypeSelect(ft)}
                className={`flex items-start gap-2.5 rounded-lg border p-3 text-left transition-all ${
                  isSelected
                    ? `${tones.active} ring-2 ${tones.ring}`
                    : `${tones.inactive}`
                }`}
              >
                <span className="mt-0.5 shrink-0 text-slate-500">
                  <FieldIcon icon={ft.icon} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">{ft.label}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{ft.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ---- Section: Basic Properties ---- */}
      <div className="border-t border-slate-200 pt-6">
        <SectionTitle title="基础属性" desc="字段的名称、编码和业务语义" />
        <div className="grid grid-cols-2 gap-4">
          <TextInput
            label="字段名"
            value={form.name}
            onChange={handleNameChange}
            placeholder="如：订单金额"
            required
            error={errors.name}
          />
          <TextInput
            label="编码"
            value={form.code}
            onChange={(v) => updateField('code', v)}
            placeholder="如：orderAmount"
            required
            error={errors.code}
          />
        </div>
        <div className="mt-4">
          <TextAreaInput
            label="业务语义"
            value={form.semantic}
            onChange={(v) => updateField('semantic', v)}
            placeholder="描述这个字段在业务中表达什么，如：客户交付承诺日期，是排产、采购和发货的关键基准日期"
            rows={2}
          />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <TextInput
            label="描述"
            value={form.description ?? ''}
            onChange={(v) => updateField('description', v)}
            placeholder="字段用途的补充说明"
          />
          <TextInput
            label="默认值"
            value={form.defaultValue ?? ''}
            onChange={(v) => updateField('defaultValue', v)}
            placeholder="新建记录时的初始值"
          />
        </div>
      </div>

      {/* ---- Section: Type-Specific Properties ---- */}
      {selectedType.configurableProperties.length > 0 ? (
        <div className="border-t border-slate-200 pt-6">
          <SectionTitle
            title={`${selectedType.label} 属性`}
            desc="该类型特有的配置项"
          />
          <div className="grid grid-cols-2 gap-4">
            {selectedType.configurableProperties.map(renderProperty)}
          </div>
        </div>
      ) : null}

      {/* ---- Section: Validation Rules ---- */}
      <div className="border-t border-slate-200 pt-6">
        <SectionTitle
          title="校验规则"
          desc="字段级别的输入校验，独立于跨字段业务规则"
        />
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left font-medium">规则类型</th>
                <th className="px-3 py-2 text-left font-medium">参数</th>
                <th className="px-3 py-2 text-left font-medium">错误提示</th>
                <th className="w-10 px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {validationRules.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-4 text-center text-xs text-slate-400">
                    暂无校验规则
                  </td>
                </tr>
              ) : (
                validationRules.map((rule) => {
                  const ruleDef = VALIDATION_RULE_OPTIONS.find((r) => r.value === rule.type);
                  return (
                    <tr key={rule.id} className="border-t border-slate-100">
                      <td className="px-3 py-2">
                        <select
                          value={rule.type}
                          onChange={(e) =>
                            updateValidationRule(rule.id, {
                              type: e.target.value as FieldValidationRule['type'],
                              value: e.target.value === 'required' || e.target.value === 'unique' ? undefined : rule.value,
                            })
                          }
                          className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:border-blue-400 focus:outline-none"
                        >
                          {VALIDATION_RULE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        {ruleDef?.needsValue ? (
                          <input
                            type={ruleDef.valueType === 'number' ? 'number' : 'text'}
                            value={rule.value ?? ''}
                            onChange={(e) =>
                              updateValidationRule(rule.id, {
                                value: ruleDef.valueType === 'number' ? Number(e.target.value) : e.target.value,
                              })
                            }
                            placeholder="参数值"
                            className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:border-blue-400 focus:outline-none"
                          />
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={rule.message}
                          onChange={(e) =>
                            updateValidationRule(rule.id, { message: e.target.value })
                          }
                          placeholder="如：金额不能为负"
                          className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:border-blue-400 focus:outline-none"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => removeValidationRule(rule.id)}
                          className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <button
          onClick={addValidationRule}
          className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-500 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-700"
        >
          <Plus className="h-3.5 w-3.5" />
          新增校验规则
        </button>
      </div>

      {/* ---- Section: Risk & Permissions ---- */}
      <div className="border-t border-slate-200 pt-6">
        <SectionTitle title="风险与权限" desc="配置字段的安全等级和 Agent 操作边界" />
        <div className="grid grid-cols-2 gap-6">
          {/* Risk level */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-700">风险等级</label>
            <div className="flex gap-2">
              {RISK_LEVEL_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`cursor-pointer rounded-md border px-3 py-1.5 text-sm transition-colors ${
                    form.risk === opt.value
                      ? 'border-slate-950 bg-slate-950 text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="risk"
                    value={opt.value}
                    checked={form.risk === opt.value}
                    onChange={(e) => updateField('risk', e.target.value as '低' | '中' | '高')}
                    className="sr-only"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Agent permission */}
          <SelectInput
            label="Agent 权限"
            value={form.agentPermission}
            onChange={(v) => updateField('agentPermission', v)}
            options={AGENT_PERMISSION_OPTIONS}
          />
        </div>

        <div className="mt-4">
          <TextInput
            label="使用视图"
            value={form.views}
            onChange={(v) => updateField('views', v)}
            placeholder="如：3个视图"
          />
        </div>
      </div>

      {/* ---- Footer (rendered outside modal footer slot) ---- */}
      <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
        <button
          onClick={onCancel}
          className="inline-flex h-9 items-center rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          取消
        </button>
        <button
          onClick={handleSave}
          className="inline-flex h-9 items-center rounded-md border border-slate-950 bg-slate-950 px-4 text-sm font-medium text-white hover:bg-slate-800"
        >
          {mode === 'create' ? '创建字段' : '保存修改'}
        </button>
      </div>
    </div>
  );
}
