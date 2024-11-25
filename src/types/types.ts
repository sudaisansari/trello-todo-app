type CardInput = {
    id: string;
    value: string;
    description: string;
    watching: boolean;
    activity: {
        id: string; // Unique identifier for each activity entry
        content: string; // Stores rich text as HTML string
        dateTime: string; // Timestamp for activity
    }[];
    dateTime: string;
};

type CardsArray = {
    id: string;
    title: string;
    inputs: CardInput[];
};

export type RootState = {
    cardsArray: CardsArray[];
};

// interface Cards {
//     id: string;
//     title: string;
//     inputs: {
//         id: string;
//         value: string;
//         description: string; // Stores HTML content as a string
//         activity: {
//             id: string; // Unique identifier for each activity entry
//             content: string; // Stores rich text as HTML string
//             dateTime: string; // Timestamp for activity
//         }[];
//         dateTime: string; // Date and time for the input creation or last update
//     }[];
// }