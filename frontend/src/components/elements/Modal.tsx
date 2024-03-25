import { ReactNode, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import '../../../public/styles/modal.css'


/**
 * Props required for Modal Component
 * @typedef {ModalProps}
 */
type ModalProps = {
    children: ReactNode,
    openModal: boolean,
    onCloseModal: () => void,
}


/**
 * Component for rendering modal overlay
 * @param {ModalProps} children passing along props for element rendering inside modal
 * @param {ModalProps} openModal boolean for displaying (true) or hiding (false) modal
 * @param {ModalProps} onCloseModal callback function for action to take when modal closed
 * @returns {React.JSX.Element} Modal
 */
export default function Modal({ children, openModal, onCloseModal }: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null)


    useEffect(() => {
        if (openModal) {
            dialogRef.current?.showModal()
        } else {
            dialogRef.current?.close()
        }
    }, [openModal])


    return createPortal(
        <dialog ref={dialogRef} className='modal' onClose={onCloseModal}>
            {children}
        </dialog>,
        document.getElementById('modal-root')!
    )
}
