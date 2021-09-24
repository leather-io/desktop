import React, { FC, memo } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { useHotkeys } from 'react-hotkeys-hook';

import { grantDiagnosticsPermission, revokeDiagnosticPermission } from '@store/settings';
import { Modal } from '@modals/components/base-modal';
import { AllowDiagnosticsLayout } from '../../components/request-diagnostics.layout';
import { ModalHeader } from '@modals/components/modal-header';
import { Box } from '@stacks/ui';

export const RequestDiagnosticsModal: FC = memo(() => {
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();

  const goToCurrentUrlOneRouteUpWithoutDiagnosticsModal = () =>
    history.push(location.pathname.replace('/request-diagnostics', ''));

  const userAllowDiagnosticAction = () => {
    dispatch(grantDiagnosticsPermission());
    goToCurrentUrlOneRouteUpWithoutDiagnosticsModal();
  };

  const userProhibitDiagnosticAction = () => {
    dispatch(revokeDiagnosticPermission());
    goToCurrentUrlOneRouteUpWithoutDiagnosticsModal();
  };

  useHotkeys('esc', () => userProhibitDiagnosticAction());

  return (
    <Modal handleClose={() => null} minWidth="488px" isOpen>
      <ModalHeader border={0} onSelectClose={() => userProhibitDiagnosticAction()}>
        Help us improve
      </ModalHeader>
      <Box mx="extra-loose" mb="extra-loose">
        <AllowDiagnosticsLayout
          onUserAllowDiagnostics={() => userAllowDiagnosticAction()}
          onUserDenyDiagnosticsPermissions={() => userProhibitDiagnosticAction()}
        />
      </Box>
    </Modal>
  );
});
