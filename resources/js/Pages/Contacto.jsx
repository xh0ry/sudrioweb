import MainLayout from '@/Layouts/MainLayout';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock, Shield } from 'lucide-react';
import { useState, useMemo } from 'react';
import { usePage } from '@inertiajs/react';

export default function Contacto() {
    const { globalSettings } = usePage().props;
    const [formData, setFormData] = useState({ name: '', apellido: '', telefono: '', email: '', asunto: '', message: '', captchaAnswer: '' });
    const [sent, setSent] = useState(false);
    const [captchaError, setCaptchaError] = useState(false);

    // Normalize & Fallbacks
    const address = globalSettings?.address || 'Lavalle 641, 5577 Rivadavia, Mendoza.';
    const emergencyPhone = globalSettings?.phones?.[0]?.value || '(263) 154356728';
    
    const otherPhones = globalSettings?.phones?.length > 1 
        ? globalSettings.phones.slice(1) 
        : [{ label: 'Atención Comercial', value: '(263) 4442353 / 4442368' }];

    const emails = globalSettings?.emails?.length > 0 
        ? globalSettings.emails 
        : [
            { label: 'Reclamos y Sugerencias', value: 'cooperativa@sudrio.com' },
            { label: 'Cobranzas', value: 'cobranzas@sudrio.com' },
            { label: 'Enviar CV (Curriculum Vitae)', value: 'cvsudrio@gmail.com' }
          ];

    const captcha = useMemo(() => {
        const a = Math.floor(Math.random() * 9) + 1;
        const b = Math.floor(Math.random() * 9) + 1;
        return { a, b, answer: a + b };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (parseInt(formData.captchaAnswer) !== captcha.answer) {
            setCaptchaError(true);
            return;
        }
        setCaptchaError(false);
        setSent(true);
        setTimeout(() => setSent(false), 5000);
    };

    const inputClasses = "w-full rounded-xl border-gray-300 dark:border-white/10 dark:bg-black/20 dark:text-white focus:ring-sudrio-DEFAULT focus:border-sudrio-DEFAULT transition-shadow";

    return (
        <MainLayout title="Contacto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Contact Info */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Comunicate con nosotros</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Estamos disponibles para responder tus consultas, sugerencias y atender emergencias.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Guardia 24hs */}
                        <div className="glass-panel p-6 rounded-3xl flex gap-4 items-start border border-red-500/20 bg-red-500/5">
                            <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl mt-1">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold dark:text-white text-lg">Guardia y Emergencias (24hs)</h3>
                                <a href={`tel:+54${emergencyPhone.replace(/\D/g, '')}`} className="text-lg sm:text-xl font-extrabold text-red-500 hover:text-red-600 transition-colors mt-1.5 block tracking-tight">
                                    {emergencyPhone}
                                </a>
                                <p className="text-xs text-gray-500 mt-2 font-semibold flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span> Los 365 días del año (24hs)
                                </p>
                            </div>
                        </div>

                        {/* Other Labeled Phones */}
                        {otherPhones.map((phone, idx) => (
                            <div key={idx} className="glass-panel p-6 rounded-3xl flex gap-4 items-start border border-white/10">
                                <div className="p-3 bg-sudrio-DEFAULT/10 text-sudrio-DEFAULT rounded-2xl mt-1">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold dark:text-white text-lg">{phone.label || 'Atención Comercial'}</h3>
                                    
                                    <div className="flex flex-col gap-1 mt-1.5">
                                        {(phone.value || '').split('/').map((val, subIdx) => {
                                            const cleanVal = val.trim();
                                            return (
                                                <a 
                                                    key={subIdx} 
                                                    href={`tel:+54${cleanVal.replace(/\D/g, '')}`} 
                                                    className="text-lg sm:text-xl font-extrabold text-sudrio-DEFAULT hover:text-sudrio-dark transition-colors tracking-tight block"
                                                >
                                                    {cleanVal}
                                                </a>
                                            );
                                        })}
                                    </div>

                                    <div className="flex items-center gap-1.5 mt-2">
                                        <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                        <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold">
                                            {phone.is_24h ? 'Todos los días, las 24 horas' : 'Lunes a Viernes de 7 a 14 h'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Dynamic Emails by Area */}
                        <div className="glass-panel p-6 rounded-3xl flex gap-4 items-start">
                            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-full mt-1">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div className="w-full">
                                <h3 className="font-bold dark:text-white text-lg mb-2">Correos Electrónicos</h3>
                                <div className="mt-2 space-y-3">
                                    {emails.map((email, idx) => (
                                        <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm border-b border-gray-100 dark:border-gray-800 last:border-0 pb-2 last:pb-0">
                                            <span className="text-gray-500 dark:text-gray-400 font-medium">{email.label || 'General'}:</span>
                                            <a href={`mailto:${email.value}`} className="font-semibold text-sudrio-DEFAULT hover:underline mt-0.5 sm:mt-0">{email.value}</a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Physical Address */}
                        <div className="glass-panel p-6 rounded-3xl flex gap-4 items-start">
                            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-full">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold dark:text-white text-lg">Ubicación</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{address}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 rounded-[2.5rem]">
                    <h2 className="text-2xl font-bold dark:text-white mb-6">Envíanos un mensaje</h2>

                    {sent ? (
                        <div className="p-4 bg-green-500/20 text-green-700 dark:text-green-400 rounded-2xl text-center border border-green-500/30">
                            ¡Mensaje enviado con éxito! Te contactaremos pronto.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                                    <input type="text" required className={inputClasses}
                                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Apellido</label>
                                    <input type="text" required className={inputClasses}
                                        value={formData.apellido} onChange={e => setFormData({...formData, apellido: e.target.value})} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono</label>
                                    <input type="tel" className={inputClasses}
                                        value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Electrónico</label>
                                    <input type="email" required className={inputClasses}
                                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Asunto</label>
                                <input type="text" required className={inputClasses}
                                    value={formData.asunto} onChange={e => setFormData({...formData, asunto: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mensaje</label>
                                <textarea required rows="4" className={`${inputClasses} resize-none`}
                                    value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
                            </div>

                            {/* Captcha */}
                            <div className="glass-panel rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-sudrio-DEFAULT flex-shrink-0" />
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {captcha.a} + {captcha.b} =
                                    </label>
                                    <input type="number" required className={`${inputClasses} w-20 text-center`}
                                        value={formData.captchaAnswer} onChange={e => { setFormData({...formData, captchaAnswer: e.target.value}); setCaptchaError(false); }} />
                                </div>
                                {captchaError && (
                                    <p className="text-red-500 text-xs mt-2">Respuesta incorrecta. Intentá de nuevo.</p>
                                )}
                            </div>

                             <button type="submit"
                                className="w-full py-4 rounded-xl bg-sudrio-dark dark:bg-sudrio-DEFAULT text-white dark:text-gray-900 font-bold hover:bg-sudrio-DEFAULT dark:hover:bg-sudrio-light transition-colors flex justify-center items-center gap-2 shadow-lg shadow-sudrio-DEFAULT/20">
                                Enviar Mensaje <Send className="w-5 h-5" />
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </MainLayout>
    );
}
