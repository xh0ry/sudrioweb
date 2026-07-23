import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, Image as ImageIcon, Video } from 'lucide-react';

export default function Index({ news }) {
    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de eliminar esta noticia?')) {
            router.delete(route('admin.news.destroy', id));
        }
    };

    return (
        <AdminLayout title="Noticias y Novedades">
            <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600 dark:text-gray-400">Gestiona las noticias que aparecen en la página de inicio.</p>
                <Link
                    href={route('admin.news.create')}
                    className="flex items-center gap-2 px-4 py-2 bg-sudrio-DEFAULT text-white rounded-xl font-medium hover:bg-sudrio-dark transition-colors shadow-lg shadow-sudrio-DEFAULT/30"
                >
                    <Plus className="w-5 h-5" />
                    Nueva Noticia
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {news.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                        No hay noticias publicadas aún.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                    <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Media</th>
                                    <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Título</th>
                                    <th className="p-4 font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">Fecha</th>
                                    <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {news.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                                        <td className="p-4 w-24">
                                            {item.image_path ? (
                                                <div className="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden relative">
                                                    <img src={`/storage/${item.image_path}`} alt="cover" className="w-full h-full object-cover" />
                                                </div>
                                            ) : item.youtube_url ? (
                                                <div className="w-16 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-red-500">
                                                    <Video className="w-6 h-6" />
                                                </div>
                                            ) : (
                                                <div className="w-16 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                                                    <ImageIcon className="w-6 h-6" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-gray-900 dark:text-white line-clamp-1">{item.title}</div>
                                            <div className="text-sm text-gray-500 line-clamp-1">{item.content}</div>
                                        </td>
                                        <td className="p-4 hidden md:table-cell text-sm text-gray-500">
                                            {new Date(item.created_at).toLocaleDateString('es-AR')}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={route('admin.news.edit', item.id)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
