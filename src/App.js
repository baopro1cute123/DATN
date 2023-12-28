import './App.css';
import { CRoutes, BRoutes } from '~/routes';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import getUnAuth from './API/get';
import { useSelector } from 'react-redux';
function App() {
    const [routers, setRouters] = useState(CRoutes);
    const authToken = JSON.parse(localStorage.getItem('authToken'));
    const { dataRole, loadingRole, errorRole } = useSelector((state) => state.roleReducer);
    useEffect(() => {
        console.log(dataRole);
        if (dataRole) {
            if (dataRole[0] == 'ROLE_BUSINESS') setRouters(BRoutes);
            if (dataRole[0] == 'ROLE_CUSTOMER') setRouters(CRoutes);
        } else setRouters(CRoutes);
    }, [dataRole]);
    return (
        <Router>
            <div className="App">
                <Routes>
                    {routers.map((route, index) => {
                        const Page = route.component;
                        let Layout = route.layout;
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
