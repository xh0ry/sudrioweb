import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { Save, Phone, Mail, MapPin, Plus, Trash2, GripVertical, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Index({ settings }) {
    const [importFile, setImportFile] = useState(null);
    const [importing, setImporting] = useState(false);

    const handleImportSubmit = (e) => {
        e.preventDefault();
        if (!importFile) return;
        if (!confirm('¿Estás seguro de que deseas importar esta copia de seguridad? Esto reemplazará TODAS las noticias, medios de pago y configuraciones actuales de forma irreversible.')) {
            return;
        }

        setImporting(true);
        const formData = new FormData();
        formData.append('backup_file', importFile);

        router.post(route('admin.backup.import'), formData, {
            onSuccess: () => {
                setImportFile(null);
                setImporting(false);
                // Clear the file input
                const fileInput = e.target.querySelector('input[type="file"]');
                if (fileInput) fileInput.value = '';
            },
            onError: () => {
                setImporting(false);
            }
        });
    };

    const { data, setData, post, processing, errors } = useForm({
        address: settings.address || '',
        contact_phones: (settings.contact_phones || [{ label: 'Guardia 24hs', value: '', is_24h: true }]).map((p, i) => ({
            ...p,
            id: p.id || `phone_${Date.now()}_${i}_${Math.random()}`
        })),
        contact_emails: (settings.contact_emails || [{ label: '', value: '' }]).map((e, i) => ({
            ...e,
            id: e.id || `email_${Date.now()}_${i}_${Math.random()}`
        })),
        external_links: settings.external_links || {
            factura_online: '',
            reglamento_suministro: '',
            cuadro_tarifario: '',
            regimen_tarifario: '',
            normas_calidad: '',
        },
    });

    const [draggedPhoneIdx, setDraggedPhoneIdx] = useState(null);
    const [draggedEmailIdx, setDraggedEmailIdx] = useState(null);

    const handleAddPhone = () => {
        setData('contact_phones', [...data.contact_phones, { 
            id: `phone_${Date.now()}_${Math.random()}`, 
            label: '', 
            value: '', 
            is_24h: false 
        }]);
    };

    const handleRemovePhone = (index) => {
        if (index === 0) return; // Prevent removing Guardia 24hs
        const newPhones = [...data.contact_phones];
        newPhones.splice(index, 1);
        setData('contact_phones', newPhones);
    };

    const handlePhoneChange = (index, field, value) => {
        const newPhones = [...data.contact_phones];
        newPhones[index] = { ...newPhones[index], [field]: value };
        setData('contact_phones', newPhones);
    };

    const handleAddEmail = () => {
        setData('contact_emails', [...data.contact_emails, { 
            id: `email_${Date.now()}_${Math.random()}`, 
            label: '', 
            value: '' 
        }]);
    };

    const handleRemoveEmail = (index) => {
        const newEmails = [...data.contact_emails];
        newEmails.splice(index, 1);
        setData('contact_emails', newEmails);
    };

    const handleEmailChange = (index, field, value) => {
        const newEmails = [...data.contact_emails];
        newEmails[index] = { ...newEmails[index], [field]: value };
        setData('contact_emails', newEmails);
    };

    // Real-time Drag and Drop Reordering Handlers (Live Shifting)
    const handleDragStart = (e, index, type) => {
        if (type === 'phone' && index === 0) return; // Guardia is locked
        e.dataTransfer.effectAllowed = 'move';
        if (type === 'phone') {
            setDraggedPhoneIdx(index);
        } else {
            setDraggedEmailIdx(index);
        }
    };

    const handleDragEnter = (e, targetIndex, type) => {
        if (type === 'phone' && targetIndex === 0) return; // Guardia is locked
        e.preventDefault();

        if (type === 'phone') {
            if (draggedPhoneIdx === null || draggedPhoneIdx === targetIndex) return;
            const reorderedPhones = [...data.contact_phones];
            const [draggedItem] = reorderedPhones.splice(draggedPhoneIdx, 1);
            reorderedPhones.splice(targetIndex, 0, draggedItem);
            setData('contact_phones', reorderedPhones);
            setDraggedPhoneIdx(targetIndex);
        } else {
            if (draggedEmailIdx === null || draggedEmailIdx === targetIndex) return;
            const reorderedEmails = [...data.contact_emails];
            const [draggedItem] = reorderedEmails.splice(draggedEmailIdx, 1);
            reorderedEmails.splice(targetIndex, 0, draggedItem);
            setData('contact_emails', reorderedEmails);
            setDraggedEmailIdx(targetIndex);
        }
    };

    const handleDragEnd = () => {
        setDraggedPhoneIdx(null);
        setDraggedEmailIdx(null);
    };

    const submit = (e) => {
        e.preventDefault();
        // Clean up empty fields and strip react unique ids before sending to backend
        const cleanData = {
            ...data,
            contact_phones: data.contact_phones
                .filter(p => p.value.trim() !== '')
                .map(({ id, ...rest }) => rest),
            contact_emails: data.contact_emails
                .filter(e => e.value.trim() !== '')
                .map(({ id, ...rest }) => rest),
        };
        post(route('admin.settings.update'), { data: cleanData });
    };

    return (
        <AdminLayout title="Configuración">
            <p className="text-gray-600 dark:text-gray-400 mb-6">Administra los datos de contacto y la información institucional de la cooperativa.</p>

            <form onSubmit={submit} className="space-y-8 max-w-4xl">
                
                {/* Contactos */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">Datos de Contacto</h2>
                    
                    <div className="space-y-6">
                        {/* Dirección */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-sudrio-DEFAULT" /> Dirección Física
                            </label>
                            <input
                                type="text"
                                value={data.address}
                                onChange={e => setData('address', e.target.value)}
                                className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-sudrio-DEFAULT focus:ring-sudrio-DEFAULT"
                            />
                            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                        </div>

                        {/* Teléfonos */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-sudrio-DEFAULT" /> Teléfonos de Contacto
                                </label>
                                <button type="button" onClick={handleAddPhone} className="text-sm text-sudrio-DEFAULT font-medium flex items-center gap-1 hover:underline">
                                    <Plus className="w-4 h-4" /> Añadir Teléfono
                                </button>
                            </div>
                            <div className="space-y-4">
                                {data.contact_phones.map((phone, idx) => (
                                    <motion.div 
                                        key={phone.id}
                                        layout
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        draggable={idx > 0}
                                        onDragStart={(e) => handleDragStart(e, idx, 'phone')}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDragEnter={(e) => handleDragEnter(e, idx, 'phone')}
                                        onDragEnd={handleDragEnd}
                                        className={`flex items-center gap-2 bg-gray-50 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all duration-200 ${
                                            draggedPhoneIdx === idx ? 'opacity-40 scale-[0.98] border-dashed border-sudrio-DEFAULT/50' : ''
                                        }`}
                                    >
                                        {/* Drag Handle */}
                                        {idx > 0 ? (
                                            <div className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-250 dark:hover:bg-gray-750 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0 transition-colors">
                                                <GripVertical className="w-5 h-5" />
                                            </div>
                                        ) : (
                                            <div className="w-7 flex-shrink-0" />
                                        )}

                                        <div className="flex-1 flex flex-col gap-3">
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <div className="flex-1">
                                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Área o Tipo de Teléfono</label>
                                                    <input
                                                        type="text"
                                                        value={phone.label}
                                                        onChange={e => handlePhoneChange(idx, 'label', e.target.value)}
                                                        disabled={idx === 0}
                                                        placeholder="Ej. Administración, Ventas"
                                                        className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-sudrio-DEFAULT focus:ring-sudrio-DEFAULT disabled:bg-gray-100 dark:disabled:bg-gray-800/80 dark:disabled:text-gray-400 font-semibold"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Número de Teléfono</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={phone.value}
                                                            onChange={e => handlePhoneChange(idx, 'value', e.target.value)}
                                                            placeholder="Ej. (263) 154356728"
                                                            className="flex-1 rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-sudrio-DEFAULT focus:ring-sudrio-DEFAULT"
                                                        />
                                                        {idx > 0 && (
                                                            <button type="button" onClick={() => handleRemovePhone(idx)} className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Checkbox de 24hs */}
                                            <div className="flex items-center gap-2 mt-1">
                                                <input
                                                    type="checkbox"
                                                    id={`is_24h_${phone.id}`}
                                                    checked={!!phone.is_24h}
                                                    disabled={idx === 0}
                                                    onChange={e => handlePhoneChange(idx, 'is_24h', e.target.checked)}
                                                    className="rounded border-gray-300 text-sudrio-DEFAULT focus:ring-sudrio-DEFAULT disabled:opacity-60"
                                                />
                                                <label htmlFor={`is_24h_${phone.id}`} className="text-xs text-gray-600 dark:text-gray-400 font-medium cursor-pointer selection:bg-transparent">
                                                    Atención 24hs {idx === 0 && <span className="text-[10px] text-gray-400 font-normal">(Obligatorio para la Guardia)</span>}
                                                    {idx > 0 && !phone.is_24h && <span className="text-[10px] text-gray-400 font-normal ml-1">(Por defecto: Lunes a Viernes de 7 a 14hs)</span>}
                                                    {idx > 0 && phone.is_24h && <span className="text-[10px] text-green-500 font-bold ml-1">(Todos los días, las 24 horas)</span>}
                                                </label>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">El primer teléfono corresponde obligatoriamente a la Guardia 24hs y su etiqueta e indicación de 24hs no pueden cambiarse. Puedes arrastrar y reordenar las posiciones de los demás teléfonos.</p>
                        </div>

                        {/* Correos */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-sudrio-DEFAULT" /> Correos Electrónicos
                                </label>
                                <button type="button" onClick={handleAddEmail} className="text-sm text-sudrio-DEFAULT font-medium flex items-center gap-1 hover:underline">
                                    <Plus className="w-4 h-4" /> Añadir Correo
                                </button>
                            </div>
                            <div className="space-y-4">
                                {data.contact_emails.map((email, idx) => (
                                    <motion.div 
                                        key={email.id}
                                        layout
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        draggable={true}
                                        onDragStart={(e) => handleDragStart(e, idx, 'email')}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDragEnter={(e) => handleDragEnter(e, idx, 'email')}
                                        onDragEnd={handleDragEnd}
                                        className={`flex items-center gap-2 bg-gray-50 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all duration-200 ${
                                            draggedEmailIdx === idx ? 'opacity-40 scale-[0.98] border-dashed border-sudrio-DEFAULT/50' : ''
                                        }`}
                                    >
                                        {/* Drag Handle */}
                                        <div className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-250 dark:hover:bg-gray-750 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0 transition-colors">
                                            <GripVertical className="w-5 h-5" />
                                        </div>

                                        <div className="flex-1 flex flex-col sm:flex-row gap-3">
                                            <div className="flex-1">
                                                <label className="block text-xs font-semibold text-gray-500 mb-1">Área o Destinatario</label>
                                                <input
                                                    type="text"
                                                    value={email.label}
                                                    onChange={e => handleEmailChange(idx, 'label', e.target.value)}
                                                    placeholder="Ej. Cobranzas, Reclamos"
                                                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-sudrio-DEFAULT focus:ring-sudrio-DEFAULT"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs font-semibold text-gray-500 mb-1">Correo Electrónico</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="email"
                                                        value={email.value}
                                                        onChange={e => handleEmailChange(idx, 'value', e.target.value)}
                                                        placeholder="info@sudrio.com.ar"
                                                        className="flex-1 rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-sudrio-DEFAULT focus:ring-sudrio-DEFAULT"
                                                    />
                                                    <button type="button" onClick={() => handleRemoveEmail(idx)} className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Puedes arrastrar y reordenar las posiciones de todos los correos electrónicos.</p>
                    </div>
                </div>
            </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 px-6 py-3 bg-sudrio-DEFAULT text-white rounded-xl font-bold hover:bg-sudrio-dark transition-colors shadow-lg shadow-sudrio-DEFAULT/30 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {processing ? 'Guardando...' : 'Guardar Configuración'}
                    </button>
                </div>
            </form>

            {/* Copia de Seguridad */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8 mt-8 max-w-4xl">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    Copia de Seguridad e Importación
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Resguarda toda la información de la web (configuraciones, medios de pago, contactos, enlaces y noticias) descargando un archivo de respaldo. Puedes subir este archivo en cualquier momento para restaurar todos tus datos al instante.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Export Card */}
                    <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/40 border border-gray-150 dark:border-gray-700 flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1.5">Exportar Datos</h3>
                            <p className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed mb-4">
                                Descarga una copia de seguridad en formato JSON de todas las noticias, contactos, cuentas de CBU y configuraciones de la cooperativa.
                            </p>
                        </div>
                        <a
                            href={route('admin.backup.export')}
                            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:scale-[1.02] transition-transform text-sm shadow-md"
                        >
                            Descargar Respaldo (.JSON)
                        </a>
                    </div>

                    {/* Import Card */}
                    <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/40 border border-gray-150 dark:border-gray-700 flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1.5">Importar Datos</h3>
                            <p className="text-xs text-red-500 dark:text-red-400 leading-relaxed mb-4 font-medium">
                                ¡Atención! Subir un archivo de copia de seguridad reemplazará por completo todas las noticias y configuraciones actuales de la web.
                            </p>
                        </div>
                        <form onSubmit={handleImportSubmit} className="space-y-3">
                            <input
                                type="file"
                                accept=".json"
                                onChange={e => setImportFile(e.target.files[0])}
                                className="w-full text-xs text-gray-500 dark:text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sudrio-DEFAULT/10 file:text-sudrio-DEFAULT hover:file:bg-sudrio-DEFAULT/20 cursor-pointer"
                                required
                            />
                            <button
                                type="submit"
                                disabled={importing}
                                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-sudrio-DEFAULT text-white rounded-xl font-bold hover:bg-sudrio-dark transition-colors text-sm shadow-md disabled:opacity-50"
                            >
                                Subir y Restaurar Copia
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
