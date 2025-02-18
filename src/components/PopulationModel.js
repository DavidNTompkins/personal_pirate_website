import React, { useEffect, useRef, useState } from 'react';

// Add new transition-related state and utilities
const PopulationModel = () => {
    const [presets, setPresets] = useState({});

    const initialState = {
        a: 0.05,
        b: 0.1,
        meanSystemicIntervention: 0,
        sdSystemicIntervention: 1,
        individualBoost: 2,
        running: true,
        damping: 0.98,
        numParticles: 50,
        startX: -150,
        particles: Array(50).fill(null).map(() => ({
            x: -150,
            v: 0,
            systemicIntervention: 0
        }))
    };

    const [state, setState] = useState(initialState);
    const [presetName, setPresetName] = useState('');
    const [selectedPreset, setSelectedPreset] = useState('');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [transitionStartState, setTransitionStartState] = useState(null);
    const [transitionEndState, setTransitionEndState] = useState(null);
    const [transitionProgress, setTransitionProgress] = useState(0);
    
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const boostRef = useRef(0);
    const stateRef = useRef(state);
    const transitionTimeoutRef = useRef(null);

    // Linear interpolation function
    const lerp = (start, end, t) => {
        return start + (end - start) * t;
    };

    // Function to interpolate between states
    const interpolateStates = (startState, endState, progress) => {
        const interpolated = {};
        const numericKeys = ['a', 'b', 'meanSystemicIntervention', 'sdSystemicIntervention', 
                            'individualBoost', 'damping', 'numParticles'];
        
        numericKeys.forEach(key => {
            interpolated[key] = lerp(startState[key], endState[key], progress);
        });

        return interpolated;
    };

    const loadPreset = (presetName) => {
        const preset = presets[presetName];
        if (preset) {
            setTransitionStartState({
                ...state,
                particles: [...state.particles]
            });
            setTransitionEndState(preset);
            setIsTransitioning(true);
            setTransitionProgress(0);
            setState(prev => ({ ...prev, running: false }));
            setSelectedPreset(presetName);
        }
    };

    // Handle the transition animation
    useEffect(() => {
        if (isTransitioning && transitionStartState && transitionEndState) {
            if (transitionProgress >= 1) {
                setIsTransitioning(false);
                setState(prev => ({
                    ...prev,
                    ...transitionEndState,
                    running: true // Resume animation after transition
                }));
                return;
            }

            // Clear any existing timeout
            if (transitionTimeoutRef.current) {
                clearTimeout(transitionTimeoutRef.current);
            }

            // Schedule next frame
            transitionTimeoutRef.current = setTimeout(() => {
                const interpolated = interpolateStates(
                    transitionStartState,
                    transitionEndState,
                    transitionProgress
                );

                setState(prev => ({
                    ...prev,
                    ...interpolated
                }));

                setTransitionProgress(prev => prev + 0.05);
            }, 50); // 20 frames per second

            return () => {
                if (transitionTimeoutRef.current) {
                    clearTimeout(transitionTimeoutRef.current);
                }
            };
        }
    }, [isTransitioning, transitionProgress, transitionStartState, transitionEndState]);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    const randomNormal = (mean, sd) => {
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return mean + sd * z;
    };

    useEffect(() => {
        setState(prev => ({
            ...prev,
            particles: prev.particles.map(particle => ({
                ...particle,
                systemicIntervention: randomNormal(state.meanSystemicIntervention, state.sdSystemicIntervention)
            }))
        }));
    }, [state.meanSystemicIntervention, state.sdSystemicIntervention]);

    const potential = (x, params) => {
        const { a, b, systemicIntervention } = params;
        const scaled = x / 100;
        return a * Math.pow(scaled, 4) - b * Math.pow(scaled, 2) + systemicIntervention * scaled / 100;
    };

    const force = (x, params) => {
        const { a, b, systemicIntervention } = params;
        const scaled = x / 100;
        return -(4 * a * Math.pow(scaled, 3) - 2 * b * scaled + systemicIntervention / 100) * 20;
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        const draw = () => {
            const currentState = stateRef.current;
            const { running, damping, particles, a, b } = currentState;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const centerY = canvas.height / 2;
            
            // Draw axes with subtle grid
            ctx.beginPath();
            ctx.strokeStyle = '#eee';
            for (let y = 0; y < canvas.height; y += 40) {
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
            }
            for (let x = 0; x < canvas.width; x += 40) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
            }
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle = '#ccc';
            ctx.moveTo(0, centerY);
            ctx.lineTo(canvas.width, centerY);
            ctx.stroke();

            // Draw potential landscapes with improved gradient
            particles.forEach((particle, i) => {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 + (i / particles.length) * 0.15})`; // Slightly more subtle blue
                ctx.lineWidth = 1;
                
                for (let x = 0; x < canvas.width; x++) {
                    const worldX = x - canvas.width/2;
                    const params = { a, b, systemicIntervention: particle.systemicIntervention };
                    const V = potential(worldX, params) * 1000;
                    if (x === 0) ctx.moveTo(x, centerY - V);
                    else ctx.lineTo(x, centerY - V);
                }
                ctx.stroke();
            });

            // Draw particles with glowing effect
            particles.forEach((particle, i) => {
                const params = { a, b, systemicIntervention: particle.systemicIntervention };
                const screenX = particle.x + canvas.width/2;
                const V = potential(particle.x, params) * 1000;
                
                // Draw particle
                ctx.beginPath();
                ctx.fillStyle = 'rgb(239, 68, 68)';
                ctx.arc(screenX, centerY - V, 4, 0, Math.PI * 2);
                ctx.fill();
            });

            if (running) {
                const dt = 0.3;
                
                setState(prev => ({
                    ...prev,
                    particles: prev.particles.map(particle => {
                        const params = { a, b, systemicIntervention: particle.systemicIntervention };
                        const acceleration = force(particle.x, params) + boostRef.current;
                        return {
                            ...particle,
                            x: particle.x + particle.v * dt,
                            v: (particle.v + acceleration * dt) * damping
                        };
                    })
                }));

                if (boostRef.current !== 0) {
                    boostRef.current *= 0.95;
                    if (Math.abs(boostRef.current) < 0.01) boostRef.current = 0;
                }
            }

            animationRef.current = requestAnimationFrame(draw);
        };

        animationRef.current = requestAnimationFrame(draw);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    const handleIndividualIntervention = () => {
        boostRef.current = state.individualBoost;
    };

    const resetParticles = () => {
        setState(prev => ({
            ...prev,
            particles: prev.particles.map(particle => ({
                ...particle,
                x: prev.startX,
                v: 0
            }))
        }));
    };

    const handleCanvasClick = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        
        // Calculate the scaling factor
        const scaleX = canvas.width / rect.width;
        
        // Get the click position in scaled canvas coordinates
        const canvasX = (e.clientX - rect.left) * scaleX;
        const x = canvasX - canvas.width/2;
        
        setState(prev => ({
            ...prev,
            startX: x,
            particles: prev.particles.map(particle => ({
                ...particle,
                x: x,
                v: 0
            }))
        }));
    };

    const updateParticleCount = (newCount) => {
        setState(prev => {
            const currentCount = prev.particles.length;
            let newParticles;
            
            if (newCount > currentCount) {
                const additionalParticles = Array(newCount - currentCount).fill(null).map(() => ({
                    x: prev.startX,
                    v: 0,
                    systemicIntervention: randomNormal(prev.meanSystemicIntervention, prev.sdSystemicIntervention)
                }));
                newParticles = [...prev.particles, ...additionalParticles];
            } else {
                newParticles = prev.particles.slice(0, newCount);
            }

            return {
                ...prev,
                numParticles: newCount,
                particles: newParticles
            };
        });
    };

    const savePreset = () => {
        if (!presetName.trim()) return;
        
        const parameters = {
            a: state.a,
            b: state.b,
            meanSystemicIntervention: state.meanSystemicIntervention,
            sdSystemicIntervention: state.sdSystemicIntervention,
            individualBoost: state.individualBoost,
            damping: state.damping,
            numParticles: state.numParticles
        };
    
        const updatedPresets = {
            ...presets,
            [presetName]: parameters
        };
        
        localStorage.setItem('populationModelPresets', JSON.stringify(updatedPresets));
        setPresets(updatedPresets);
        setPresetName('');
        setSelectedPreset(presetName);
    };

    const deletePreset = (presetName) => {
        const updatedPresets = { ...presets };
        delete updatedPresets[presetName];
        localStorage.setItem('populationModelPresets', JSON.stringify(updatedPresets));
        setPresets(updatedPresets);
        setSelectedPreset('');
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="mb-4 space-y-2">
                <div className="flex space-x-2 mb-4">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                        onClick={() => setState(prev => ({ ...prev, running: !prev.running }))}
                    >
                        {state.running ? 'Pause' : 'Play'}
                    </button>
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                        onClick={handleIndividualIntervention}
                    >
                        Apply Individual Intervention
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                        onClick={resetParticles}
                    >
                        Reset Positions
                    </button>
                </div>

                <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
                    <input
                        type="text"
                        value={presetName}
                        onChange={(e) => setPresetName(e.target.value)}
                        placeholder="Enter preset name"
                        className="px-3 py-2 text-gray-700 border rounded-lg flex-grow"
                    />
                    <button
                        onClick={savePreset}
                        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors shadow-sm"
                    >
                        Save Preset
                    </button>
                </div>

                <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
                    {Object.keys(presets).map(name => (
                        <div key={name} className="flex items-center space-x-2 bg-white text-black p-2 rounded-lg shadow-sm">
                            <button
                                onClick={() => loadPreset(name)}
                                className={`px-3 py-1 rounded ${
                                    selectedPreset === name ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
                                }`}
                            >
                                {name}
                            </button>
                            <button
                                onClick={() => deletePreset(name)}
                                className="text-red-500 hover:text-red-700 px-2"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {isTransitioning && (
                <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow">
                    Transitioning... {Math.round(transitionProgress * 100)}%
                </div>
            )}

            <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="border border-gray-200 w-full rounded-lg mb-4 cursor-pointer shadow-inner bg-gray-50"
                onClick={handleCanvasClick}
            />

            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Overall Scale (a): {state.a.toFixed(3)}
                    </label>
                    <input
                        type="range"
                        min="0.01"
                        max="0.1"
                        step="0.005"
                        value={state.a}
                        onChange={(e) => setState(prev => ({ ...prev, a: Number(e.target.value) }))}
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Peak Separation (b): {state.b.toFixed(3)}
                    </label>
                    <input
                        type="range"
                        min="0.05"
                        max="0.2"
                        step="0.01"
                        value={state.b}
                        onChange={(e) => setState(prev => ({ ...prev, b: Number(e.target.value) }))}
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mean Environmental Factor: {state.meanSystemicIntervention.toFixed(2)}
                    </label>
                    <input
                        type="range"
                        min="-10"
                        max="10"
                        step="0.1"
                        value={state.meanSystemicIntervention}
                        onChange={(e) => setState(prev => ({ 
                            ...prev, 
                            meanSystemicIntervention: Number(e.target.value)
                        }))}
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Environmental Factor SD: {state.sdSystemicIntervention.toFixed(2)}
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.1"
                        value={state.sdSystemicIntervention}
                        onChange={(e) => setState(prev => ({ 
                            ...prev, 
                            sdSystemicIntervention: Number(e.target.value)
                        }))}
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Individual Intervention Strength: {state.individualBoost.toFixed(2)}
                    </label>
                    <input
                        type="range"
                        min="-10"
                        max="10"
                        step="0.2"
                        value={state.individualBoost}
                        onChange={(e) => setState(prev => ({ 
                            ...prev, 
                            individualBoost: Number(e.target.value)
                        }))}
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Particles: {state.numParticles}
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="200"
                        step="1"
                        value={state.numParticles}
                        onChange={(e) => updateParticleCount(Number(e.target.value))}
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Damping (Energy Loss): {state.damping.toFixed(3)}
                    </label>
                    <input
                        type="range"
                        min="0.9"
                        max="1"
                        step="0.001"
                        value={state.damping}
                        onChange={(e) => setState(prev => ({ 
                            ...prev, 
                            damping: Number(e.target.value)
                        }))}
                        className="w-full"
                    />
                </div>
            </div>

            <div className="mt-4 text-sm text-gray-600 space-y-1 p-4 bg-gray-50 rounded-lg">
                <p>- Click anywhere on the canvas to set the starting position for all particles</p>
                <p>- Blue lines show potential energy landscapes for different environmental factors</p>
                <p>- Red dots show individual particles moving in their respective landscapes</p>
                <p>- Save parameter combinations as presets using the form above</p>
                <p>- Individual interventions affect all particles simultaneously</p>
            </div>
        </div>
    );
};

export default PopulationModel;