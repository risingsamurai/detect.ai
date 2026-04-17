import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Database, BrainCircuit, Activity, ChevronRight, Play } from 'lucide-react';
import { signInWithGoogle } from '../services/firebase';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import toast from 'react-hot-toast';

export default function Landing() {
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
      toast.success('Successfully signed in!');
    } catch (error) {
      // It's expected to fail if user didn't put API key yet.
      // But we will allow navigating to dashboard as a demo fallback.
      navigate('/dashboard');
      toast.error('Google Sign-In failed (no real config). Continuing in demo mode.');
    }
  };

  const handleDemo = () => {
    navigate('/dashboard');
    toast.success('Entering Demo Mode');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0A0A0F]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C47FF] to-[#00C2A8] flex items-center justify-center text-white font-bold text-2xl shadow-[0_0_20px_rgba(108,71,255,0.4)]">
              L
            </div>
            <span className="text-2xl font-bold tracking-tight">LUMIS.AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleDemo}>Try Demo</Button>
            <Button onClick={handleSignIn}>Sign In</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6C47FF]/10 text-[#6C47FF] font-medium text-sm border border-[#6C47FF]/20 mb-6">
                <ShieldCheck className="w-4 h-4" /> Solution Challenge 2026
              </span>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
                Detect Bias. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C47FF] to-[#00C2A8]">
                  Build Fairness.
                </span> <br />
                Deploy With Confidence.
              </h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-gray-400 max-w-2xl leading-relaxed"
            >
              The industry standard for AI fairness auditing. Automatically detect, measure, visualize, and fix bias in your datasets and ML models before they harm real people.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" onClick={handleSignIn} className="gap-2">
                Start Free Audit <ChevronRight className="w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={handleDemo} className="gap-2">
                <Play className="w-5 h-5" /> Try Demo Data
              </Button>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex-1 relative"
          >
            {/* Pulsing visual representation */}
            <div className="relative w-full max-w-lg mx-auto aspect-square">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#6C47FF]/20 to-[#00C2A8]/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="glass absolute inset-4 rounded-full border border-white/10 flex items-center justify-center flex-col">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.6 }}
                  className="w-32 h-32 rounded-full border-4 border-[#22C55E] flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                >
                  <span className="text-4xl font-bold text-[#22C55E]">94</span>
                </motion.div>
                <p className="text-lg font-medium">Fairness Score</p>
                <p className="text-sm text-gray-400">Model: HR_Screening_v2</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-y border-white/5"
        >
          <div className="text-center">
            <h3 className="text-5xl font-bold text-white mb-2">2.3B</h3>
            <p className="text-gray-400">People affected by biased AI annually</p>
          </div>
          <div className="text-center">
            <h3 className="text-5xl font-bold text-[#6C47FF] mb-2">5+</h3>
            <p className="text-gray-400">Fairness metrics analyzed</p>
          </div>
          <div className="text-center">
            <h3 className="text-5xl font-bold text-[#00C2A8] mb-2">100%</h3>
            <p className="text-gray-400">Actionable mitigation strategies</p>
          </div>
        </motion.div>

        {/* How it works */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How LUMIS.AI Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Three simple steps to ensure your AI systems are fair, compliant, and unbiased.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Database, title: '1. Upload Dataset', desc: 'Securely connect your data or upload a CSV. We support large-scale datasets with intelligent parsing.' },
              { icon: Activity, title: '2. Analyze for Bias', desc: 'Our engine runs 5+ statistical fairness tests across protected attributes (gender, race, age) in seconds.' },
              { icon: BrainCircuit, title: '3. Fix with AI Insights', desc: 'Get Gemini-powered explanations of bias and concrete, code-level mitigation recommendations.' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full bg-gradient-to-b from-[#12121A] to-transparent">
                  <div className="w-12 h-12 rounded-lg bg-[#6C47FF]/20 flex items-center justify-center mb-6 text-[#6C47FF]">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
