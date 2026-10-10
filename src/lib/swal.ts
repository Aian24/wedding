import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// 1. Dedicated Toast (Standard SweetAlert2 Toast - Do NOT include backdrop property)
const weddingToast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: false,
});

// 2. Dedicated Modal for Confirmations
const weddingModal = Swal.mixin({
  backdrop: "rgba(15, 23, 42, 0.6)",
  customClass: {
    popup:
      "wedding-swal-popup rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 bg-white text-slate-800",
    title:
      "wedding-swal-title font-serif-title font-bold text-xl sm:text-2xl text-[#1b3b5f]",
    htmlContainer:
      "wedding-swal-text text-xs sm:text-sm text-slate-600 leading-relaxed mt-2",
    confirmButton:
      "px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-[#1b3b5f] to-[#2e5782] hover:opacity-95 shadow-md cursor-pointer transition-all mx-1.5",
    cancelButton:
      "px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 cursor-pointer transition-all mx-1.5",
    denyButton:
      "px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-rose-600 hover:bg-rose-700 shadow-md cursor-pointer transition-all mx-1.5",
  },
  buttonsStyling: false,
});

export const swalAlert = {
  // Quick Success Toast - Concise "Success" only, no backdrop, no long text
  success: (_title?: string, _text?: string) => {
    return weddingToast.fire({
      icon: "success",
      title: "Success",
    });
  },

  toastSuccess: (_title?: string, _text?: string) => {
    return weddingToast.fire({
      icon: "success",
      title: "Success",
    });
  },

  // Quick Error Toast - Concise "Error" only
  error: (_title?: string, _text?: string) => {
    return weddingToast.fire({
      icon: "error",
      title: "Error",
    });
  },

  toastError: (_title?: string, _text?: string) => {
    return weddingToast.fire({
      icon: "error",
      title: "Error",
    });
  },

  // Warning Toast
  warning: (_title?: string, _text?: string) => {
    return weddingToast.fire({
      icon: "warning",
      title: "Warning",
    });
  },

  // Info Toast
  info: (_title?: string, _text?: string) => {
    return weddingToast.fire({
      icon: "info",
      title: "Notice",
    });
  },

  // Confirmation Modal for Delete / Danger
  confirmDelete: async (options: {
    title?: string;
    text?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
  }): Promise<boolean> => {
    const result = await weddingModal.fire({
      icon: "warning",
      title: options.title || "Delete Item?",
      text: options.text || "Are you sure you want to delete this?",
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText || "Yes, Delete",
      cancelButtonText: options.cancelButtonText || "Cancel",
      reverseButtons: true,
      customClass: {
        popup:
          "wedding-swal-popup rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-100 bg-white text-slate-800",
        title:
          "wedding-swal-title font-serif-title font-bold text-xl text-[#1b3b5f]",
        htmlContainer:
          "wedding-swal-text text-xs sm:text-sm text-slate-600 leading-relaxed mt-2",
        confirmButton:
          "px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-rose-600 hover:bg-rose-700 shadow-md cursor-pointer transition-all mx-1.5",
        cancelButton:
          "px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 cursor-pointer transition-all mx-1.5",
      },
    });
    return result.isConfirmed;
  },

  // Generic Confirmation Modal
  confirm: async (options: {
    title: string;
    text?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    icon?: "question" | "info" | "warning";
  }): Promise<boolean> => {
    const result = await weddingModal.fire({
      icon: options.icon || "question",
      title: options.title,
      text: options.text,
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText || "Yes, Proceed",
      cancelButtonText: options.cancelButtonText || "Cancel",
      reverseButtons: true,
    });
    return result.isConfirmed;
  },
};

export default swalAlert;
