import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { userApi } from "@/lib/api";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Moon, Sun, LogOut, Save } from "lucide-react";

export default function Settings() {
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      if (!user) return;
      try {
        const res = await userApi.getProfile();
        if (!active) return;
        setDisplayName(res.data?.display_name ?? user.display_name ?? user.full_name ?? "");
        setAvatarUrl(res.data?.avatar_url ?? user.avatar_url ?? "");
      } catch (error) {
        setDisplayName(user.display_name ?? user.full_name ?? "");
        setAvatarUrl(user.avatar_url ?? "");
      } finally {
        if (active) setProfileLoading(false);
      }
    };
    void loadProfile();
    return () => { active = false; };
  }, [user]);

  const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await userApi.updateProfile({
        displayName: displayName.trim(),
        avatarUrl: avatarUrl.trim(),
      });
      toast.success("Profile saved.");
    } catch (error) {
      toast.error("Unable to save your profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your account & preferences.</p>
      </div>

      <form onSubmit={saveProfile} className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Account</p>
          <p className="mt-1 font-medium">{user?.email}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-name">Display name</Label>
          <Input id="profile-name" autoComplete="name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} disabled={profileLoading} maxLength={100} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-avatar">Profile photo link</Label>
          <Input id="profile-avatar" type="url" value={avatarUrl} onChange={(event) => setAvatarUrl(event.target.value)} disabled={profileLoading} placeholder="https://example.com/photo.jpg" />
        </div>
        <Button type="submit" disabled={saving || profileLoading}>
          <Save className="mr-2 h-4 w-4" /> {saving ? "Saving…" : "Save profile"}
        </Button>
      </form>

      <div className="rounded-2xl border border-border bg-card p-6 flex items-center justify-between">
        <div>
          <p className="font-medium">Appearance</p>
          <p className="text-sm text-muted-foreground">{theme === "dark" ? "Dark mode" : "Light mode"}</p>
        </div>
        <Button variant="outline" onClick={toggle}>
          {theme === "dark" ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
          Switch to {theme === "dark" ? "light" : "dark"}
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 flex items-center justify-between">
        <div>
          <p className="font-medium">Sign out</p>
          <p className="text-sm text-muted-foreground">End your current session.</p>
        </div>
        <Button variant="destructive" onClick={signOut}>
          <LogOut className="h-4 w-4 mr-2" /> Sign out
        </Button>
      </div>
    </div>
  );
}
