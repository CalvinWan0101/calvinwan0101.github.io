import styled from 'styled-components';
import avatar from '../../assets/images/avatar.png';

const Container = styled.div`
  display: flex;
  align-items: center;
  height: 100vh;
  padding-left: 10%;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const Title = styled.div`
  color: black;
  font-size: 100px;
  font-weight: 1000;
  line-height: 24px;
`;

const SubTitle = styled.div`
  color: black;
  font-size: 30px;
  font-weight: 500;
  line-height: 24px;
`

export const Home = () => {
  return (
    <Container>
      <InnerContainer>
        <Title>Calvin Wan</Title>
        <SubTitle>A backend developer learning frontend</SubTitle>
      </InnerContainer>
    </Container>
  );
};