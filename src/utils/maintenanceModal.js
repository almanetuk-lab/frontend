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
      <div id="maintenance-modal-backdrop" class="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300 opacity-0"></div>
      
      <!-- Modal Content Card -->
      <div id="maintenance-modal-card" class="relative bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 w-full max-w-md rounded-3xl shadow-[0_20px_50px_rgba(79,70,229,0.3)] border border-indigo-500/30 p-8 md:p-10 text-center transition-all duration-300 scale-95 opacity-0 transform">
        
        <!-- Close Button (X) -->
        <button id="maintenance-modal-close-btn-x" class="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 focus:outline-none" aria-label="Close">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Icon / Illustration -->
        <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-indigo-500/10 text-pink-400 border border-pink-500/30 mb-6 shadow-[0_0_20px_rgba(236,72,153,0.15)]">
          <svg class="w-10 h-10 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        <!-- Title -->
        <h3 class="text-3xl font-black text-white mb-2 tracking-tight">
          Coming soon
        </h3>

        <!-- Description -->
        <p class="text-pink-400 text-lg md:text-xl font-bold leading-relaxed mb-4">
          The future of meaningful connection
        </p>
        
        <p class="text-slate-300 text-sm leading-relaxed mb-8">
          We are currently preparing the platform for launch. Registration is temporarily closed. Please check back soon.
        </p>

        <!-- Action Button -->
        <button id="maintenance-modal-close-btn" class="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-500 hover:from-blue-700 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none">
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
