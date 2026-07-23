import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { CreditCard, Plus, Trash2, Coins, Building2, QrCode, Receipt, Globe, UploadCloud, Info, Edit, X } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function PaymentMethods({ paymentMethods }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        type: 'fisico',
        icon: null,
        bg_color: '#0bc5ea',
        description: ''
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [editingMethod, setEditingMethod] = useState(null);

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

    const startEdit = (method) => {
        setEditingMethod(method);
        setData({
            name: method.name,
            type: method.type,
            bg_color: method.bg_color || '#0bc5ea',
            description: method.description || '',
            icon: null
        });
        if (method.icon && !method.icon.startsWith('default:')) {
            setImagePreview(method.icon);
        } else {
            setImagePreview(null);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingMethod(null);
        reset();
        setImagePreview(null);
        const fileInput = document.getElementById('icon-input');
        if (fileInput) fileInput.value = '';
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingMethod) {
            post(route('admin.payments.update', editingMethod.id), {
                onSuccess: () => {
                    setEditingMethod(null);
                    reset();
                    setImagePreview(null);
                    const fileInput = document.getElementById('icon-input');
                    if (fileInput) fileInput.value = '';
                }
            });
        } else {
            post(route('admin.payments.store'), {
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
        if (confirm('¿Estás seguro de eliminar este medio de pago?')) {
            router.delete(route('admin.payments.destroy', id));
        }
    };

    // Helper to render beautiful default vector icons or image tags
    const renderIcon = (iconPath, name, bgColor) => {
        if (iconPath && iconPath.startsWith('default:')) {
            const key = iconPath.split(':')[1];
            const iconClass = "w-8 h-8 text-sudrio-DEFAULT";
            let defaultIcon = <CreditCard className={iconClass} />;
            switch (key) {
                case 'cash':
                    defaultIcon = <Coins className={iconClass} />; break;
                case 'card':
                    defaultIcon = <CreditCard className={iconClass} />; break;
                case 'bank':
                    defaultIcon = <Building2 className={iconClass} />; break;
                case 'mp':
                    defaultIcon = <QrCode className={iconClass} />; break;
                case 'rapipago':
                    defaultIcon = <Receipt className={iconClass} />; break;
                case 'online':
                    defaultIcon = <Globe className={iconClass} />; break;
            }

            return (
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm border border-gray-150 dark:border-gray-700">
                    {defaultIcon}
                </div>
            );
        }

        return (
            <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-650 shadow-sm"
                style={{ backgroundColor: bgColor || '#ffffff' }}
            >
                <img src={iconPath} alt={name} className="w-full h-full object-contain p-1.5" />
            </div>
        );
    };

    return (
        <AdminLayout title="Medios de Pago">
            <p className="text-gray-600 dark:text-gray-400 mb-8">Gestiona los métodos de cobro que acepta la cooperativa. Se mostrarán divididos por Físicos (en la oficina) y Digitales (fuera de la oficina/online) en la sección pública.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulario de Alta / Edición */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                {editingMethod ? <Edit className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-sudrio-DEFAULT" />}
                                {editingMethod ? 'Editar Medio' : 'Nuevo Medio de Pago'}
                            </span>
                            {editingMethod && (
                                <button type="button" onClick={cancelEdit} className="text-gray-450 hover:text-gray-600 dark:hover:text-gray-200 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </h2>

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Nombre del Item
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Ej. Transferencia Bancaria, Pago Fácil"
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-sudrio-DEFAULT focus:ring-sudrio-DEFAULT"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Tipo de Medio de Pago
                                </label>
                                <select
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-sudrio-DEFAULT focus:ring-sudrio-DEFAULT"
                                >
                                    <option value="fisico">Físico (Se recibe en la oficina)</option>
                                    <option value="digital">Digital o Externo (Se recibe fuera de la oficina)</option>
                                </select>
                                {errors.type && <p className="mt-1 text-sm text-red-605">{errors.type}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-between">
                                    <span>Color de Fondo del Ícono</span>
                                    <span className="text-xs text-gray-400 font-normal">Hexadecimal</span>
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={data.bg_color}
                                        onChange={e => setData('bg_color', e.target.value)}
                                        className="w-12 h-11 rounded-xl border border-gray-300 dark:border-gray-600 cursor-pointer p-0 overflow-hidden"
                                    />
                                    <input
                                        type="text"
                                        value={data.bg_color}
                                        onChange={e => setData('bg_color', e.target.value)}
                                        className="flex-1 rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-sudrio-DEFAULT focus:ring-sudrio-DEFAULT font-mono text-sm uppercase"
                                    />
                                </div>
                                {errors.bg_color && <p className="mt-1 text-sm text-red-610">{errors.bg_color}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-between">
                                    <span>Aclaración o Detalle (Opcional)</span>
                                    <span className="text-xs text-gray-400 font-normal">Se muestra debajo del título</span>
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    placeholder="Ej. CBU: 1910125755012500098765, Alias: COOP.SUDRIO.PAGOS"
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-sudrio-DEFAULT focus:ring-sudrio-DEFAULT text-sm"
                                    rows="3"
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-605">{errors.description}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    {editingMethod ? 'Ícono (Opcional, conservar actual)' : 'Ícono (Opcional, .PNG recomendado)'}
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-xl hover:border-sudrio-DEFAULT dark:hover:border-sudrio-DEFAULT transition-colors relative cursor-pointer group">
                                    <input
                                        type="file"
                                        id="icon-input"
                                        onChange={handleFileChange}
                                        accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
                                        editingMethod 
                                            ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30' 
                                            : 'bg-sudrio-DEFAULT hover:bg-sudrio-dark shadow-sudrio-DEFAULT/30'
                                    }`}
                                >
                                    {editingMethod ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                    {processing ? 'Guardando...' : editingMethod ? 'Guardar Cambios' : 'Añadir Medio'}
                                </button>
                                {editingMethod && (
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
                            <span>Medios Habilitados</span>
                            <span className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-950 text-gray-600 dark:text-gray-400 rounded-full font-semibold">
                                Total: {paymentMethods.length}
                            </span>
                        </h2>

                        {paymentMethods.length === 0 ? (
                            <div className="p-12 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center gap-2">
                                <Info className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                                <p className="font-medium text-lg">No hay medios de pago configurados</p>
                                <p className="text-sm">Agrega uno desde el formulario lateral para habilitarlo.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {paymentMethods.map((method) => (
                                    <div 
                                        key={method.id}
                                        className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm transition-all duration-200"
                                    >
                                        <div className="flex-shrink-0">
                                            {renderIcon(method.icon, method.name, method.bg_color)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 dark:text-white truncate text-base leading-tight mb-1">{method.name}</p>
                                            {method.description && (
                                                <p className="text-xs text-gray-500 dark:text-gray-405 mb-1.5 truncate" title={method.description}>{method.description}</p>
                                            )}
                                            <div className="flex items-center gap-2">
                                                {method.type === 'fisico' ? (
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
                                                        Físico (Oficina)
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-bold uppercase tracking-wider">
                                                        Digital (Fuera)
                                                    </span>
                                                )}
                                                {method.icon && method.icon.startsWith('default:') && (
                                                    <span className="text-[9px] text-gray-400 font-medium">Predeterminado</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 flex-shrink-0 self-center">
                                            <button 
                                                type="button" 
                                                onClick={() => startEdit(method)} 
                                                className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                                                title="Editar medio de pago"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => handleDelete(method.id)} 
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors flex-shrink-0"
                                                title="Eliminar medio de pago"
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
