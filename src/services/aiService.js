/**
 * Zenith AI Service Logic
 * Mimics a backend API with proper latency and streaming-like response.
 */

const SYSTEM_PROMPTS = {
    creative: "You are Zenith AI in Creative Mode. You help users brainstorm, think out of the box, and explore non-linear ideas. Use an inspiring and imaginative tone.",
    focus: "You are Zenith AI in Focus Mode. Be concise, direct, and objective. Help the user execute tasks efficiently and eliminate distractions.",
    research: "You are Zenith AI in Research Mode. Use a scholarly, analytical tone. Provide deep insights, historical context, and cite potential sources or theories."
};

export const getAIResponse = async (userQuery, mode, history = []) => {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const prompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.creative;
    const q = userQuery.toLowerCase();

    // Basic logic for "backend" decisions
    if (q.includes('weather')) {
        return "I've synthesized current meteorological data: The atmosphere is clear with a stable pressure system at 1013 hPa. Ideal for deep work.";
    }

    if (q.includes('time') || q.includes('jam')) {
        return `Temporal sync complete. It is currently ${new Date().toLocaleTimeString()}. Optimal performance window is active.`;
    }

    if (q.includes('calculate') || q.includes('hitung')) {
        try {
            const expression = q.replace(/[a-zA-Z]/g, '').trim();
            if (expression) {
                // Safe evaluation of simple math
                const result = eval(expression.replace(/x/g, '*'));
                return `Computation successful: **${result}**. My arithmetic processors are running at peak efficiency.`;
            }
        } catch (e) {
            return "I encountered a syntax error in your mathematical expression. Please provide a clear numerical string.";
        }
    }

    // Fallback responses based on mode mimicking a "Brain"
    const responses = {
        creative: [
            `That's a fascinating spark! Have you considered how **${userQuery}** might evolve if we applied first-principles thinking?`,
            `Synthesizing creative alternatives for "${userQuery}"... The most elegant solution might be the one we haven't mapped yet.`,
            `My neural creative engine suggests a 15% increase in impact if we pivot the core concept of **${userQuery}** towards a more user-centric model.`
        ],
        focus: [
            `Objective: **${userQuery}**. \nPrimary Action: Identify the bottleneck. \nSecondary Action: Execute with maximum focus. Shall I block non-essential notifications?`,
            `Efficiency analysis complete. Regarding "${userQuery}", the most direct path involves three steps: Plan, Execute, and Review. Let's start now.`,
            `Task "${userQuery}" logged. Estimated time to completion: 45 minutes of deep work. Ready whenever you are.`
        ],
        research: [
            `Tracing the lineage of **${userQuery}** leads back to several foundational theories in complex system dynamics. Would you like a bibliography?`,
            `Data synthesis for "${userQuery}" indicates a correlation with emerging trends in decentralized intelligence. I recommend monitoring this space closely.`,
            `Analysis of your query suggests an intersection between ${userQuery} and cognitive optimization. Preliminary results are promising.`
        ]
    };

    const modeResponses = responses[mode] || responses.creative;
    return modeResponses[Math.floor(Math.random() * modeResponses.length)];
};
