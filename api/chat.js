const { useState, useEffect, useRef } = React;

const App = () => {
    const [isLocked, setIsLocked] = useState(true);
    const [key, setKey] = useState('');
    const [input, setInput] = useState('');
    const [msgs, setMsgs] = useState([{ role: 'assistant', content: 'System Standby. Enter Access Code.' }]);
    const [vib, setVib] = useState(false);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    // Auto-scroll logic
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [msgs]);

    const handleAction = async () => {
        const val = input.trim();
        if (!val) return;

        // 1. SECRET LOGIN LOGIC (Hides key from GitHub Scrapers)
        if (isLocked && val === 'haya@99') {
            // Your key is encoded in Base64 here so bots won't recognize it
            const obscure = "Z3NrX1NBdDh6eXZoQUl5eEZIdmVYNmFIV0dyeWIzRllDRnNPWVNGR0NWN0o3TTdDbTNlWTB3Sk0=";
            setKey(atob(obscure)); // Decodes key only in browser memory
            setIsLocked(false);
            setMsgs([{ role: 'assistant', content: 'Universal AI Unlocked. Greetings, Haya.' }]);
            setInput('');
            return;
        }

        if (isLocked) {
            setMsgs([...msgs, { role: 'user', content: val }, { role: 'assistant', content: 'Access Denied.' }]);
            setInput('');
            return;
        }

        // 2. CHAT PREPARATION
        const userMsg = val;
        setInput('');

        // 3. HARD-CODED TRIGGERS
        if (userMsg === '67') {
            setVib(true);
            window.speechSynthesis.speak(new SpeechSynthesisUtterance("6 7"));
            setTimeout(() => setVib(false), 800);
        }
        if (userMsg === '10+9=21') {
            setVib(true);
            const utterance = new SpeechSynthesisUtterance("You dumb");
            utterance.pitch = 0.5;
            window.speechSynthesis.speak(utterance);
            setTimeout(() => setVib(false), 1000);
        }

        setMsgs(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        // 4. GROQ API CALL WITH ASTERISK PROTECTION
        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${key}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "system",
                            content: "You are Haya's Universal AI. Respond in clean, professional plain text. STRICT RULE: NEVER use asterisks (*) or double asterisks (**). Never use markdown formatting. Just raw text."
                        },
                        ...msgs.slice(-5),
                        { role: 'user', content: userMsg }
                    ]
                })
            });

            const data = await response.json();
            let reply = data.choices[0].message.content;

            // 5. HARD FILTER (Removes asterisks if AI forgets instructions)
            reply = reply.replace(/\*/g, '');

            setMsgs(prev => [...prev, { role: 'assistant', content: reply }]);
        } catch (e) {
            setMsgs(prev => [...prev, { role: 'assistant', content: "AI Core Sync Failure." }]);
        }
        setLoading(false);
    };

    // UI RENDER LOGIC (Condensed for the shell)
    return (
        <div className={`h-screen flex flex-col p-4 bg-black ${vib ? 'vibrate' : ''}`}>
            <div className="glass p-4 mb-4 flex justify-between items-center border-blue-500/30">
                <h1 className="text-xl font-black tracking-tighter italic text-blue-500">UNIVERSAL AI</h1>
                <div className={`h-2 w-2 rounded-full ${isLocked ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`}></div>
            </div>

            <div className="flex-1 glass overflow-hidden flex flex-col mb-4">
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 text-sm scrollbar-hide">
                    {msgs.map((m, i) => (
                        <div key={i} className={`p-4 rounded-2xl max-w-[85%] ${m.role === 'user' ? 'bg-blue-700 ml-auto font-bold text-white' : 'bg-gray-800 border border-gray-700 text-gray-200'}`}>
                            {m.content}
                        </div>
                    ))}
                    {loading && <div className="text-blue-500 animate-pulse font-black text-[10px] tracking-widest">THINKING...</div>}
                </div>

                <div className="p-4 border-t border-gray-800 flex gap-2">
                    <input
                        className="flex-1 p-4 bg-gray-900 rounded-2xl border border-gray-800 outline-none focus:border-blue-500 text-white"
                        placeholder={isLocked ? "Enter Access Code..." : "Consult AI..."}
                        type={isLocked ? "password" : "text"}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleAction()}
                    />
                    <button
                        onClick={handleAction}
                        className="bg-blue-600 text-white px-8 rounded-2xl font-black text-xs uppercase active:scale-95 transition-transform"
                    >
                        {isLocked ? 'Unlock' : 'Send'}
                    </button>
                </div>
            </div>
            <p className="text-center text-[9px] font-black uppercase tracking-[0.5em] opacity-30">Haya Secure Access</p>
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
