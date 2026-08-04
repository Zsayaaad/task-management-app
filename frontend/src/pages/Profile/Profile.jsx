import { useQuery } from "@tanstack/react-query";
import { currentUserQuery } from "./loader";

const Profile = () => {
  const { user } = useQuery(currentUserQuery).data;
  // const user = data?.user || {};

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "MEMBER":
      default:
        return "bg-primary/15 text-primary border-primary/30";
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <h1 className="font-page-title text-2xl font-bold text-on-surface">
          User Profile
        </h1>
        <p className="font-body text-sm text-text-muted mt-1">
          View your personal account information and system role.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-surface-container border border-border rounded-xl p-6 shadow-lg space-y-6">
        {/* User Hero Section */}
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-border/50">
          <div className="w-20 h-20 rounded-full bg-primary/20 text-primary border-2 border-primary/40 flex items-center justify-center font-bold text-3xl shrink-0 uppercase shadow-inner">
            {user.name ? user.name.charAt(0) : "?"}
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="font-section-heading text-xl font-bold text-on-surface">
                {user.name || "TaskFlow User"}
              </h2>
              <span
                className={`font-label-caps text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getRoleBadgeStyle(
                  user.role,
                )}`}
              >
                {user.role || "MEMBER"}
              </span>
            </div>
            <p className="font-body text-sm text-text-muted">{user.email}</p>
          </div>
        </div>

        {/* User Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <div className="bg-surface-dim border border-border/60 rounded-lg p-4 space-y-1">
            <div className="flex items-center gap-2 text-text-muted text-xs font-semibold uppercase tracking-wider">
              <span className="material-symbols-outlined text-base text-primary">
                mail
              </span>
              Email Address
            </div>
            <p className="font-body text-sm font-medium text-on-surface truncate">
              {user.email || "N/A"}
            </p>
          </div>

          {/* Role */}
          <div className="bg-surface-dim border border-border/60 rounded-lg p-4 space-y-1">
            <div className="flex items-center gap-2 text-text-muted text-xs font-semibold uppercase tracking-wider">
              <span className="material-symbols-outlined text-base text-primary">
                badge
              </span>
              Account Role
            </div>
            <p className="font-body text-sm font-medium text-on-surface">
              {user.role || "MEMBER"}
            </p>
          </div>

          {/* Member Since */}
          <div className="bg-surface-dim border border-border/60 rounded-lg p-4 space-y-1">
            <div className="flex items-center gap-2 text-text-muted text-xs font-semibold uppercase tracking-wider">
              <span className="material-symbols-outlined text-base text-primary">
                calendar_today
              </span>
              Member Since
            </div>
            <p className="font-body text-sm font-medium text-on-surface">
              {formatDate(user.createdAt)}
            </p>
          </div>

          {/* User ID */}
          <div className="bg-surface-dim border border-border/60 rounded-lg p-4 space-y-1">
            <div className="flex items-center gap-2 text-text-muted text-xs font-semibold uppercase tracking-wider">
              <span className="material-symbols-outlined text-base text-primary">
                fingerprint
              </span>
              User Identifier
            </div>
            <p className="font-mono text-xs text-text-muted truncate">
              {user.id || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
