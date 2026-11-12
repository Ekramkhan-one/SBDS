// src/components/PageTransition.jsx
// Wraps the whole route tree so every page fades and slides in smoothly
// whenever the URL changes - no need to add animation classes to each
// individual page. Keying the wrapper by pathname forces React to remount
// it on navigation, which restarts the CSS animation each time.

import { useLocation } from 'react-router-dom';

export default function PageTransition({ children }) {
  const location = useLocation();

  return (
    <div key={location.pathname} className="animate-page-in">
      {children}
    </div>
  );
}
