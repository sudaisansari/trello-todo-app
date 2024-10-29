
type Todo = {
    id: string;
    todo: string;
};

type CardInput = {
    id: string;
    value: string;
};

type CardsArray = {
    id: string;
    title: string;
    inputs: CardInput[];
};

export type RootState = {
    todos: Todo[];
    doing: Todo[];
    done: Todo[];
    cardsArray: CardsArray[];
};