import MainLayout from '@/Layouts/MainLayout';
import { motion } from 'framer-motion';
import { Activity, Wifi, BarChart3, Bell, Smartphone, Globe, ArrowRight, Mail } from 'lucide-react';

export default function MedidoresInteligentes() {
    const faqs = [
        {
            question: '¿Qué es?',
            answer: 'Son dispositivos que combinan la medición eléctrica tradicional con tecnologías modernas. Utilizan una red de datos confiable y segura para enviar de forma inalámbrica las lecturas de sus medidores.',
            icon: Wifi,
            color: 'from-blue-400 to-blue-600',
        },
        {
            question: '¿Para qué sirven?',
            answer: 'Miden el consumo de energía del usuario, y verifican la calidad del servicio promediando y almacenando los valores de tensión, corriente y frecuencia cada 15 minutos.',
            icon: BarChart3,
            color: 'from-emerald-400 to-emerald-600',
        },
    ];

    const benefits = [
        'Permite acceder a la información de su consumo fácilmente.',
        'Provee una estimación estadística proyectada a final de mes que permite comparar con el acumulado del mes anterior.',
        'Posee umbrales para el control de los máximos y mínimos de tensión, corriente, demanda y factor de potencia, y puede generar alertas cuando dichos umbrales son sobrepasados.',
    ];

    return (
        <MainLayout title="Medidores Inteligentes">
            {/* Hero */}
            <div className="glass-card rounded-[2.5rem] p-8 md:p-12 mb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
                    <span className="text-sudrio-DEFAULT font-bold tracking-wider uppercase text-sm mb-2 block">Tecnología</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">Medidores Inteligentes</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                        Continuamos con el recambio paulatino a medidores inteligentes. Esta nueva tecnología le da al usuario información valiosa del consumo diario.
                    </p>
                </motion.div>
            </div>

            {/* FAQ Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {faqs.map((faq, i) => (
                    <motion.div key={faq.question} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="glass-panel p-8 rounded-3xl">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${faq.color} flex items-center justify-center shadow-lg mb-6`}>
                            <faq.icon className="w-7 h-7 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold dark:text-white mb-4">{faq.question}</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                ))}
            </div>

            {/* Benefits */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-8 rounded-3xl mb-12">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
                        <Bell className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold dark:text-white">¿Qué beneficios tiene?</h2>
                </div>
                <ul className="space-y-4">
                    {benefits.map((b, i) => (
                        <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + 0.05 * i }} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-sudrio-DEFAULT/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-sudrio-DEFAULT text-xs font-bold">{i + 1}</span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">{b}</p>
                        </motion.li>
                    ))}
                </ul>
            </motion.div>

            {/* App Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-[2.5rem] p-8 md:p-12 mb-12 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-sudrio-DEFAULT/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold dark:text-white mb-4">¿Cómo bajo la aplicación?</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Deberá proporcionar una dirección de correo electrónico al que se le enviarán los datos de acceso. Esta dirección de correo electrónico será también su "nombre de usuario".
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <a href="https://play.google.com/store/apps/details?id=com.mrdims.android" target="_blank" rel="noreferrer"
                           className="flex items-center gap-3 glass-panel px-6 py-4 rounded-2xl hover:-translate-y-1 transition-transform group">
                            <Smartphone className="w-8 h-8 text-emerald-500" />
                            <div>
                                <p className="font-bold dark:text-white group-hover:text-sudrio-DEFAULT transition-colors">Mi Medidor</p>
                                <p className="text-xs text-gray-500">Google Play Store</p>
                            </div>
                        </a>
                        <a href="https://www.discar.com/?page_id=1507" target="_blank" rel="noreferrer"
                           className="flex items-center gap-3 glass-panel px-6 py-4 rounded-2xl hover:-translate-y-1 transition-transform group">
                            <Globe className="w-8 h-8 text-blue-500" />
                            <div>
                                <p className="font-bold dark:text-white group-hover:text-sudrio-DEFAULT transition-colors">Versión Web</p>
                                <p className="text-xs text-gray-500">Acceso desde el navegador</p>
                            </div>
                        </a>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Mail className="w-4 h-4" />
                        <span>Contactanos a <a href="mailto:cooperativa@sudrio.com" className="text-sudrio-DEFAULT hover:underline">cooperativa@sudrio.com</a> para solicitar tus credenciales.</span>
                    </div>
                </div>
            </motion.div>
        </MainLayout>
    );
}
