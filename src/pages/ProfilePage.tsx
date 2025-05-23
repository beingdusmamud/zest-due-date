
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, LogOut, Upload, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";

const profileSchema = z.object({
  username: z.string().min(1, "Username is required"),
  full_name: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const { user, profile, signOut, updateProfile, uploadAvatar } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile?.username || "",
      full_name: profile?.full_name || "",
    },
  });
  
  useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username || "",
        full_name: profile.full_name || "",
      });
      
      if (profile.avatar_url) {
        setAvatarUrl(profile.avatar_url);
      }
    }
  }, [profile, form]);

  const handleProfileUpdate = async (values: ProfileFormValues) => {
    setIsLoading(true);
    
    try {
      const { error } = await updateProfile({
        username: values.username,
        full_name: values.full_name,
      });
      
      if (!error) {
        form.reset(values);
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    const fileSize = file.size / 1024 / 1024; // size in MB
    
    if (fileSize > 2) {
      toast.error("File size must be less than 2MB");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error, url } = await uploadAvatar(file);
      
      if (error) {
        toast.error("Error uploading avatar");
        return;
      }
      
      if (url) {
        setAvatarUrl(url);
        toast.success("Avatar updated successfully");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !profile) {
    navigate('/auth');
    return null;
  }

  const getInitials = () => {
    if (profile.full_name) {
      return profile.full_name.split(' ').map(name => name[0]).join('').toUpperCase();
    } else if (profile.username) {
      return profile.username[0].toUpperCase();
    }
    return user.email?.[0].toUpperCase() || 'U';
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Upload a picture to personalize your profile</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="w-32 h-32 mb-6">
                <AvatarImage src={avatarUrl || ""} alt={profile.username || "User"} />
                <AvatarFallback className="text-2xl bg-blue-600 text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              
              <Label 
                htmlFor="avatar" 
                className="cursor-pointer bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 transition text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-2 px-4 py-2 rounded-md w-full justify-center"
              >
                <Upload size={16} />
                Upload Picture
              </Label>
              <Input
                id="avatar"
                type="file"
                onChange={handleAvatarChange}
                accept="image/*"
                disabled={isLoading}
                className="hidden"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Max file size: 2MB
              </p>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="theme-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                </div>
                <div className="flex items-center gap-2">
                  <Sun size={18} className="text-yellow-500" />
                  <Switch 
                    id="theme-mode"
                    checked={theme === "dark"}
                    onCheckedChange={toggleTheme}
                  />
                  <Moon size={18} className="text-blue-500" />
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900/50 dark:hover:bg-red-900/20" 
                onClick={() => signOut()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="dark:bg-slate-800">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(handleProfileUpdate)}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email || ""}
                      disabled
                      className="bg-gray-50 dark:bg-slate-700/50"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Email cannot be changed
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      {...form.register("username")}
                      className={form.formState.errors.username ? "border-red-500" : ""}
                    />
                    {form.formState.errors.username && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.username.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      {...form.register("full_name")}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isLoading || !form.formState.isDirty}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
