import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  Linkedin, Mail, Terminal, Server,
  Code2, Activity, Play,
  Folder, ChevronRight, Brain, Sparkles
} from 'lucide-react';

// --- 1. FONDO DE PARTÍCULAS ---
const NeuralBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let mouse = { x: -1000, y: -1000 };

    const syntaxColors = ['#ff79c6', '#50fa7b', '#8be9fd', '#bd93f9', '#f1fa8c'];

    class Particle {
      constructor(w, h) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 1.5 + 0.5;
        this.color = syntaxColors[Math.floor(Math.random() * syntaxColors.length)];
        this.w = w;
        this.h = h;
      }
      update(mouse) {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > this.w) this.vx *= -1;
        if (this.y < 0 || this.y > this.h) this.vy *= -1;
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 150) {
          const angle = Math.atan2(dy, dx);
          const force = (150 - distance) / 150;
          this.x -= Math.cos(angle) * force * 1;
          this.y -= Math.sin(angle) * force * 1;
        }
      }
      draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      const count = Math.min(window.innerWidth / 10, 80);
      for (let i = 0; i < count; i++) particles.push(new Particle(canvas.width, canvas.height));
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    init();

    const animate = () => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        particles.forEach((p2, j) => {
          if (i === j) return;
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 100, 100, ${0.1 - dist/1200})`;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
        p.update(mouse);
        p.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  return <canvas ref={canvasRef} className="fixed top-0 left-0 z-0 pointer-events-none bg-[#050505]" />;
};

// --- 2. TERMINAL DE BIENVENIDA ---
const InteractiveTerminal = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([
    { type: 'system', text: 'Cargando perfil de Víctor Pagola...' },
    { type: 'success', text: 'Detectado: Pasión por IA y Automatización.' },
    { type: 'info', text: 'Sistema listo. Escribe "help" para interactuar.' }
  ]);
  
  const terminalBodyRef = useRef(null);
  const inputRef = useRef(null);

  // FIX SCROLL: Usamos scrollTop en el contenedor en vez de scrollIntoView en la página
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [output]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      const newLog = [...output, { type: 'user', text: `root@pagola:~$ ${input}` }];
      
      const responses = {
        help: { type: 'info', text: 'Comandos: about, ai_vision, stack, contact, clear, github' },
        about: { type: 'success', text: 'Víctor Pagola. Desarrollador Backend & IT Technician. Transformando ideas en código eficiente.' },
        ai_vision: { type: 'warning', text: 'Objetivo: Implementar IA para optimizar procesos reales, mejorarlos e implementar nuevas tecnologías en proyectos.' },
        stack: { type: 'info', text: 'Java | Python | AI Prompting | Linux | SQL | vibecoding' },
        contact: { type: 'info', text: 'Email: victorpagola.w@gmail.com' },
        clear: 'CLEAR',
      };

      if (cmd === 'clear') {
        setOutput([]);
      }  else if (cmd === 'github') {
        // 1. Mensaje inicial
        newLog.push({ type: 'warning', text: 'Iniciando protocolo de transferencia a GitHub...' });
        setOutput(newLog);

        // 2. Secuencia de cuenta atrás
        let countdown = 3;
        
        const timer = setInterval(() => {
          if (countdown > 0) {
            setOutput(prev => [...prev, { type: 'system', text: `Redirigiendo en ${countdown}...` }]);
            countdown--;
          } else {
            clearInterval(timer);
            setOutput(prev => [...prev, { type: 'success', text: 'CONNECTION ESTABLISHED. LAUNCHING...' }]);
            
            // 3. Redirección final
            setTimeout(() => {
              window.location.href = 'https://github.com/Paagola';
            }, 1000);
          }
        }, 1000); // Se ejecuta cada 1 segundo
      }  
      
      else {
        newLog.push(responses[cmd] || { type: 'error', text: `Error: Comando '${cmd}' desconocido.` });
        setOutput(newLog);
      }
      setInput('');
    }
    
  };

  // Evitar scroll al hacer click para enfocar
  const focusInput = () => {
    inputRef.current?.focus({ preventScroll: true });
  };

  return (
    <motion.div 
      initial={{opacity:0, y:20}} 
      animate={{opacity:1, y:0}} 
      className="w-full max-w-3xl mx-auto mt-12 rounded-lg overflow-hidden border border-[#333] bg-[#0c0c0c] shadow-2xl font-mono text-sm z-10 relative"
      onClick={focusInput}
    >
      <div className="bg-[#1a1a1a] px-4 py-2 flex gap-2 border-b border-[#333]">
        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        <div className="ml-4 text-gray-500 text-xs">bash — pagola_term</div>
      </div>
      <div ref={terminalBodyRef} className="p-4 h-64 overflow-y-auto custom-scrollbar text-gray-300 cursor-text">
        {output.map((o, i) => (
          <div key={i} className={`mb-1 ${o.type === 'error' ? 'text-red-400' : o.type === 'user' ? 'text-blue-400' : o.type === 'success' ? 'text-green-400' : o.type === 'warning' ? 'text-yellow-400' : 'text-gray-400'}`}>
            {o.text}
          </div>
        ))}
        <div className="flex text-blue-400">
          <span className="mr-2">➜</span>
          <input 
            ref={inputRef}
            className="bg-transparent border-none outline-none flex-1 text-white min-w-0"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleCommand}
            autoFocus
            autoComplete="off"
            placeholder="..."
          />
        </div>
      </div>
    </motion.div>
  );
};

// --- 3. IDE INTERACTIVO ---
const IDEWorkspace = () => {
  const [activeFile, setActiveFile] = useState('AI_Oracle.py');
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [inputRequired, setInputRequired] = useState(false);
  const [userInput, setUserInput] = useState('');
  
  // Ref para el contenedor de la consola (para controlar el scroll interno)
  const consoleContainerRef = useRef(null);
  const consoleInputRef = useRef(null);

  // FIX SCROLL: Controlamos el scrollTop del contenedor, no de la ventana
  useEffect(() => {
    if (consoleContainerRef.current) {
      consoleContainerRef.current.scrollTop = consoleContainerRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  // Foco automático sin saltos
  useEffect(() => {
    if (inputRequired && consoleInputRef.current) {
        consoleInputRef.current.focus({ preventScroll: true });
    }
  }, [inputRequired]);

  const files = {
    'AI_Oracle.py': {
      lang: 'python',
      icon: <Brain size={14} className="text-purple-400"/>,
      code: (
        <pre>
          <span className="syntax-keyword">import</span> <span className="syntax-class">neural_core</span> <span className="syntax-keyword">as</span> ai{'\n'}
          <span className="syntax-keyword">import</span> <span className="syntax-class">humor_module</span>{'\n\n'}
          <span className="syntax-keyword">class</span> <span className="syntax-class">OracleIA</span>:{'\n'}
          {'    '}<span className="syntax-keyword">def</span> <span className="syntax-func">__init__</span>(self):{'\n'}
          {'        '}self.knowledge = <span className="syntax-string">"Infinite"</span>{'\n'}
          {'        '}self.patience = <span className="syntax-number">0.1</span>{'\n\n'}
          {'    '}<span className="syntax-keyword">def</span> <span className="syntax-func">ask</span>(self, question):{'\n'}
          {'        '}<span className="syntax-keyword">if</span> <span className="syntax-string">"bug"</span> <span className="syntax-keyword">in</span> question:{'\n'}
          {'            '}<span className="syntax-keyword">return</span> <span className="syntax-string">"It's not a bug, it's a feature."</span>{'\n'}
          {'        '}<span className="syntax-keyword">return</span> ai.predict_response(question){'\n\n'}
          <span className="syntax-comment"># Start System</span>{'\n'}
          bot = <span className="syntax-class">OracleIA</span>(){'\n'}
          q = <span className="syntax-func">input</span>(<span className="syntax-string">"Ask the AI anything: "</span>){'\n'}
          <span className="syntax-keyword">print</span>(bot.ask(q))
        </pre>
      )
    },
    'SecurityGate.java': {
      lang: 'java',
      icon: <Code2 size={14} className="text-red-400"/>,
      code: (
        <pre>
          <span className="syntax-keyword">public class</span> <span className="syntax-class">Mainframe</span> {'{'}{'\n'}
          {'    '}<span className="syntax-keyword">public static void</span> <span className="syntax-func">main</span>(String[] args) {'{'}{'\n'}
          {'        '}System.out.println(<span className="syntax-string">"SECURE CONNECTION ESTABLISHED"</span>);{'\n'}
          {'        '}Scanner sc = <span className="syntax-keyword">new</span> Scanner(System.in);{'\n'}
          {'        '}System.out.print(<span className="syntax-string">"Enter Admin Password: "</span>);{'\n'}
          {'        '}String pass = sc.nextLine();{'\n\n'}
          {'        '}<span className="syntax-keyword">if</span> (pass.length() {'>'} <span className="syntax-number">5</span>) {'{'}{'\n'}
          {'            '}<span className="syntax-func">grantAccess</span>();{'\n'}
          {'        '} {'}'} <span className="syntax-keyword">else</span> {'{'}{'\n'}
          {'            '}System.out.println(<span className="syntax-string">"ACCESS DENIED"</span>);{'\n'}
          {'        '}{'}'}{'\n'}
          {'    '}{'}'}{'\n'}
          {'}'}
        </pre>
      )
    }
  };

  const handleRun = () => {
    setTerminalLogs([{ text: "> Initializing Runtime Environment...", color: "text-gray-400" }]);
    setIsRunning(true);
    setInputRequired(false);

    setTimeout(() => {
      if (activeFile === 'AI_Oracle.py') {
        setTerminalLogs(prev => [...prev, { text: "Ask the AI anything (Job, Life, Code?):", color: "text-purple-400" }]);
        setInputRequired(true);
      } else {
        setTerminalLogs(prev => [...prev, { text: "SECURE CONNECTION ESTABLISHED.", color: "text-green-500" }, { text: "Enter Admin Password:", color: "text-yellow-400" }]);
        setInputRequired(true);
      }
    }, 800);
  };

  const handleConsoleInput = (e) => {
    if (e.key === 'Enter') {
      const val = userInput;
      setTerminalLogs(prev => [...prev, { text: val, color: "text-white" }]);
      setUserInput('');
      setInputRequired(false);
      
      setTimeout(() => {
        if (activeFile === 'AI_Oracle.py') {
            const funnyResponses = [
                "> Computing... The answer is 42. But you knew that.",
                "> I've analyzed 14 million futures. In only one do you fix that bug without coffee.",
                "> ERROR: Too much human logic detected. Please try thinking like a machine.",
                `> Analysis of '${val}': Result uncertain. Recommend hiring Víctor to solve it.`,
                "> Synthesizing... Have you tried turning the universe off and on again?"
            ];
            let response = funnyResponses[Math.floor(Math.random() * funnyResponses.length)];
            if(val.toLowerCase().includes('job') || val.toLowerCase().includes('work') || val.toLowerCase().includes('contract')) {
                response = "> Prediction: Hiring this developer increases efficiency by 200%.";
            }

            setTerminalLogs(prev => [
                ...prev, 
                { text: "> Neural Network Thinking...", color: "text-gray-500 animate-pulse" },
                { text: response, color: "text-cyan-400 font-bold" }
            ]);
            setIsRunning(false);

        } else {
          if (val.toLowerCase() === 'admin' || val.length > 5) {
            setTerminalLogs(prev => [
              ...prev, 
              { text: "> Verifying hash...", color: "text-gray-400" },
              { text: "> ACCESS GRANTED. Welcome back, Commander.", color: "text-green-500 font-bold" }
            ]);
          } else {
             setTerminalLogs(prev => [
              ...prev, 
              { text: "> Verifying hash...", color: "text-gray-400" },
              { text: "> ACCESS DENIED. This incident will be reported.", color: "text-red-500 font-bold" }
            ]);
          }
          setIsRunning(false);
        }
      }, 800);
    }
  };

  return (
    <div className="rounded-xl overflow-hidden border border-[#333] bg-[#0d1117] shadow-2xl max-w-5xl mx-auto flex flex-col md:flex-row h-[500px]">
      <div className="w-full md:w-64 bg-[#010409] border-r border-[#333] flex flex-col">
        <div className="p-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-[#21262d]">Project Explorer</div>
        <div className="p-2 space-y-1">
          <div className="flex items-center gap-2 text-gray-400 px-2 py-1 hover:text-white cursor-pointer">
            <ChevronRight size={14}/> <Folder size={14} className="text-blue-400"/> src
          </div>
          {Object.keys(files).map(filename => (
            <div 
              key={filename}
              onClick={() => { setActiveFile(filename); setTerminalLogs([]); setIsRunning(false); setInputRequired(false); }}
              className={`flex items-center gap-2 px-6 py-1.5 text-sm cursor-pointer transition-colors ${activeFile === filename ? 'bg-[#21262d] text-white border-l-2 border-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {files[filename].icon} {filename}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-[#0d1117]">
        <div className="flex items-center bg-[#010409] border-b border-[#333]">
          <div className="px-4 py-2 text-sm text-white bg-[#0d1117] border-t-2 border-pink-500 flex items-center gap-2">
            {files[activeFile].icon} {activeFile}
          </div>
          <div className="ml-auto px-4">
            <button 
              onClick={handleRun}
              disabled={isRunning && !inputRequired}
              className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-bold transition-colors disabled:opacity-50 ${isRunning && !inputRequired ? 'bg-yellow-600 text-white' : 'bg-green-600 hover:bg-green-500 text-white'}`}
            >
              <Play size={12} fill="currentColor"/> RUN
            </button>
          </div>
        </div>

        <div className="flex-1 p-6 font-mono text-sm overflow-auto text-gray-300 leading-relaxed">
          {files[activeFile].code}
        </div>

        {/* Console con Scroll Controlado */}
        <div 
            ref={consoleContainerRef}
            className="h-40 bg-[#010409] border-t border-[#333] flex flex-col p-3 font-mono text-xs overflow-y-auto" 
            onClick={() => inputRequired && consoleInputRef.current?.focus({ preventScroll: true })}
        >
          <div className="text-gray-500 mb-1">DEBUG CONSOLE</div>
          {terminalLogs.map((log, i) => (
             <div key={i} className={`${log.color} mb-1 whitespace-pre-wrap`}>{log.text}</div>
          ))}
          
          {inputRequired && (
            <div className="flex items-center text-blue-400 animate-pulse">
              <span className="mr-2">?</span>
              <input 
                ref={consoleInputRef}
                className="bg-transparent border-none outline-none flex-1 text-white"
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                onKeyDown={handleConsoleInput}
                autoFocus
                autoComplete="off"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- 4. NUEVA SECCIÓN: SOBRE MÍ (Limpia y Profesional) ---
const AboutSection = () => (
  <section id="about" className="py-20 px-6 relative z-10">
    {/* Eliminados iconos gigantes, diseño centrado en contenido */}
    <div className="max-w-4xl mx-auto border border-[#333] bg-[#0c0c0c]/80 backdrop-blur-md rounded-xl p-10 relative overflow-hidden">
        {/* Detalles técnicos decorativos en las esquinas */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-pink-500 rounded-tl-lg opacity-70"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500 rounded-br-lg opacity-70"></div>

        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
           Sobre Mí
           <span className="text-xs font-mono font-normal text-gray-500 bg-[#21262d] px-2 py-1 rounded">human_v2.0</span>
        </h2>
        
        <div className="space-y-4 text-gray-300 leading-relaxed text-lg">
            <p>
                Soy una persona <span className="text-white font-semibold">proactiva y creativa</span> con un fuerte interés en la tecnología. 
                Me apasiona transformar ideas abstractas en proyectos reales mediante código limpio, buscando siempre soluciones innovadoras.
            </p>
            <p>
                Me especializo en trabajar en equipo y automatizar procesos. Actualmente, mi foco está en aprovechar la <span className="text-cyan-400 font-semibold">Inteligencia Artificial</span> para mejorar la eficiencia y la productividad de las empresas, integrando nuevas herramientas en flujos de trabajo tradicionales.
            </p>
        </div>

        <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-400 border-t border-[#333] pt-6 mt-8">
            <span className="flex items-center gap-2 bg-[#111] px-3 py-1 rounded border border-[#333]">
                <Sparkles size={12} className="text-yellow-400"/> AI Integration
            </span>
            <span className="flex items-center gap-2 bg-[#111] px-3 py-1 rounded border border-[#333]">
                <Sparkles size={12} className="text-yellow-400"/> Automatización de Procesos
            </span>
            <span className="flex items-center gap-2 bg-[#111] px-3 py-1 rounded border border-[#333]">
                <Sparkles size={12} className="text-yellow-400"/> Eficiencia Empresarial
            </span>
        </div>
    </div>
  </section>
);

// --- 5. GRID DE EXPERIENCIA ---
const TechCard = ({ icon: Icon, title, role, desc, color, tags }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="p-6 rounded-xl border border-[#333] bg-[#161b22] relative overflow-hidden group transition-all hover:border-opacity-50 hover:shadow-lg flex flex-col h-full"
    style={{ borderColor: color }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-50"></div>
    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
      <Icon size={80} color={color} />
    </div>
    
    <div className="relative z-10 flex-1">
      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-opacity-10" style={{ backgroundColor: color }}>
        <Icon size={24} style={{ color: color }} />
      </div>
      <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
      <div className="inline-block px-2 py-0.5 rounded text-xs font-mono mb-3 bg-[#333] text-gray-300">
        {role}
      </div>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">{desc}</p>
    </div>
    <div className="relative z-10 flex flex-wrap gap-2 mt-auto">
      {tags.map(tag => (
        <span key={tag} className="text-[10px] px-2 py-1 rounded bg-black/50 border border-white/10 text-gray-400">
          {tag}
        </span>
      ))}
    </div>
  </motion.div>
);

// --- LAYOUT PRINCIPAL ---
const Portfolio = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className="min-h-screen text-gray-200 font-sans selection:bg-pink-500 selection:text-white">
      <NeuralBackground />
      
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 origin-left z-50" style={{ scaleX }} />

      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-40 backdrop-blur-xl bg-black/50 border border-[#333] rounded-full px-6 py-3 flex gap-8 hidden md:flex">
        {['ROOT', 'ABOUT', 'PROFILE', 'PLAYGROUND', 'CONTACT'].map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} className="text-xs font-bold tracking-widest text-gray-500 hover:text-white transition-colors">
            {item}
          </a>
        ))}
      </nav>

      {/* HERO */}
      <section id="root" className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-10">
        <div className="text-center z-10">
          <motion.div initial={{scale:0}} animate={{scale:1}} className="inline-block mb-6 relative">
            <div className="absolute inset-0 bg-purple-600 blur-xl opacity-20 animate-pulse"></div>
            <Terminal size={60} className="relative text-white" />
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-6 glitch-effect">
            VÍCTOR PAGOLA
          </h1>
          
          <div className="flex justify-center gap-4 text-sm font-mono text-gray-400 mb-8">
            <span className="px-3 py-1 border border-[#333] rounded bg-[#111] text-pink-400">Java / Python Dev</span>
            <span className="px-3 py-1 border border-[#333] rounded bg-[#111] text-green-400">IT Technician</span>
            <span className="px-3 py-1 border border-[#333] rounded bg-[#111] text-cyan-400">AI Enthusiast</span>
          </div>

          <InteractiveTerminal />
        </div>
      </section>

      {/* SOBRE MÍ (Diseño Mejorado) */}
      <AboutSection />

      {/* EXPERIENCE & EDUCATION GRID */}
      <section id="profile" className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 flex items-center gap-3">
            <Activity className="text-pink-500" />
            <h2 className="text-3xl font-bold text-white">System Logs <span className="text-gray-600 text-lg font-normal">/ Exp & Education</span></h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TechCard 
              icon={Server}
              title="IDILIQ Group"
              role="IT Technician | 1 Año"
              desc="Gestión integral de soporte, Intune y redes. Participación activa en proyectos de optimización tecnológica y automatización de procesos clave."
              color="#bd93f9" // Purple
              tags={['Service Desk', 'Optimización', 'Hardware', 'SAI']}
            />
            <TechCard 
              icon={Brain}
              title="AI & Innovation"
              role="Formación Continua"
              desc="Curso de Fundamentos de IA y desarrollo con Inteligencia Artificial. Hackathon DigitIA FP Innovation. Uso de IA para potenciar el desarrollo."
              color="#50fa7b" // Green
              tags={['Prompting', 'DigitIA Hackathon', 'Automatización']}
            />
            <TechCard 
              icon={Code2}
              title="Formación D.A.M"
              role="Desarrollo Multiplataforma"
              desc="Programación orientada a objetos (Java), Bases de Datos (SQL) y lógica avanzada. Desarrollo de APIs y proyectos en grupo."
              color="#ff79c6" // Pink
              tags={['Java', 'SQL', 'Git', 'Liderazgo']}
            />
          </div>
        </div>
      </section>

      {/* WORKSPACE IDE */}
      <section id="playground" className="py-32 bg-[#050505] border-y border-[#222] relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Dev Playground</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Interactúa con los módulos. Prueba a preguntarle algo al script de 
              <span className="text-purple-400 font-mono font-bold"> Python (AI Oracle)</span> o intenta loguearte en el sistema <span className="text-red-400 font-mono font-bold">Java</span>.
            </p>
          </div>
          
          <IDEWorkspace />
        </div>
      </section>

      {/* FOOTER / CONTACT */}
      <section id="contact" className="py-32 px-6 relative z-10 text-center">
        <h2 className="text-4xl font-bold text-white mb-8">Inicializar Conexión?</h2>
        <div className="flex justify-center gap-6 flex-wrap">
          <a href="mailto:victorpagola.w@gmail.com" className="px-8 py-4 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Mail size={20}/> victorpagola.w@gmail.com
          </a>
          <a href="https://www.linkedin.com/in/pagola/" target="_blank" rel="noreferrer" className="px-8 py-4 border border-[#333] bg-[#111] text-white font-bold rounded hover:bg-[#222] transition-colors flex items-center gap-2">
            <Linkedin size={20}/> LinkedIn
          </a>
        </div>
        <footer className="mt-20 text-gray-600 font-mono text-xs">
          SYSTEM STATUS: ONLINE | UBICACIÓN: MÁLAGA, ES | CARNET B + VEHÍCULO
        </footer>
      </section>
    </div>
  );
};

export default Portfolio;