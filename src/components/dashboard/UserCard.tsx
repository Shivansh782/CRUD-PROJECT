// "use client";

// import { useState, useRef } from "react";
// import {
//   motion,
//   useMotionValue,
//   useTransform,
//   useAnimation,
// } from "motion/react";
// import {
//   Mail,
//   Phone,
//   MapPin,
//   Calendar,
//   BadgeCheck,
//   Building2,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import type { User } from "@/components/types/user";

// interface UserCardProps {
//   user: User;
// }

// export function UserCard({ user }: UserCardProps) {
//   const [isFlipped, setIsFlipped] = useState(false);
//   const cardRef = useRef<HTMLDivElement>(null);
//   const x = useMotionValue(0);
//   const controls = useAnimation();
//   const input = [-200, 0, 200];
//   const rotate = useTransform(x, input, [-180, 0, 180]);

//   const handleFlip = () => {
//     setIsFlipped(!isFlipped);
//     controls.start({ rotateY: isFlipped ? 0 : 180 });
//   };

//   const handleDragEnd = (event: any, info: any) => {
//     const threshold = 100;
//     if (Math.abs(info.offset.x) > threshold) {
//       handleFlip();
//     }
//     controls.start({ x: 0 });
//   };

//   return (
//     <div
//       className="relative w-full max-w-[450px] h-[500px] cursor-pointer perspective-1000"
//       ref={cardRef}
//     >
//       <motion.div
//         className="relative w-full h-full transition-all duration-500"
//         animate={controls}
//         drag="x"
//         dragConstraints={cardRef}
//         dragElastic={0.1}
//         onDragEnd={handleDragEnd}
//         style={{ x, rotateY: rotate, transformStyle: "preserve-3d" }}
//       >
//         {/* Front of the card */}
//         <div
//           className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 text-white rounded-xl p-6 backface-hidden shadow-lg w-full"
//           style={{ backfaceVisibility: "hidden" }}
//         >
//           <div className="absolute top-0 left-0 w-full h-24 bg-red-500 rounded-t-xl overflow-hidden">
//             <div
//               className="absolute top-0 left-0 w-full h-full opacity-30"
//               style={{
//                 backgroundImage:
//                   "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
//               }}
//             />
//           </div>

//           <div className="relative mt-8 text-center">
//             <Avatar className="h-24 w-24 mx-auto ring-4 ring-red-300">
//               <AvatarImage src={user.avatar} alt={user.name} />
//               <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
//             </Avatar>
//             <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
//             <p className="text-red-200 text-sm mt-1">{user.role}</p>
//           </div>

//           <div className="mt-6 space-y-3 text-sm">
//             <div className="flex items-center gap-2">
//               <BadgeCheck className="h-5 w-5 text-red-300" />
//               <span>ID: {user.id}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Building2 className="h-5 w-5 text-red-300" />
//               <span>{user.department}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Calendar className="h-5 w-5 text-red-300" />
//               <span>Joined: {user.joinDate}</span>
//             </div>
//           </div>

//           <div
//             className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-red-200 w-full text-center"
//             onClick={handleFlip}
//           >
//             Swipe or click to view more details
//           </div>
//         </div>

//         {/* Back of the card */}
//         <div
//           className="absolute inset-0 bg-[#6a1c1c] text-white rounded-xl p-6 backface-hidden shadow-lg [transform:rotateY(180deg)]"
//           style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
//         >
//           <div className="absolute top-0 left-0 w-full h-16 bg-red-600 rounded-t-xl">
//             <div
//               className="absolute top-0 left-0 w-full h-full opacity-30"
//               style={{
//                 backgroundImage:
//                   "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
//               }}
//             />
//           </div>

//           <div className="mt-20 space-y-6">
//             <div className="space-y-3">
//               <div className="flex items-center gap-3 text-sm">
//                 <Mail className="h-5 w-5 text-red-600" />
//                 <span className="">{user.email}</span>
//               </div>
//               <div className="flex items-center gap-3 text-sm">
//                 <Phone className="h-5 w-5 text-red-600" />
//                 <span className="">{user.phone}</span>
//               </div>
//               <div className="flex items-center gap-3 text-sm">
//                 <MapPin className="h-5 w-5 text-red-600" />
//                 <span className="">{user.location}</span>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <h3 className="text-sm font-semibold ">Status</h3>
//               <Badge
//                 variant={
//                   user.status === "Active"
//                     ? "default"
//                     : user.status === "Inactive"
//                     ? "secondary"
//                     : "outline"
//                 }
//                 className={cn(
//                   "w-full justify-center text-sm py-1",
//                   user.status === "Active" && "bg-green-500 hover:bg-green-600"
//                 )}
//               >
//                 {user.status}
//               </Badge>
//             </div>

//             <div className="space-y-2">
//               <h3 className="text-sm font-semibold text-gray-900">
//                 Last Active
//               </h3>
//               <p className="text-sm text-gray-700">{user.lastActive}</p>
//             </div>
//           </div>

//           <div
//             className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-gray-500"
//             onClick={handleFlip}
//           >
//             Swipe or click to flip back
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }
