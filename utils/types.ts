export type FormErrors = {
  email?: string;
  password?: string;
  userName?: string;
  formError?: string;
};

export type ChangePasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isResetFlow?: boolean;
  token?: string | null;
}