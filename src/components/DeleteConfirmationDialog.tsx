interface DeleteConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
  appointmentProviderName: string
}

function DeleteConfirmationDialog({ isOpen, onClose, onDelete, appointmentProviderName }: DeleteConfirmationDialogProps) {
  if (!isOpen) return null

  return (
    <div className="delete-confirmation-overlay" onClick={onClose}>
      <div className="delete-confirmation-dialog" onClick={(e) => e.stopPropagation()}>
        <h2 className="delete-confirmation-title">Cancel Appointment</h2>
        <p className="delete-confirmation-message">
          Are you sure you want to cancel your appointment with {appointmentProviderName}?
        </p>
        <div className="delete-confirmation-buttons">
          <button
            className="delete-confirmation-cancel-button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="delete-confirmation-delete-button"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationDialog

