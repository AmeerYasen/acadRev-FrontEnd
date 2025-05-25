"use client"; // If using Next.js App Router

import React, { useState } from 'react';
import { User, Shield, Bell, CreditCard, Lock } from 'lucide-react'; // Example icons

// Define the settings sections
const settingsSections = [
  { id: 'profile', label: 'Profile', icon: <User size={20} />, content: <ProfileSettings /> },
  { id: 'account', label: 'Account', icon: <Shield size={20} />, content: <AccountSettings /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={20} />, content: <NotificationSettings /> },
  { id: 'security', label: 'Security', icon: <Lock size={20} />, content: <SecuritySettings /> },
];

// --- Placeholder Content Components ---
// In a real app, these would be more complex forms or displays

function ProfileSettings() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-[var(--text-main)]">Profile Settings</h2>
      <p className="text-[var(--text-medium)]">Update your personal information here.</p>
      {/* Add form fields for name, email, avatar etc. */}
      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[var(--text-main)]">Name</label>
          <input type="text" id="name" defaultValue="Ameer Dabour" className="mt-1 block w-full px-3 py-2 border border-[var(--border-main)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm bg-[var(--bg-input)] text-[var(--text-main)]" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[var(--text-main)]">Email</label>
          <input type="email" id="email" defaultValue="ameer.d@example.com" className="mt-1 block w-full px-3 py-2 border border-[var(--border-main)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm bg-[var(--bg-input)] text-[var(--text-main)]" />
        </div>
        <button className="bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] text-white font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function AccountSettings() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-[var(--text-main)]">Account Settings</h2>
      <p className="text-[var(--text-medium)]">Manage your account preferences.</p>
      {/* Add options for language, theme, etc. */}
       <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-[var(--text-main)]">Language</label>
          <select id="language" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-[var(--border-main)] focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm rounded-md bg-[var(--bg-input)] text-[var(--text-main)]">
            <option>English</option>
            <option>Arabic</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-[var(--text-main)]">Notification Settings</h2>
      <p className="text-[var(--text-medium)]">Control how you receive notifications.</p>
      {/* Add toggles for email, push, SMS notifications */}
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
           <span className="text-sm font-medium text-[var(--text-main)]">Email Notifications</span>
           <label htmlFor="email-toggle" className="inline-flex relative items-center cursor-pointer">
            <input type="checkbox" value="" id="email-toggle" className="sr-only peer" defaultChecked/>
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--primary-color)]"></div>
          </label>
        </div>
         <div className="flex items-center justify-between">
           <span className="text-sm font-medium text-[var(--text-main)]">Push Notifications</span>
           <label htmlFor="push-toggle" className="inline-flex relative items-center cursor-pointer">
            <input type="checkbox" value="" id="push-toggle" className="sr-only peer"/>
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--primary-color)]"></div>
          </label>
        </div>
      </div>
    </div>
  );
}



function SecuritySettings() {
    return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-[var(--text-main)]">Security</h2>
      <p className="text-[var(--text-medium)]">Manage your password and security settings.</p>
      {/* Add change password, 2FA setup */}
       <div className="mt-4 space-y-4">
         <button className="border border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out">
          Change Password
        </button>
         <div>
           <p className="text-sm font-medium text-[var(--text-main)]">Two-Factor Authentication (2FA)</p>
           <p className="text-sm text-[var(--text-medium)]">Add an extra layer of security to your account.</p>
           <button className="mt-2 bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] text-white font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out">
            Enable 2FA
          </button>
         </div>
      </div>
    </div>
  );
}


// --- Main Settings Page Component ---

function SettingsPage() {
  const [activeSection, setActiveSection] = useState(settingsSections[0].id); // Default to the first section

  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);
  };

  const ActiveComponent = settingsSections.find(sec => sec.id === activeSection)?.content;

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-theme(space.16))] bg-[var(--bg-light)]"> {/* Adjust min-height based on header height */}
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[var(--bg-card)] p-4 md:p-6 border-r border-[var(--border-main)] flex-shrink-0">
        <h2 className="text-lg font-semibold mb-6 text-[var(--text-main)]">Settings</h2>
        <nav className="space-y-2">
          {settingsSections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150
                ${activeSection === section.id
                  ? 'bg-[var(--primary-color)] text-white'
                  : 'text-[var(--text-medium)] hover:bg-[var(--bg-input)] hover:text-[var(--text-main)]'
                }
              `}
            >
              {section.icon}
              <span>{section.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {ActiveComponent ? ActiveComponent : <p>Select a section</p>}
      </main>
    </div>
  );
}

export default SettingsPage;

