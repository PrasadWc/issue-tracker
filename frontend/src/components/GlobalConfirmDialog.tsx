import ConfirmationDialog from "./ConfirmationDialog";
import { useConfirmStore } from "../store/useConfirmStore";

const GlobalConfirmDialog = () => {
  const { isOpen, options, loading, onConfirm, onCancel } = useConfirmStore();

  return (
    <ConfirmationDialog
      open={isOpen}
      onClose={onCancel}
      onConfirm={onConfirm}
      title={options.title}
      message={options.message}
      confirmText={options.confirmText}
      cancelText={options.cancelText}
      severity={options.severity}
      loading={loading}
    />
  );
};

export default GlobalConfirmDialog;
