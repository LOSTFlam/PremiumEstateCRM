import { useTranslation } from "react-i18next";
import { translateCrmText } from "i18n/crmDictionary";

/** Shared CRM labels — respects current i18n language (ru/en). */
export const useCrmLabels = () => {
  const { t, i18n } = useTranslation();
  const labelOptions = { t, language: i18n.language };
  const tr = (text) => translateCrmText(text, labelOptions);
  return { t, i18n, labelOptions, tr };
};

export default useCrmLabels;
