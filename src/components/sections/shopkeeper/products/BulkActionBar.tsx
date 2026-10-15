'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Eye, EyeOff, LayoutPanelTop, PackagePlus, PackageX } from 'lucide-react';
import Button from '@/components/ui/Button';

interface BulkActionBarProps {
  selectedIds: string[];
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onBulkPublish: (publish: boolean) => void;
  onBulkRestock?: (quantity: number) => void;
  onBulkMarkOutOfStock?: () => void;
}

export default function BulkActionBar({
  selectedIds,
  onClearSelection,
  onBulkDelete,
  onBulkPublish,
  onBulkRestock,
  onBulkMarkOutOfStock,
}: BulkActionBarProps) {
  const count = selectedIds.length;

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 z-50 flex max-w-[95vw] -translate-x-1/2 flex-wrap items-center gap-3 rounded-2xl bg-slate-900/95 px-5 py-3.5 shadow-2xl backdrop-blur-md ring-1 ring-white/10"
        >
          <div className="flex items-center gap-3 border-r border-slate-700 pr-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <LayoutPanelTop className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{count} Selected</p>
              <button
                onClick={onClearSelection}
                className="text-xs text-slate-400 transition-colors hover:text-white"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Restock +10 */}
            {onBulkRestock && (
              <Button
                variant="secondary"
                size="sm"
                className="border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300"
                onClick={() => onBulkRestock(10)}
              >
                <PackagePlus className="mr-1.5 h-3.5 w-3.5" />
                Restock (+10)
              </Button>
            )}

            {/* Quick Mark Out of Stock */}
            {onBulkMarkOutOfStock && (
              <Button
                variant="secondary"
                size="sm"
                className="border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300"
                onClick={onBulkMarkOutOfStock}
              >
                <PackageX className="mr-1.5 h-3.5 w-3.5" />
                Mark OOS (0)
              </Button>
            )}

            <Button
              variant="secondary"
              size="sm"
              className="border border-slate-700 bg-transparent text-white hover:bg-slate-800"
              onClick={() => onBulkPublish(true)}
            >
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              Publish
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="border border-slate-700 bg-transparent text-white hover:bg-slate-800"
              onClick={() => onBulkPublish(false)}
            >
              <EyeOff className="mr-1.5 h-3.5 w-3.5" />
              Unpublish
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="border border-red-900 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400"
              onClick={onBulkDelete}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
