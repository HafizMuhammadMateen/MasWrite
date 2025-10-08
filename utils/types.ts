export type FormErrors = {
  email?: string | null;
  password?: string | null;
  currentPassword?: string | null;
  newPassword?: string | null;
  confirmPassword?: string | null;
  userName?: string| null;
  formError?: string | null;
};

export type ChangePasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isResetFlow?: boolean;
  token?: string | null;
}