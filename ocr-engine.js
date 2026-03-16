/**
 * Kenko AI OCR Engine
 * Using Tesseract.js for client-side OCR and Regex-based parsing for medical data.
 */

const OCREngine = {
    worker: null,

    async init() {
        if (this.worker) return;
        try {
            this.worker = await Tesseract.createWorker('eng', 1, {
                logger: m => console.log(m), // Add logger for progress tracking
            });
        } catch (error) {
            console.error("OCR Worker Init Error:", error);
        }
    },

    async scanImage(imageSource, onProgress) {
        await this.init();
        
        // Progress handling
        // Tesseract.js logger provides progress m.progress (0-1)
        
        const { data: { text } } = await this.worker.recognize(imageSource);
        return text;
    },

    async terminate() {
        if (this.worker) {
            await this.worker.terminate();
            this.worker = null;
        }
    },

    /**
     * Parses raw OCR text into structured medical data using regex.
     */
    parseMedicalData(text) {
        const lines = text.split('\n');
        const data = {
            medications: [],
            vitals: {},
            labResults: [],
            doctor: null,
            date: null,
            raw: text
        };

        // Date detection
        const dateMatch = text.match(/\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/);
        if (dateMatch) data.date = dateMatch[0];

        // Doctor detection
        const docMatch = text.match(/Dr\.\s?([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)/i);
        if (docMatch) data.doctor = docMatch[1];

        // Improved regex for medications (catches names followed by dosage or instructions)
        data.medications = [...text.matchAll(/(?:Rx|Med|Tab|Cap|Syp)?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*(?:\d+mg|\d+\s*mg|tablet|cap|once|daily|od|bd|tds|hs)?/gi)]
            .map(m => m[1].trim())
            .filter(m => m.length > 3 && !['Date', 'Name', 'Diagnosis', 'Patient'].includes(m));

        // Vitals detection
        const bpMatch = text.match(/BP[:\s]+(\d{2,3}[\/\s]\d{2,3})/i);
        if (bpMatch) data.vitals.bp = bpMatch[1];

        const hrMatch = text.match(/(?:HR|Pulse|Heart\s?Rate)[:\s]+(\d{2,3})/i);
        if (hrMatch) data.vitals.heartRate = hrMatch[1];

        // Lab results patterns (Common markers)
        const labPatterns = [
            { key: 'Glucose', regex: /(?:Glucose|Sugar)[:\s]+(\d+(?:\.\d+)?)\s?(?:mg\/dL)?/i },
            { key: 'Hemoglobin', regex: /(?:Hemoglobin|Hb)[:\s]+(\d+(?:\.\d+)?)\s?(?:g\/dL)?/i },
            { key: 'Cholesterol', regex: /(?:Cholesterol|Total\s?CHL)[:\s]+(\d+)\s?(?:mg\/dL)?/i }
        ];

        labPatterns.forEach(pattern => {
            const match = text.match(pattern.regex);
            if (match) {
                data.labResults.push({ name: pattern.key, value: match[1] });
            }
        });

        // Medication detection (Sample list of common suffixes/patterns)
        // This is a simplified approach
        const medKeywords = ['Tablet', 'Capsule', 'mg', 'ml', 'Syrup', 'BD', 'TID', 'OD', 'HS'];
        lines.forEach(line => {
            const hasKeyword = medKeywords.some(k => line.includes(k));
            if (hasKeyword && line.length > 5) {
                // Try to clean up the line
                const cleaned = line.replace(/[^\w\s\-\/\.]/gi, '').trim();
                data.medications.push(cleaned);
            }
        });

        return data;
    }
};

window.OCREngine = OCREngine;
