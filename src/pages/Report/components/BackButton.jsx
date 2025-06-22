import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "../../../components/ui/button";
import { ArrowRight } from "lucide-react";
import { useToast } from '../../../context/ToastContext';
import UnsavedChangesModal from './UnsavedChangesModal';

const BackButton = ({ 
  hasUnsavedChanges, 
  onSave,
  saving = false 
}) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);

  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowModal(true);
    } else {
      // No unsaved changes, safe to go back
      navigate(-1);
    }
  };

  const handleSaveAndBack = async () => {
    try {
      await onSave();
      // Give a small delay for the save to complete and show toast
      setTimeout(() => {
        setShowModal(false);
        navigate(-1);
      }, 1000);
    } catch (error) {
      showToast('فشل في حفظ التغييرات، يرجى المحاولة مرة أخرى', 'error');
    }
  };

  const handleDiscardChanges = () => {
    setShowModal(false);
    navigate(-1);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleBack}
        disabled={saving}
        className="flex items-center gap-2"
      >
        <ArrowRight className="h-4 w-4" />
        رجوع
        {hasUnsavedChanges && (
          <span className="text-orange-500">*</span>
        )}
      </Button>

      <UnsavedChangesModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveAndBack}
        onDiscard={handleDiscardChanges}
        saving={saving}
      />
    </>
  );
};

export default BackButton;
