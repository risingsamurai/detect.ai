import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UploadCloud, FileType2, Play, Settings2, CheckCircle2, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuditStore } from '../store/auditStore';
import toast from 'react-hot-toast';

export default function NewAudit() {
  const navigate = useNavigate();
  const { addAudit } = useAuditStore();
  
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  
  const [datasetName, setDatasetName] = useState('');
  const [targetColumn, setTargetColumn] = useState('');
  const [favorableOutcome, setFavorableOutcome] = useState('');
  const [protectedAttrs, setProtectedAttrs] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setDatasetName(uploadedFile.name.split('.')[0]);

    // Parse CSV
    Papa.parse(uploadedFile, {
      header: true,
      preview: 10,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.meta.fields) {
          setColumns(results.meta.fields);
          setPreviewData(results.data);
          setStep(2);
        }
      },
      error: (error) => {
        toast.error(`Error parsing file: ${error.message}`);
      }
    });
  }, []);

  const handleToggleProtected = (col: string) => {
    setProtectedAttrs(prev => 
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  };

  const handleStartAnalysis = async () => {
    if (!targetColumn || !favorableOutcome || protectedAttrs.length === 0) {
      toast.error('Please complete all configuration fields');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Create mock audit
    const newAudit = {
      id: Math.random().toString(36).substring(7),
      userId: 'user123',
      datasetName: datasetName,
      createdAt: new Date().toISOString(),
      status: 'complete' as const,
      rowCount: 1000,
      columnCount: columns.length,
      targetColumn,
      protectedAttributes: protectedAttrs,
      fairnessScore: 68,
      severity: 'moderate' as const,
      metrics: {
        [protectedAttrs[0] || 'gender']: {
          disparateImpact: 0.72,
          statParityDiff: -0.15,
          equalOppDiff: -0.12,
          avgOddsDiff: -0.10,
          theilIndex: 0.08,
        }
      }
    };

    addAudit(newAudit);
    toast.success('Analysis complete!');
    navigate(`/audit/${newAudit.id}`);
  };

  const loadDemoData = () => {
    // Demo mode bypasses real upload
    setDatasetName('HR_Screening_Dataset');
    setColumns(['applicant_id', 'gender', 'race', 'age', 'education', 'years_experience', 'interview_score', 'hired']);
    setPreviewData([
      { applicant_id: '1', gender: 'Male', race: 'White', age: '32', hired: '1' },
      { applicant_id: '2', gender: 'Female', race: 'Asian', age: '28', hired: '0' },
      { applicant_id: '3', gender: 'Male', race: 'Black', age: '45', hired: '1' },
    ]);
    setStep(2);
    toast.success('Loaded demo dataset');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Fairness Audit</h1>
        <p className="text-gray-400 mt-1">Upload your dataset and configure the analysis parameters.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between relative mb-12">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-white/10 -z-10"></div>
        {[
          { id: 1, label: 'Upload' },
          { id: 2, label: 'Configure' },
          { id: 3, label: 'Analyze' }
        ].map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-2 bg-[#0A0A0F] px-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
              step >= s.id 
                ? 'bg-[#6C47FF] text-white shadow-[0_0_15px_rgba(108,71,255,0.5)]' 
                : 'bg-[#12121A] text-gray-500 border border-white/10'
            }`}>
              {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
            </div>
            <span className={`text-sm ${step >= s.id ? 'text-white' : 'text-gray-500'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Card className="p-12 text-center border-dashed border-2 hover:border-[#6C47FF]/50 transition-colors group">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-10 h-10 text-[#6C47FF]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Drag & Drop your dataset</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Upload a CSV or JSON file containing your features and target variables. Max size 50MB for the free tier.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="relative">
                  <input
                    type="file"
                    accept=".csv,.json"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button className="w-full sm:w-auto">Browse Files</Button>
                </div>
                <span className="text-gray-500">or</span>
                <Button variant="outline" onClick={loadDemoData}>
                  Load Demo Data
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <Card>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                      <Settings2 className="w-5 h-5 text-[#6C47FF]" /> Configuration
                    </h3>
                    <Input 
                      label="Dataset Name" 
                      value={datasetName} 
                      onChange={(e) => setDatasetName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Target Variable <span className="text-[#FF4D6D]">*</span>
                    </label>
                    <select 
                      className="w-full bg-[#12121A] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#6C47FF] focus:ring-1 focus:ring-[#6C47FF]"
                      value={targetColumn}
                      onChange={(e) => setTargetColumn(e.target.value)}
                    >
                      <option value="">Select target column...</option>
                      {columns.map(col => <option key={col} value={col}>{col}</option>)}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">What is your model trying to predict?</p>
                  </div>

                  <div>
                    <Input 
                      label="Favorable Outcome Value *" 
                      placeholder="e.g., 1, 'Yes', 'Approved'"
                      value={favorableOutcome}
                      onChange={(e) => setFavorableOutcome(e.target.value)}
                    />
                  </div>
                </div>

                <div className="w-px bg-white/10 hidden md:block"></div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-[#FFB740]" /> Protected Attributes
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">Select the demographic columns to check for bias against.</p>
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {columns.map(col => (
                      <label key={col} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        protectedAttrs.includes(col) 
                          ? 'border-[#6C47FF] bg-[#6C47FF]/10' 
                          : 'border-white/5 hover:border-white/20 bg-[#12121A]'
                      }`}>
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-gray-600 text-[#6C47FF] focus:ring-[#6C47FF] focus:ring-offset-[#12121A] bg-[#12121A]"
                          checked={protectedAttrs.includes(col)}
                          onChange={() => handleToggleProtected(col)}
                        />
                        <span className="font-medium">{col}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <FileType2 className="w-5 h-5 text-[#00C2A8]" /> Data Preview
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-400 uppercase bg-white/5">
                    <tr>
                      {columns.slice(0, 8).map(col => (
                        <th key={col} className="px-4 py-3">{col}</th>
                      ))}
                      {columns.length > 8 && <th className="px-4 py-3">...</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, i) => (
                      <tr key={i} className="border-b border-white/5">
                        {columns.slice(0, 8).map(col => (
                          <td key={col} className="px-4 py-3 text-gray-300">{row[col]}</td>
                        ))}
                        {columns.length > 8 && <td className="px-4 py-3">...</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
              <Button 
                size="lg" 
                onClick={handleStartAnalysis}
                isLoading={isAnalyzing}
                disabled={!targetColumn || !favorableOutcome || protectedAttrs.length === 0}
              >
                {isAnalyzing ? 'Analyzing for Bias...' : 'Start Analysis'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
