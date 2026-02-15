const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class EmotionService {
    constructor() {
        this.pythonProcess = null;
        this.pendingRequests = [];
        this.isInitializing = false;
        this.init();
    }

    init(force = false) {
        if (this.pythonProcess && !force) return;
        
        if (this.pythonProcess) {
            console.log("🔄 Restarting FER Engine...");
            this.pythonProcess.kill();
            this.pythonProcess = null;
        }

        this.isInitializing = true;

        const venvPythonPath = path.join(__dirname, '..', '..', '..', 'Model', 'venv', 'Scripts', 'python.exe');
        const pythonExecutable = fs.existsSync(venvPythonPath) ? venvPythonPath : 'python';
        const scriptPath = path.join(__dirname, 'emotion_engine.py');

        console.log(`🚀 Starting Persistent FER Engine: ${pythonExecutable}`);

        this.pythonProcess = spawn(pythonExecutable, [scriptPath]);

        this.pythonProcess.stdout.on('data', (data) => {
            const result = data.toString().trim();
            if (this.pendingRequests.length > 0) {
                const { resolve } = this.pendingRequests.shift();
                resolve(result);
            }
        });

        this.pythonProcess.stderr.on('data', (data) => {
            const error = data.toString();
            // Filter out TensorFlow warnings/logs that aren't critical errors
            // TensorFlow often mentions 'round-off errors' in its INFO logs which triggers our includes('error')
            const isCriticalError = error.toLowerCase().includes('error') && 
                                   !error.includes('oneDNN') && 
                                   !error.includes('floating-point');
            
            if (isCriticalError) {
                console.error(`🐍 FER Engine Error: ${error}`);
            }
        });

        this.pythonProcess.on('close', (code) => {
            console.log(`🐍 FER Engine exited with code ${code}`);
            this.pythonProcess = null;
            this.isInitializing = false;
            // Reject all pending if it crashed
            while (this.pendingRequests.length > 0) {
                const { resolve } = this.pendingRequests.shift();
                resolve('unknown');
            }
        });

        this.isInitializing = false;
    }

    detectEmotion(base64Image) {
        return new Promise((resolve) => {
            if (!this.pythonProcess) {
                this.init();
                // If it still hasn't started, return unknown
                if (!this.pythonProcess) return resolve('unknown');
            }

            this.pendingRequests.push({ resolve });
            
            // Clean base64 string (remove data:image/jpeg;base64, etc.)
            const cleanImage = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
            
            // Send to Python stdin as one line
            this.pythonProcess.stdin.write(cleanImage + '\n');
        });
    }
}

// Singleton instances
const emotionServiceInstance = new EmotionService();
// Force a fresh start to clear any old instances
emotionServiceInstance.init(true);

module.exports = { 
    detectEmotion: (img) => emotionServiceInstance.detectEmotion(img)
};
