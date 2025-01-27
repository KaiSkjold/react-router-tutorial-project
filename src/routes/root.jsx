import { Outlet, useLoaderData, Form, redirect, NavLink, useNavigation } from "react-router-dom";
import { getContacts, createContact } from "../contacts";
import { useEffect } from "react";

export async function loader({ request }) {
  // filtering contacts based on the query parameter
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const contacts = await getContacts(q);
    return { contacts, q };
}

export async function action() {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

export default function Root() {
    const { contacts, q } = useLoaderData();
    const navigation = useNavigation();

    // synchronizing the search input with the URL query parameter
    useEffect(() => {
      document.getElementById("q").value = q;
    },[q]);

    return (
      <>
        <div id="sidebar">
          <h1>React Router Contacts</h1>
          <div>
            <Form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
                defaultValue={q}
              />
              <div
                id="search-spinner"
                aria-hidden
                hidden={true}
              />
              <div
                className="sr-only"
                aria-live="polite"
              ></div>
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  {/* NavLink adds styling attributes to rendered elements, useful for highlighting an active link in menu
                   vs Link which creates a hyperlink with no styling or indication of which is the active route */}
                  <NavLink to={`contacts/${contact.id}`}>
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
          </nav>
        
        </div>
        <div id="detail"
        className={
          // useNavigation states can be "loading", "idle" or "submitting"
          navigation.state === "loading" ? "loading" : ""
        }>
            <Outlet />
        </div>
      </>
    );
  }