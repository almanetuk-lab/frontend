import { useState, useEffect } from 'react';

// CONFIGURATION DATA - यही आपका Excel data है
const LIFE_RHYTHMS_CONFIG = {
  work_rhythm: {
    label: "Work Rhythm",
    singles: {
      "Focused": "I like working without distractions and staying deeply focused.",
      "Balanced": "I keep a healthy balance between work and personal life.",
      "Driven": "I like making progress and working toward meaningful goals.",
      "Independent": "I prefer having control over my time and decisions."
    },
    combinations: {
      "Focused and Balanced": "I stay focused in work while staying balanced between work and personal life.",
      "Focused and Driven": "I bring focused effort to my work and stay driven toward meaningful goals and targets.",
      "Focused and Independent": "I prefer focused work and being independent in how I manage my time.",
      "Balanced and Driven": "I stay driven in my career while keeping a balanced approach to life.",
      "Balanced and Independent": "I value being independent at work while maintaining a balanced routine.",
      "Driven and Independent": "I'm driven by outcomes and prefer working in an independent way."
    }
  },
  
  social_energy: {
    label: "Social Energy",
    singles: {
      "Selective": "I prefer a small circle and meaningful connections.",
      "Intentional": "I'm thoughtful about how and when I spend social time.",
      "Energetic": "I enjoy lively social moments when the mood is right.",
      "Calm": "I prefer calm, low-pressure social interactions."
    },
    combinations: {
      "Selective and Intentional": "I'm selective about who I spend time with and keep my connections intentional.",
      "Selective and Energetic": "I'm selective socially, but when I engage, I bring real energy.",
      "Selective and Calm": "I prefer a selective circle and enjoy calm, low-pressure interactions.",
      "Intentional and Energetic": "I'm intentional with people and bring energy to conversations that matter.",
      "Intentional and Calm": "I approach social time in an intentional and calm way.",
      "Energetic and Calm": "I enjoy being energetic when needed while staying calm overall."
    }
  },
  
  life_pace: {
    label: "Life Pace",
    singles: {
      "Steady": "I don't like feeling rushed in daily life.",
      "Consistent": "I like routines I can rely on.",
      "Flexible": "I'm okay adjusting when plans change.",
      "Easygoing": "I let things flow without putting too much pressure on them."
    },
    combinations: {
      "Steady and Consistent": "I prefer a steady pace of life and like things to stay consistent day to day.",
      "Steady and Flexible": "I move at a steady life pace but stay flexible when plans change.",
      "Steady and Easygoing": "I keep life steady and remain easygoing about how things unfold.",
      "Consistent and Flexible": "I value consistent routines while staying flexible when needed.",
      "Consistent and Easygoing": "I like a consistent rhythm without losing an easygoing attitude.",
      "Flexible and Easygoing": "I'm flexible by nature and generally easygoing about life."
    }
  },
  
  emotional_style: {
    label: "Emotional Style",
    singles: {
      "Aware": "I notice how people feel, even when they don't say it.",
      "Curious": "I enjoy learning about people and how they think.",
      "Calm": "I stay composed when emotions run high.",
      "Grounded": "I stay emotionally steady and bounce back after challenges."
    },
    combinations: {
      "Steady and Consistent": "I'm emotionally aware and genuinely curious about people and perspectives.",
      "Steady and Flexible": "I stay aware of emotions while remaining calm in my responses.",
      "Steady and Easygoing": "I'm emotionally aware and stay grounded even in difficult moments.",
      "Consistent and Flexible": "I'm curious about others while keeping a calm emotional tone.",
      "Consistent and Easygoing": "I stay curious about life while remaining grounded in how I respond.",
      "Flexible and Easygoing": "I approach situations in a calm and grounded way."
    }
  }
};

export default function LifeRhythmsFinalForm({ userId, initialData, onSave }) {
  // INITIAL STATE
  const [formData, setFormData] = useState({
    work_rhythm: { single: '', combination: '', statement: '' },
    social_energy: { single: '', combination: '', statement: '' },
    life_pace: { single: '', combination: '', statement: '' },
    emotional_style: { single: '', combination: '', statement: '' }
  });

  // Load initial data if exists
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Handle selection change
  const handleSelectionChange = (category, type, value) => {
    const config = LIFE_RHYTHMS_CONFIG[category];
    
    let newData = { ...formData[category] };
    newData[type] = value;
    
    // Clear other type if one is selected
    if (type === 'single') {
      newData.combination = '';
      newData.statement = config.singles[value] || '';
    } else if (type === 'combination') {
      newData.single = '';
      newData.statement = config.combinations[value] || '';
    }
    
    setFormData(prev => ({
      ...prev,
      [category]: newData
    }));
  };

  // Get final JSON for database
  const getFinalData = () => {
    return formData;
  };

  // Save to backend
  const handleSave = async () => {
    try {
      const finalData = getFinalData();
      
      const response = await fetch('/api/profile/save-life-rhythms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          life_rhythms: finalData
        })
      });

      if (response.ok) {
        alert('Life Rhythms saved successfully!');
        onSave?.(finalData);
      }
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  // Render category section
  const renderCategory = (category) => {
    const config = LIFE_RHYTHMS_CONFIG[category];
    const data = formData[category];

    return (
      <div key={category} className="mb-8 p-4 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{config.label}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Single Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select one word
            </label>
            <select
              value={data.single}
              onChange={(e) => handleSelectionChange(category, 'single', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Choose one --</option>
              {Object.keys(config.singles).map((word) => (
                <option key={word} value={word}>{word}</option>
              ))}
            </select>
          </div>

          {/* Combination Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Or select combination
            </label>
            <select
              value={data.combination}
              onChange={(e) => handleSelectionChange(category, 'combination', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Choose combination --</option>
              {Object.keys(config.combinations).map((combo) => (
                <option key={combo} value={combo}>{combo}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Generated Statement */}
        {data.statement && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 font-medium">{data.statement}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Life Rhythms</h2>
        <p className="text-gray-600 mt-1">Describe your personal and work style</p>
      </div>

      {/* All Categories */}
      {Object.keys(LIFE_RHYTHMS_CONFIG).map(renderCategory)}

      {/* Preview JSON */}
      <div className="mt-8 p-4 border rounded-lg bg-gray-100">
        <h3 className="font-bold text-gray-700 mb-2">Data Preview (JSON for DB):</h3>
        <pre className="text-sm bg-white p-3 rounded overflow-auto">
          {JSON.stringify(getFinalData(), null, 2)}
        </pre>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Save Life Rhythms
        </button>
      </div>
    </div>
  );
}