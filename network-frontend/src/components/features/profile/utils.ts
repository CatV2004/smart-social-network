import { Profile } from "@/types/profile";

export const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

export const formatWebsite = (url: string | null) => {
    if (!url) return null;
    return url.replace(/(^\w+:|^)\/\//, "").split("/")[0];
};

export const hasPersonalInfo = (profile: Profile) => {
    return !!(profile.location || profile.phoneNumber || profile.dateOfBirth || profile.gender);
};

export const hasSocialInfo = (profile: Profile) => {
    return !!(profile.website || profile.facebook || profile.linkedin || profile.github);
};

export const getGenderText = (gender: string) => {
    switch (gender) {
        case "MALE":
            return "Nam";
        case "FEMALE":
            return "Nữ";
        case "OTHER":
            return "Khác";
        default:
            return gender;
    }
};