import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { currentUserQuery } from "./loader";
import { useRef, useState } from "react";
import customFetch from "../../utils/customFetch";
import { upload } from "@imagekit/javascript";

const Profile = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

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

  // Mutation to save avatar URL to backend
  const avatarMutation = useMutation({
    mutationFn: (avatarUrl) =>
      customFetch.patch("/users/avatar", { avatarUrl }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Avatar updated successfully");
      setUploading(false);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onError: () => {
      toast.error("Failed to save avatar");
      setUploading(false);
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files[0];
    if (!file) return;

    setUploading(true);

    try {
      // 1. Get authentication parameters from backend
      const { data: authData } = await customFetch.get("/imagekit/auth");

      // 2. Upload to ImageKit
      const uploadResult = await upload({
        file,
        fileName: `task-management/avatar/${user.id}-${Date.now()}.${file.name.split(".").pop()}`,
        token: authData.token,
        signature: authData.signature,
        expire: authData.expire,
        publicKey: authData.publicKey,
      });

      // 3. Save the URL to your backend
      avatarMutation.mutate(uploadResult.url);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed");
      setUploading(false);
    }
  };

  const displayAvatar = preview || user.avatarUrl;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <h1 className="font-page-title text-2xl font-bold text-on-surface">
          User Profile
        </h1>
        <p className="font-body text-sm text-text-muted mt-1">
          View your personal account information and manage your profile.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-surface-container border border-border rounded-xl p-6 shadow-lg space-y-6">
        {/* User Hero Section */}
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-border/50">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full bg-primary/20 text-primary border-2 border-primary/40 flex items-center justify-center font-bold text-3xl shrink-0 uppercase shadow-inner overflow-hidden">
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                user.name?.charAt(0) || "?"
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-white text-2xl">
                photo_camera
              </span>
            </button>
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="font-section-heading text-xl font-bold text-on-surface">
                {user.name}
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

          {/* Upload Controls */}
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {preview && (
              <>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
                <button
                  onClick={() => {
                    setPreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  disabled={uploading}
                  className="px-4 py-2 border border-border text-text-muted text-sm font-medium rounded-lg hover:bg-surface-bright disabled:opacity-50"
                >
                  Cancel
                </button>
              </>
            )}
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
