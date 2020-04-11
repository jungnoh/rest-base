import axios from 'axios';
import React, { useState } from 'react';
import styled from 'styled-components';
import SupLayout from '../../../layout/sup';
import { handleError } from '../../../utils';

export default function Index() {
  const [qv, setQv] = useState<string>('');
  const [output, setOutput] = useState<string>('enter key');
  const [input, setInput] = useState('');

  const query = (key: string) => {
    key = key.trim();
    if (!(/^imps?_[0-9]+$/.test(key))) {
      alert('Invalid IMP key!');
      return;
    }
    setQv(key);
    axios.get(`/api/super/imp/purchase/${key}`, {validateStatus: () => true})
      .then((resp) => {
        if (resp.status === 404) {
          setOutput('Invalid uid');
        } else if (resp.status !== 200) {
          handleError(resp);
        } else {
          setOutput(JSON.stringify(resp.data, null, 4));
        }
      });
  };

  const onSubmit = () => {
    query(input);
    setInput('');
  };

  return (
    <SupLayout>
      <h2>IMP purchase ({qv})</h2>
      <span>
        Parsed from backend.
        &nbsp;<a href="https://admin.iamport.kr/payments" target="_blank" rel="noopener noreferrer">imp console</a>
        &nbsp;<a href="https://api.iamport.kr/" target="_blank" rel="noopener noreferrer">api docs</a>
      </span>
      <TextInput
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {if (e.keyCode === 13) onSubmit();}}
        placeholder="iamport uid (imps?_[0-9]+)"
      />
      <ShellOutput>
        {output}
      </ShellOutput>
    </SupLayout>
  );
}

const ShellOutput = styled.div`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  white-space: pre-wrap;
  overflow-x: hidden;
  overflow-y: scroll;
  word-break: break-all;
  margin-top: 16px;  
`;

const TextInput = styled.input`
  width: 100%;
  box-sizing: border-box;
`;
