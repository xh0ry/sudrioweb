import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { FileText, Settings, AlertTriangle, ArrowRight, Activity, Users, Save, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Dashboard({ stats }) {
    const { auth } = usePage().props;

    const { data, setData, post, processing } = useForm({
        forced_weather_alert: stats.weather_alert || 'none',
    });

    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (!stats.weather_alert_expires_at || stats.weather_alert === 'none') {
            setTimeLeft('');
            return;
        }

        const calculateTime = () => {
            const difference = new Date(stats.weather_alert_expires_at) - new Date();
            if (difference <= 0) {
                setTimeLeft('Expirado');
                return;
            }
            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            setTimeLeft(`${hours}h ${minutes}m restantes`);
        };

        calculateTime();
        const timer = setInterval(calculateTime, 60000);
        return () => clearInterval(timer);
    }, [stats.weather_alert, stats.weather_alert_expires_at]);

    const submitAlert = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'));
    };

    return (
        <AdminLayout title="Panel de Control">
            <div className="mb-8">
                <h2 className="text-xl text-gray-700 dark:text-gray-300">
                    ¡Hola, <span className="font-bold text-sudrio-DEFAULT">{auth.user.name}</span>! Bienvenido al panel de administración.
                </h2>
                <p className="text-gray-500 mt-2">Desde aquí puedes gestionar el contenido y la configuración de la cooperativa.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                        <FileText className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Noticias Publicadas</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.news_count}</h3>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-500">
                        <Settings className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Puntos de Contacto</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.contacts_count}</h3>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${stats.weather_alert !== 'none' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-500' : 'bg-green-50 dark:bg-green-900/20 text-green-500'}`}>
                        {stats.weather_alert !== 'none' ? <AlertTriangle className="w-7 h-7" /> : <Activity className="w-7 h-7" />}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Alerta Forzada</p>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize flex flex-col">
                            <span>{stats.weather_alert === 'none' ? 'Inactiva' : stats.weather_alert}</span>
                            {stats.weather_alert !== 'none' && timeLeft && (
                                <span className="text-[10px] text-gray-500 font-semibold">{timeLeft}</span>
                            )}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Control de Alertas Forzadas */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700 pb-4 mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-500" /> Control de Alertas Meteorológicas
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Fuerza una alerta específica para probar o ante emergencias locales. Se desactivará automáticamente tras 24hs.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {stats.weather_alert === 'none' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800">
                                <Activity className="w-3.5 h-3.5" /> Automático (SMN)
                            </span>
                        ) : (
                            <div className="flex flex-col items-end gap-1">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-200 dark:border-amber-800 uppercase">
                                    <AlertTriangle className="w-3.5 h-3.5 animate-pulse" /> Forzada: {stats.weather_alert}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <form onSubmit={submitAlert} className="flex flex-col sm:flex-row items-end gap-4">
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Estado de Alerta</label>
                        <select
                            value={data.forced_weather_alert}
                            onChange={e => setData('forced_weather_alert', e.target.value)}
                            className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-sudrio-DEFAULT focus:ring-sudrio-DEFAULT text-sm"
                        >
                            <option value="none">Desactivado (Usar SMN Automático)</option>
                            <option value="zonda">Forzar: Alerta de Viento Zonda</option>
                            <option value="viento">Forzar: Alerta de Viento Fuerte</option>
                            <option value="tormenta">Forzar: Alerta de Tormenta</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-sudrio-DEFAULT text-white rounded-xl text-sm font-bold hover:bg-sudrio-dark transition-colors disabled:opacity-50 shadow-md shadow-sudrio-DEFAULT/20"
                    >
                        <Save className="w-4 h-4" />
                        {processing ? 'Actualizando...' : 'Actualizar Alerta'}
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Accesos Rápidos</h3>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        <Link href={route('admin.news.create')} className="flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-sudrio-DEFAULT/10 flex items-center justify-center text-sudrio-DEFAULT">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-sudrio-DEFAULT transition-colors">Redactar Nueva Noticia</h4>
                                    <p className="text-sm text-gray-500">Publica actualizaciones para los socios.</p>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-sudrio-DEFAULT transition-colors" />
                        </Link>
                        
                        <Link href={route('admin.settings.index')} className="flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-sudrio-DEFAULT/10 flex items-center justify-center text-sudrio-DEFAULT">
                                    <Settings className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-sudrio-DEFAULT transition-colors">Actualizar Contactos</h4>
                                    <p className="text-sm text-gray-500">Modifica los teléfonos y correos visibles.</p>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-sudrio-DEFAULT transition-colors" />
                        </Link>
                    </div>
                </div>

                {/* Info Panel */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 shadow-sm p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Users className="w-32 h-32" />
                    </div>
                    <h3 className="text-lg font-bold mb-4 relative z-10">Módulo de Administración</h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-6 relative z-10">
                        Bienvenido a la nueva plataforma de autogestión de Sud Río. Este espacio está diseñado para que puedas mantener actualizada la información de la cooperativa de manera sencilla e instantánea.
                    </p>
                    <ul className="space-y-3 text-sm text-gray-300 relative z-10">
                        <li className="flex items-start gap-2">
                            <span className="text-sudrio-DEFAULT mt-0.5">•</span>
                            Los cambios en las noticias se reflejan inmediatamente en el inicio.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-sudrio-DEFAULT mt-0.5">•</span>
                            Las modificaciones en "Configuración" actualizan el footer y la vista de contacto de toda la web.
                        </li>
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
}
