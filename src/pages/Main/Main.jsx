"use client"
import { useState, useEffect } from "react";
import IconGrid from "../../components/Dashboard";
import {useAuth} from "../../context/AuthContext";
import "./Main.css";

function Main() {
  const [greeting, setGreeting] = useState("");
  const { user } = useAuth();
  const userRole = user?.role || null;
  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <div className="main-container bg-gray-50 min-h-screen">
     

      
      <main className="main-content">
        <div className="container mx-auto px-4 py-6">
          <div className="w-full max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">{greeting}, {user.username}</h1>
              <p className="text-gray-600">Welcome to your academic review dashboard</p>
            </div>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {[
                { label: "Universities", value: 12, change: "+2", color: "bg-blue-500" },
                { label: "Total Programs", value: 284, change: "+14", color: "bg-green-500" },
                { label: "Active Users", value: 1840, change: "+86", color: "bg-purple-500" },
                { label: "New Reports", value: 18, change: "+6", color: "bg-amber-500" }
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-5 flex items-center">
                  <div className={`${stat.color} h-12 w-12 rounded-lg flex items-center justify-center text-white mr-4`}>
                    <span className="font-bold text-lg">{stat.value.toString()[0]}</span>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                    <div className="flex items-baseline">
                      <h3 className="text-xl font-bold text-gray-800 mr-2">{stat.value}</h3>
                      <span className="text-xs text-green-600">{stat.change}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Module Access</h2>
              <div className="dashboard-card-container">
                <IconGrid userLevel={userRole} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Main

