
import React, { useState, useEffect, useCallback } from 'react';
import * as dbService from '../services/dbService';
import { StoredCreation } from '../types';
import { CloseIcon, DeleteIcon, ReloadIcon, PlayIcon } from './icons/Icons';

interface GalleryModalProps {
  onClose: () => void;
  onReload: (creation: StoredCreation) => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({ onClose, onReload }) => {
  const [creations, setCreations] = useState<StoredCreation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCreations = useCallback(async () => {
    setLoading(true);
    try {
      const items = await dbService.getCreations();
      setCreations(items);
    } catch (error) {
      console.error("Failed to load creations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCreations();
  }, [fetchCreations]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to permanently delete this creation?")) {
      try {
        await dbService.deleteCreation(id);
        fetchCreations(); // Refresh the list
      } catch (error) {
        console.error("Failed to delete creation:", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-40 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-slate-850 rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-xl font-semibold">My Creations</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-700"><CloseIcon /></button>
        </div>
        <div className="p-4 overflow-y-auto">
          {loading && <p>Loading creations...</p>}
          {!loading && creations.length === 0 && <p>No creations yet. Start creating to see your gallery!</p>}
          {!loading && creations.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {creations.map((item) => (
                <div key={item.id} className="group relative aspect-square rounded-md overflow-hidden bg-slate-700">
                  <img src={item.result.mediaType === 'image' ? item.result.mediaUrl : undefined} alt="Creation" className="w-full h-full object-cover" />
                  {item.result.mediaType === 'video' && (
                    <div className="w-full h-full bg-black flex items-center justify-center">
                      <video src={item.result.mediaUrl} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <PlayIcon className="w-10 h-10 text-white/80" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                    <p className="text-xs text-white truncate mb-2">{item.state.prompt}</p>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => handleDelete(item.id)} title="Delete Creation" className="p-2 bg-slate-900/70 rounded-full hover:bg-red-600 transition-colors">
                            <DeleteIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => onReload(item)} title="Reload Creation" className="p-2 bg-slate-900/70 rounded-full hover:bg-indigo-600 transition-colors">
                            <ReloadIcon className="w-4 h-4"/>
                        </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
