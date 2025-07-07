"use client";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  Building2,
  Landmark,
  BookOpen,
  Users,
  BarChart3,
  University,
  UserCircle,
} from "lucide-react"; // Added UserCircle
import { DashboardCard } from "./dashboard-card";
import { useState } from "react";
import useNamespacedTranslation from "../../hooks/useNamespacedTranslation";

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
    },
  },
  hover: {
    scale: 1.03,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
};

// Base card data
const getBaseNavCards = (translateDashboard) => [
  {
    id: 1,
    icon: <University className="w-6 h-6" />,
    title: translateDashboard("cards.university.title"),
    color: "from-blue-500 to-blue-700",
    description: translateDashboard("cards.university.description"),
    destination: "university",
  },
  {
    id: 2,
    icon: <Building2 className="w-6 h-6" />,
    title: translateDashboard("cards.college.title"),
    color: "from-purple-500 to-purple-700",
    description: translateDashboard("cards.college.description"),
    destination: "college",
  },
  {
    id: 3,
    icon: <Landmark className="w-6 h-6" />,
    title: translateDashboard("cards.department.title"),
    color: "from-green-500 to-green-700",
    description: translateDashboard("cards.department.description"),
    destination: "departments",
  },
  {
    id: 4,
    icon: <BookOpen className="w-6 h-6" />,
    title: translateDashboard("cards.program.title"),
    color: "from-amber-500 to-amber-700",
    description: translateDashboard("cards.program.description"),
    destination: "programs",
  },
  // User-specific card will be added dynamically
  {
    id: 6, // Adjusted ID to avoid conflict
    icon: <BarChart3 className="w-6 h-6" />,
    title: translateDashboard("cards.results.title"),
    subtitle: translateDashboard("cards.results.subtitle"),
    color: "from-cyan-500 to-cyan-700",
    description: translateDashboard("cards.results.description"),
    destination: "results",
  },
];

const getAdminUserCard = (translateDashboard) => ({
  id: 5,
  icon: <Users className="w-6 h-6" />,
  title: translateDashboard("cards.users.title"),
  subtitle: translateDashboard("cards.users.subtitle"),
  color: "from-red-500 to-red-700",
  description: translateDashboard("cards.users.description"),
  destination: "users",
});

const getNonAdminUserProfileCard = (translateDashboard) => ({
  id: 5, // Same ID for consistent placement if desired, or different
  icon: <UserCircle className="w-6 h-6" />,
  title: translateDashboard("cards.profile.title"),
  subtitle: translateDashboard("cards.profile.subtitle"),
  color: "from-teal-500 to-teal-700",
  description: translateDashboard("cards.profile.description"),
  destination: "profile",
});

function IconGrid({ userLevel }) {
  // Expect a user object e.g., { role: 'admin' } or { role: 'authority' }
  const [hoveredCard, setHoveredCard] = useState(null);
  const { translateDashboard } = useNamespacedTranslation();

  const baseNavCards = getBaseNavCards(translateDashboard);
  const adminUserCard = getAdminUserCard(translateDashboard);
  const nonAdminUserProfileCard =
    getNonAdminUserProfileCard(translateDashboard);

  const navCards = [
    ...baseNavCards.slice(0, 4), // Cards before user-specific one
    userLevel && userLevel === "admin"
      ? adminUserCard
      : nonAdminUserProfileCard,
    ...baseNavCards.slice(4), // Cards after user-specific one (Reports card)
  ];

  // Filter visible cards (if any further global filtering is needed beyond role-specific card)
  const visibleNavCards = navCards.filter(() => {
    // Example: if you had a userLevel prop for other filtering
    // if (card.minLevel && userLevel < card.minLevel) return false;
    return true;
  });

  return (
    <div className="py-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {translateDashboard("header.title")}
        </h2>
        <p className="text-gray-600">{translateDashboard("header.subtitle")}</p>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {visibleNavCards.map((card) => (
          <motion.div
            key={card.id}
            variants={itemVariants}
            whileHover="hover"
            animate={hoveredCard === card.id ? "hover" : "show"}
            onMouseEnter={() => setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
            className="relative"
          >
            <DashboardCard
              icon={card.icon}
              title={card.title}
              subtitle={card.subtitle}
              color={card.color}
              description={card.description}
              isActive={hoveredCard === card.id}
              destination={card.destination}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default IconGrid;
