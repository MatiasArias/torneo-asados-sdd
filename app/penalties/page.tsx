'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Penalty, User } from '@/lib/types';
import AccessCodeModal from '@/components/AccessCodeModal';

export default function PenaltiesPage() {
  const router = useRouter();
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Access code modal state
  const [showAccessCodeModal, setShowAccessCodeModal] = useState(false);
  const [isAccessGranted, setIsAccessGranted] = useState(false);
  const [pendingAction, setPendingAction] = useState<'create' | 'delete' | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  
  // Form state
  const [userId, setUserId] = useState('');
  const [points, setPoints] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      const [penaltiesRes, usersRes] = await Promise.all([
        fetch('/api/penalties'),
        fetch('/api/users'),
      ]);
      
      const penaltiesData = await penaltiesRes.json();
      const usersData = await usersRes.json();
      
      setPenalties(penaltiesData.penalties || []);
      setUsers(usersData.users || []);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check access code first
    if (!isAccessGranted) {
      setPendingAction('create');
      setShowAccessCodeModal(true);
      return;
    }
    
    setSubmitting(true);
    
    try {
      const penalty = {
        userId,
        points: -Math.abs(parseInt(points)), // Ensure negative
        reason,
        date: new Date().toISOString(),
      };
      
      const response = await fetch('/api/penalties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(penalty),
      });
      
      if (!response.ok) {
        throw new Error('Error al crear penalty');
      }
      
      // Reset form
      setUserId('');
      setPoints('');
      setReason('');
      setShowForm(false);
      setIsAccessGranted(false); // Reset access for next time
      
      // Reload data
      await loadData();
      router.refresh();
    } catch (error) {
      console.error('Error creating penalty:', error);
      alert('Error al crear penalty');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleAccessCodeSuccess = () => {
    setShowAccessCodeModal(false);
    setIsAccessGranted(true);
    
    // Execute pending action
    if (pendingAction === 'create') {
      setPendingAction(null);
      setTimeout(() => {
        const form = document.querySelector('form');
        if (form) {
          form.requestSubmit();
        }
      }, 100);
    } else if (pendingAction === 'delete' && pendingDeleteId) {
      setPendingAction(null);
      const idToDelete = pendingDeleteId;
      setPendingDeleteId(null);
      executeDelete(idToDelete);
    }
  };
  
  const handleAccessCodeCancel = () => {
    setShowAccessCodeModal(false);
    setPendingAction(null);
    setPendingDeleteId(null);
  };
  
  const executeDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/penalties?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar penalty');
      }
      
      setIsAccessGranted(false); // Reset access for next time
      await loadData();
      router.refresh();
    } catch (error) {
      console.error('Error deleting penalty:', error);
      alert('Error al eliminar penalty');
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este penalty?')) {
      return;
    }
    
    // Check access code first
    if (!isAccessGranted) {
      setPendingAction('delete');
      setPendingDeleteId(id);
      setShowAccessCodeModal(true);
      return;
    }
    
    await executeDelete(id);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 md:p-8">
      {/* Access Code Modal */}
      {showAccessCodeModal && (
        <AccessCodeModal
          actionName={pendingAction === 'create' ? 'crear la penalización' : 'eliminar la penalización'}
          onSuccess={handleAccessCodeSuccess}
          onCancel={handleAccessCodeCancel}
        />
      )}
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-orange-600 hover:text-orange-700 font-medium">
            ← Volver al inicio
          </Link>
        </div>
        
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ⚠️ Penalties
            </h1>
            <p className="text-gray-600">
              Gestiona las penalizaciones del torneo.
            </p>
          </div>
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            {showForm ? 'Cancelar' : '+ Agregar Penalty'}
          </button>
        </div>
        
        {/* Add Penalty Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Nuevo Penalty</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario *
                </label>
                <select
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">Selecciona un usuario...</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Puntos a restar * (número positivo)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Ej: 3"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Razón *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={3}
                  placeholder="Ej: Comportamiento antideportivo"
                  required
                />
              </div>
              
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Guardando...' : 'Agregar Penalty'}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Common Penalties Reference */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Penalties Comunes:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Comportamiento antideportivo: <strong>-3 puntos</strong></li>
            <li>• No hostear en el año: <strong>-3 puntos</strong> (aplicar a fin de año)</li>
            <li>• Tercer ausencia consecutiva: <strong>-1 punto</strong> (automático si trackeas)</li>
          </ul>
        </div>
        
        {/* Penalties List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {penalties.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg mb-2">No hay penalties registrados.</p>
              <p className="text-sm">¡Esperemos que siga así! 🎉</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Usuario</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Puntos</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Razón</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Fecha</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {penalties
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((penalty) => {
                      const user = users.find(u => u.id === penalty.userId);
                      return (
                        <tr key={penalty.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {user?.name || 'Usuario desconocido'}
                          </td>
                          <td className="px-4 py-3 text-center text-sm font-bold text-red-600">
                            {penalty.points}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {penalty.reason}
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-gray-600">
                            {new Date(penalty.date).toLocaleDateString('es-AR')}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleDelete(penalty.id)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

