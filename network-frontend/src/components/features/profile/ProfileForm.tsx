import { useFormik } from 'formik';
import { ProfileUpdatePayload } from '@/types/profile';
import { updateMyProfile } from '@/redux/features/profile/profileThunks';
import { useAppDispatch } from '@/redux/hooks';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui';

interface ProfileFormProps {
  initialValues: ProfileUpdatePayload;
}

export default function ProfileForm({ initialValues }: ProfileFormProps) => {
  const dispatch = useAppDispatch();

  const formik = useFormik<ProfileUpdatePayload>({
    initialValues: {
      bio: initialValues.bio || '',
      location: initialValues.location || '',
      dateOfBirth: initialValues.dateOfBirth || '',
      gender: initialValues.gender || '',
      phoneNumber: initialValues.phoneNumber || '',
      website: initialValues.website || '',
      facebook: initialValues.facebook || '',
      linkedin: initialValues.linkedin || '',
      github: initialValues.github || '',
      isPrivate: initialValues.isPrivate || false,
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await dispatch(updateMyProfile(values)).unwrap();
      } catch (error) {
        console.error('Update failed:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 max-w-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Website"
          name="website"
          value={formik.values.website}
          onChange={formik.handleChange}
          placeholder="https://example.com"
        />
        <Input
          label="Số điện thoại"
          name="phoneNumber"
          value={formik.values.phoneNumber}
          onChange={formik.handleChange}
        />
      </div>

      <Textarea
        label="Tiểu sử"
        name="bio"
        value={formik.values.bio}
        onChange={formik.handleChange}
        rows={3}
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPrivate"
          name="isPrivate"
          checked={formik.values.isPrivate}
          onChange={formik.handleChange}
          className="h-4 w-4"
        />
        <label htmlFor="isPrivate">Tài khoản riêng tư</label>
      </div>

      <Button type="submit" disabled={formik.isSubmitting}>
        {formik.isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
      </Button>
    </form>
  );
};