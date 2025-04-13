import { ReactNode } from 'react';
import { Container } from 'react-bootstrap';

interface Props {
    children: ReactNode;
}

export const MainContent = ({children}:Props) => {
    return (
        <>
        <Container style={{marginTop: "70px"}}>
            {children}
        </Container>
    </>
  );
};