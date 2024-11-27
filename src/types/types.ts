type CardInput = {
    id: string;
    value: string;
    description: string;
    watching: boolean;
    activity: {
        id: string; 
        content: string; 
        dateTime: string; 
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

export interface Item {
    id: string;
    value: string;
    description?: string;
    dateTime?: string;
    watching: boolean;
    // Stores HTML content as a string
    activity?: {
        id: string; // Unique identifier for each activity entry
        content: string; // Stores rich text as HTML string
        dateTime: string; // Timestamp for activity
    }[];
}


export interface Cards {
    id: string;
    title: string;
    inputs: {
        id: string;
        value: string;
        description: string;
        dateTime: string;
        watching: boolean;
        activity: {
            id: string;
            content: string;
            dateTime: string;
        }[];
    }[];
}

export interface PH {
    clientHeight: number;
    clientWidth: number;
    clientY: number;
    clientX: number;
  }