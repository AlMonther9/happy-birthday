"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  Cake,
  Sparkles,
  ArrowRight,
  UserIcon as Male,
  UserIcon as Female,
  Check,
  Share2,
} from "lucide-react";
import ShareLink from "@/components/share-link";

export default function CreatePage() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال اسم",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Instead of immediately redirecting, set the created state to true
      // to show sharing options
      setIsCreated(true);

      toast({
        title: "تم إنشاء الاحتفال",
        description: `تم إنشاء احتفال لـ ${name}`,
        variant: "success",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "خطأ",
        description: "فشل إنشاء الاحتفال",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToCelebration = () => {
    const url =
      gender === "female"
        ? `/${encodeURIComponent(name)}?gender=female`
        : `/${encodeURIComponent(name)}`;
    router.push(url);
  };

  const staggerItems = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 to-cyan-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-pink-100 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="relative overflow-hidden pb-10">
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-pink-400/20 to-cyan-400/20" />

            <motion.div
              className="absolute top-4 right-4 text-pink-500"
              animate={{ rotate: 360 }}
              transition={{
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <Sparkles className="h-5 w-5" />
            </motion.div>

            <div className="relative z-10 text-center mt-6">
              <motion.div
                className="mx-auto mb-4 bg-gradient-to-r from-pink-100 to-cyan-100 p-3 rounded-full w-16 h-16 flex items-center justify-center"
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Cake className="h-8 w-8 text-pink-500" />
              </motion.div>

              <CardTitle className="text-2xl text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-cyan-600">
                إنشاء احتفال عيد ميلاد
              </CardTitle>
              <CardDescription className="text-center mt-2">
                أدخل اسم الشخص الذي تريد الاحتفال بعيد ميلاده
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            {!isCreated ? (
              <form onSubmit={handleSubmit}>
                <motion.div
                  className="space-y-4"
                  variants={staggerItems}
                  initial="hidden"
                  animate="show"
                >
                  <motion.div className="space-y-2" variants={item}>
                    <Input
                      type="text"
                      placeholder="أدخل الاسم هنا"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="text-right border-pink-200 focus:border-pink-400 h-12"
                      dir="rtl"
                    />
                  </motion.div>

                  {/* Gender Selection */}
                  <motion.div
                    variants={item}
                    className="flex justify-center gap-4 py-2"
                  >
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-2">اختر الجنس</p>
                      <div className="flex gap-4 justify-center">
                        <button
                          type="button"
                          onClick={() => setGender("male")}
                          className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all cursor-pointer ${
                            gender === "male"
                              ? "bg-blue-100 text-blue-600 ring-2 ring-blue-400"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          <Male
                            className={`h-6 w-6 ${
                              gender === "male"
                                ? "text-blue-500"
                                : "text-gray-400"
                            }`}
                          />
                          <span className="text-xs font-medium">ذكر</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setGender("female")}
                          className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all cursor-pointer ${
                            gender === "female"
                              ? "bg-pink-100 text-pink-600 ring-2 ring-pink-400"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          <Female
                            className={`h-6 w-6 ${
                              gender === "female"
                                ? "text-pink-500"
                                : "text-gray-400"
                            }`}
                          />
                          <span className="text-xs font-medium">أنثى</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={item}>
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <motion.div
                          className="flex items-center gap-2"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                          }}
                        >
                          <span>جاري الإنشاء...</span>
                          <Sparkles className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>إنشاء الاحتفال</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </form>
            ) : (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", duration: 0.7 }}
                    className="mx-auto mb-4 bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center"
                  >
                    <Check className="h-8 w-8 text-green-500" />
                  </motion.div>

                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    تم إنشاء الاحتفال بنجاح!
                  </h3>
                  <p className="text-sm text-gray-500">
                    يمكنك الآن مشاركة الرابط أو الذهاب للاحتفال
                  </p>
                </div>

                <ShareLink name={name} gender={gender} />

                <Button
                  onClick={handleGoToCelebration}
                  className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white cursor-pointer"
                >
                  الذهاب إلى الاحتفال
                </Button>
              </motion.div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            {!isCreated && (
              <>
                <motion.p
                  className="text-sm text-gray-500 text-center"
                  variants={item}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: 0.5 }}
                >
                  سيتم إنشاء رابط فريد يمكنك مشاركته مع الشخص المحتفل به
                </motion.p>

                <motion.div
                  className="w-full flex justify-center"
                  variants={item}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: 0.6 }}
                >
                  <motion.div
                    className="flex items-center gap-1 text-xs text-pink-500"
                    animate={{ y: [0, -3, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <Share2 className="h-3 w-3" />
                    <span>شارك الفرحة مع أحبائك</span>
                  </motion.div>
                </motion.div>
              </>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
