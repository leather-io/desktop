import React, { FC } from 'react';
import { Input, InputProps } from '@blockstack/ui';

import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';

interface CryptoAddressFormProps extends Omit<InputProps, 'form'> {
  form: any;
  fieldName: string;
}

export const CryptoAddressForm: FC<CryptoAddressFormProps> = props => {
  const { form, fieldName, children, ...rest } = props;
  return (
    <form onSubmit={form.handleSubmit}>
      <Input
        id={fieldName}
        name={fieldName}
        onChange={form.handleChange}
        value={form.values[fieldName]}
        mt="loose"
        maxWidth="400px"
        fontFamily={form.values[fieldName].length ? 'monospace' : null}
        {...rest}
      />
      {form.touched[fieldName] && form.errors[fieldName] && (
        <ErrorLabel>
          <ErrorText>{form.errors[fieldName]}</ErrorText>
        </ErrorLabel>
      )}
      {children}
    </form>
  );
};
