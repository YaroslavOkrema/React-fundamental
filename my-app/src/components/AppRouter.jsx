import React, {useContext} from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import {privateRoutes, publicRotes} from "../router/routes";
import {AuthContext} from "../context/context";
import Loader from "./UI/Loader/Loader";

const AppRouter = () => {
    const {isAuth, isLoading} = useContext(AuthContext);

    if (isLoading) {
        return <Loader />
    }

    return (
        isAuth
            ?
            <Routes>
                {privateRoutes.map(route => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={<route.component />}
                        exact={route.exact}
                    />
                ))}
                <Route path="*" element={<Navigate to="/posts" />} />
            </Routes>
            :
            <Routes>
                {publicRotes.map(route => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={<route.component />}
                        exact={route.exact}
                    />
                ))}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
    );
};

export default AppRouter;