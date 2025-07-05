import { t } from 'i18next';

export const getEditorSections = () => [
  {
    title: t('report:sections.requirementAchievement'),
    key: 'result',
  },
  {
    title: t('report:sections.strengths'),
    key: 'power',
  },
  {
    title: t('report:sections.weaknesses'),
    key: 'weak',
  },
  {
    title: t('report:sections.strengthImprovement'),
    key: 'improve_power',
  },
  {
    title: t('report:sections.weaknessImprovement'),
    key: 'improve_weak',
  }
];

export const editorSections = [
  {
    title: 'مدى تحقق المتطلب',
    key: 'result',
  },
  {
    title: 'نقاط القوة',
    key: 'power',
  },
  {
    title: 'مواطن الضعف',
    key: 'weak',
  },
  {
    title: 'أساليب تحسين نقاط القوة',
    key: 'improve_power',
  },
  {
    title: 'أساليب معالجة مواطن الضعف',
    key: 'improve_weak',
  }
];

export const getEmptyReportData = () => ({
  result: '',
  weak: '',
  improve_weak: '',
  power: '',
  improve_power: ''
});

export const validateReportData = (reportData) => {
  return editorSections.some(section => 
    reportData[section.key] && reportData[section.key].trim() !== ''
  );
};
