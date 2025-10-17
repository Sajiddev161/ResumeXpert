import React, { useEffect, useRef, useState } from "react";
import { resumeTemplates } from "../utils/data";
import { Check } from "lucide-react";

// ✅ Example placeholder components (you should replace these with your actual ones)
import Tabs from "./Tabs"; // <-- Make sure Tabs is imported from your components
// import TemplateCard from "./TemplateCard"; // <-- Make sure TemplateCard exists
import RenderResume from "./RenderResume"; // <-- Replace with your actual resume renderer
import { TemplateCard } from "./Cards";

const TAB_DATA = [{ label: "Templates" }];

const ThemeSelector = ({ selectedTheme, setSelectedTheme, resumeData, onClose }) => {
  const resumeRef = useRef(null);
  const [baseWidth, setBaseWidth] = useState(800);
  const [tabValue, setTabValue] = useState("Templates");

  // ✅ Update container width on resize
  const updateBaseWidth = () => {
    if (resumeRef.current) {
      setBaseWidth(resumeRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    updateBaseWidth();
    window.addEventListener("resize", updateBaseWidth);
    return () => {
      window.removeEventListener("resize", updateBaseWidth);
    };
  }, []);

  // ✅ Get initial template index
  const initialIndex = resumeTemplates.findIndex((t) => t.id === selectedTheme);
  const [selectedTemplate, setSelectedTemplate] = useState({
    theme: selectedTheme || resumeTemplates[0]?.id || "",
    index: initialIndex >= 0 ? initialIndex : 0,
  });

  const handleThemeSelection = () => {
    setSelectedTheme(selectedTemplate.theme);
    onClose();
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 p-4 sm:p-6 bg-gradient-to-r from-white to-violet-50 rounded-2xl border border-violet-100">
        <Tabs tabs={TAB_DATA} activeTab={tabValue} setActiveTab={setTabValue} />

        <button
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black rounded-2xl hover:scale-105 transition-all shadow-lg hover:shadow-xl"
          onClick={handleThemeSelection}
        >
          <Check size={18} /> Apply Changes
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        {/* LEFT SIDE – Templates */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] lg:max-h-[70vh] overflow-auto p-2">
            {resumeTemplates.map((template, index) => (
              <TemplateCard
                key={`template_${index}`}
                thumbnailImg={template.thumbnailImg}
                isSelected={selectedTemplate.index === index}
                onSelect={() =>
                  setSelectedTemplate({
                    theme: template.id,
                    index,
                  })
                }
              />
            ))}
          </div>
        </div>

        {/* RIGHT SIDE – Resume Preview */}
        <div
          className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-4 sm:p-6"
          ref={resumeRef}
        >
          <RenderResume
            templateId={selectedTemplate?.theme || ""}
            resumeData={resumeData}
            containerWidth={baseWidth}
          />
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
