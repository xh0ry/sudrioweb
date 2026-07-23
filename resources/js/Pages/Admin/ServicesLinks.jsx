import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { FileText, Plus, Trash2, Edit, X, UploadCloud, Info, BookOpen, Calculator, Scale, AlertTriangle, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ServicesLinks({ servicesLinks }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        desc: '',
        href: '',
        icon: null
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [editingLink, setEditingLink] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('icon', file);
            setImagePreview(URL.createObjectURL(file));
        } else {
            setData('icon', null);
            setImagePreview(null);
        }
    };

    const startEdit = (link) => {
        setEditingLink(link);
        setData({
            title: link.title,
            desc: link.desc || '',
            href: link.href || '',
            icon: null
        });
        if (link.icon && !link.icon.startsWith('default:')) {
            setImagePreview(link.icon);
        } else {
            setImagePreview(null);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingLink(null);
        reset();
        setImagePreview(null);
        const fileInput = document.getElementById('icon-input');
        if (fileInput) fileInput.value = '';
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingLink) {
            post(route('admin.services-links.update', editingLink.id), {
                onSuccess: () => {
                    setEditingLink(null);
                    reset();
                    setImagePreview(null);
                    const fileInput = document.getElementById('icon-input');
                    if (fileInput) fileInput.value = '';
                }
            });
        } else {
            post(route('admin.services-links.store'), {
                onSuccess: () => {
                    reset();
                    setImagePreview(null);
                    const fileInput = document.getElementById('icon-input');
                    if (fileInput) fileInput.value = '';
                }
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de eliminar este enlace de servicio?')) {
            router.delete(route('admin.services-links.destroy', id));
        }
    };

    // Helper to render beautiful default vector icons or image tags
    const renderIcon = (iconPath, name) => {
        if (iconPath && iconPath.startsWith('default:')) {
            const key = iconPath.split(':')[1];
            const iconClass = "w-8 h-8 text-sudrio-DEFAULT";
            let defaultIcon = <FileText className={iconClass} />;
            switch (key) {
                case 'invoice':
                    defaultIcon = <FileText className={iconClass} />; break;
                case 'rules':
                    defaultIcon = <BookOpen className={iconClass} />; break;
                case 'calculator':
                    defaultIcon = <Calculator className={iconClass} />; break;
                case 'scale':
                    defaultIcon = <Scale className={iconClass} />; break;
                case 'warning':
                    defaultIcon = <AlertTriangle className={iconClass} />; break;
            }

            return (
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm border border-gray-150 dark:border-gray-700">
                    {defaultIcon}
                </div>
            );
        }

        return (
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-650 shadow-sm">
                <img src={iconPath} alt={name} className="w-full h-full object-contain p-2" />
            </div>
        );
    };

    return (
        <AdminLayout title="Enlaces de Servicios">
            <p className="text-gray-600 dark:text-gray-400 mb-8">Administra los enlaces externos que aparecen en la sección pública de "Servicios" (gubernamentales, normativos o páginas externas). Puedes agregar nuevos, editarlos o borrarlos completamente.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulario de Alta / Edición */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                {editingLink ? <Edit className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-sudrio-DEFAULT" />}
                                {editingLink ? 'Editar Enlace' : 'Nuevo Enlace'}
                            </span>
                            {editingLink && (
                                <button type="button" onClick={cancelEdit} className="text-gray-450 hover:text-gray-600 dark:hover:text-gray-250 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </h2>

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Título del Servicio
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    placeholder="Ej. Reglamento de Suministro"
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-sudrio-DEFAULT focus:ring-sudrio-DEFAULT"
                                    required
                                />
                                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Descripción Breve
                                </label>
                                <input
                                    type="text"
                                    value={data.desc}
                                    onChange={e => setData('desc', e.target.value)}
                                    placeholder="Ej. Descargar cuadro tarifario en PDF"
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-sudrio-DEFAULT focus:ring-sudrio-DEFAULT"
                                    required
                                />
                                {errors.desc && <p className="mt-1 text-sm text-red-600">{errors.desc}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Enlace / URL
                                </label>
                                <input
                                    type="text"
                                    value={data.href}
                                    onChange={e => setData('href', e.target.value)}
                                    placeholder="https://..."
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-sudrio-DEFAULT focus:ring-sudrio-DEFAULT"
                                    required
                                />
                                {errors.href && <p className="mt-1 text-sm text-red-600">{errors.href}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    {editingLink ? 'Ícono (Opcional, conservar actual)' : 'Ícono (.PNG recomendado)'}
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-xl hover:border-sudrio-DEFAULT dark:hover:border-sudrio-DEFAULT transition-colors relative cursor-pointer group">
                                    <input
                                        type="file"
                                        id="icon-input"
                                        onChange={handleFileChange}
                                        accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        required={!editingLink}
                                    />
                                    <div className="space-y-1 text-center">
                                        {imagePreview ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <img src={imagePreview} alt="Preview" className="w-16 h-16 object-contain rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-1" />
                                                <span className="text-xs text-sudrio-DEFAULT font-semibold">Cambiar imagen</span>
                                            </div>
                                        ) : (
                                            <>
                                                <UploadCloud className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 group-hover:text-sudrio-DEFAULT transition-colors" />
                                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="font-semibold text-sudrio-DEFAULT hover:underline">Sube un archivo</span>
                                                </div>
                                                <p className="text-xs text-gray-550 dark:text-gray-400">
                                                    PNG, JPG o SVG hasta 2MB
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {errors.icon && <p className="mt-1 text-sm text-red-600">{errors.icon}</p>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 text-white rounded-xl font-bold transition-all shadow-lg disabled:opacity-50 ${
                                        editingLink 
                                            ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30' 
                                            : 'bg-sudrio-DEFAULT hover:bg-sudrio-dark shadow-sudrio-DEFAULT/30'
                                    }`}
                                >
                                    {editingLink ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                    {processing ? 'Guardando...' : editingLink ? 'Guardar Cambios' : 'Añadir Enlace'}
                                </button>
                                {editingLink && (
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-semibold transition-colors"
                                    >
                                        Cancelar Edición
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Listado y Vista General */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center justify-between">
                            <span>Enlaces Habilitados</span>
                            <span className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-950 text-gray-600 dark:text-gray-400 rounded-full font-semibold">
                                Total: {servicesLinks.length}
                            </span>
                        </h2>

                        {servicesLinks.length === 0 ? (
                            <div className="p-12 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center gap-2">
                                <Info className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                                <p className="font-medium text-lg">No hay enlaces de servicios configurados</p>
                                <p className="text-sm">Agrega uno desde el formulario lateral para habilitarlo.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {servicesLinks.map((link) => (
                                    <div 
                                        key={link.id}
                                        className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm transition-all duration-200"
                                    >
                                        <div className="flex-shrink-0">
                                            {renderIcon(link.icon, link.title)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 dark:text-white text-base leading-tight mb-1">{link.title}</p>
                                            <p className="text-xs text-gray-500 mb-1">{link.desc}</p>
                                            <div className="flex items-center gap-2">
                                                <a 
                                                    href={link.href} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="text-[10px] text-sudrio-DEFAULT hover:underline font-semibold inline-flex items-center gap-0.5"
                                                >
                                                    Visitar link <ExternalLink className="w-2.5 h-2.5" />
                                                </a>
                                                {link.icon && link.icon.startsWith('default:') && (
                                                    <span className="text-[9px] text-gray-400 font-medium ml-2">Predeterminado</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 flex-shrink-0 self-center">
                                            <button 
                                                type="button" 
                                                onClick={() => startEdit(link)} 
                                                className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                                                title="Editar enlace de servicio"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => handleDelete(link.id)} 
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors flex-shrink-0"
                                                title="Eliminar enlace de servicio"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
