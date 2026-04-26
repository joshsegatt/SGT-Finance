import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-background text-foreground overflow-hidden">
      {/* Background Graphic/Gradients */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      <div className="absolute w-[600px] h-[600px] top-[-200px] left-[-200px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
      <div className="absolute w-[400px] h-[400px] bottom-[-100px] right-[-100px] bg-primary/10 rounded-full blur-[100px] pointer-events-none opacity-50"></div>
      
      <LoginForm />
    </div>
  );
}
