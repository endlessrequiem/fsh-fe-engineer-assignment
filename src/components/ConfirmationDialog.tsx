type ConfirmationDialogProps = {
  isOpen: boolean
  closeText: string
  onClose: () => void
  closeStyling: string
  actionText: string
  onAction: () => void
  actionStyling: string
  dialogText: string
}

function ConfirmationDialog({
                                isOpen,
                                onClose,
                                onAction,
                                dialogText,
                                closeText,
                                actionText,
                                closeStyling,
                                actionStyling
}: ConfirmationDialogProps) {
  if (!isOpen) return null

  return (
      <div className="dialog-overlay" onClick={onClose}>
      <div className="confirmation-dialog" onClick={(e) => e.stopPropagation()}>
        <h2 className="dialog-title">Cancel Appointment</h2>
        <p className="dialog-message">
          {dialogText}
        </p>
        <div className="dialog-buttons">
          <button
            className={closeStyling}
            onClick={onClose}
          >
           {closeText}
          </button>
          <button
            className={actionStyling}
            onClick={onAction}
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationDialog

