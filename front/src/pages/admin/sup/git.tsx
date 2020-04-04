import axios from 'axios';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SupLayout from '../../../layout/sup';
import { handleError } from '../../../utils';

export default function Index() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [git, setGit] = useState<any>(null);
  useEffect(() => {
    axios.get('/api/super/git', {validateStatus: () => true})
      .then((resp) => {
        if (resp.status !== 200) {
          handleError(resp);
        } else {
          setGit(resp.data); 
        }
      });
  }, []);
  return (
    <SupLayout>
      <h2>Latest commit @ {new Date().toString()}</h2>
      <Result>{JSON.stringify(git, null, 4)}</Result>
    </SupLayout>
  );
}

const Result = styled.span`
  white-space: pre;
`;