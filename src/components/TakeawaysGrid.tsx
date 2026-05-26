import React, { useState } from 'react';
import { Takeaway } from '../types';
import { Lightbulb, Trash, Plus, Settings } from 'lucide-react';

interface TakeawaysGridProps {
  takeaways: Takeaway[];
  onUpdateTakeaways: (takeaways: Takeaway[]) => void;
}

export default function TakeawaysGrid({ takeaways, onUpdateTakeaways }: TakeawaysGridProps) {
  const [editingMode, setEditingMode] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<Takeaway['priority']>('Quick Fix');
  const [newEmoji, setNewEmoji] = useState('💡');

  const priorityOptions: Takeaway['priority'][] = [
    'Critical',
    'Overhaul Needed',
    'Process Gap',
    'Bright Spot',
    'Quick Fix',
  ];

  const getUrgencyClass = (priority: string) => {
    switch (priority) {
      case 'Critical':
      case 'Overhaul Needed':
        return 'bg-red-50 text-red-700 border border-red-250';
      case 'Process Gap':
      case 'Quick Fix':
        return 'bg-amber-50 text-amber-700 border border-amber-250';
      default:
        return 'bg-emerald-50 text-emerald-700 border border-[#a7f3d0]/60';
    }
  };

  const getPriorityIconClass = (priority: string) => {
    switch (priority) {
      case 'Critical':
      case 'Overhaul Needed':
        return 'bg-red-50 border border-red-100 text-red-600';
      case 'Process Gap':
      case 'Quick Fix':
        return 'bg-amber-50 border border-amber-100 text-[#FD5900]';
      default:
        return 'bg-emerald-50 border border-emerald-100 text-emerald-600';
    }
  };

  const handleAddTakeaway = () => {
    if (!newTitle.trim() || !newDescription.trim()) return;
    const updated = [
      ...takeaways,
      {
        priority: newPriority,
        emoji: newEmoji,
        title: newTitle.trim(),
        description: newDescription.trim(),
        fullWidth: takeaways.length === 0, // span first if empty
      },
    ];
    onUpdateTakeaways(updated);
    setNewTitle('');
    setNewDescription('');
  };

  const handleRemoveTakeaway = (index: number) => {
    const updated = takeaways.filter((_, i) => i !== index);
    // ensure at least one full width if we still have entries
    if (updated.length > 0) {
      updated[0].fullWidth = true;
    }
    onUpdateTakeaways(updated);
  };

  const handleUpdateField = (index: number, field: keyof Takeaway, value: string) => {
    const updated = takeaways.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onUpdateTakeaways(updated);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center bg-white border border-slate-200 rounded-xl px-6 py-4 mb-6 shadow-sm">
        <div>
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            C-4 Strategic Action Plan
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Edit priority directives to align team objectives</p>
        </div>
        <button
          onClick={() => setEditingMode(!editingMode)}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
            editingMode
              ? 'bg-[#FD5900] text-white border-transparent'
              : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          {editingMode ? 'Finish Advising' : 'Edit Takeaways'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {takeaways.map((t, idx) => (
          <div
            key={idx}
            className={`bg-white border border-slate-200 rounded-2xl p-6 relative transition hover:border-[#FD5900]/25 shadow-sm hover:shadow-md ${
              t.fullWidth || idx === 0 ? 'md:col-span-2' : ''
            }`}
          >
            {/* Takeaway Header elements */}
            <div className="flex justify-between items-start gap-4 mb-4">
              <div className="flex gap-3.5 items-center">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shadow-inner ${getPriorityIconClass(t.priority)}`}>
                  {t.emoji || '💡'}
                </div>
                <div>
                  <div className="flex gap-2 items-center flex-wrap">
                    <span className={`text-[10px] uppercase font-mono tracking-wider font-bold rounded-full px-2.5 py-0.5 border ${getUrgencyClass(t.priority)}`}>
                      {t.priority}
                    </span>
                  </div>
                </div>
              </div>

              {editingMode && (
                <button
                  onClick={() => handleRemoveTakeaway(idx)}
                  className="text-red-500 hover:text-red-700 transition p-1.5 hover:bg-red-50 rounded-md flex-shrink-0"
                >
                  <Trash className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Content Fields */}
            {editingMode ? (
              <div className="space-y-3 mt-4">
                <input
                  type="text"
                  value={t.title}
                  onChange={(e) => handleUpdateField(idx, 'title', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-[#FD5900] focus:bg-white focus:ring-1 focus:ring-[#FD5900]/10"
                />
                <textarea
                  value={t.description}
                  onChange={(e) => handleUpdateField(idx, 'description', e.target.value)}
                  className="w-full h-24 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 focus:outline-none focus:border-[#FD5900] focus:bg-white resize-none"
                />
                <div className="flex gap-3 items-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Topic Priority:</span>
                  <select
                     value={t.priority}
                     onChange={(e) => handleUpdateField(idx, 'priority', e.target.value)}
                     className="bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 p-1"
                  >
                    {priorityOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div>
                <h5 className="text-slate-800 font-bold text-lg mb-2 leading-snug select-text">
                  {t.title}
                </h5>
                <p className="text-sm text-slate-600 leading-relaxed select-text">
                  {t.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {editingMode && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm max-w-full">
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#FD5900]" />
            Formulate New Strategic Directive
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as Takeaway['priority'])}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-805 focus:outline-none focus:border-[#FD5900]"
              >
                {priorityOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Emoji
              </label>
              <input
                type="text"
                value={newEmoji}
                onChange={(e) => setNewEmoji(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-[#FD5900] text-center"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Task Title
              </label>
              <input
                type="text"
                placeholder="Overdue outbound SLA corrective parameters..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-[#FD5900]"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Description Sentence
            </label>
            <textarea
              placeholder="Provide 2 to 3 sentences detailing the exact business issue, active peer benchmark evidence, and step-by-step resolution requirements."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full h-20 bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-800 focus:outline-none focus:border-[#FD5900]"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAddTakeaway}
              className="px-4 py-2 bg-[#FD5900] text-[#ffffff] text-xs font-bold rounded-lg hover:bg-[#ff6e1d] flex items-center gap-1.5 transition uppercase"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Takeaway
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
