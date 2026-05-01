import { codeToHtml } from "shiki";

const themes = {
  light: "github-light",
  dark: "one-dark-pro",
};

export const renderCodeToHtml = async (code: string, language: string = "text") => {
  const normalizedCode = code
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\r\n/g, "\n");

  try {
    return await codeToHtml(normalizedCode, {
      lang: language,
      themes: themes, // Shiki handles the wrapper classes and themes automatically
      defaultColor: false, 
    });
  } catch (error) {
    console.warn(`Language ${language} failed, falling back to text. \n Error:`, error);
    return await codeToHtml(normalizedCode, {
      lang: "text",
      themes: themes,
      defaultColor: false,
    });
  }
};
