import React, { FC } from 'react';
import { Input, InputProps } from '@blockstack/ui';

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
      {children}
    </form>
  );
};
