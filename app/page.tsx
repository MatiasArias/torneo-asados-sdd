import { getTournamentData } from '@/lib/db';
import { calculateRankings } from '@/lib/rankings';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const data = await getTournamentData();
  const rankings = calculateRankings(data);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            🥩 Torneo de Asadores 2025
          </h1>
          <p className="text-gray-600">
            {data.asados.length} asados • {data.users.length} participantes
          </p>
        </div>
        
        {/* Podium (Top 3) */}
        {rankings.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
            {/* 2nd place */}
            <div className="flex flex-col items-center pt-8">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-2xl mb-2">
                🥈
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-md w-full">
                <p className="font-semibold text-gray-900">{rankings[1].user.name}</p>
                <p className="text-2xl font-bold text-gray-700">{rankings[1].totalPoints}</p>
                <p className="text-xs text-gray-500">pts</p>
              </div>
            </div>
            
            {/* 1st place */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-3xl mb-2">
                👑
              </div>
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg p-4 text-center shadow-lg w-full border-2 border-yellow-400">
                <p className="font-bold text-gray-900">{rankings[0].user.name}</p>
                <p className="text-3xl font-bold text-gray-900">{rankings[0].totalPoints}</p>
                <p className="text-xs text-gray-600">pts</p>
              </div>
            </div>
            
            {/* 3rd place */}
            <div className="flex flex-col items-center pt-12">
              <div className="w-14 h-14 bg-orange-300 rounded-full flex items-center justify-center text-xl mb-2">
                🥉
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-md w-full">
                <p className="font-semibold text-gray-900">{rankings[2].user.name}</p>
                <p className="text-xl font-bold text-gray-700">{rankings[2].totalPoints}</p>
                <p className="text-xs text-gray-500">pts</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mb-8">
          <Link
            href="/asados/nuevo"
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-colors"
          >
            + Crear Asado
          </Link>
          <Link
            href="/penalties"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-colors"
          >
            ⚠️ Penalties
          </Link>
        </div>
        
        {/* Full Rankings Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Puntos</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Asistidos</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Cocinados</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Hosteados</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Penalties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rankings.map((ranking) => (
                  <tr 
                    key={ranking.userId}
                    className={`hover:bg-gray-50 transition-colors ${
                      ranking.position <= 3 ? 'bg-orange-50' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {ranking.position}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {ranking.user.name}
                      {ranking.position === 1 && ' 👑'}
                    </td>
                    <td className="px-4 py-3 text-center text-sm font-bold text-orange-600">
                      {ranking.totalPoints}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">
                      {ranking.asadosAttended}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">
                      {ranking.asadosCooked}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">
                      {ranking.timesHosted}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-red-600">
                      {ranking.totalPenalties > 0 ? `-${ranking.totalPenalties}` : '0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Recent Asados */}
        {data.asados.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Asados Recientes</h2>
            <div className="space-y-2">
              {data.asados
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((asado) => {
                  const host = data.users.find(u => u.id === asado.hostId);
                  const participants = data.participations.filter(p => p.asadoId === asado.id && p.asistio);
                  return (
                    <Link
                      key={asado.id}
                      href={`/asados/${asado.id}`}
                      className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{asado.name}</h3>
                          <p className="text-sm text-gray-600">
                            Host: {host?.name} • {participants.length} asistentes
                          </p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          {new Date(asado.date).toLocaleDateString('es-AR')}
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        )}
        
        {data.asados.length === 0 && (
          <div className="mt-8 text-center text-gray-500">
            <p className="text-lg mb-4">No hay asados registrados aún.</p>
            <p>¡Crea el primer asado del torneo! 🔥</p>
          </div>
        )}
      </div>
    </div>
  );
}
