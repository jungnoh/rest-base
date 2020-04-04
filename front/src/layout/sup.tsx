import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface IndexProps {
  children?: ReactNode;
}

const menuItems: {url: string; name: string}[] = [
  {url: '/admin', name: 'leave'},
  {url: '/admin/sup', name: 'config'},
  {url: '/admin/sup/mongo', name: 'mongo'},
  {url: '/admin/sup/git', name: 'git head'}
]

export default function SupLayout(props: IndexProps) {
  return (
    <Layout>
      <SideBar>
        <SupLogo>
          <span>
            #su
          </span>
          Superuser Tools
        </SupLogo>
        <SidebarItems>
          {menuItems.map(x => (<a href={x.url}>{x.name}</a>))}
        </SidebarItems>
      </SideBar>
      <Content>
        {props.children}
      </Content>
    </Layout>
  );
}

const Layout = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 200px auto;
`;

const SideBar = styled.div`
  grid-row: 1 / 2;
  grid-column: 1 / 2;
  display: flex;
  flex-direction: column;
  padding: 8px;
  box-sizing: border-box;
  background-color: #FFF;
  box-shadow: 0px 0px 5px 1px rgba(158,158,158,0.41);
  user-select: none;
`;

const SidebarItems = styled.div`
  & > a {
    height: 36px;
    display: flex;
    align-items: center;
    padding: 0 8px;
    color: #0000FF;
  }
`;

const Content = styled.div`
  grid-row: 1 / 2;
  grid-column: 2 / 3;
  width: 100%;
  height: 100%;
  padding: 8px;
  box-sizing: border-box;
`;

const SupLogo = styled.div`
  display: flex;
  align-items: center;
  height: 48px;
  padding: 8px;
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 16px;
  & > span {
    background-color: #ff8819;
    width: 36px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotate(-20deg);
    color: #FFF;
    font-family: Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New; 
    font-weight: bold;
    margin-right: 8px;
  }
`;