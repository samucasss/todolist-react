import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function ConfirmDialog(props) {

    return (
        <Modal show={props.show}>
            <Modal.Body>{props.message}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => props.cancelar()}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={() => props.ok()}>
                    OK
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

