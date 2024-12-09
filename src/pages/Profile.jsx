import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import "tailwindcss/tailwind.css";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [totalProgress, setTotalProgress] = useState({ percent: 0, completed: 0, total: 0 });
  const [sectionProgress, setSectionProgress] = useState([]);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const fetchProgressData = async () => {
      try {
        const { data: allSubsectionsData } = await axios.get("/v1/subsection/get-subsections");
        const allSubsections = allSubsectionsData.subsections || [];
        
        const { data: allSectionsData } = await axios.get("/v1/section/get-sections");
        const allSections = allSectionsData.subsections || [];

        const sectionNames = allSections.reduce((acc, section) => {
          acc[section.id] = section.name;
          return acc;
        }, {});
 
        const completedSubsections = allSubsections.filter((sub) => sub.status === 2);

        const totalProgressPercent = (completedSubsections.length / allSubsections.length) * 100;

        const sectionStats = allSubsections.reduce((acc, subsection) => {
          const sectionId = subsection.section_id;
          if (!acc[sectionId]) {
            acc[sectionId] = { total: 0, completed: 0, name: sectionNames[sectionId] || `Секция ${sectionId}` };
          }
          acc[sectionId].total += 1;
          if (subsection.status === 2) {
            acc[sectionId].completed += 1;
          }
          return acc;
        }, {});

        const sectionProgressArray = Object.entries(sectionStats).map(
          ([sectionId, { total, completed, name }]) => ({
            sectionId,
            name,
            progress: (completed / total) * 100,
            completed,
            total,
          })
        );

        setTotalProgress({
          percent: totalProgressPercent,
          completed: completedSubsections.length,
          total: allSubsections.length,
        });
        setSectionProgress(sectionProgressArray);
      } catch (error) {
        console.error("Ошибка при загрузке данных прогресса:", error);
      }
    };

    fetchProgressData();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <img
          src="https://upload.wikimedia.org/wikipedia/en/c/c7/Chill_guy_original_artwork.jpg"
          alt="Profile"
          className="w-24 h-24 rounded-full border-2 border-gray-300"
        />
        <div className="ml-4">
          <h1 className="text-xl font-semibold">{username}</h1>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Общий прогресс</h2>
        <div className="bg-gray-200 rounded-lg overflow-hidden h-6">
          <div
            className="bg-blue-600 h-full"
            style={{ width: `${totalProgress.percent}%` }}
          ></div>
        </div>
        <p className="text-sm mt-1">
          {Math.round(totalProgress.percent)}% ({totalProgress.completed}/{totalProgress.total})
        </p>
      </div>

      <h2 className="text-lg font-semibold mb-4">Прогресс по секциям</h2>
      <div>
        {sectionProgress.map(({ sectionId, name, progress, completed, total }) => (
          <div key={sectionId} className="mb-4">
            <h3 className="text-md font-medium">{name}</h3>
            <div className="bg-gray-200 rounded-lg overflow-hidden h-6">
              <div
                className="bg-green-500 h-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm mt-1">
              {Math.round(progress)}% ({completed}/{total})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
