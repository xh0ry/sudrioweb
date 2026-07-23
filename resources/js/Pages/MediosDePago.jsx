import MainLayout from '@/Layouts/MainLayout';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, CreditCard, Globe, MapPin, Clock, ArrowRight, ExternalLink, Coins, QrCode, Receipt, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function MediosDePago() {
    const { globalSettings } = usePage().props;
    
    const paymentMethods = globalSettings?.payment_methods || [];
    const servicesLinks = globalSettings?.services_links || [];
    const facturaOnlineLink = servicesLinks.find(s => s.title.toLowerCase().includes('factura online'))?.href 
        || "https://net.optimasa.com.ar/factura_online_sudrio/";
    
    const physicalMethods = paymentMethods.filter(m => m.type === 'fisico');
    const digitalMethods = paymentMethods.filter(m => m.type === 'digital');

    const [copiedField, setCopiedField] = useState(null);

    const copyToClipboard = (text, fieldName) => {
        navigator.clipboard.writeText(text);
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(null), 2000);
    };

    // Helper to render beautiful default vector icons or image tags
    const renderIcon = (iconPath, name, bgColor) => {
        if (iconPath && iconPath.startsWith('default:')) {
            const key = iconPath.split(':')[1];
            const iconClass = "w-7 h-7 text-white";
            let bgGradient = "bg-gradient-to-br from-blue-400 to-blue-600";
            let IconComponent = CreditCard;

            switch (key) {
                case 'cash':
                    IconComponent = Coins;
                    bgGradient = "bg-gradient-to-br from-emerald-400 to-emerald-600";
                    break;
                case 'card':
                    IconComponent = CreditCard;
                    bgGradient = "bg-gradient-to-br from-sky-400 to-sky-600";
                    break;
                case 'bank':
                    IconComponent = Building2;
                    bgGradient = "bg-gradient-to-br from-amber-400 to-amber-600";
                    break;
                case 'mp':
                    IconComponent = QrCode;
                    bgGradient = "bg-gradient-to-br from-teal-400 to-teal-600";
                    break;
                case 'rapipago':
                    IconComponent = Receipt;
                    bgGradient = "bg-gradient-to-br from-violet-400 to-violet-600";
                    break;
                case 'online':
                    IconComponent = Globe;
                    bgGradient = "bg-gradient-to-br from-indigo-400 to-indigo-600";
                    break;
            }

            return (
                <div className={`w-14 h-14 rounded-2xl ${bgGradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                    <IconComponent className={iconClass} />
                </div>
            );
        }

        return (
            <div 
                className="w-14 h-14 rounded-2xl border border-gray-150 dark:border-gray-700 flex items-center justify-center shadow-md overflow-hidden group-hover:scale-110 transition-transform flex-shrink-0"
                style={{ backgroundColor: bgColor || '#ffffff' }}
            >
                <img src={iconPath} alt={name} className="w-full h-full object-contain p-2" />
            </div>
        );
    };

    return (
        <MainLayout title="Medios de Pago">
            {/* Hero Banner */}
            <div className="glass-card rounded-[2.5rem] p-8 md:p-12 mb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-sudrio-DEFAULT/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
                    <span className="text-sudrio-DEFAULT font-bold tracking-wider uppercase text-sm mb-2 block">Cobros y Facturación</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">Medios de Pago Habilitados</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                        Conocé todas las opciones que tenés a tu disposición para abonar tu factura del servicio eléctrico, tanto de manera presencial como online.
                    </p>
                </motion.div>
            </div>

            {/* SECCION 1: MEDIOS FISICOS */}
            <div className="mb-16">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                            <Coins className="w-6 h-6 text-emerald-500" /> Medios de Pago en Oficina (Presencial)
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Recibidos directamente en nuestra administración física.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 text-xs font-semibold">
                        <div className="flex items-center gap-1.5 text-gray-650 dark:text-gray-300">
                            <MapPin className="w-4 h-4 text-sudrio-DEFAULT" />
                            <span>Lavalle 641, Rivadavia</span>
                        </div>
                        <div className="hidden sm:block text-gray-300 dark:text-white/20">|</div>
                        <div className="flex items-center gap-1.5 text-gray-650 dark:text-gray-300">
                            <Clock className="w-4 h-4 text-sudrio-DEFAULT" />
                            <span>Lunes a Viernes de 7 a 14 h</span>
                        </div>
                    </div>
                </div>

                {physicalMethods.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 italic text-center py-6">No hay medios de pago físicos habilitados en este momento.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {physicalMethods.map((method, i) => (
                            <motion.div
                                key={method.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="glass-panel p-6 rounded-3xl flex items-center gap-4 hover:-translate-y-1 transition-all duration-300 group"
                            >
                                {renderIcon(method.icon, method.name, method.bg_color)}
                                <div className="min-w-0">
                                    <h3 className="font-bold text-lg dark:text-white group-hover:text-sudrio-DEFAULT transition-colors leading-tight">{method.name}</h3>
                                    {method.description ? (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 whitespace-pre-wrap leading-relaxed">{method.description}</p>
                                    ) : (
                                        <span className="text-[10px] text-gray-450 dark:text-gray-500 mt-1 inline-block font-semibold uppercase tracking-wider">Pago en Ventanilla</span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* SECCION 2: MEDIOS DIGITALES */}
            <div className="mb-16">
                <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                        <Globe className="w-6 h-6 text-sudrio-DEFAULT" /> Medios de Pago Digitales o Externos
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Aboná desde tu celular, homebanking o puntos de cobro extrabancarios.</p>
                </div>

                {digitalMethods.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 italic text-center py-6">No hay medios de pago digitales habilitados en este momento.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {digitalMethods.map((method, i) => {
                            const isBankTransfer = method.icon === 'default:bank' || method.name.toLowerCase().includes('transferencia');
                            const isOnlineBilling = method.icon === 'default:online' || method.name.toLowerCase().includes('factura online');

                            return (
                                <motion.div
                                    key={method.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`glass-panel p-8 rounded-3xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group ${
                                        isBankTransfer ? 'md:col-span-2 bg-gradient-to-r from-gray-50 to-amber-500/5 dark:from-gray-900/40 dark:to-amber-500/5' : ''
                                    }`}
                                >
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                                        <div className="flex items-center gap-4">
                                            {renderIcon(method.icon, method.name, method.bg_color)}
                                            <div>
                                                <h3 className="font-extrabold text-xl dark:text-white group-hover:text-sudrio-DEFAULT transition-colors">{method.name}</h3>
                                                {method.description ? (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 whitespace-pre-wrap leading-relaxed">{method.description}</p>
                                                ) : (
                                                    <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Pago Online y Externo</span>
                                                )}
                                            </div>
                                        </div>
                                        {isOnlineBilling && (
                                            <a 
                                                href={facturaOnlineLink} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-sudrio-dark dark:bg-sudrio-DEFAULT text-white dark:text-gray-900 font-bold hover:bg-sudrio-DEFAULT dark:hover:bg-sudrio-light transition-colors text-xs shadow-md shadow-sudrio-DEFAULT/20"
                                            >
                                                Pagar Factura <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                    </div>

                                    {/* DETALLES DE TRANSFERENCIA BANCARIA */}
                                    {isBankTransfer && (
                                        <div className="mt-4 bg-white/50 dark:bg-gray-950/40 border border-amber-500/10 rounded-2xl p-6">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-2.5 h-2.5 rounded-full bg-amber-550 animate-pulse"></div>
                                                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">Datos para Transferencia Directa</span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                                <div>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Banco</p>
                                                    <p className="font-bold text-gray-800 dark:text-white">Banco Credicoop</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Titular de la Cuenta</p>
                                                    <p className="font-bold text-gray-800 dark:text-white">Cooperativa de Electrificación Rivadavia Ltda.</p>
                                                </div>
                                                <div className="md:col-span-2 border-t border-dashed border-gray-200 dark:border-gray-800 my-1"></div>
                                                
                                                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/80 p-3.5 rounded-xl border dark:border-gray-800">
                                                    <div className="min-w-0">
                                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold mb-0.5">CBU (Clave Bancaria Uniforme)</p>
                                                        <p className="font-mono font-bold text-xs text-gray-800 dark:text-gray-200 select-all tracking-wider">1910125755012500098765</p>
                                                    </div>
                                                    <button 
                                                        onClick={() => copyToClipboard('1910125755012500098765', 'cbu')}
                                                        className="p-2 ml-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-lg transition-colors flex items-center justify-center"
                                                        title="Copiar CBU"
                                                    >
                                                        {copiedField === 'cbu' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                                    </button>
                                                </div>

                                                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/80 p-3.5 rounded-xl border dark:border-gray-800">
                                                    <div className="min-w-0">
                                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold mb-0.5">ALIAS</p>
                                                        <p className="font-sans font-bold text-xs text-gray-800 dark:text-gray-200 select-all tracking-wide">COOP.SUDRIO.PAGOS</p>
                                                    </div>
                                                    <button 
                                                        onClick={() => copyToClipboard('COOP.SUDRIO.PAGOS', 'alias')}
                                                        className="p-2 ml-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-lg transition-colors flex items-center justify-center"
                                                        title="Copiar ALIAS"
                                                    >
                                                        {copiedField === 'alias' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-550 dark:text-gray-400 mt-4 leading-relaxed bg-amber-500/5 p-3 rounded-xl border border-amber-500/10">
                                                <strong>Importante:</strong> Al realizar una transferencia, te solicitamos enviar el comprobante de pago vía correo electrónico a <span className="font-semibold text-sudrio-DEFAULT">cobranzas@sudrio.com</span> especificando tu Nombre, Apellido y Número de Suministro para procesarlo a la brevedad.
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* CTA Soporte */}
            <div className="glass-card rounded-3xl p-8 text-center bg-gradient-to-r from-sudrio-DEFAULT/10 to-blue-500/10 border border-sudrio-DEFAULT/20 mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">¿Necesitás asistencia personalizada?</h3>
                <p className="text-gray-650 dark:text-gray-300 mb-6">Si tenés dudas con el estado de tu cuenta o formas de cobro especiales, comunicate con nosotros.</p>
                <Link href={route('contacto')} className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-bold hover:scale-105 transition-transform shadow-xl">
                    Contactanos <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </MainLayout>
    );
}
