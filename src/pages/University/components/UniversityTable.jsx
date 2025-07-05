import { Eye, Trash2, Edit } from "lucide-react";
import { useNamespacedTranslation } from "../../../hooks/useNamespacedTranslation";

function UniversityTable({
  universities = [], // Matches prop name from University.jsx
  renderSortableHeader,
  onView,         // Prop from University.jsx
  onEdit,         // Prop from University.jsx
  onDelete,       // Prop from University.jsx (was handleDelete)
  userRole,
  getRandomLogo, // This prop was not passed from University.jsx
  // debouncedSearchTerm, // This prop was not passed from University.jsx
}) {
  const { translateUniversity } = useNamespacedTranslation();

  // Ensure universities is always an array
  const universityList = Array.isArray(universities) ? universities : [];

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-100 sticky top-0">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
            {translateUniversity('table.headers.logo')}
          </th>
          {renderSortableHeader && renderSortableHeader(translateUniversity('table.headers.name'), "name")}
          {renderSortableHeader && renderSortableHeader(translateUniversity('table.headers.country'), "country")}
          {renderSortableHeader && renderSortableHeader(translateUniversity('table.headers.email'), "email")}
          {/* Assuming 'established' might be 'since' based on previous contexts */}
          {renderSortableHeader && renderSortableHeader(translateUniversity('table.headers.established'), "since")}
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            {translateUniversity('table.headers.website')}
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            {translateUniversity('table.headers.actions')}
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {universityList.length > 0 ? (
          universityList.map((uni) => (
            <tr
              key={uni.id}
              className="even:bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
            >
              <td className="px-4 py-4">
                {/* Use picsum.photos for random images, seeded by uni.id for consistency */}
                <img
                  src={`https://picsum.photos/seed/${uni.id || 'default'}/40/40`} // Added 'default' seed if id is missing
                  alt={`${uni.name || 'University'} logo`}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    // Fallback if picsum.photos fails or uni.id is problematic
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = "https://via.placeholder.com/40?text=Logo"; 
                  }}
                />
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{uni.name || "-"}</div>
                <div className="text-xs text-gray-500">{uni.abbreviation || ""}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{uni.country || "-"}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{uni.email || "-"}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{uni.since || "-"}</td>
              <td className="px-6 py-4">
                {uni.website ? (
                  <a
                    href={uni.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 hover:underline text-center"
                  >
                    {translateUniversity('table.actions.visit')}
                  </a>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="px-6 py-4 flex justify-center space-x-2">
                <button
                  onClick={() => onView(uni)} // Uses onView prop
                  className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition-colors"
                  aria-label={translateUniversity('table.actions.viewDetails', { name: uni.name })}
                  title={translateUniversity('table.actions.viewTooltip')}
                >
                  <Eye size={18} />
                </button>
                
                {/* Edit and Delete buttons only visible for authority or admin users */}
                {(userRole === "authority" || userRole === "admin") && (
                  <>
                    <button
                      onClick={() => onEdit(uni)} // Uses onEdit prop
                      className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-100 transition-colors"
                      aria-label={translateUniversity('table.actions.editUniversity', { name: uni.name })}
                      title={translateUniversity('table.actions.editTooltip')}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(uni.id)} // Uses onDelete prop, passing only id
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition-colors"
                      aria-label={translateUniversity('table.actions.deleteUniversity', { name: uni.name })}
                      title={translateUniversity('table.actions.deleteTooltip')}
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
              {/* Removed debouncedSearchTerm as it's not passed */}
              {translateUniversity('table.noUniversitiesFound')}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default UniversityTable;