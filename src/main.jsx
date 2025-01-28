import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Root, {loader as rootLoader, action as rootAction} from './routes/root';
import ErrorPage from './error-page';
import Contact, {loader as contactLoader, editLoader, action as contactAction} from './routes/contact';
import EditContact, {action as editAction} from './routes/edit';
import {action as destroyAction} from './routes/destroy';
import Index from './routes';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,
    action: rootAction,
    errorElement: <ErrorPage />,
    children: [{
      errorElement: <ErrorPage />,
      children: [
          // Here is index instead of path, 
          // this is a special case where the route is the index of the parent route
          { index: true, element: <Index /> },
          {
            // URL Params (params): The colon (:) turns it into a "dynamic segment" that matches dynamic values in the URL.
            path: "contacts/:contactId",
            element: <Contact />,
            loader: contactLoader,
            action: contactAction,
          },
          {
            path: "contacts/:contactId/edit",
            element: <EditContact />,
            loader: editLoader,
            action: editAction,
          },
          {
            path: "contacts/:contactId/destroy",
            action: destroyAction,
            errorElement: <div>Oops! There was an error</div>
          },
        ],
      },
    ],
  },
]);

// stylistic choice using JSX to create routes, createRoutesFromElements and Route
// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route
//       path="/"
//       element={<Root />}
//       loader={rootLoader}
//       action={rootAction}
//       errorElement={<ErrorPage />}
//     >
//       <Route errorElement={<ErrorPage />}>
//         <Route index element={<Index />} />
//         <Route
//           path="contacts/:contactId"
//           element={<Contact />}
//           loader={contactLoader}
//           action={contactAction}
//         />
//         <Route
//           path="contacts/:contactId/edit"
//           element={<EditContact />}
//           loader={contactLoader}
//           action={editAction}
//         />
//         <Route
//           path="contacts/:contactId/destroy"
//           action={destroyAction}
//         />
//       </Route>
//     </Route>
//   )
// );

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
