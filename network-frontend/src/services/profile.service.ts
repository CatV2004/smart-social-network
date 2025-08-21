import profileApi from "@/lib/api/profile.api";
import { Profile, ProfileUpdatePayload } from "@/types/profile";

// Helper: build url cho các social
function buildSocialUrl(type: "facebook" | "linkedin" | "github" | "website", value?: string | null): string | null {
    if (!value) return null;
    const trimmed = value.trim();
    if (trimmed === "") return null;

    // Nếu đã nhập http/https sẵn thì giữ nguyên
    if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
    }

    switch (type) {
        case "facebook":
            return `https://facebook.com/${trimmed}`;
        case "linkedin":
            return `https://linkedin.com/in/${trimmed}`;
        case "github":
            return `https://github.com/${trimmed}`;
        case "website":
        default:
            return `https://${trimmed}`;
    }
}

export const profileService = {
    updateProfile: (data: ProfileUpdatePayload & { avatar?: File; coverImage?: File }) => {
        const formData = new FormData();

        // Xử lý các field thông thường
        const fields = {
            ...data,
            dateOfBirth: data.dateOfBirth
                ? new Date(data.dateOfBirth).toISOString().split("T")[0]
                : null,
            website: buildSocialUrl("website", data.website),
            facebook: buildSocialUrl("facebook", data.facebook),
            linkedin: buildSocialUrl("linkedin", data.linkedin),
            github: buildSocialUrl("github", data.github),
        };

        Object.entries(fields).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                let stringValue: string;
                if (typeof value === 'boolean') {
                    stringValue = value ? 'true' : 'false';
                } else {
                    stringValue = value.toString();
                }
                formData.append(key, stringValue);
            }
        });

        // Thêm file nếu có
        if (data.avatar) formData.append("avatar", data.avatar);
        if (data.coverImage) formData.append("coverImage", data.coverImage);

        console.log("Updating profile with data: ", Object.fromEntries(formData.entries()));

        return profileApi.updateProfile(formData)
    },

    uploadAvatar: async (file: File): Promise<Profile> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "avatar");
        const response = await profileApi.uploadImage(formData);
        return response;
    },

    uploadCover: async (file: File): Promise<Profile> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "cover");
        const response = await profileApi.uploadImage(formData);
        return response;
    },

};
