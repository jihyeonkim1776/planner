import {ReactNode} from "react";
import Header from "./Header";

interface LayoutProps {
    children: ReactNode;
}

export const Layout = ({children}:LayoutProps) => {
    return (

    <div className="layout">
                <Header/>
                <div className="background"></div>
        {children}
    </div>)
}