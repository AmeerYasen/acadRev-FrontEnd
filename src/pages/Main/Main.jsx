"use client";
import { useState, useEffect } from "react";
import IconGrid from "../../components/Dashboard";
import { useAuth } from "../../context/AuthContext";
import useNamespacedTranslation from "../../hooks/useNamespacedTranslation";
import { getDashboardStats } from "../../api/statisticsAPI";
import "./Main.css";

function Main() {
  const [greeting, setGreeting] = useState("");
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { translateMain } = useNamespacedTranslation();
  const userRole = user?.role || null;

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(translateMain("greetings.morning"));
    else if (hour < 18) setGreeting(translateMain("greetings.afternoon"));
    else setGreeting(translateMain("greetings.evening"));
  }, [translateMain]);

  // Fetch statistics data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getDashboardStats();
        if (response.success) {
          setStatistics(response.data);
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Get statistics data with fallback to dummy data
  const getStatsData = () => {
    if (!statistics) {
      // Fallback dummy data
      return [
        {
          label: translateMain("stats.universities.label"),
          value: 12,
          color: "bg-blue-500",
        },
        {
          label: translateMain("stats.programs.label"),
          value: 284,
          color: "bg-green-500",
        },
        {
          label: translateMain("stats.users.label"),
          value: 1840,
          color: "bg-purple-500",
        },
        {
          label: translateMain("stats.reports.label"),
          value: 18,
          color: "bg-amber-500",
        },
      ];
    }

    const { counts } = statistics;

    // Define color mapping for different types of data
    const colorMapping = {
      authorities: "bg-red-500",
      universities: "bg-blue-500",
      colleges: "bg-purple-500",
      departments: "bg-green-500",
      programs: "bg-amber-500",
      users: "bg-cyan-500",
      responses: "bg-indigo-500",
      reports: "bg-pink-500",
    };

    // Default colors array for fallback
    const defaultColors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-amber-500",
      "bg-red-500",
      "bg-cyan-500",
      "bg-indigo-500",
      "bg-pink-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-lime-500",
      "bg-rose-500",
    ];

    // Dynamically create cards from all counts data
    return Object.entries(counts).map(([key, value], index) => {
      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
      const translationKey = `stats.${key}.label`;

      return {
        label: translateMain(translationKey) || capitalizedKey,
        value: value || 0,
        color: colorMapping[key] || defaultColors[index % defaultColors.length],
      };
    });
  };

  const statsData = getStatsData();

  return (
    <div className="main-container bg-gray-50 min-h-screen">
      <main className="main-content">
        <div className="container mx-auto px-4 py-6">
          <div className="w-full max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                {greeting}, {user.username}
              </h1>
              <p className="text-gray-600">
                {translateMain("welcome.subtitle")}
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
              {loading
                ? // Loading skeleton - show 4 cards while loading
                  Array(4)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-xl shadow-sm p-5 flex items-center animate-pulse"
                      >
                        <div className="bg-gray-300 h-12 w-12 rounded-lg mr-4"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-300 rounded mb-2"></div>
                          <div className="h-6 bg-gray-300 rounded w-16"></div>
                        </div>
                      </div>
                    ))
                : statsData.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-sm p-5 flex items-center"
                    >
                      <div
                        className={`${stat.color} h-12 w-12 rounded-lg flex items-center justify-center text-white mr-4`}
                      >
                        <span className="font-bold text-lg">
                          {stat.value.toString()[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">{stat.label}</p>
                        <h3 className="text-xl font-bold text-gray-800">
                          {stat.value}
                        </h3>
                      </div>
                    </div>
                  ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {translateMain("modules.title")}
              </h2>
              <div className="dashboard-card-container">
                <IconGrid userLevel={userRole} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Main;
