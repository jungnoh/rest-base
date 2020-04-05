import axios from 'axios';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SupLayout from '../../../layout/sup';
import { handleError } from '../../../utils';
import { useRouter } from 'next/dist/client/router';

export default function Index() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [config, setConfig] = useState<any>(null);
  const [updateKey, setUpdateKey] = useState('');
  const [updateValue, setUpdateValue] = useState('');
  const [removeKey, setRemoveKey] = useState('');
  useEffect(() => {
    axios.get('/api/super/config', {validateStatus: () => true})
      .then((resp) => {
        if (resp.status !== 200) {
          handleError(resp);
        } else {
          setConfig(resp.data); 
        }
      });
  }, []);

  const update = () => {
    axios.put('/api/super/config', {
      key: updateKey,
      value: updateValue
    }, {validateStatus: () => true})
      .then((resp) => {
        if (resp.status !== 200) {
          handleError(resp);
        } else {
          router.reload();
        }
      });
  };
  const remove = () => {
    axios.delete(`/api/super/config/${removeKey}`, {validateStatus: () => true})
      .then((resp) => {
        if (resp.status !== 200) {
          handleError(resp);
        } else {
          router.reload();
        }
      });
  };

  return (
    <SupLayout>
      <h2>Config @ {new Date().toString()}</h2>
      <Result>{JSON.stringify(config, null, 4)}</Result>
      <Row>
        <span>Add/Edit:&nbsp;</span>
        <input placeholder="key" value={updateKey} onChange={e => setUpdateKey(e.target.value)}></input>
        <input placeholder="value" value={updateValue} onChange={e => setUpdateValue(e.target.value)}></input>
        <button onClick={update}>OK</button>
      </Row>
      <Row>
        <span>Remove:&nbsp;</span>
        <input placeholder="key" value={removeKey} onChange={e => setRemoveKey(e.target.value)}></input>
        <button onClick={remove}>OK</button>
      </Row>
    </SupLayout>
  );
}

const Result = styled.span`
  white-space: pre;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`;