
import { useState } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckSquare, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const signUpSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Please enter your password" }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;
type SignInFormValues = z.infer<typeof signInSchema>;

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("mode") === "signin" ? "signin" : "signup";
  const [activeTab, setActiveTab] = useState<"signin" | "signup">(defaultTab as "signin" | "signup");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  
  const { user, signIn, signUp } = useAuth();
  
  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignUp = async (values: SignUpFormValues) => {
    setIsLoading(true);
    
    try {
      const { error } = await signUp(values.email, values.password);
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      signUpForm.reset();
      setVerificationEmail(values.email);
      setVerificationDialogOpen(true);
    } catch (error: any) {
      toast.error(error.message || "An error occurred during sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (values: SignInFormValues) => {
    setIsLoading(true);
    
    try {
      const { error } = await signIn(values.email, values.password);
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      signInForm.reset();
    } catch (error: any) {
      toast.error(error.message || "An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-100 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <CheckSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-gray-800 dark:text-white">TaskFlow</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {activeTab === "signup" ? "Create an account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {activeTab === "signup" ? "Sign up to get started with TaskFlow" : "Sign in to access your tasks"}
          </p>
        </div>

        <Card className="border-none shadow-lg dark:bg-slate-800">
          <CardHeader className="pb-2">
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as "signin" | "signup")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                <TabsTrigger value="signin">Sign In</TabsTrigger>
              </TabsList>
            
              <TabsContent value="signup" className="mt-4">
                <form onSubmit={signUpForm.handleSubmit(handleSignUp)}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        autoComplete="email"
                        {...signUpForm.register("email")}
                        className={signUpForm.formState.errors.email ? "border-red-500" : ""}
                      />
                      {signUpForm.formState.errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {signUpForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        {...signUpForm.register("password")}
                        className={signUpForm.formState.errors.password ? "border-red-500" : ""}
                      />
                      {signUpForm.formState.errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {signUpForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        {...signUpForm.register("confirmPassword")}
                        className={signUpForm.formState.errors.confirmPassword ? "border-red-500" : ""}
                      />
                      {signUpForm.formState.errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {signUpForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Sign Up"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="signin" className="mt-4">
                <form onSubmit={signInForm.handleSubmit(handleSignIn)}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="your@email.com"
                        autoComplete="email"
                        {...signInForm.register("email")}
                        className={signInForm.formState.errors.email ? "border-red-500" : ""}
                      />
                      {signInForm.formState.errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {signInForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        {...signInForm.register("password")}
                        className={signInForm.formState.errors.password ? "border-red-500" : ""}
                      />
                      {signInForm.formState.errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {signInForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>

      <Dialog open={verificationDialogOpen} onOpenChange={setVerificationDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-500" />
              Verify Your Email
            </DialogTitle>
            <DialogDescription>
              We've sent a verification link to <strong>{verificationEmail}</strong>. Please check your inbox and click the link to verify your email address.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg text-sm text-blue-700 dark:text-blue-300">
            <p>After verification, you can sign in to your account.</p>
          </div>
          <div className="flex justify-center">
            <Button 
              variant="outline"
              onClick={() => {
                setVerificationDialogOpen(false);
                setActiveTab("signin");
              }}
            >
              Go to Sign In
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuthPage;
