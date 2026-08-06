/**
 * Utility to display a beautiful, modern modal dialog indicating registration is temporarily disabled.
 * Uses Tailwind CSS classes and custom DOM injection to ensure it works anywhere in the application.
 */
export const showMaintenanceModal = () => {
  // Check if modal already exists
  if (document.getElementById("maintenance-modal")) return;

  const modalHtml = `
    <div id="maintenance-modal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div id="maintenance-modal-backdrop" class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 opacity-0"></div>
      
      <!-- Modal Content Card -->
      <div id="maintenance-modal-card" class="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 md:p-8 text-center transition-all duration-300 scale-95 opacity-0 transform">
        <!-- Close Button (X) -->
        <button id="maintenance-modal-close-btn-x" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none" aria-label="Close">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Icon / Illustration -->
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-500 mb-6">
          <svg class="w-8 h-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <!-- Title -->
        <h3 class="text-2xl font-bold text-slate-800 dark:text-white mb-3">
          Maintenance Notice
        </h3>

        <!-- Description -->
        <p class="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed mb-8">
            Registration is temporarily unavailable due to scheduled maintenance. Please check back later.
        </p>

        <!-- Action Button -->
        <button id="maintenance-modal-close-btn" class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Got it
        </button>
      </div>
    </div>
  `;

  // Create container element and append to body
  const container = document.createElement("div");
  container.innerHTML = modalHtml;
  const modalElement = container.firstElementChild;
  document.body.appendChild(modalElement);

  // Trigger animations
  const backdrop = document.getElementById("maintenance-modal-backdrop");
  const card = document.getElementById("maintenance-modal-card");

  setTimeout(() => {
    backdrop.classList.remove("opacity-0");
    backdrop.classList.add("opacity-100");
    card.classList.remove("opacity-0", "scale-95");
    card.classList.add("opacity-100", "scale-100");
  }, 20);

  // Close function
  const closeModal = () => {
    backdrop.classList.remove("opacity-100");
    backdrop.classList.add("opacity-0");
    card.classList.remove("opacity-100", "scale-100");
    card.classList.add("opacity-0", "scale-95");

    setTimeout(() => {
      modalElement.remove();
    }, 300);
  };

  // Attach event listeners
  document.getElementById("maintenance-modal-close-btn").addEventListener("click", closeModal);
  document.getElementById("maintenance-modal-close-btn-x").addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);
};
