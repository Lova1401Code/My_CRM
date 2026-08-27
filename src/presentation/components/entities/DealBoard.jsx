// Kanban board for deals: one column per stage, native HTML5 drag & drop.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Building2 } from 'lucide-react';
import { Badge } from '../ui/Badge.jsx';
import { Select } from '../ui/Input.jsx';
import { formatCurrency, formatDate } from '../../../shared/utils/formatters.js';
import {
  DealStage,
  DEAL_STAGE_LABELS,
  DEAL_STAGE_STYLES,
} from '../../../core/domain/enums/DealStage.js';

function DealCard({ deal, customerName, onStageChange }) {
  const navigate = useNavigate();
  const [dragging, setDragging] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', deal.id);
        e.dataTransfer.effectAllowed = 'move';
        setDragging(true);
      }}
      onDragEnd={() => setDragging(false)}
      onClick={() => navigate(`/deals/${deal.id}/edit`)}
      className={`cursor-grab rounded-md bg-white p-3 ring-1 ring-slate-200 shadow-sm transition hover:ring-indigo-300 active:cursor-grabbing ${
        dragging ? 'opacity-40' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-slate-900">{deal.title}</p>
        <span className="shrink-0 text-sm font-semibold text-slate-900">
          {formatCurrency(deal.amount)}
        </span>
      </div>
      <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
        <Building2 className="h-3 w-3" />
        <span className="truncate">{customerName || '—'}</span>
      </p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <Badge className={DEAL_STAGE_STYLES[deal.stage]}>
          {DEAL_STAGE_LABELS[deal.stage]}
        </Badge>
        {deal.expectedCloseDate && (
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <CalendarDays className="h-3 w-3" />
            {formatDate(deal.expectedCloseDate)}
          </span>
        )}
      </div>
      {/* Mobile / accessibility fallback: explicit stage selection */}
      <Select
        value={deal.stage}
        onChange={(e) => {
          e.stopPropagation();
          onStageChange(deal.id, e.target.value);
        }}
        onClick={(e) => e.stopPropagation()}
        className="!mt-2 !py-1 !text-xs"
        aria-label="Changer l'étape"
      >
        {Object.values(DealStage).map((s) => (
          <option key={s} value={s}>
            {DEAL_STAGE_LABELS[s]}
          </option>
        ))}
      </Select>
    </div>
  );
}

export function DealBoard({ deals, customerMap = {}, onStageChange }) {
  const [dragOverStage, setDragOverStage] = useState(null);
  const stages = Object.values(DealStage);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stages.map((stage) => {
        const stageDeals = deals.filter((d) => d.stage === stage);
        const total = stageDeals.reduce((sum, d) => sum + (d.amount || 0), 0);
        return (
          <div
            key={stage}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
              setDragOverStage(stage);
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setDragOverStage(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragOverStage(null);
              const dealId = e.dataTransfer.getData('text/plain');
              if (dealId) onStageChange(dealId, stage);
            }}
            className={`min-h-[200px] rounded-lg p-2 ring-1 transition ${
              dragOverStage === stage
                ? 'bg-indigo-50 ring-indigo-400'
                : 'bg-slate-100/70 ring-slate-200'
            }`}
          >
            <div className="mb-2 flex items-center justify-between px-1 pt-1">
              <Badge className={DEAL_STAGE_STYLES[stage]}>{DEAL_STAGE_LABELS[stage]}</Badge>
              <span className="text-xs text-slate-500">
                {stageDeals.length} · {formatCurrency(total)}
              </span>
            </div>
            <div className="space-y-2">
              {stageDeals.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  customerName={customerMap[deal.customerId]?.company}
                  onStageChange={onStageChange}
                />
              ))}
              {stageDeals.length === 0 && (
                <p className="rounded-md border border-dashed border-slate-300 px-2 py-6 text-center text-xs text-slate-400">
                  Déposez une affaire ici
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
