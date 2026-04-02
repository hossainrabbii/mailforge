// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import {
//   Eye,
//   EyeOff,
//   Mail,
//   Lock,
//   ArrowRight,
//   Zap,
//   Shield,
//   Clock,
//   TrendingUp,
// } from "lucide-react";
// import { login, register } from "@/services/auth";

// const slides = [
//   {
//     icon: Zap,
//     title: "Automate your outreach",
//     subtitle:
//       "Send personalized emails to hundreds of prospects automatically — with smart delays that feel human.",
//     stat: "10x",
//     statLabel: "faster outreach",
//   },
//   {
//     icon: Shield,
//     title: "Stay safe & undetected",
//     subtitle:
//       "Random delays between sends, timezone-aware scheduling, and smart throttling keep your domain healthy.",
//     stat: "99%",
//     statLabel: "deliverability rate",
//   },
//   {
//     icon: Clock,
//     title: "Set it and forget it",
//     subtitle:
//       "Queue hundreds of emails, walk away. MailForge handles the timing, retries, and status tracking for you.",
//     stat: "24/7",
//     statLabel: "automated sending",
//   },
//   {
//     icon: TrendingUp,
//     title: "Track every send",
//     subtitle:
//       "Know exactly who got your email, when it was sent, and what happened — all in one clean dashboard.",
//     stat: "100%",
//     statLabel: "send visibility",
//   },
// ];

// export default function AuthPage() {
//   const router = useRouter();
//   const [mode, setMode] = useState<"login" | "register">("login");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [activeSlide, setActiveSlide] = useState(0);
//   const [animating, setAnimating] = useState(false);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setAnimating(true);
//       setTimeout(() => {
//         setActiveSlide((prev) => (prev + 1) % slides.length);
//         setAnimating(false);
//       }, 400);
//     }, 4000);
//     return () => clearInterval(interval);
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!email || !password) {
//       toast.error("Please fill in all fields");
//       return;
//     }
//     setLoading(true);
//     try {
//       const res =
//         mode === "login"
//           ? await login(email, password)
//           : await register(email, password);

//       if (!res.success) {
//         toast.error(res.message);
//         return;
//       }

//       if (mode === "login") {
//         toast.success("Welcome back!");
//         router.push("/dashboard");
//       } else {
//         toast.success("Account created! Please login.");
//         setMode("login");
//         setPassword("");
//       }
//     } catch {
//       toast.error("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const slide = slides[activeSlide];
//   const SlideIcon = slide.icon;

//   return (
//     <div className="min-h-screen flex bg-white dark:bg-zinc-950">
//       {/* LEFT PANEL */}
//       <div className="hidden lg:flex lg:w-[52%] bg-zinc-950 relative overflow-hidden flex-col">
//         {/* grid texture */}
//         <div
//           className="absolute inset-0 opacity-[0.04]"
//           style={{
//             backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
//               linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
//             backgroundSize: "40px 40px",
//           }}
//         />

//         {/* orange glow */}
//         <div
//           className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full opacity-20"
//           style={{
//             background: "radial-gradient(circle, #f97316 0%, transparent 70%)",
//           }}
//         />
//         <div
//           className="absolute bottom-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full opacity-10"
//           style={{
//             background: "radial-gradient(circle, #f97316 0%, transparent 70%)",
//           }}
//         />

//         {/* Logo */}
//         <div className="relative z-10 p-10">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
//               <Mail className="w-4 h-4 text-white" />
//             </div>
//             <span className="text-white font-semibold text-lg tracking-tight">
//               MailForge
//             </span>
//           </div>
//         </div>

//         {/* Slide content */}
//         <div className="relative z-10 flex-1 flex flex-col justify-center px-12 pb-16">
//           <div
//             className="transition-all duration-400"
//             style={{
//               opacity: animating ? 0 : 1,
//               transform: animating ? "translateY(12px)" : "translateY(0)",
//             }}
//           >
//             {/* icon */}
//             <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-8">
//               <SlideIcon className="w-6 h-6 text-orange-400" />
//             </div>

//             {/* stat */}
//             <div className="mb-6">
//               <span className="text-6xl font-bold text-white tracking-tight">
//                 {slide.stat}
//               </span>
//               <span className="ml-3 text-orange-400 text-sm font-medium uppercase tracking-widest">
//                 {slide.statLabel}
//               </span>
//             </div>

//             <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
//               {slide.title}
//             </h2>
//             <p className="text-zinc-400 text-base leading-relaxed max-w-md">
//               {slide.subtitle}
//             </p>
//           </div>

//           {/* dots */}
//           <div className="flex gap-2 mt-12">
//             {slides.map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setActiveSlide(i)}
//                 className="transition-all duration-300"
//                 style={{
//                   width: i === activeSlide ? "24px" : "6px",
//                   height: "6px",
//                   borderRadius: "3px",
//                   background:
//                     i === activeSlide ? "#f97316" : "rgba(255,255,255,0.2)",
//                 }}
//               />
//             ))}
//           </div>
//         </div>

//         {/* testimonial card */}
//         <div className="relative z-10 mx-10 mb-10 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
//           <p className="text-zinc-300 text-sm leading-relaxed mb-4">
//             "MailForge saved us hours every week. The automated delays are
//             genius — our reply rates went through the roof."
//           </p>
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
//               JR
//             </div>
//             <div>
//               <p className="text-white text-sm font-medium">James R.</p>
//               <p className="text-zinc-500 text-xs">Founder, OutreachLab</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* RIGHT PANEL */}
//       <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
//         <div className="w-full max-w-[400px]">
//           {/* Mobile logo */}
//           <div className="flex items-center gap-2 mb-10 lg:hidden">
//             <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center">
//               <Mail className="w-3.5 h-3.5 text-white" />
//             </div>
//             <span className="font-semibold text-base tracking-tight dark:text-white">
//               MailForge
//             </span>
//           </div>

//           {/* Heading */}
//           <div className="mb-8">
//             <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1.5">
//               {mode === "login" ? "Welcome back" : "Create an account"}
//             </h1>
//             <p className="text-zinc-500 dark:text-zinc-400 text-sm">
//               {mode === "login"
//                 ? "Sign in to your MailForge account"
//                 : "Start automating your email outreach"}
//             </p>
//           </div>

//           {/* Tab toggle */}
//           <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl mb-8">
//             {(["login", "register"] as const).map((m) => (
//               <button
//                 key={m}
//                 onClick={() => setMode(m)}
//                 className="flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200"
//                 style={{
//                   background: mode === m ? "white" : "transparent",
//                   color: mode === m ? "#09090b" : "#71717a",
//                   boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
//                 }}
//               >
//                 {m === "login" ? "Sign in" : "Register"}
//               </button>
//             ))}
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Email */}
//             <div>
//               <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
//                 Email address
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="you@example.com"
//                   className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="••••••••"
//                   className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="w-4 h-4" />
//                   ) : (
//                     <Eye className="w-4 h-4" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 mt-2"
//               style={{
//                 background: loading ? "#f97316aa" : "#f97316",
//                 boxShadow: loading ? "none" : "0 4px 16px rgba(249,115,22,0.3)",
//               }}
//             >
//               {loading ? (
//                 <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//               ) : (
//                 <>
//                   {mode === "login" ? "Sign in" : "Create account"}
//                   <ArrowRight className="w-4 h-4" />
//                 </>
//               )}
//             </button>
//           </form>

//           {/* Switch mode */}
//           <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-6">
//             {mode === "login"
//               ? "Don't have an account?"
//               : "Already have an account?"}{" "}
//             <button
//               onClick={() => setMode(mode === "login" ? "register" : "login")}
//               className="text-orange-500 font-medium hover:text-orange-600 transition-colors"
//             >
//               {mode === "login" ? "Register" : "Sign in"}
//             </button>
//           </p>

//           {/* Terms for register */}
//           {mode === "register" && (
//             <p className="text-center text-xs text-zinc-400 dark:text-zinc-600 mt-4">
//               By creating an account you agree to our{" "}
//               <span className="text-zinc-500 underline underline-offset-2 cursor-pointer">
//                 Terms
//               </span>{" "}
//               and{" "}
//               <span className="text-zinc-500 underline underline-offset-2 cursor-pointer">
//                 Privacy Policy
//               </span>
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
