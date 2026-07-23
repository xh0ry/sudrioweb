import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save, ArrowLeft, Image as ImageIcon, Video } from 'lucide-react';
import { useState } from 'react';

export default function Edit({ news }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: news.title || '',
        content: news.content || '',
        image: null,
        remove_image: false,
        youtube_url: news.youtube_url || '',
    });

    const [imagePreview, setImagePreview] = useState(news.image_path ? `/storage/${news.image_path}` : null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setData('remove_image', false);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        // We use post because of multipart/form-data constraints in PHP, but with _method: 'PUT'
        post(route('admin.news.update', news.id));
    };

    return (
        <AdminLayout title="Editar Noticia">
            <div className="mb-6">
                <Link href={route('admin.news.index')} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-2 w-fit">
                    <ArrowLeft className="w-4 h-4" /> Volver
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8 max-w-3xl">
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-sudrio-DEFAULT focus:ring-sudrio-DEFAULT"
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contenido</label>
                        <textarea
                            value={data.content}
                            onChange={e => setData('content', e.target.value)}
                            rows={6}
                            className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-sudrio-DEFAULT focus:ring-sudrio-DEFAULT"
                        />
                        {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" /> Imagen (Opcional)
                            </label>
                            
                            {imagePreview && !data.remove_image ? (
                                <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 mb-2">
                                    <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => { 
                                            setData('image', null); 
                                            setData('remove_image', true);
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-md text-xs font-bold"
                                    >
                                        Quitar
                                    </button>
                                </div>
                            ) : (
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sudrio-DEFAULT/10 file:text-sudrio-DEFAULT hover:file:bg-sudrio-DEFAULT/20 transition-colors"
                                />
                            )}
                            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                <Video className="w-4 h-4" /> Video de YouTube (Opcional)
                            </label>
                            <input
                                type="url"
                                value={data.youtube_url}
                                onChange={e => setData('youtube_url', e.target.value)}
                                className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-sudrio-DEFAULT focus:ring-sudrio-DEFAULT text-sm"
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                            {errors.youtube_url && <p className="mt-1 text-sm text-red-600">{errors.youtube_url}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 px-6 py-3 bg-sudrio-DEFAULT text-white rounded-xl font-bold hover:bg-sudrio-dark transition-colors shadow-lg shadow-sudrio-DEFAULT/30 disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            {processing ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
