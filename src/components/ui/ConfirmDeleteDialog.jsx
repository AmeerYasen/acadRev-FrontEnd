import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

/**
 * Confirmation dialog for deleting resources, similar to GitHub repository deletion
 * @param {boolean} isOpen - Whether the dialog is open
 * @param {function} onClose - Function to close the dialog
 * @param {function} onConfirm - Function called when deletion is confirmed
 * @param {string} title - Dialog title
 * @param {string} message - Warning message
 * @param {string} resourceName - Name of the resource to be deleted
 * @param {string} confirmationText - Text user must type to confirm deletion
 * @param {string} confirmButtonText - Text for the confirm button
 * @param {boolean} isLoading - Whether the deletion is in progress
 */
function ConfirmDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Resource",
  message = "This action cannot be undone.",
  resourceName = "",
  confirmationText = "",
  confirmButtonText = "Delete",
  isLoading = false,
}) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (inputValue !== confirmationText) {
      setError(`Please type "${confirmationText}" to confirm deletion.`);
      return;
    }

    try {
      await onConfirm();
      handleClose();
    } catch (err) {
      setError(err.message || "Failed to delete. Please try again.");
    }
  };

  const handleClose = () => {
    setInputValue("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm flex justify-center items-center z-200 p-4 transition-opacity duration-300"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fade-in-up border border-red-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Warning message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-red-800 font-medium mb-1">Warning</p>
                <p className="text-red-700">{message}</p>
                {resourceName && (
                  <p className="text-red-700 mt-2">
                    You are about to delete <strong>{resourceName}</strong>.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Confirmation input */}
          {confirmationText && (
            <div>
              <label
                htmlFor="confirm-input"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Type{" "}
                <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-red-600">
                  {confirmationText}
                </span>{" "}
                to confirm deletion:
              </label>
              <input
                id="confirm-input"
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setError("");
                }}
                placeholder={confirmationText}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                disabled={isLoading}
                autoComplete="off"
                spellCheck={false}
              />
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isLoading ||
                (confirmationText && inputValue !== confirmationText)
              }
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {confirmButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConfirmDeleteDialog;
