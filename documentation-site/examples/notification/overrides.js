// @flow
import * as React from 'react';
import {Notification} from 'baseui/notification';
import DeleteAlt from 'baseui/icon/delete-alt';
import {expandBorderStyles} from 'baseui/styles';
export default () => (
  <Notification
    overrides={{
      Body: {
        style: ({$theme}) => ({
          ...expandBorderStyles($theme.borders.border600),
        }),
      },
      CloseIcon: {
        component: DeleteAlt,
        style: {float: 'right', cursor: 'pointer'},
      },
    }}
    closeable
  >
    Notification with overrides
  </Notification>
);
