import React from "react";
import { ROLES } from "../../../constants";

const DataTable = React.memo(({ 
  selectedArea, 
  headers, 
  items, 
  responses, 
  userRole,
  handleInputChange, 
  isModal = false 
}) => {



  console.log('responses:', responses);
  const canEdit = userRole === ROLES.DEPARTMENT;
  
    return (
    <div className={`${isModal ? 'mb-12' : 'overflow-x-auto custom-scrollbar mb-12'}`}>
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-200 p-3 text-left font-semibold text-gray-900 min-w-[50px]">#</th>
            <th className="border border-gray-200 p-3 text-left font-semibold text-gray-900 min-w-[200px]">
            Item / البند
            </th>
            {headers[selectedArea].map((header) => (
              <th
                key={header.id}
                className="border border-gray-200 p-3 text-center font-semibold text-gray-900 min-w-[120px]"
              >
                <div className="space-y-1">
                  <div className="text-sm">{header.text}</div>
                </div>
              </th>
            ))}
          </tr>
        </thead>        
          <tbody>
          {items[selectedArea].length > 0 ? (
            items[selectedArea].map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="border border-gray-200 p-3 text-center text-gray-600 font-medium">{index + 1}</td>
                <td className="border border-gray-200 p-3">
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900">{item.name}</div>
                  </div>
                </td>                
                {headers[selectedArea].map((header) => {
                  const isNumeric =
                    header.text.includes("عدد") ||
                    header.text.includes("النسبة");

                  const inputKey = `${selectedArea}-${item.id}-${header.id}`;
                  return (
                    <td key={header.id} className="border border-gray-200 p-2">                      
                      <input
                        type={isNumeric ? "number" : "text"}
                        placeholder={isNumeric ? "0" : "Enter value"}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md 
                                 text-gray-900 text-sm
                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                 transition-all duration-200 ${
                                   canEdit 
                                     ? 'bg-white' 
                                     : 'bg-gray-100 cursor-not-allowed'
                                 }`}
                        value={responses[selectedArea]?.grid?.[header.id]?.[item.id] || ""}
                        onChange={(e) => canEdit && handleInputChange(inputKey, e.target.value)}
                        readOnly={!canEdit}
                        disabled={!canEdit}
                        min={isNumeric ? "0" : undefined}
                        step={isNumeric ? "0.01" : undefined}
                      />
                    </td>
                  );
                })}
              </tr>
            ))
          ) : headers[selectedArea].length > 0 ? (
            // Show one row of input fields when there are headers but no items
            <tr key={1} className="hover:bg-gray-50 transition-colors">
              <td className="border border-gray-200 p-3 text-center text-gray-600 font-medium">1</td>
                <td className="border border-gray-200 p-3">
                <input
                  type="text"
                  placeholder={canEdit ? "Enter item name" : "Item name"}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md 
                           text-gray-900 text-sm
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                           transition-all duration-200 ${
                             canEdit 
                               ? 'bg-white' 
                               : 'bg-gray-100 cursor-not-allowed'
                           }`}
                  readOnly={!canEdit}
                  disabled={!canEdit}
                />
              </td>
              {headers[selectedArea].map((header) => {
                const isNumeric =
                  header.text.includes("عدد") ||
                  header.text.includes("النسبة");

                const inputKey = `${selectedArea}-${1}-${header.id}`;
                return (
                  <td key={header.id} className="border border-gray-200 p-2">
                    <input
                      type={isNumeric ? "number" : "text"}
                      placeholder={canEdit ? (isNumeric ? "0" : "Enter value") : (isNumeric ? "0" : "Value")}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md 
                               text-gray-900 text-sm
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                               transition-all duration-200 ${
                                 canEdit 
                                   ? 'bg-white' 
                                   : 'bg-gray-100 cursor-not-allowed'
                               }`}
                      value={responses[selectedArea]?.grid?.[header.id]?.[1] || ""}
                      onChange={(e) => canEdit && handleInputChange(inputKey, e.target.value)}
                      readOnly={!canEdit}
                      disabled={!canEdit}
                      
                      min={isNumeric ? "0" : undefined}
                      step={isNumeric ? "1" : undefined}
                    />
                  </td>
                );
              })}
            </tr>
          ) : null}
        </tbody>
      </table>    </div>
  );
});

export default DataTable;
