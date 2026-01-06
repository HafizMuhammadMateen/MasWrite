export type FormErrors = {
  email?: string;
  password?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  userName?: string;
  formError?: string;
};

export type ChangePasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isResetPasswordFlow?: boolean;
  token?: string | null;
}