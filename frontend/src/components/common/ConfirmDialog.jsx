import Button from "./Button";
import Modal from "./Modal";

const ConfirmDialog = ({
  open,
  title = "Confirm action",
  description = "This action cannot be undone.",
  onConfirm,
  onCancel
}) => {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      }
    >
      <p className="text-sm text-text-muted">{description}</p>
    </Modal>
  );
};

export default ConfirmDialog;