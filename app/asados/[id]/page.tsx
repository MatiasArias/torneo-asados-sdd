import { getTournamentData } from '@/lib/db';
import AsadoForm from '@/components/AsadoForm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditarAsadoPage({ params }: { params: { id: string } }) {
  const data = await getTournamentData();
  const asado = data.asados.find(a => a.id === params.id);
  
  if (!asado) {
    notFound();
  }
  
  const participations = data.participations.filter(p => p.asadoId === params.id);
  
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

