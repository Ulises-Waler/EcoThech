import { Client, InternetIdentity } from '@bundly/ic-core-js';
import { IcpConnectContextProvider } from '@bundly/ic-react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Home } from './Home';
import XD from './XD';

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <XD/>,
    },
    {
      path: "/Identity",
      element: <Home/>,
    },
  ]);

  const client = Client.create({
    restCanisters: {
      backend: {
        baseUrl: process.env.REACT_APP_API_REST_URL
      }
    },
    providers: [
      new InternetIdentity({
        providerUrl: process.env.REACT_APP_INTERNET_IDENTITY_URL
      })
    ]
  });

  return (
    <IcpConnectContextProvider client={client}>
      <RouterProvider router={router} />
    </IcpConnectContextProvider>
  )
}