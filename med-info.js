/**
 * Kenko AI - Medicine Intelligence Database
 * Provides descriptions, uses, and side effects for common medications.
 */

const MedicineDB = {
    "paracetamol": {
        "description": "A common painkiller and fever reducer.",
        "uses": "Relief of mild to moderate pain (headache, toothache) and fever.",
        "sideEffects": "Rare but may include skin rash, nausea, or liver damage if overdosed."
    },
    "amoxicillin": {
        "description": "A penicillin-type antibiotic used to treat bacterial infections.",
        "uses": "Ear infections, strep throat, pneumonia, and skin infections.",
        "sideEffects": "Nausea, vomiting, diarrhea, or allergic reactions (hives)."
    },
    "metformin": {
        "description": "An oral diabetes medicine that helps control blood sugar levels.",
        "uses": "Type 2 diabetes management.",
        "sideEffects": "Diarrhea, stomach pain, gas, or metal taste in the mouth."
    },
    "atorvastatin": {
        "description": "A statin medication used to lower cholesterol.",
        "uses": "Prevention of cardiovascular disease and high cholesterol treatment.",
        "sideEffects": "Muscle pain, joint pain, diarrhea, or upset stomach."
    },
    "ibuprofen": {
        "description": "A nonsteroidal anti-inflammatory drug (NSAID).",
        "uses": "Inflammation, fever, and pain relief.",
        "sideEffects": "Stomach upset, heartburn, or increased risk of heart issues if used long-term."
    },
    "cetirizine": {
        "description": "An antihistamine used for allergy relief.",
        "uses": "Hay fever, hives, and itchy/watery eyes.",
        "sideEffects": "Drowsiness, dry mouth, or fatigue."
    },
    "omeprazole": {
        "description": "A proton pump inhibitor (PPI) that reduces stomach acid.",
        "uses": "Acid reflux, GERD, and stomach ulcers.",
        "sideEffects": "Headache, nausea, or abdominal pain."
    },
    "azithromycin": {
        "description": "A macrolide-type antibiotic.",
        "uses": "Respiratory infections and skin infections.",
        "sideEffects": "Nausea, diarrhea, or stomach pain."
    },
    "losartan": {
        "description": "An angiotensin II receptor blocker (ARB).",
        "uses": "High blood pressure (hypertension) and kidney protection.",
        "sideEffects": "Dizziness, cold-like symptoms, or back pain."
    },
    "levothyroxine": {
        "description": "A thyroid hormone replacement.",
        "uses": "Hypothyroidism (underactive thyroid).",
        "sideEffects": "Nausea, headache, or sleep problems if levels are not balanced."
    }
};

/**
 * Utility to get medicine info with a fallback
 */
function getMedicineInfo(name) {
    if (!name) return null;
    const cleanName = name.toLowerCase().trim();
    
    // Check for exact match or partial match
    for (let med in MedicineDB) {
        if (cleanName.includes(med)) {
            return MedicineDB[med];
        }
    }
    return null;
}

// Export for use in browser
if (typeof window !== 'undefined') {
    window.MedicineDB = MedicineDB;
    window.getMedicineInfo = getMedicineInfo;
}
