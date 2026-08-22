import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "id" | "en";

export const translations = {
  id: {
    // Navigation & Common
    nav_home: "Beranda",
    nav_features: "Fitur Utilitas",
    nav_qualifications: "Kualifikasi",
    nav_login: "Masuk Platform",
    nav_register: "Daftar Akun",
    nav_dashboard: "Dashboard Utama",
    nav_logout: "Keluar Sesi",
    welcome_back: "Selamat Datang",
    role_admin: "Super Admin Platform",
    role_participant: "Peserta Ujian Sertifikasi",

    // Admin Sidebar & Navigation
    admin_overview: "Ringkasan Statistik",
    admin_users: "Kelola Peserta & Akun",
    admin_qualifications: "Skema Kualifikasi",
    admin_subjects: "Materi & Subjek",
    admin_questions: "Bank Soal & Impor CSV",
    admin_blueprints: "Matriks Blueprint Soal",
    admin_exams: "Paket & Rencana Ujian",
    admin_enrollments: "Pendaftaran Peserta",
    admin_results: "Hasil & Skor Ujian",
    admin_audit: "Catatan Audit Log",

    // Participant Dashboard
    participant_dashboard: "Dashboard Peserta",
    participant_registration_number: "Nomor Registrasi",
    participant_main_qual: "Kualifikasi Utama",
    participant_enrolled_exams: "Paket Ujian Terdaftar",
    participant_no_exams: "Anda belum terdaftar dalam paket ujian kompetensi manapun.",
    participant_start: "Mulai Ujian",
    participant_resume: "Lanjutkan Sesi",
    participant_completed: "Selesai",

    // Exam Engine
    exam_title: "Sesi Ujian Kompetensi Online",
    exam_time_remaining: "Sisa Waktu Ujian",
    exam_question_number: "Soal Nomor",
    exam_of: "dari",
    exam_prev: "Sebelumnya",
    exam_next: "Simpan & Lanjut",
    exam_submit: "Selesai & Kumpulkan Ujian",
    exam_doubtful: "Ragu-ragu",
    exam_warning_tab: "Peringatan: Jangan tinggalkan halaman ujian!",

    // Controls
    lang_id: "Bahasa Indonesia",
    lang_en: "English",
  },
  en: {
    // Navigation & Common
    nav_home: "Home",
    nav_features: "Key Features",
    nav_qualifications: "Qualifications",
    nav_login: "Platform Login",
    nav_register: "Register Account",
    nav_dashboard: "Main Dashboard",
    nav_logout: "Sign Out",
    welcome_back: "Welcome Back",
    role_admin: "Platform Super Admin",
    role_participant: "Certification Exam Participant",

    // Admin Sidebar & Navigation
    admin_overview: "System Analytics",
    admin_users: "Manage Participants",
    admin_qualifications: "Qualification Schemes",
    admin_subjects: "Subjects & Modules",
    admin_questions: "Question Bank & CSV Import",
    admin_blueprints: "Blueprint Matrices",
    admin_exams: "Exam Packages & Schedules",
    admin_enrollments: "Participant Enrollments",
    admin_results: "Exam Results & Scores",
    admin_audit: "System Audit Logs",

    // Participant Dashboard
    participant_dashboard: "Participant Dashboard",
    participant_registration_number: "Registration Number",
    participant_main_qual: "Primary Qualification",
    participant_enrolled_exams: "Enrolled Exam Packages",
    participant_no_exams: "You are not enrolled in any competency exam packages yet.",
    participant_start: "Start Exam",
    participant_resume: "Resume Exam",
    participant_completed: "Completed",

    // Exam Engine
    exam_title: "Online Competency Exam Session",
    exam_time_remaining: "Time Remaining",
    exam_question_number: "Question Number",
    exam_of: "of",
    exam_prev: "Previous",
    exam_next: "Save & Next",
    exam_submit: "Submit Exam",
    exam_doubtful: "Mark Doubtful",
    exam_warning_tab: "Warning: Do not switch browser tabs during the exam!",

    // Controls
    lang_id: "Bahasa Indonesia",
    lang_en: "English",
  },
};

export type TranslationKey = keyof typeof translations.id;

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("id");

  useEffect(() => {
    const stored = localStorage.getItem("askganis_lang") as Language | null;
    if (stored === "id" || stored === "en") {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("askganis_lang", lang);
  };

  const toggleLanguage = () => {
    const next = language === "id" ? "en" : "id";
    setLanguage(next);
  };

  const t = (key: TranslationKey): string => {
    return translations[language]?.[key] || translations["id"]?.[key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { language, toggleLanguage } = useI18n();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      title={language === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-forest-100 bg-white px-2.5 py-1 text-xs font-bold text-forest-900 transition-all hover:bg-forest-50 dark:border-charcoal/60 dark:bg-charcoal dark:text-forest-100 dark:hover:bg-charcoal/80 ${className}`}
    >
      <span className="text-sm">{language === "id" ? "🇮🇩" : "🇬🇧"}</span>
      <span>{language === "id" ? "ID" : "EN"}</span>
    </button>
  );
}
