import * as React from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function CustomToast() : React.ReactElement {
    return <ToastContainer toastStyle={{ backgroundColor: "black" }} position="top-right" autoClose={1800} hideProgressBar={true} newestOnTop={false}
                          closeOnClick rtl={false} theme="dark"/>
}