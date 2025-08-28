"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Calendar, Globe, Lock, Unlock, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/use-toast";
import { Profile } from "@/types/profile";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// ---- Schema
const profileFormSchema = z.object({
  bio: z
    .string()
    .max(500, "Tiểu sử không được vượt quá 500 ký tự")
    .nullable()
    .optional(),
  location: z
    .string()
    .max(100, "Địa điểm không được vượt quá 100 ký tự")
    .nullable()
    .optional(),
  gender: z.string().nullable().optional(),
  phoneNumber: z
    .string()
    .regex(/^[+]?[0-9]{8,15}$/, "Số điện thoại không hợp lệ")
    .nullable()
    .optional(),
  dateOfBirth: z
    .string()
    .nullable()
    .refine(
      (val) => !val || (!isNaN(Date.parse(val)) && new Date(val) < new Date()),
      {
        message: "Ngày sinh không hợp lệ",
      }
    )
    .optional(),
  website: z
    .string()
    .url("URL không hợp lệ")
    .nullable()
    .or(z.literal(""))
    .optional(),
  facebook: z
    .string()
    .max(50, "Username không được vượt quá 50 ký tự")
    .nullable()
    .optional(),
  linkedin: z
    .string()
    .max(50, "Username không được vượt quá 50 ký tự")
    .nullable()
    .optional(),
  github: z
    .string()
    .max(50, "Username không được vượt quá 50 ký tự")
    .nullable()
    .optional(),
  isPrivate: z.boolean(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  onSave: (data: ProfileFormValues) => Promise<any>;
}

const ProfileEditModal = ({
  isOpen,
  onClose,
  profile,
  onSave,
}: ProfileEditModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    trigger,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      bio: profile.bio || "",
      location: profile.location || "",
      gender: profile.gender || "",
      phoneNumber: profile.phoneNumber || "",
      dateOfBirth: profile.dateOfBirth || "",
      website: profile.website || "",
      facebook: profile.facebook || "",
      linkedin: profile.linkedin || "",
      github: profile.github || "",
      isPrivate: profile.isPrivate || false,
    },
  });

  const isPrivateValue = watch("isPrivate");
  const bioValue = watch("bio");
  const bioLength = bioValue?.length || 0;

  useEffect(() => {
    if (isOpen) {
      reset({
        bio: profile.bio || "",
        location: profile.location || "",
        gender: profile.gender || "",
        phoneNumber: profile.phoneNumber || "",
        dateOfBirth: profile.dateOfBirth || "",
        website: profile.website || "",
        facebook: profile.facebook || "",
        linkedin: profile.linkedin || "",
        github: profile.github || "",
        isPrivate: profile.isPrivate || false,
      });
      setActiveTab("basic");
    }
  }, [isOpen, profile, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      // Validate all fields before submitting
      const isValid = await trigger();
      if (!isValid) {
        toast({
          title: "Lỗi",
          description: "Vui lòng kiểm tra lại thông tin đã nhập",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Chuẩn hóa dữ liệu: "" => null
      const normalizedData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value === "" ? null : value,
        ])
      ) as ProfileFormValues;

      await onSave(normalizedData);

      toast({
        title: "Thành công",
        description: "Thông tin cá nhân đã được cập nhật",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description:
          error.message || "Không thể cập nhật thông tin. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <>
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Chỉnh sửa hồ sơ
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Cập nhật thông tin cá nhân của bạn
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Đóng"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="px-6 pt-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
            <TabsTrigger value="social">Mạng xã hội</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit(onSubmit)} className="py-6 space-y-6">
            <TabsContent value="basic" className="space-y-6 m-0">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label htmlFor="bio">Tiểu sử</Label>
                    <span
                      className={`text-xs ${
                        bioLength > 500
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      {bioLength}/500
                    </span>
                  </div>
                  <Textarea
                    id="bio"
                    placeholder="Giới thiệu về bản thân..."
                    {...register("bio")}
                    className="resize-none"
                    rows={3}
                    disabled={isLoading}
                  />
                  {errors.bio && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.bio.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Địa điểm</Label>
                    <Input
                      id="location"
                      placeholder="Thành phố, quốc gia..."
                      {...register("location")}
                      disabled={isLoading}
                    />
                    {errors.location && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.location.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="gender">Giới tính</Label>
                    <Select
                      value={watch("gender") || ""}
                      onValueChange={(value) =>
                        setValue("gender", value === "" ? null : value)
                      }
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Nam</SelectItem>
                        <SelectItem value="FEMALE">Nữ</SelectItem>
                        <SelectItem value="OTHER">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="dateOfBirth"
                      className="flex items-center gap-1"
                    >
                      <Calendar className="w-4 h-4" />
                      Ngày sinh
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      {...register("dateOfBirth")}
                      disabled={isLoading}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.dateOfBirth.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber">Số điện thoại</Label>
                    <Input
                      id="phoneNumber"
                      placeholder="Số điện thoại..."
                      {...register("phoneNumber")}
                      disabled={isLoading}
                    />
                    {errors.phoneNumber && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="website" className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    placeholder="https://website-của-bạn.com"
                    {...register("website")}
                    disabled={isLoading}
                  />
                  {errors.website && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.website.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2 text-base">
                      {isPrivateValue ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <Unlock className="w-4 h-4" />
                      )}
                      Tài khoản riêng tư
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {isPrivateValue
                        ? "Chỉ người theo dõi được phê duyệt mới có thể xem bài viết của bạn"
                        : "Mọi người đều có thể xem bài viết của bạn"}
                    </p>
                  </div>
                  <Switch
                    checked={isPrivateValue}
                    onCheckedChange={(checked) =>
                      setValue("isPrivate", checked)
                    }
                    disabled={isLoading}
                    color="blue"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-6 m-0">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="facebook">Facebook</Label>
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                        @
                      </span>
                      <Input
                        id="facebook"
                        placeholder="username"
                        {...register("facebook")}
                        disabled={isLoading}
                        className="rounded-l-none"
                      />
                    </div>
                    {errors.facebook && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.facebook.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                        @
                      </span>
                      <Input
                        id="linkedin"
                        placeholder="username"
                        {...register("linkedin")}
                        disabled={isLoading}
                        className="rounded-l-none"
                      />
                    </div>
                    {errors.linkedin && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.linkedin.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="github">GitHub</Label>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                      @
                    </span>
                    <Input
                      id="github"
                      placeholder="username"
                      {...register("github")}
                      disabled={isLoading}
                      className="rounded-l-none"
                    />
                  </div>
                  {errors.github && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.github.message}
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {activeTab === "basic"
                  ? "Thông tin cơ bản"
                  : "Liên kết mạng xã hội"}
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            </div>
          </form>
        </Tabs>
      </>
    </Modal>
  );
};

export default ProfileEditModal;
