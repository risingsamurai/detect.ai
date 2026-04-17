from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
import pandas as pd
import io
import base64
from typing import List, Optional
import traceback

from bias_analyzer import analyze_dataset_fairness

app = FastAPI(title="LUMIS.AI Bias Analysis Engine")

class AnalyzeRequest(BaseModel):
    dataset_csv_base64: str
    target_column: str
    favorable_outcome: str
    protected_attributes: List[str]

@app.post("/analyze")
async def analyze_bias(request: AnalyzeRequest):
    try:
        # Decode base64 CSV to DataFrame
        csv_data = base64.b64decode(request.dataset_csv_base64).decode('utf-8')
        df = pd.read_csv(io.StringIO(csv_data))
        
        # Run AIF360 analysis
        results = analyze_dataset_fairness(
            df=df,
            target_column=request.target_column,
            favorable_outcome=request.favorable_outcome,
            protected_attrs=request.protected_attributes
        )
        
        return results
        
    except Exception as e:
        print(f"Error during analysis: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
