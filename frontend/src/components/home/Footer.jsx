/* Footer component code */
import React from 'react';


export default function Footer(){
return (
<footer className="mt-12 bg-white border-t border-amber-50">
<div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold">M</div>
<div>
<div className="font-semibold">MingleHub</div>
<div className="text-sm text-amber-700/80">© 2025 MingleHub. All rights reserved.</div>
</div>
</div>


<div className="flex items-center gap-6 text-sm">
<nav className="flex gap-3">
<a href="#">Home</a>
<a href="#about">About</a>
<a href="#">Safety Tips</a>
<a href="#blog">Blog</a>
<a href="#">Contact</a>
<a href="#">FAQs</a>
</nav>
<div className="flex items-center gap-3">
{/* <a href="#" aria-label="facebook">FB</a>
<a href="#" aria-label="instagram">IG</a>
<a href="#" aria-label="linkedin">LI</a> */}
</div>
</div>
</div>
</footer>
);
}


















// import React from "react";

// export default function Footer() {
//   return (
//     <footer className="bg-gray-50 border-t">
//       <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-gray-600">
//         © {new Date().getFullYear()} Match Making — Hybrid. All rights reserved.
//       </div>
//     </footer>
//   );
// }
