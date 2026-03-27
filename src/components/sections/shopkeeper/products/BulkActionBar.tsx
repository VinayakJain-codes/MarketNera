'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Eye, EyeOff, LayoutPanelTop } from 'lucide-react';
import Button from '@/components/ui/Button';

interface BulkActionBarProps {
  selectedIds: string[];
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onBulkPublish: (publish: boolean) => void;
}

export default function BulkActionBar({ selectedIds, onClearSelection, onBulkDelete, onBulkPublish }: BulkActionBarProps) {
  const count = selectedIds.length;

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-2xl bg-slate-900 px-6 py-4 shadow-2xl ring-1 ring-white/10"
        >
          <div className="flex items-center gap-3 border-r border-slate-700 pr-4">
             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
               <LayoutPanelTop className="h-4 w-4" />
             </div>
             <div>
               <p className="text-sm font-bold text-white">{count} Selected</p>
               <button onClick={onClearSelection} className="text-xs text-slate-400 hover:text-white transition-colors">Clear selection</button>
             </div>
          </div>

          <div className="flex items-center gap-2 pl-2">
            <Button 
               variant="secondary" 
               className="border border-slate-700 bg-transparent text-white hover:bg-slate-800"
               onClick={() => onBulkPublish(true)}
            >
               <Eye className="h-4 w-4 mr-2" />
               Publish
            </Button>
            <Button 
               variant="secondary" 
               className="border border-slate-700 bg-transparent text-white hover:bg-slate-800"
               onClick={() => onBulkPublish(false)}
            >
               <EyeOff className="h-4 w-4 mr-2" />
               Unpublish
            </Button>
            <Button 
               variant="secondary" 
               className="border border-red-900 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400"
               onClick={onBulkDelete}
            >
               <Trash2 className="h-4 w-4 mr-2" />
               Delete
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
