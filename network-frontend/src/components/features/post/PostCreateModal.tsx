// "use client";

// import { useState, useRef, useCallback, useEffect } from "react";
// import {
//   X,
//   ChevronLeft,
//   ChevronRight,
//   ArrowLeft,
//   MapPin,
//   UserPlus,
//   Tag,
//   Facebook,
//   Instagram,
// } from "lucide-react";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { FancySwitch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import MediaCropper from "./MediaCropper";

// interface PostCreateModalProps {
//   open: boolean;
//   onClose: () => void;
// }

// type ModalStep = "select" | "preview" | "post-info";

// export function PostCreateModal({ open, onClose }: PostCreateModalProps) {
//   const [step, setStep] = useState<ModalStep>("select");
//   const [isExpanding, setIsExpanding] = useState(false);
//   const [modalWidth, setModalWidth] = useState(600);
//   const [files, setFiles] = useState<File[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [aspectRatios, setAspectRatios] = useState<(number | null)[]>([]);
//   const [croppedFiles, setCroppedFiles] = useState<(File | null)[]>([]);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [isCropped, setIsCropped] = useState<boolean[]>([]);
//   const modalRef = useRef<HTMLDivElement>(null);
//   const [caption, setCaption] = useState("");

//   const handleContinue = () => {
//     setIsExpanding(true);

//     setTimeout(() => {
//       setModalWidth(1000);
//       setIsExpanding(false);
//       setStep("post-info");
//     }, 300);
//   };

//   const handleBackToPostInfo = () => {
//     setIsExpanding(true);

//     if (modalRef.current) {
//       modalRef.current.style.transform = "translateX(0)";
//     }

//     setTimeout(() => {
//       setModalWidth(600);
//       setIsExpanding(false);
//       setStep("preview");
//     }, 300);
//   };

//   const handleResetImage = useCallback(() => {
//     setCroppedFiles((prev) => {
//       const newCrops = [...prev];
//       newCrops[currentIndex] = null;
//       return newCrops;
//     });
//     setIsCropped((prev) => {
//       const newIsCropped = [...prev];
//       newIsCropped[currentIndex] = false;
//       return newIsCropped;
//     });
//   }, [currentIndex]);

//   useEffect(() => {
//     return () => {
//       files.forEach((file) => URL.revokeObjectURL(URL.createObjectURL(file)));
//       croppedFiles.forEach(
//         (file) => file && URL.revokeObjectURL(URL.createObjectURL(file))
//       );
//     };
//   }, [files, croppedFiles]);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const selectedFiles = Array.from(e.target.files);
//       setFiles(selectedFiles);
//       setCroppedFiles(new Array(selectedFiles.length).fill(null));
//       setAspectRatios(new Array(selectedFiles.length).fill(null));
//       setCurrentIndex(0);
//       setStep("preview");
//     }
//   };

//   const handlePrev = () => {
//     setCurrentIndex((prev) => (prev > 0 ? prev - 1 : files.length - 1));
//   };

//   const handleNext = () => {
//     setCurrentIndex((prev) => (prev < files.length - 1 ? prev + 1 : 0));
//   };

//   const handleBackToSelect = () => {
//     const confirmBack = window.confirm(
//       "Bạn có chắc muốn quay lại? Các ảnh/video đã chọn sẽ bị mất."
//     );
//     if (confirmBack) {
//       setStep("select");
//       setFiles([]);
//       setAspectRatios([]);
//       setCroppedFiles([]);
//     }
//   };

//   const handleCropComplete = useCallback(
//     (croppedBlob: Blob) => {
//       const file = files[currentIndex];
//       const croppedFile = new File([croppedBlob], file.name, {
//         type: file.type,
//         lastModified: Date.now(),
//       });

//       setCroppedFiles((prev) => {
//         const newCrops = [...prev];
//         newCrops[currentIndex] = croppedFile;
//         return newCrops;
//       });

//       setIsCropped((prev) => {
//         const newIsCropped = [...prev];
//         newIsCropped[currentIndex] = true;
//         return newIsCropped;
//       });
//     },
//     [currentIndex, files]
//   );

//   const renderMedia = (file: File, index: number) => {
//     const croppedFile = croppedFiles[index];
//     const displayFile = croppedFile || file;
//     const url = URL.createObjectURL(displayFile);

//     if (file.type.startsWith("image/")) {
//       if (step === "preview") {
//         return (
//           <MediaCropper
//             key={`cropper-${index}`}
//             file={displayFile}
//             aspectRatio={aspectRatios[index]}
//             onCropComplete={handleCropComplete}
//             onReset={handleResetImage}
//             isCropped={isCropped[index] || false}
//           />
//         );
//       }
//       return (
//         <img
//           src={url}
//           alt="Selected"
//           className="w-full h-full object-contain"
//         />
//       );
//     }
//     if (file.type.startsWith("video/")) {
//       return (
//         <video src={url} controls className="w-full h-full object-contain" />
//       );
//     }
//     return null;
//   };

//   const renderPostInfo = () => (
//     <div className="flex h-full">
//       {/* Media display area */}
//       <div className="w-[600px] border-r bg-black flex items-center justify-center">
//         {files.length > 0 && (
//           <div className="relative w-full h-full">
//             {renderMedia(files[currentIndex], currentIndex)}

//             {files.length > 1 && (
//               <>
//                 <button
//                   onClick={handlePrev}
//                   className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 transition-colors"
//                 >
//                   <ChevronLeft size={24} />
//                 </button>
//                 <button
//                   onClick={handleNext}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 transition-colors"
//                 >
//                   <ChevronRight size={24} />
//                 </button>
//               </>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Right sidebar - Post info */}
//       <div className="flex-1 flex flex-col min-w-[400px]">
//         {/* User info */}
//         <div className="flex items-center gap-3 p-4 border-b">
//           <Avatar className="w-8 h-8">
//             <AvatarImage src="/user-avatar.jpg" />
//             <AvatarFallback>U</AvatarFallback>
//           </Avatar>
//           <span className="font-semibold text-sm">username</span>
//         </div>

//         {/* Caption area */}
//         <div className="flex-1 p-4 flex flex-col">
//           <Textarea
//             placeholder="Viết chú thích..."
//             className="flex-1 w-full p-2 border-none outline-none resize-none text-sm min-h-[120px]"
//             value={caption}
//             onChange={(e) => setCaption(e.target.value)}
//           />

//           <div className="flex items-center justify-between text-muted-foreground text-xs mt-2">
//             <span>{caption.length}/2,200</span>
//             <button className="text-blue-500 hover:text-blue-600">
//               Thêm hashtag
//             </button>
//           </div>
//         </div>

//         {/* Additional options */}
//         <div className="space-y-4 p-4 border-t">
//           {/* Tag people */}
//           <button className="flex items-center gap-3 w-full text-sm">
//             <Tag className="w-4 h-4 text-muted-foreground" />
//             <span>Gắn thẻ mọi người</span>
//           </button>

//           {/* Add location */}
//           <button className="flex items-center gap-3 w-full text-sm">
//             <MapPin className="w-4 h-4 text-muted-foreground" />
//             <span>Thêm vị trí</span>
//           </button>

//           {/* Add collaborators */}
//           <button className="flex items-center gap-3 w-full text-sm">
//             <UserPlus className="w-4 h-4 text-muted-foreground" />
//             <span>Thêm cộng tác viên</span>
//           </button>
//         </div>

//         {/* Share options */}
//         <div className="p-4 border-t space-y-3">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <Facebook className="w-4 h-4 text-blue-600" />
//               <Label htmlFor="facebook" className="text-sm">
//                 Facebook
//               </Label>
//             </div>
//             <FancySwitch defaultChecked color="blue" />
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <Instagram className="w-4 h-4 text-pink-600" />
//               <Label htmlFor="threads" className="text-sm">
//                 Threads
//               </Label>
//             </div>
//             <FancySwitch defaultChecked color="pink" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//       <button
//         onClick={onClose}
//         className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 transition-colors"
//       >
//         <X size={28} />
//       </button>

//       <div
//         ref={modalRef}
//         className={`bg-white rounded-xl shadow-xl h-[600px] flex flex-col ${
//           isExpanding ? "overflow-hidden" : ""
//         }`}
//         style={{
//           width: `${modalWidth}px`,
//           transform: "translateX(0)",
//           transition: "width 300ms ease-in-out, transform 300ms ease-in-out",
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between border-b p-4">
//           {step !== "select" ? (
//             <button
//               onClick={() => {
//                 if (step === "post-info") {
//                   handleBackToPostInfo();
//                 } else {
//                   handleBackToSelect();
//                 }
//               }}
//               className="flex items-center gap-1 text-sm text-gray-600 hover:text-black transition-colors"
//             >
//               <ArrowLeft size={16} /> Quay lại
//             </button>
//           ) : (
//             <div className="w-[80px]" />
//           )}

//           <h2 className="text-lg font-bold">
//             {step === "select"
//               ? "Tạo bài viết mới"
//               : step === "preview"
//               ? "Xem trước"
//               : "Tạo bài viết"}
//           </h2>

//           {step === "preview" ? (
//             <Button size="sm" onClick={handleContinue}>
//               Tiếp tục
//             </Button>
//           ) : step === "post-info" ? (
//             <Button size="sm" onClick={() => alert("Đăng bài viết")}>
//               Chia sẻ
//             </Button>
//           ) : (
//             <div className="w-[80px]" />
//           )}
//         </div>

//         {/* Content area */}
//         <div className="flex-1 flex flex-col items-center justify-center overflow-hidden">
//           {step === "select" && (
//             <div
//               className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg p-10 cursor-pointer hover:bg-gray-50 transition-colors"
//               onClick={() => fileInputRef.current?.click()}
//             >
//               <Image
//                 src="/icons/folder.png"
//                 alt="Chọn ảnh"
//                 width={80}
//                 height={80}
//                 className="mb-4 opacity-70"
//               />
//               <p className="text-gray-600 mb-2">
//                 Chọn ảnh hoặc video từ thiết bị
//               </p>
//               <p className="text-gray-400 text-sm">Kéo thả tập tin vào đây</p>
//               <input
//                 type="file"
//                 accept="image/*,video/*"
//                 multiple
//                 hidden
//                 ref={fileInputRef}
//                 onChange={handleFileChange}
//               />
//             </div>
//           )}

//           {step === "preview" && files.length > 0 && (
//             <div className="w-full h-full flex flex-col">
//               <div className="relative flex-1 w-full h-full overflow-hidden bg-black">
//                 {renderMedia(files[currentIndex], currentIndex)}

//                 {files.length > 1 && (
//                   <>
//                     <button
//                       onClick={handlePrev}
//                       className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 transition-colors"
//                     >
//                       <ChevronLeft size={24} />
//                     </button>
//                     <button
//                       onClick={handleNext}
//                       className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 transition-colors"
//                     >
//                       <ChevronRight size={24} />
//                     </button>
//                   </>
//                 )}
//               </div>

//               <div className="flex gap-2 p-4 justify-center border-t">
//                 <Button
//                   variant={
//                     aspectRatios[currentIndex] === 1 ? "default" : "outline"
//                   }
//                   size="sm"
//                   onClick={() => {
//                     const newAspectRatios = [...aspectRatios];
//                     newAspectRatios[currentIndex] = 1;
//                     setAspectRatios(newAspectRatios);
//                   }}
//                 >
//                   1:1
//                 </Button>
//                 <Button
//                   variant={
//                     aspectRatios[currentIndex] === 0.8 ? "default" : "outline"
//                   }
//                   size="sm"
//                   onClick={() => {
//                     const newAspectRatios = [...aspectRatios];
//                     newAspectRatios[currentIndex] = 0.8;
//                     setAspectRatios(newAspectRatios);
//                   }}
//                 >
//                   4:5
//                 </Button>
//                 <Button
//                   variant={
//                     aspectRatios[currentIndex] === 16 / 9
//                       ? "default"
//                       : "outline"
//                   }
//                   size="sm"
//                   onClick={() => {
//                     const newAspectRatios = [...aspectRatios];
//                     newAspectRatios[currentIndex] = 16 / 9;
//                     setAspectRatios(newAspectRatios);
//                   }}
//                 >
//                   16:9
//                 </Button>
//                 <Button
//                   variant={
//                     aspectRatios[currentIndex] === null ? "default" : "outline"
//                   }
//                   size="sm"
//                   onClick={() => {
//                     const newAspectRatios = [...aspectRatios];
//                     newAspectRatios[currentIndex] = null;
//                     setAspectRatios(newAspectRatios);
//                   }}
//                 >
//                   Gốc
//                 </Button>
//               </div>
//             </div>
//           )}
//           {step === "post-info" && renderPostInfo()}
//         </div>
//       </div>
//     </div>
//   );
// }
