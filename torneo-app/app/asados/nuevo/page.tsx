import { getTournamentData } from '@/lib/db';
import AsadoForm from '@/components/AsadoForm';
import Link from 'next/link';

export default async function NuevoAsadoPage() {
  const data = await getTournamentData();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-orange-600 hover:text-orange-700 font-medium">
            ← Volver al inicio
          </Link>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crear Nuevo Asado
          </h1>
          <p className="text-gray-600">
            Completa la información del asado y asigna roles a los participantes.
          </p>
        </div>
        
        <AsadoForm users={data.users} />
      </div>
    </div>
  );
}

