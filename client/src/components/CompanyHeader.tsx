interface CompanyHeaderProps {
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
  showLogout?: boolean;
}

export function CompanyHeader({ userName, userRole, onLogout, showLogout = true }: CompanyHeaderProps) {
  return (
    <div className="bg-slate-900/90 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="/images/AMINTOUCHLOGO.png" 
              alt="Amin Touch Logo" 
              className="h-12 w-auto"
            />
            <div>
              <h1 className="text-xl font-bold text-white">
                AMIN TOUCH TRADING CONTRACTING & HOSPITALITY SERVICES
              </h1>
              <p className="text-sm text-slate-400">Staff Management & Income Tracking System</p>
            </div>
          </div>
          
          {userName && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white font-medium">Welcome, {userName}</p>
                <p className="text-sm text-slate-400 capitalize">{userRole}</p>
              </div>
              {showLogout && onLogout && (
                <button
                  onClick={onLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
