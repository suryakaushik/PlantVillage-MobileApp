import * as React from 'react';
import { Modal } from 'react-native';

function ConfirmationModal() {
    return (
        <Modal style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Confirmation Modal</Text>
        </Modal>
    );
}

export default ConfirmationModal;