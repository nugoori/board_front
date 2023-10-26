import { Route, Routes } from 'react-router-dom';
import './App.css';
import { useQuery } from 'react-query';

import AuthRoute from './components/Routes/AuthRoute';
import RootLayout from './components/RootLayout/RootLayout';
import Home from './pages/Homs/Home';
import { instance } from './api/config/instance';
import AccountRoute from './components/Routes/AccountRoute';
import BoardWrite from './pages/BoardWrite/BoardWrite';
import BoardList from './pages/BoardList/BoardList';
import BoardDetails from './pages/BoardDetails/BoardDetails';

function App() {
  // useQurey = get요청 / useMutation? lotation? 굳이 안써도 되지만 
  // useQuery(["key값", "useEffect의 dependency"])
  const getPrincipal = useQuery(["getPrincipal"], async () => {
    try {
      const option = {
        headers: {
          Authorization: localStorage.getItem("accessToken")
        }
      }
      
      return await instance.get("/account/principal", option); // getPrincipal안에 응답 데이터가 들어있음

    } catch (error) {
      throw new Error(error);
    }
  }, {
    retry: 0,
    // 10분마다 요청날아감 / 요청을 보내지 않으면 만료된 데이터가 전역 상태에 남아있게됨
    refetchInterval: 1000 * 60 * 10,
    refetchOnWindowFocus: false
  });

  if(getPrincipal.isLoading) {
    return <></>
  }

  return (
    // 로그인 상태를 전역상태로 관리 -> 로그인이 필요한 부분에만 로그인 상태를 사용
    <RootLayout>
      <Routes>

        <Route path='/' element={ <Home /> }/>
        <Route path='/auth/*' element={ <AuthRoute /> }/>
        <Route path='/account/*' element={ <AccountRoute /> }/>
        <Route path='/board/write' element={ <BoardWrite /> }/>
        <Route path='/board/:category/:page' element={ <BoardList />}/>
        <Route path='/board/:boardId' element={ <BoardDetails/>}/>
        <Route path='/board/:category/edit' element={<></>}/>

      </Routes>
    </RootLayout>
  );
}

export default App;
