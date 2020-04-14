/// <reference types="next" />
/// <reference types="next/types/global" />

declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

interface IamPortCertificateOptions {
  merchant_uid?: string;
  popup?: boolean;
  phone?: string;
  name?: string;
}

declare const IMP: {
  init: (code: string) => unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  certification: (params: IamPortCertificateOptions, callback: (rsp: any) => unknown) => unknown;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Quill: any;