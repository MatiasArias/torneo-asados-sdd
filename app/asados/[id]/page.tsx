'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AsadoForm from '@/components/AsadoForm';
import AccessCodeModal from '@/components/AccessCodeModal';
import Link from 'next/link';
import type { TournamentData } from '@/lib/types';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function EditarAsadoPage({ params }: PageProps) {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [data, setData] = useState<TournamentData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Access code for delete
  const [showAccessCodeModal, setShowAccessCodeModal] = useState(false);
  const [isAccessGranted, setIsAccessGranted] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);
  
  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);
  
  const loadData = async () => {
    try {
      const response = await fetch('/api/asados');
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };
  
  const handleDeleteClick = () => {
    if (!confirm('¿Estás seguro que quieres eliminar este asado? Esta acción no se puede deshacer.')) {
      return;
    }
    
    if (!isAccessGranted) {
      setShowAccessCodeModal(true);
      return;
    }
    
    executeDelete();
  };
  
  const handleAccessCodeSuccess = () => {
    setShowAccessCodeModal(false);
    setIsAccessGranted(true);
    executeDelete();
  };
  
  const handleAccessCodeCancel = () => {
    setShowAccessCodeModal(false);
  };
  
  const executeDelete = async () => {
    setDeleting(true);
    
    try {
      const response = await fetch(`/api/asados/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar el asado');
      }
      
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error deleting asado:', error);
      alert('Error al eliminar el asado');
      setDeleting(false);
      setIsAccessGranted(false);
    }
  };
  
  if (loading || !data || !id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }
  
  const asado = data.asados.find(a => a.id === id);
  
  if (!asado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-xl text-gray-600">Asado no encontrado</div>
      </div>
    );
  }
  
  const participations = data.participations.filter(p => p.asadoId === id);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 md:p-8">
      {/* Access Code Modal */}
      {showAccessCodeModal && (
        <AccessCodeModal
          actionName="eliminar el asado"
          onSuccess={handleAccessCodeSuccess}
          onCancel={handleAccessCodeCancel}
        />
      )}
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/" className="text-orange-600 hover:text-orange-700 font-medium">
            ← Volver al inicio
          </Link>
          
          {/* Delete Button */}
          <button
            onClick={handleDeleteClick}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Eliminar asado"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
              />
            </svg>
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Editar Asado
          </h1>
          <p className="text-gray-600">
            Modifica la información del asado "{asado.name}".
          </p>
        </div>
        
        <AsadoForm
          users={data.users}
          initialData={{
            name: asado.name,
            date: asado.date,
            time: asado.time,
            location: asado.location,
            hostId: asado.hostId,
            notes: asado.notes || '',
            participations,
          }}
          asadoId={asado.id}
        />
      </div>
    </div>
  );
}

