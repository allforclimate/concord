import styled from "styled-components";

export const Header = styled.header`
  background-color: #000000;
  min-height: 70px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  color: white;
`;

export const Body = styled.div`
  align-items: left;
  padding: 5rem;
  background-color: #000000;
  color: white;
  font-size: calc(10px + 2vmin);
  justify-content: center;
  min-height: calc(100vh - 70px);
`;

export const Image = styled.img`
  height: 40vmin;
  margin-bottom: 16px;
  pointer-events: none;
`;

export const Link = styled.a.attrs({
  target: "_blank",
  rel: "noopener noreferrer",
})`
  color: #61dafb;
  margin-top: 10px;
`;

export const Button = styled.button`
  background-color: white;
  border: none;
  border-radius: 12px;
  color: #282c34;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
  text-decoration: none;
  margin: 0px 0px;
  margin: 24px;
  padding: 12px 24px;

  ${props => props.hidden && "hidden"} :focus {
    border: none;
    outline: none;
  }
`;

export const SuperButton = styled.button`
  background-color: white;
  border: none;
  border-radius: 6px;
  color: #282c34;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
  text-decoration: none;
  padding: 8px 24px;
  margin-right: 10px;

  ${props => props.hidden && "hidden"} :focus {
    border: none;
    outline: none;
  }
`;

export const TopupButton = styled.button`
  background-color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
  text-decoration: none;
  padding: 5px 24px;
  margin-left: 10px;

  ${props => props.hidden && "hidden"} :focus {
    border: none;
    outline: none;
  }
  
`;
