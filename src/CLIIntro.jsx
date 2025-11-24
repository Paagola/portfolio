import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Minus, Square, X } from 'lucide-react';

const CLIIntro = ({ onComplete }) => {
    const [lines, setLines] = useState([]);
    const [input, setInput] = useState('');
    const [isBooting, setIsBooting] = useState(true);
    const inputRef = useRef(null);
    const containerRef = useRef(null);

    const bootSequence = [
        { text: "Initializing PAGOLA_OS kernel...", delay: 300 },
        { text: "Loading interface modules...", delay: 600 },
        { text: "Verifying user permissions...", delay: 900 },
        { text: "Acceso Concedido.", color: "text-green-400", delay: 1200 },
        { text: "", delay: 1300 },
        { text: "Bienvenido a la terminal interactiva.", delay: 1400 },
        {
            text: "Escribe 'help' para ver comandos o 'start' para entrar.",
            highlight: ['help', 'start'],
            delay: 1500
        },
        { text: "", delay: 1600 },
    ];

    useEffect(() => {
        let timeouts = [];
        let cumulativeDelay = 0;

        bootSequence.forEach((line, index) => {
            cumulativeDelay += line.delay || 100;
            const timeout = setTimeout(() => {
                setLines(prev => [...prev, line]);
                if (index === bootSequence.length - 1) {
                    setIsBooting(false);
                }
            }, cumulativeDelay);
            timeouts.push(timeout);
        });

        return () => timeouts.forEach(clearTimeout);
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
        if (!isBooting) {
            inputRef.current?.focus();
        }
    }, [lines, isBooting]);

    const handleCommand = (e) => {
        if (e.key === 'Enter') {
            const cmd = input.trim().toLowerCase();
            const newLines = [...lines, { text: `visitor@pagola:~$ ${input}`, type: 'input' }];

            let response = [];

            switch (cmd) {
                case 'help':
                    response = [
                        { text: "Comandos disponibles:", color: "text-yellow-400" },
                        { text: "  about    - ¿Quién soy?" },
                        { text: "  stack    - Tecnologías y Habilidades" },
                        { text: "  contact  - Información de contacto" },
                        { text: "  github   - Ir a mi GitHub" },
                        { text: "  clear    - Limpiar terminal" },
                        { text: "  start    - Iniciar Portfolio UI" },
                    ];
                    break;
                case 'about':
                    response = [
                        { text: "Víctor Pagola - Java/Python Developer & IT Technician." },
                        { text: "Persona proactiva y creativa con fuerte interés en tecnología." },
                        { text: "Especializado en automatización, IA y desarrollo de software." }
                    ];
                    break;
                case 'stack':
                    response = [
                        { text: "Lenguajes: Java, Python, JavaScript, SQL, HTML, CSS" },
                        { text: "Sistemas: Linux, CMD, Virtualización, Redes Locales" },
                        { text: "Herramientas: Git, GitHub, Office 365, Workbench" },
                        { text: "Skills: Gestión de Sistemas, Soporte Técnico, IA" }
                    ];
                    break;
                case 'contact':
                    response = [
                        { text: "Email: victorpagola.w@gmail.com" },
                        { text: "LinkedIn: linkedin.com/in/pagola/" },
                        { text: "GitHub: github.com/Paagola" },
                        { text: "Ubicación: Alhaurín de la Torre, Málaga" }
                    ];
                    break;
                case 'github':
                    setLines([...newLines, { text: "Iniciando protocolo de transferencia a GitHub...", color: "text-yellow-400" }]);
                    setInput('');

                    let count = 3;
                    const timer = setInterval(() => {
                        if (count > 0) {
                            setLines(prev => [...prev, { text: `Redirigiendo en ${count}...` }]);
                            count--;
                        } else {
                            clearInterval(timer);
                            setLines(prev => [...prev, { text: "CONEXIÓN ESTABLECIDA.", color: "text-green-400" }]);
                            setTimeout(() => {
                                window.location.href = 'https://github.com/Paagola';
                            }, 1000);
                        }
                    }, 1000);
                    return;
                case 'clear':
                    setLines([]);
                    setInput('');
                    return;
                case 'start':
                    setLines(prev => [...prev, { text: "visitor@pagola:~$ start", type: 'input' }]);
                    setLines(prev => [...prev, { text: "Iniciando interfaz gráfica...", color: "text-green-400" }]);
                    setTimeout(onComplete, 1000);
                    return;
                case '':
                    break;
                default:
                    response = [{ text: `Comando no encontrado: ${cmd}. Escribe 'help' para ver opciones.`, color: "text-red-400" }];
            }

            setLines([...newLines, ...response, { text: "" }]);
            setInput('');
        }
    };

    // Helper to render text with highlights
    const renderLine = (line) => {
        if (!line.highlight) return <span className={line.color || "text-gray-300"}>{line.text}</span>;

        let parts = [line.text];
        const highlights = Array.isArray(line.highlight) ? line.highlight : [line.highlight];

        highlights.forEach(word => {
            const newParts = [];
            parts.forEach(part => {
                if (typeof part === 'string') {
                    const split = part.split(word);
                    split.forEach((s, i) => {
                        if (s) newParts.push(s);
                        if (i < split.length - 1) newParts.push(<span key={i} className="text-cyan-400 font-bold bg-cyan-900/30 px-1 rounded">{word}</span>);
                    });
                } else {
                    newParts.push(part);
                }
            });
            parts = newParts;
        });

        return <span className={line.color || "text-gray-300"}>{parts}</span>;
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-2xl bg-[#0c0c0c]/90 border border-[#333] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[50vh]"
            >
                {/* Window Header */}
                <div className="bg-[#1a1a1a] px-4 py-3 flex items-center justify-between border-b border-[#333]">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="text-xs font-mono text-gray-500 flex items-center gap-2">
                        <Terminal size={12} />
                        pagola_term — zsh
                    </div>
                    <div className="w-10" /> {/* Spacer for centering */}
                </div>

                {/* Terminal Body */}
                <div
                    ref={containerRef}
                    className="flex-1 p-6 overflow-y-auto font-mono text-sm md:text-base custom-scrollbar text-left"
                    onClick={() => inputRef.current?.focus()}
                >
                    {lines.map((line, i) => (
                        <div key={i} className="mb-1 leading-relaxed break-words">
                            {line.type === 'input' ? (
                                <span className="text-gray-400">{line.text}</span>
                            ) : (
                                renderLine(line)
                            )}
                        </div>
                    ))}

                    {!isBooting && (
                        <div className="flex items-center mt-2 text-blue-400">
                            <span className="mr-3">➜</span>
                            <span className="mr-3 text-purple-400">~</span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleCommand}
                                className="bg-transparent border-none outline-none flex-1 text-white min-w-0"
                                autoFocus
                                spellCheck="false"
                                autoComplete="off"
                            />
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default CLIIntro;
