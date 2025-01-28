import { Form, useLoaderData, useFetcher } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getContact, updateContact } from '../contacts';

export async function loader({params}) {
    const contact = await getContact(params.contactId);
    if (!contact) {
        return { status: 404, statusText: "Contact not found" };
    }
    return { contact };
}
// Using separate loaders keeping each routes data fetching logic separate, preventing unintended side-effects and
//  separation of concerns makes code easier to read and also ensure future changes are easier to manage

export async function editLoader({params}) {
    const contact = await getContact(params.contactId);
    return { contact };
}

export async function action({request, params}) {
    const formData = await request.formData();
    return updateContact(params.contactId, {
        favorite: formData.get("favorite") === "true",
    });
}

export default function Contact() {
    // const contact = {
    //     first: "Your",
    //     last: "Name",
    //     avatar: "https://robohash.org/you.png?size=200x200",
    //     twitter: "your_handle",
    //     notes: "This is a note about you",
    //     favorite: true,
    // };

    const { contact } = useLoaderData();

    return (
        <div id="contact">
            <div>
                <img 
                    key={contact.avatar}
                    src={contact.avatar ||
                `https://robohash.org/${contact.id}.png?size=200x200`} />
            </div>
            
            <div>
                <h1>
                    {contact.first || contact.last ? (
                        <>
                            {contact.first} {contact.last}
                        </>
                    ) : (
                        <i>No name</i>
                    )}{" "}
                    <Favorite contact={contact} />
                </h1>
            
                {contact.twitter && (
                    <p>
                        <a target="_blank"
                        href={`https://twitter.com/${contact.twitter}`}>
                            {contact.twitter}
                        </a>
                    </p>
                )}

                {contact.notes && <p>{contact.notes}</p>}

                <div>
                    <Form action="edit">
                        <button type='submit'>Edit</button>
                    </Form>
                    <Form
                    method="post"
                    action="destroy"
                    onSubmit={(event) => {
                        if (!confirm("Do you want to delete this contact?")) {
                            event.preventDefault();
                        }
                    }}
                    >
                        <button type='submit'>Delete</button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

function Favorite({ contact }) {
    const fetcher = useFetcher();

    const favorite = fetcher.favorite
    ? fetcher.formData.get("favorite") === "true"
    : contact.favorite;

    return (
        <fetcher.Form method="post">
            <button
            name='favorite'
            value={favorite ? "false" : "true"}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            >
                {favorite ? "★" : "☆"}
            </button>
        </fetcher.Form>
    )
}

// Add PropTypes validation
Favorite.propTypes = {
    contact: PropTypes.shape({
        favorite: PropTypes.bool.isRequired,
    }).isRequired,
};