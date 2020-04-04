import axios from 'axios';
import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import SupLayout from '../../../layout/sup';
import { handleError } from '../../../utils';

const SHORTCUT_ITEMS = [
  {command: '{ "dbStats": 1 }', name: 'db stats'},
  {command: '{ "listCollections": 1 }', name: 'list collections'}
];

export default function Index() {
  const [output, setOutput] = useState<string>('');
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>();

  const query = (cmd: string) => {
    axios.post('/api/super/mongo', {command: cmd}, {validateStatus: () => true})
      .then((resp) => {
        if (resp.status !== 200) {
          handleError(resp);
        } else {
          setOutput(output+`\n> ${cmd}\n`+JSON.stringify(resp.data, null, 4));
          endRef.current?.scrollIntoView({behavior: 'smooth'});
        }
      });
  };

  const onSubmit = () => {
    query(input);
    setInput('');
  };

  return (
    <SupLayout>
      <h2>Mongo shell</h2>
      <div>
        <a href="https://docs.mongodb.com/manual/reference/command/" target="_blank" rel="noreferrer noopener">command docs</a>
      </div>
      <Shortcuts>
        <span>Shortcuts</span>
        {SHORTCUT_ITEMS.map((x, i) => (<a onClick={() => query(x.command)} key={i}>{x.name}</a>))}
      </Shortcuts>
      <TextInput type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => {if (e.keyCode === 13) onSubmit();}} />
      <ShellOutput>
        {output}
        <div ref={endRef} />
      </ShellOutput>
    </SupLayout>
  );
}

const ShellOutput = styled.div`
  background-color: #080808;
  color: #FFF;
  width: 100%;
  max-width: 100%;
  height: 80vh;
  padding: 8px;
  box-sizing: border-box;
  white-space: pre-wrap;
  overflow-x: hidden;
  overflow-y: scroll;
  word-break: break-all;
`;

const TextInput = styled.input`
  width: 100%;
  box-sizing: border-box;
`;

const Shortcuts = styled.div`
  & > span {
    font-style: italic;
    margin-right: 8px;
  }
  & > a {
    margin: 0 4px;
    color: #0000FF;
    text-decoration: underline;
    cursor: pointer;
  }
`;
