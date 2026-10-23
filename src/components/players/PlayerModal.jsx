import React, { useState, useEffect } from 'react';

export default function PlayerModal({ isOpen, onClose, onSave, playerData }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    gender: 'Male',
    age: '',
    rating: 0
  });

  // Populate form fields if editing an existing participant
  useEffect(() => {
    if (playerData) {
      setFormData({
        id: playerData.id || '',
        name: playerData.name || '',
        gender: playerData.gender || 'Male',
        age: playerData.age || '',
        rating: playerData.rating || 0
      });
    } else {
      // Auto-generate a dummy numeric ID for new registrations
      setFormData({
        id: Math.floor(10000000 + Math.random() * 90000000).toString(),
        name: '',
        gender: 'Male',
        age: '',
        rating: 0
      });
    }
  }, [playerData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSave({
      ...formData,
      age: Number(formData.age) || 18,
      rating: Number(formData.rating) || 0,
      isWithdrawn: playerData ? playerData.isWithdrawn : false,
      hadBye: playerData ? playerData.hadBye : false
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200">
        <div className="flex justify-between items-center pb-3 border-b border-stone-200 mb-5">
          <h3 className="text-lg font-bold text-stone-900">
            {playerData ? 'Edit Participant Details' : 'Register New Participant'}
          </h3>
          <button 
            type="button"
            onClick={onClose} 
            className="text-stone-400 hover:text-stone-700 font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Viswanathan Anand"
              className="w-full px-3.5 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                FIDE ID
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full px-3.5 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3.5 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Age
              </label>
              <input
                type="number"
                min="5"
                max="100"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="e.g. 21"
                className="w-full px-3.5 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                FIDE Rating (0 for Unrated)
              </label>
              <input
                type="number"
                min="0"
                max="3500"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full px-3.5 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg font-medium text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-stone-900 rounded-lg font-semibold text-xs transition-colors shadow-sm"
            >
              {playerData ? 'Save Changes' : 'Confirm Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}